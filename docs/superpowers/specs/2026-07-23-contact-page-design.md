# Contact Page — Design Spec

**Date:** 2026-07-23
**Status:** Approved for planning
**Author:** Sanjula + Claude

## Overview

Add a dedicated `/contact` page to the Kids & Teens Medical Group site. It presents
the practice's contact channels alongside a "Send us a message" form. Submissions are
delivered by email via the practice's own Microsoft 365 mailbox over SMTP — no
third-party SaaS, no database.

The visual reference is a two-column layout: a contact/info rail on the left (call, text,
email, office hours, emergency notice) and a message form on the right.

## Goals

- A localized (`en` + `es`) contact page matching the existing site conventions and brand tokens.
- A working message form that emails submissions to a configurable inbox.
- All email routing configured via environment variables so the sender and receiver can be
  changed later without touching code.
- Clear, user-friendly error handling (especially for the known Microsoft 365 SMTP-AUTH caveat).
- Test coverage matching the repo's near-100% `.test` convention.

## Non-Goals (YAGNI)

- No database or persistence of submissions.
- No CAPTCHA / reCAPTCHA (a hidden honeypot field is the only spam measure).
- No file attachments / uploads.
- No auto-reply to the sender.
- No admin dashboard or submission log.

## Architecture

Follows the established page pattern: a thin `page.tsx` handles metadata and renders a
content component. The form is an isolated client island; the email send is a Server Action.

```
Browser
  └─ <form action={formAction}>            components/ContactForm.tsx  ("use client", useActionState)
        │  submit (POST, progressive-enhancement capable)
        ▼
     sendContactMessage(prevState, formData) app/[locale]/contact/actions.ts  ("use server")
        │  1. honeypot check → silent success
        │  2. zod validation → field errors
        │  3. build message
        ▼
     sendMail({ to, from, replyTo, subject, text, html })  lib/mailer.ts  (nodemailer + M365 SMTP)
        │
        ▼
     Microsoft 365 (smtp.office365.com:587, STARTTLS)  →  CONTACT_TO inbox
```

### Files

| File | Responsibility |
|---|---|
| `app/[locale]/contact/page.tsx` | `generateMetadata` via `buildMetadata`; renders `<ContactPageContent />`. |
| `components/ContactPageContent.tsx` | Server component. Hero + left info rail (call/text/email cards, office-hours card, emergency notice) + right form slot. Uses `Reveal`, brand tokens. |
| `components/ContactForm.tsx` | `"use client"` island. Fields + `useActionState(sendContactMessage)`; pending state; success/error UI; honeypot input. |
| `app/[locale]/contact/actions.ts` | `"use server"`. Honeypot check, zod validation, calls `lib/mailer.ts`. Returns a typed result state. |
| `lib/mailer.ts` | Creates a nodemailer transport from env vars; `sendMail()` helper. Reads config lazily so a missing env var yields a handled error, not a build crash. |
| `.env.local.example` | Documented SMTP/contact keys with placeholder values (no secrets). |
| `*.test.tsx` / `*.test.ts` | Tests for page, content, form, action, and mailer (SMTP mocked). |

### Dependencies to add

- `nodemailer` (+ `@types/nodemailer`) — SMTP transport.
- `zod` — server-side validation (recommended by the bundled Next.js forms guide).

## Data Flow & Form

### Fields

| Field | Name attr | Required | Notes |
|---|---|---|---|
| Full name | `name` | Yes | |
| Email | `email` | Yes | `type="email"` client validation + zod email check. Used as **Reply-To**. |
| Phone | `phone` | No | Free text. |
| Subject | `subject` | Yes | |
| Message | `message` | Yes | `<textarea>`. |
| (honeypot) | `company` | — | Hidden from users (visually + `aria-hidden`, `tabIndex=-1`, `autocomplete=off`). If filled → treat as spam, return success without sending. |

### Validation

- **Client:** native HTML (`required`, `type="email"`, `maxLength`) for instant feedback and progressive enhancement.
- **Server:** `zod` re-validates every field (never trust the client). Returns per-field error messages rendered inline; the action always re-validates before sending.

### Submission UX (`useActionState`)

- Submit button disabled + label switches to "Sending…" while `pending`.
- On success: form is replaced by an inline confirmation panel ("Thanks — we'll reply within one business day").
- On validation error: inline field messages, form values preserved.
- On send failure (SMTP): a non-technical error message ("We couldn't send your message right now — please call or email us directly") plus the fallback phone/email. The underlying error is logged server-side only.

