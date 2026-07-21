# Homepage Booking CTA Banner — Redesign

**Date:** 2026-07-21
**Status:** Approved design, pending implementation plan

## Goal

Upgrade the homepage bottom "Book an Appointment" banner (the navy box currently
at [`app/[locale]/page.tsx`](../../../app/[locale]/page.tsx) lines 566–593) to the
richer composition shown in the reference mockup (`CTA Banner 4a.html`): a live
"same-day openings" status pill, a decorative corner glow, an arrow icon on the
primary button, and a secondary phone link — while staying fully **on-theme** and
honoring the site's dark/light, responsive, reduced-motion, and bilingual
behavior.

## Decisions (from brainstorming)

- **On-theme, not pixel-match.** Use the existing `navy` token (`#1e2940`) and
  `font-display` (Plus Jakarta Sans), NOT the mockup's deeper `#0C1B26` navy or
  Space Grotesk. No new colors or webfonts enter the design system.
- **Reproduce the full composition** of the mockup: status pill (pulsing dot),
  corner glow, arrow icon on the button, and secondary phone link — all four.
- The heading and body copy already match the mockup (`bottomCtaHeading`,
  `bottomCtaBody`) and are unchanged.

## Architecture

Extract the inline bottom-CTA JSX into a new component
**`components/BookingCtaBanner.tsx`**, a client component using
`useTranslations("Home")` (consistent with sibling card components such as
`ClinicNearYouCard` and `NetworkCard`).

The homepage section is replaced with:

```tsx
<section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
  <Reveal>
    <BookingCtaBanner />
  </Reveal>
</section>
```

**Rationale:** every component in the repo has a colocated test; extracting makes
the banner independently testable and keeps `page.tsx` lean. Wrapping in `Reveal`
matches the homepage's scroll-in behavior and is reduced-motion-safe (see
`components/Reveal.tsx`).

## Component: `BookingCtaBanner`

Presentational, no props, no local state, no effects (the pulse is pure CSS).

### Root

```
relative overflow-hidden rounded-3xl bg-navy px-8 py-10 text-white
+ data-on-navy
+ flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between
```

- `data-on-navy` pins `--color-ivory` / `--color-teal-tint` to their light values
  so the banner renders identically in light and dark (navy + white text are
  already theme-invariant). Same attribute the current banner and footer use.
- `overflow-hidden` clips the decorative glow so it can **never** introduce
  horizontal page scroll on mobile.

### Corner glow (decorative)

An `aria-hidden`, `pointer-events-none`, absolutely-positioned `<div>` in the
top-right with a translucent teal radial-gradient background — same technique as
the depth glows in `ClinicNearYouCard`. Uses a fixed teal rgba (decorative, on a
theme-invariant navy surface), e.g.
`radial-gradient(circle, rgba(14,143,160,0.28), transparent 65%)`.

### Left cluster

`flex items-center gap-4` (or gap suited to the mockup). Contains:

1. **Logo** — `/clinic-logo.svg`, `alt=""` `aria-hidden`, `hidden sm:block`,
   `brightness-0 invert` (renders white on navy). Unchanged from current banner.
2. **Text block**:
   - **Status pill** — `inline-flex w-fit items-center gap-2` with the live
     pulsing dot copied verbatim from
     [`ClinicNearYouCard.tsx`](../../../components/ClinicNearYouCard.tsx) lines
     99–102:
     ```tsx
     <span className="relative flex h-2.5 w-2.5">
       <span className="absolute inset-0 rounded-full bg-teal ... motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
       <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-teal ..." />
     </span>
     ```
     On the navy surface both the ring and the static dot use `bg-teal` (a
     mid-teal that reads on navy in both themes) rather than `teal-dark`. Pill
     label: `t("bottomCtaPill")`.
   - **Heading** — `font-display text-xl font-bold` (roughly matching the current
     `text-xl`), `t("bottomCtaHeading")`.
   - **Body** — `text-white/70`, `t("bottomCtaBody")`.

### Right cluster

