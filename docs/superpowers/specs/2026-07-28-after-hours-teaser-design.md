# After-Hours Pediatric Urgent Care Teaser — Design Spec

Date: 2026-07-28
Status: Approved

## Background

The client supplied a mockup of a homepage teaser promoting After-Hours
Pediatric Urgent Care (external partner site, already listed as the
`pediatric-after-hour` entry in `data/network.ts`, but currently only
reachable via the low-visibility Network section). The mockup is a two-column
banner: a light content panel (eyebrow, headline, body, CTA button, phone)
next to a dark teal accent panel showing an "Open now" status and a
weeknights/weekends/virtual-care schedule.

Confirmed with the client:
- Phone number `(818) 280-4268` is real and specific to this service (distinct
  from `MAIN_PHONE`).
- Schedule copy is accurate as given: weeknights 6pm-11pm, weekends all day,
  virtual care 24/7.
- Redirect target is the existing external URL `https://pediatricafterhour.com/`.

## Goals

- Give the After-Hours Pediatric Urgent Care service standout, above-the-fold
  homepage visibility (currently it's buried as 1 of 6 equal-weight network
  cards).
- Match the supplied mockup's visual structure and copy.
- Follow existing homepage card conventions (theme-aware surface, colored
  accent panel) rather than introducing a new visual pattern.
- Fully bilingual (en/es) and responsive, per project-wide requirements.

## Placement

New section in `components/HomePageContent.tsx`, directly after `<Hero />`
and before the existing "Why families choose us" section. Rationale: this is
a time-sensitive, high-intent message (a parent with a sick kid outside
office hours) that deserves the second-highest visibility on the page, right
after the Hero.

## Component: `AfterHoursCtaBanner`

New file `components/AfterHoursCtaBanner.tsx` (+ colocated
`AfterHoursCtaBanner.test.tsx`), modeled structurally on the existing
`ClinicNearYouCard` / `InfoStatCard` pattern (theme-aware `bg-surface` card
with a fixed-color accent panel) and on `BookingCtaBanner` for the
button+phone CTA pairing (this banner needs two independently actionable
targets, so — like `BookingCtaBanner` — it is not a single whole-card
`<Link>` the way `ClinicNearYouCard`/`InfoStatCard` are).

Structure:
- Outer card: `rounded-3xl border border-border bg-surface shadow-card`,
  `flex-col` on mobile, `md:flex-row` on desktop (content first, panel
  second — panel drops below content on mobile, matching
  `ClinicNearYouCard`'s `order-1`/`order-2` pattern).
- Left (content), roughly 60% width on desktop:
  - Eyebrow: "Urgent Care · After Hours" (dot-separated, same styling as
    other eyebrows: `font-display text-xs font-semibold uppercase
    tracking-wide text-teal-dark`).
  - Heading (`h2`, since this is a page-level section, not a card inside
    one): "Sick after six? Our doors are still open."
  - Body copy (board-certified pediatricians / same-day / virtual care /
    ER-cost framing).
  - CTA row, matching the mockup's two side-by-side buttons (not
    `BookingCtaBanner`'s small icon+text phone link): a filled teal button
    "Get urgent care now" linking to
    `networkBrands.find(b => b.id === "pediatric-after-hour")!.externalUrl`
    (`target="_blank" rel="noopener noreferrer"`, reusing the existing data
    entry instead of a second hardcoded URL), plus a same-size
    outlined/bordered secondary button (`border border-border`, rounded-full,
    matching padding) linking to `tel:+1<AFTER_HOURS_PHONE digits>` and
    displaying `AFTER_HOURS_PHONE` as its visible label.
- Right (accent panel), roughly 40% width on desktop:
  - Fixed `bg-gradient-to-br from-teal to-teal-dark` (same token pair as
    `InfoStatCard`'s `teal` variant) so it renders identically in light and
    dark mode.
  - "Open now" status pill reusing the existing pulsing-dot pattern
    (`ktmg-ping` keyframe, gated behind `motion-reduce`) already used in
    `BookingCtaBanner` and `ClinicNearYouCard`. Static marketing copy, not a
    live clock computation — consistent with how other pills in the codebase
    work (no existing component computes real-time open/closed state).
  - Three schedule rows (label + value), each a translated pair:
    Weeknights / 6pm - 11pm, Weekends / All day, Virtual care / 24/7.

## Data / constants

- `lib/constants.ts`: add `export const AFTER_HOURS_PHONE = "(818) 280-4268";`
  next to the other phone constants, with the same "do not change without
  confirmation" comment convention already used at the top of the file.
- Reuse `data/network.ts`'s existing `pediatric-after-hour` entry for the
  external URL — no new data file.

## i18n

New keys under the existing `Home` namespace in both `messages/en.json` and
`messages/es.json` (matching key structure in both, per project convention):

- `afterHoursEyebrow`
- `afterHoursHeading`
- `afterHoursBody`
- `afterHoursCta` (button label)
- `afterHoursCallLabel` (aria-label for the phone link, `{phone}` param,
  mirroring the existing `bottomCtaCall` pattern)
- `afterHoursOpenNow` (pill text)
- `afterHoursWeeknightsLabel` / `afterHoursWeeknightsValue`
- `afterHoursWeekendsLabel` / `afterHoursWeekendsValue`
- `afterHoursVirtualLabel` / `afterHoursVirtualValue`

Spanish translations to be written to match (not machine-placeholder text).

## Accessibility

- The accent panel's schedule list is presentational text, not interactive.
- Both CTAs are real `<a>` elements (external link + tel:) with visible focus
  rings matching the existing `focus-visible:ring-2 focus-visible:ring-teal
  focus-visible:ring-offset-2` convention used elsewhere on the homepage.
- Phone link carries an `aria-label` via `afterHoursCallLabel` (same pattern
  as `BookingCtaBanner`'s `bottomCtaCall`).
- No new images, so no new alt text needed.

## Testing

Colocated `AfterHoursCtaBanner.test.tsx` covering: renders heading/body copy,
external CTA has the correct `href`/`target`/`rel`, phone link has the
correct `tel:` href and `aria-label`, schedule rows render. Update
`HomePageContent`'s existing test (if any) / add coverage asserting the
banner renders after the Hero. Follows the existing unit/component-level
testing convention (no end-to-end/browser verification).

## Explicitly out of scope

- No live/computed "open now" status logic.
- No changes to `data/network.ts`'s existing network-page card for this
  brand (the `/network` page listing is untouched).
- No new imagery/photography for this section (mockup has none).

## Next steps

1. Write an implementation plan (writing-plans skill).