## Email Delivery (Microsoft 365 SMTP)

Sent via nodemailer, fully env-driven. On Microsoft 365 the `From` address must equal the
authenticated mailbox, so the visitor's address is placed in `Reply-To` instead.

- **From:** `CONTACT_FROM` (= authenticated mailbox)
- **To:** `CONTACT_TO`
- **Reply-To:** visitor's submitted email
- **Subject:** e.g. `[Website Contact] {subject}`
- **Body:** plain-text + simple HTML containing name, email, phone, subject, message.

### Environment variables (`.env.local`, gitignored)

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false          # STARTTLS on 587; set true only for port 465
SMTP_USER=Sanjula.Rajapaksha@ktdoctor.com
SMTP_PASS=                 # mailbox password, or M365 App Password if 2FA is on
CONTACT_TO=Sanjula.Rajapaksha@ktdoctor.com
CONTACT_FROM=Sanjula.Rajapaksha@ktdoctor.com
```

`.env.local.example` ships the same keys with blank/placeholder values as documentation.
Sender and receiver are changed later by editing `CONTACT_FROM`/`SMTP_USER` and `CONTACT_TO`
— no code change.

### Known caveat — SMTP AUTH

Microsoft is retiring basic-auth SMTP; many tenants have "Authenticated SMTP" disabled by
default. If so, sends fail with an auth error. Mitigations, in order:
1. Enable Authenticated SMTP for the mailbox (M365 admin center → Users → mailbox → Mail →
   Manage email apps → "Authenticated SMTP").
2. Use an App Password if 2FA is enabled on the account.

The Server Action catches transport errors and shows the friendly failure UI; the real error
is logged to the server console for debugging. This never blocks the build or crashes the page.

## Internationalization

- New `Contact` namespace in `messages/en.json` and `messages/es.json` (all UI strings, labels,
  placeholders, validation messages, success/error copy).
- New `Seo.contact` entry (`title`, `description`) in both locale files.
- Follows the existing all-pages-localized convention.

## Integration Points

- **Header:** add a "Contact" link (in the "More" dropdown, matching the existing secondary links).
- **Footer:** add "Contact" to the "Quick links" group (`quickLinks` array in `Footer.tsx`).
- **Sitemap:** add `/contact` to `STATIC_PATHS` in `app/sitemap.ts`.
- **Constants:** reuse `MAIN_PHONE`, `TEXT_PHONE`, `TEXT_PHONE_ES`, `GENERAL_EMAIL` from `lib/constants.ts`.

## Content

- **Hero:** eyebrow pill "We reply within one business day"; heading "We're here for your family
  — how can we help?"; subcopy inviting appointment/insurance/records/billing questions and
  noting that calling is fastest for same-day needs.
- **Left rail cards:** Call (front desk, `MAIN_PHONE`), Text (`TEXT_PHONE`), Email (`GENERAL_EMAIL`).
- **Office Hours card (dark):** Mon–Fri 8:00 AM – 6:00 PM, Sat 9:00 AM – 2:00 PM, Sun
  "Telehealth only"; note that hours vary by clinic across the Greater LA locations with a
  link to `/locations`. (These are display defaults matching the reference; treated as
  general hours, not per-clinic data.)
- **Emergency notice (red):** "Medical emergency? Call 911 or go to your nearest emergency room.
  This form is not monitored for urgent care."

## Error Handling Summary

| Situation | Behavior |
|---|---|
| Honeypot filled | Return success without sending (silently drop spam). |
| Validation fails | Inline per-field errors; values preserved; nothing sent. |
| Missing SMTP env var | Handled error → friendly failure UI + fallback contacts; logged server-side. |
| SMTP transport/auth error | Same friendly failure UI; real error logged server-side only. |
| Success | Inline confirmation panel replaces the form. |

## Testing

Matching the repo's coverage convention:
- `page.test.tsx` — renders, metadata present.
- `ContactPageContent.test.tsx` — hero, contact cards, hours, emergency notice render; phone/email from constants shown.
- `ContactForm.test.tsx` — fields present/required; honeypot hidden; pending + success + error states (action mocked).
- `actions.test.ts` — honeypot short-circuit; zod validation failures; success path calls mailer with correct To/From/Reply-To (mailer mocked).
- `mailer.test.ts` — builds transport from env; throws/handles clean on missing config (nodemailer mocked).

## Open Questions

None outstanding. Spanish translations are included now (per site convention).
