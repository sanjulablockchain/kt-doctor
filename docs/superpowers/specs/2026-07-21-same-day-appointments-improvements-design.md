# Same-Day Appointments page improvements — Design

**Date:** 2026-07-21
**Page:** `/services/same-day-appointments` (and, for the button, all service detail pages)

## Goal

Improve the Same-Day Appointments service page by:

1. Adding a photo (the pediatrician-with-child PNG) in a two-column layout beside the text on desktop, stacked on mobile.
2. Adding a "More Services" button that links to the services listing page.
3. Matching the existing theme, dark-mode, and responsive behavior — no new visual language.

All service detail pages are rendered by one shared template
(`app/[locale]/services/[slug]/page.tsx`), so changes must be driven by data
rather than hardcoded to a single slug.

## Approach

**Data-driven, not slug-special-cased.** Add optional image fields to the
`Service` type. Only `same-day-appointments` populates them today; the template
branches on their presence. Any service can gain an image later with no template
change. Rejected alternative: an `if (slug === "same-day-appointments")` branch
in the template — brittle and non-extensible.

The "More Services" button is universal (all service pages) — it needs no
per-service data and aids navigation everywhere.

## Changes

### 1. `data/services.ts`

Extend the `Service` type with three optional fields:

```ts
imageSrc?: string;
imageAlt?: string;
imageAltEs?: string;
```

Populate them on the `same-day-appointments` service only:

```ts
imageSrc: "/services/same-day-appointments.png",
imageAlt: "A pediatrician smiling with a young child holding a teddy bear",
imageAltEs: "Una pediatra sonriendo con una niña pequeña que sostiene un osito de peluche",
```

### 2. `app/[locale]/services/[slug]/page.tsx`

Server component; already reads `locale` and does inline `locale === "es" ? …`
ternaries for `name`/`description`. Follow that same style.

- Import `Image` from `next/image` and `Link` from `@/i18n/navigation`.
- Localized button labels via inline ternary (consistent with the file):
  - Book: `locale === "es" ? "Reservar una Cita" : "Book an Appointment"`
  - More Services: `locale === "es" ? "Más Servicios" : "More Services"`
- Localized alt text: `locale === "es" ? service.imageAltEs : service.imageAlt`.

**Layout branch on `service.imageSrc`:**

- **With image** — container widens to `max-w-5xl`. `BackLink` → eyebrow → `h1`
  stay full-width. Below them a
  `grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center`:
  - **Left col:** `<div class="overflow-hidden rounded-2xl">` wrapping
    `<Image>` with `unoptimized`, explicit `width`/`height` (portrait, e.g.
    800×1000), and `className` giving `w-full` + `object-cover` in a controlled
    aspect (e.g. `aspect-[4/5]`) — same recipe as blog detail pages
    (`app/[locale]/blog/[slug]/page.tsx`).
  - **Right col:** description (`text-lg font-semibold text-ink-soft`) →
    `longDescription` (`text-ink-soft`) → button row.
  - Mobile (`grid-cols-1`): image renders between the title and the text.
- **Without image** — unchanged single-column `max-w-3xl`; only gains the second
  button.

**Button row (both branches)** — `flex flex-col gap-3 sm:flex-row`, reusing the
About-page classes verbatim so styling/dark-mode are identical:

- Primary — `<a href={BOOKING_URL}` target/rel unchanged`>`:
  `rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark`
- Secondary — `<Link href="/services">` (locale-aware):
  `rounded-full border border-border bg-surface px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark`

### 3. Image asset

- Referenced as `/services/same-day-appointments.png`.
- File must exist at `public/services/same-day-appointments.png`.
- **User provides the PNG** (the pasted attachment). Implementation creates the
  folder and wires the reference; the image renders once the file is present.

## Theme / responsive / dark mode

No new tokens. All classes use existing design tokens (`teal`, `teal-dark`,
`ink`, `ink-soft`, `border`, `surface`, `shadow-soft`, `font-display`) that
already handle light/dark. Responsive behavior comes from Tailwind `lg:` /
`sm:` breakpoints matching the rest of the site.

## Constraints / notes

- Per `AGENTS.md`, this repo's Next.js differs from stock — read
  `node_modules/next/dist/docs/` for the `Image` component before coding.
  Mitigation: mirror the already-working blog-page `Image` usage.
- `Link` from `@/i18n/navigation` is used directly in the server component (no
  `useTranslations`, so no client boundary needed).

## Verification

- `npm run build` succeeds.
- Existing `app/[locale]/services/[slug]/page.test.tsx` passes; extend if needed
  for the image branch / second button.
- Manual: two-column on desktop, stacked on mobile, `/es` shows Spanish labels,
  buttons legible in dark mode, "More Services" navigates to `/services`
  (staying on `/es` when applicable).

## Out of scope

- Localizing button labels on other pages, adding images to other services,
  or any refactor of the shared template beyond the branch described.