`flex flex-col gap-2` (stacks button over phone, as in the mockup). Contains:

1. **Primary button** — `<a>` to `BOOKING_URL` with `target="_blank"`
   `rel="noopener noreferrer"`, classes
   `inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5
   font-display font-semibold text-white shadow-soft transition-transform
   hover:-translate-y-0.5 hover:bg-teal-dark`, label `t("bookAppointment")`, plus
   the right-arrow SVG (the `M5 12h14m-6-6 6 6-6 6` path used in
   `ClinicNearYouCard`), optionally `hover:translate-x-1` on the arrow.
2. **Phone link** — `<a href={`tel:${digits of MAIN_PHONE}`}>` with a phone icon,
   `text-white/85 hover:text-white`, visible text `MAIN_PHONE`, and
   `aria-label={t("bottomCtaCall", { phone: MAIN_PHONE })}`. The `tel:` href is
   built by stripping `MAIN_PHONE` to digits and prefixing `+1`, i.e.
   `tel:+18183615437`.

## Responsive behavior

- Mobile (`< sm`): column layout, left-aligned (`items-start`), logo hidden,
  button + phone stacked below the text.
- `sm` and up: row layout, `justify-between`, logo visible, text on the left,
  button/phone cluster on the right.
- No horizontal overflow at any width (glow clipped by `overflow-hidden`).

## Theme / dark-light

- No new tokens. `bg-navy`, `bg-teal`/`bg-teal-dark`, `text-white`, `data-on-navy`.
- `font-display` (Plus Jakarta Sans) for pill/heading/button; body font for the
  paragraph — consistent with the rest of the site.
- Renders identically in light and dark; verified conceptually via `data-on-navy`
  pinning (same mechanism the existing banner relies on).

## Motion / reduced motion

- Pulse ring: `animate-[ktmg-ping_...]` gated by `motion-reduce:hidden` (the ring
  simply disappears, the static dot remains) — identical to `ClinicNearYouCard`.
- Hover lifts/translations are hover-intent only.
- `Reveal` wrapper self-disables under reduced motion and renders fully visible
  when `IntersectionObserver` is unavailable (SSR / jsdom).

## Internationalization

Add to **both** `messages/en.json` and `messages/es.json` under `Home`:

| Key              | EN                          | ES                              |
| ---------------- | --------------------------- | ------------------------------- |
| `bottomCtaPill`  | `Same-day openings today`   | `Citas para el mismo día, hoy`  |
| `bottomCtaCall`  | `Call {phone}`              | `Llamar al {phone}`             |

`bottomCtaCall` is used only as the phone link's `aria-label`; the visible text is
the raw `MAIN_PHONE` number (not translated). Both keys must exist in both locale
files or `useTranslations` will error for the missing locale.

## Testing

New **`components/BookingCtaBanner.test.tsx`** using `renderWithIntl` from
`lib/test-utils`:

- Renders `bottomCtaHeading` and `bottomCtaBody` text.
- Renders the `bottomCtaPill` label.
- Book link points to `BOOKING_URL` with `target="_blank"` and
  `rel="noopener noreferrer"`.
- Phone link has an `href` starting with `tel:` and its `aria-label` contains the
  phone number.
- Under `es`, the pill renders `Citas para el mismo día, hoy`.

Existing **`app/[locale]/page.test.tsx`** must remain green:

- Its `getAllByRole("link", { name: /book/i })` assertion still passes — the Book
  button keeps the `bookAppointment` label; the new phone link is excluded from
  `/book/i` (its accessible name is the number / "Call …").
- The Spanish `reservar una cita` assertion still passes (button unchanged).

## Verification

- `npm test` (vitest) — all suites green, including the new banner test and the
  existing home-page test.
- `npm run lint` — clean.
- `npm run build` — succeeds.

## Out of scope

- Deeper `#0C1B26` navy and Space Grotesk font (rejected in favor of on-theme).
- Using this banner anywhere other than the homepage bottom CTA.
- Any change to the hero banner at the top of the homepage.
