# Contact Notification Email Redesign — Design Spec

Date: 2026-07-28
Status: Proposed (pending user spec review)

## Background

The contact form (`app/[locale]/contact/actions.ts`) currently emails a plain,
unstyled notification to the internal inbox: a bare `<h2>` and a handful of
`<p><strong>Label:</strong> value</p>` lines (screenshot: bold labels on a
plain white background, no branding). The user wants this "beautiful."

A much nicer branded template already exists for the careers application
notification (`buildApplicationEmailHtml` in `app/[locale]/careers/actions.ts`):
a teal header card with a "Kids & Teens Medical Group" eyebrow and title, a
bordered white body with labeled rows, a highlighted message block, and a gray
footer band, all built with inline styles and a `<table>` layout (required for
Outlook compatibility). This is the visual target for the contact email.

### Decisions from brainstorming

1. **Extract the shared chrome** rather than duplicating it. The header/card/
   footer wrapper, row layout, and message block move into a new
   `lib/emailTemplate.ts`; both `contact/actions.ts` and `careers/actions.ts`
   build their HTML from these shared pieces instead of each having its own
   copy of the markup.
2. **Subject is a plain row**, not a pill/badge like careers' Position. Subject
   is free-typed text (potentially long), so it sits in the same row list as
   Name/Email/Phone; only Message keeps the visually highlighted block.
3. **Email and Phone become `mailto:`/`tel:` links**, in both the contact email
   and (as a side effect of sharing the row helper) the careers email, for
   one-click reply/call from the inbox. No other content change to the careers
   email.
4. **Eyebrow text uses the existing `SITE_NAME` constant** (`lib/constants.ts`)
   instead of the hardcoded string currently in the careers builder.

## `lib/emailTemplate.ts`

Exports the building blocks used by both action files:

- `emailShell({ title, bodyHtml, footerText }): string` — the outer table:
  teal header (`SITE_NAME` eyebrow + `title`), white rounded card containing
  `bodyHtml`, gray footer band with `footerText`. Same colors/radii/fonts as
  the current careers template (`#0e8fa0` header, `#f4f7fa` background,
  `#dde3ea` borders, Arial/Helvetica stack, inline styles only, no `<style>`
  block, for email-client compatibility).
- `emailRowTable(rows: { label: string; valueHtml: string }[]): string` — the
  bordered label/value row list.
- `emailBadge(text: string): string` — the rounded pill (still used by
  careers for Position).
- `emailMessageBlock(label: string, html: string): string` — the highlighted
  left-border quote box.
- `mailtoLink(escapedEmail: string): string` / `telLink(escapedPhone: string): string`
  — each wraps an already-escaped value in an `<a href="mailto:...">`/
  `<a href="tel:...">` tag. Exported alongside the other helpers so both
  action files use the same link markup. Callers still HTML-escape the raw
  value first, same as today; linking happens after escaping.

All values passed in by callers must already be HTML-escaped (same contract
as the existing `buildApplicationEmailHtml`), so `emailTemplate.ts` does no
escaping itself, it only lays out markup.

## Contact email content

`contact/actions.ts` replaces its inline HTML string with:

- Title: "New Website Contact Message"
- Rows: Name, Email (`mailto:` link), Phone (`tel:` link, or "Not provided"
  text when absent, matching current behavior), Subject
- Message block: the escaped, newline-to-`<br>` converted message body
- Footer: "Submitted via the Contact page at ktdoctor.com."

The `text` (plain-text) version of the email is unchanged.

## Careers email

`careers/actions.ts`'s `buildApplicationEmailHtml` is refactored to call
`emailShell` / `emailRowTable` / `emailBadge` / `emailMessageBlock` instead of
its inline markup. Visual output is unchanged except Email/Phone become
links. Title, badge copy, footer text, and colors stay exactly as they are
today.

## Testing

- New `lib/emailTemplate.test.ts`: unit tests asserting each helper's output
  contains the expected structure: row labels/values render, `mailtoLink`/
  `telLink` produce correct `href` attributes, `emailBadge` renders the pill
  text, and `emailShell` includes the title, `SITE_NAME` eyebrow, and footer
  text. Matches the project's existing unit-test-only convention (no e2e/
  browser checks).
- Existing `app/[locale]/contact/actions.test.ts` keeps passing unmodified
  (its assertions check for name/message substrings and script-escaping in
  `arg.html`, which remain true under the new template); add one assertion
  that the rendered HTML contains a `mailto:` link for the submitted email.
- No existing test asserts on the careers HTML output directly (only
  `lib/mailer.test.ts`, which tests the transport call, not HTML content), so
  no existing test breaks from the careers refactor; no new careers test is
  added since none is required by the task.

## Out of scope

- No i18n changes: this HTML is an internal staff-facing notification, not
  site UI copy, so it isn't routed through next-intl (consistent with the
  existing careers email, which is also unlocalized English).
- No changes to `lib/constants.ts` values, env vars, or the plain-text email
  bodies.
- No visual/browser rendering check (per project testing policy); review is
  via code + an Artifact HTML preview during implementation if useful.
