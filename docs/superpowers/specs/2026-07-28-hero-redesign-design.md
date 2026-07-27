# Homepage Hero Redesign — Design Spec

Date: 2026-07-28
Status: Approved (pending final spec review)

## Overview

Redesign the homepage hero section (currently a light two-column layout: text
left, boxed photo right) to match the "5c" dark full-bleed mockup
(`Hero One Network v4.html`): a full-bleed photo hero with a dark gradient
scrim, overlaid badge/headline/CTAs/stat bar/social row, and an embedded
"One Network" quick-action panel overlapping the bottom of the photo on
desktop.

The existing site header/nav is unchanged; the new hero slots in beneath it,
same as today. The rest of the homepage (Why families choose us, Telehealth
teaser, Doctors preview, the existing lower "Network teaser" section with all
9 real partner cards, Foundation teaser, FAQ, footer, etc.) is untouched.

## Goals

- Full-bleed, dark, photo-backed hero matching the mockup's visual language,
  responsive across mobile/tablet/desktop (the mockup itself is a fixed
  1440×1080 desktop-only export — translating it into a responsive layout is
  a core part of this work, not an afterthought).
- Preserve all real, dynamic content already in the hero (badge with live
  clinic count, stat bar with live clinic/provider counts) rather than
  replacing it with the mockup's static example copy.
- Add a new "One Network" quick-action panel (6 tiles: Book Appointment,
  Supporting Network, Services, Telehealth, Locations, Sri Lanka) sourced from
  real data where a real data source exists.
- Support both light and dark site themes (the hero itself renders as a fixed
  dark surface in both, following the same precedent already used by the
  Footer — see Theming below).
- Bilingual (en/es), accessible, tested, following existing repo conventions.

## Non-goals / out of scope

- Header/nav restyling — stays as-is.
- The existing lower-page "Network teaser" section (all 9 real partner
  brand cards) — stays as-is, unchanged, alongside the new hero panel.
- `DonateTab` / `ContactWidget` floating widgets — untouched, unrelated.
- `lib/constants.ts` business data (phone/email/booking URL) — untouched.
- Sourcing a new hero photo — reuses the current Unsplash photo.

## Component architecture

New files:

- **`components/Hero.tsx`** — the dark full-bleed hero: photo + gradient
  overlay, badge, headline, subheading, 3 CTA buttons, 4-stat bar, social
  icon row + "Health tips weekly on YouTube" line. Renders
  `<HeroNetworkPanel />` inside its own relatively-positioned wrapper.
  `"use client"` (uses `AnimatedCounter`, `useTranslations`).
- **`components/HeroNetworkPanel.tsx`** — the embedded "One Network" glass
  panel: eyebrow, heading, "Explore the network" CTA, and the 6-tile grid.
  Takes no complex props beyond what it needs to compute counts (imports its
  own data). `"use client"`.
- **`components/SocialLinks.tsx`** — new small shared presentational
  component rendering the icon-button row from shared social data. Used by
  both `Footer.tsx` (replacing its inline `SOCIAL_LINKS.map(...)` block,
  same markup/classes, zero visual change) and `Hero.tsx`. Props: none
  required (reads from `data/social.ts` directly), since both current
  consumers render every link with the exact same treatment.
- **`data/social.ts`** (+ colocated `data/social.test.ts`) — the `SOCIAL_LINKS`
  array (label/href/svg path), moved out of `Footer.tsx` verbatim. Single
  source of truth for these confirmed, real production URLs.
- Colocated `Hero.test.tsx`, `HeroNetworkPanel.test.tsx`,
  `SocialLinks.test.tsx`.

Changes to existing files:

- **`components/HomePageContent.tsx`** — the current inline `{/* Hero */}`
  `<section>` (lines ~60–156) is replaced with `<Hero />`. The `STATS` array
  construction moves into `Hero.tsx` (it's hero-only data, not used
  elsewhere in `HomePageContent.tsx`).
- **`components/Footer.tsx`** — inline `SOCIAL_LINKS` array and its
  `<ul>{SOCIAL_LINKS.map(...)}</ul>` block are replaced with
  `<SocialLinks />`; everything else in the footer is unchanged.
- **`messages/en.json`, `messages/es.json`** — new `Hero` namespace (see
  Content plan below); no existing keys removed.

## Content / i18n plan

**Reused as-is** (no changes), all already under the existing `Home`
namespace: `badge`, `headingStart`, `headingHighlight`, `subheading`,
`bookAppointment`, `findDoctor`, `findClinic`, `statClinics`,
`statProviders`, `statYears`, `statAges`, `networkEyebrow`, `networkHeading`.
`Hero.tsx` calls `useTranslations("Home")` for these, same as today.

**New `Hero` namespace** (added to both `messages/en.json` and
`messages/es.json`, identical key structure per the i18n rule):

| Key | English | Used for |
|---|---|---|
| `followUs` | "Follow us" | Label before the social icon row |
| `youtubeLine` | "Health tips weekly on **YouTube**" | Line after the social icons (bold "YouTube" via a `<strong>`/span split at render time, not rich-text interpolation — keep the translation string plain and bold the literal word "YouTube" in JSX, since it's already known/constant) |
| `exploreNetwork` | "Explore the network" | CTA button inside `HeroNetworkPanel`, links to `/network` |
| `bookAppointmentTile` | "Book Appointment" | Tile 1 title |
| `bookAppointmentBody` | "Online in under a minute, or call us." | Tile 1 description |
| `bookAppointmentTag` | "Today" | Tile 1 small badge |
| `supportingNetworkTile` | "Supporting Network" | Tile 2 title |
| `supportingNetworkBody` | "{count} partner organizations across two countries." | Tile 2 description, `count` = `networkBrands.length - 1` (real partner count, excluding KTMG itself since it's the flagship, not a "partner" of itself) |
| `servicesTile` | "Services" | Tile 3 title |
| `servicesBody` | "Well-child, urgent, vaccines, and more." | Tile 3 description |
| `telehealthTile` | "Telehealth" | Tile 4 title |
| `telehealthBody` | "Secure video visits from home." | Tile 4 description |
| `telehealthTag` | "7 days" | Tile 4 small badge |
| `locationsTile` | "Locations" | Tile 5 title |
| `locationsBody` | "Addresses, hours, and a live map." | Tile 5 description |

Spanish equivalents added with matching keys/structure (translated the same
way the rest of `Home`'s copy already is).

**Tile 6 ("Sri Lanka") is not new copy** — it renders directly from the
existing `networkBrands` entry with `id: "st-joseph-hospital"`
(`data/network.ts`): its `name`, `description`/`descriptionEs`, and
`externalUrl` are used as-is. This is both more accurate (the mockup's own
"St. Joseph Hospital, run by KTMG" line already matches this entry's real
data) and avoids inventing a fourth bilingual content source for one tile.

**Tile tag counts sourced from real data** (not hardcoded, mirroring the
existing pattern already used for the hero's clinic/provider stats):
- Tile 2 ("Supporting Network"): `networkBrands.length - 1`
- Tile 3 ("Services"): `serviceCategories.flatMap(c => c.services).length`
  (same computation `HomePageContent.tsx` already does for `allServices`)
- Tile 5 ("Locations"): `locations.length`

Tile 1 ("Book Appointment") and Tile 4 ("Telehealth") have no dynamic count
— their tags ("Today", "7 days") are static, matching the mockup.

**Not reproduced from the mockup:** the mockup's own placeholder text for
tile 2 ("3 partners" / "St. Gianna, LAIPT & the Foundation") and the badge
line above it ("4 organizations · 2 countries") are stale examples from
before the recent 5-partner network expansion (current data has 9 brands).
These are replaced with the dynamically-computed real count above.

## Visual & responsive translation

**Desktop (`lg:` and up):**
- Full-bleed hero, `ParallaxImage` as the base layer (kept — see Data reuse
  below), a dark gradient scrim overlay `<div>` on top of it, then hero
  content (badge/headline/etc.) positioned in the top-left over the image,
  then `<HeroNetworkPanel />` absolutely positioned overlapping the bottom of
  the photo (`absolute inset-x-0 bottom-0` within the hero's own relatively
  positioned wrapper, roughly matching the mockup's `left/right: 40px;
  bottom: 32px` framing, translated to responsive spacing tokens).
- 6 tiles: `grid-cols-6` inside the panel.

**Tablet (`sm:`/`md:`):**
- Panel switches from absolute overlap to normal document flow, directly
  below the hero's text content (still inside the same full-bleed photo
  section, just not overlapping — overlapping text on a shorter hero would
  be illegible at this size).
- 6 tiles: `grid-cols-3` (2 rows of 3).

**Mobile (base):**
- Hero content stacks vertically (badge → headline → subheading → buttons →
  stat bar → social row), photo still full-bleed behind everything with the
  scrim ensuring text contrast.
- Panel still in normal flow below the hero content.
- 6 tiles: `grid-cols-2` (3 rows of 2).

**Typography/spacing:** headline/stat/button sizing follows the same
responsive type-scale already used in the current hero (`text-4xl sm:text-5xl
lg:text-[3.4rem]` and similar patterns), just recolored for the dark
background.

## Data reuse

- **`ParallaxImage`** is kept, not replaced. Reading its implementation
  confirms the scroll-linked translate only affects the image element
  itself (absolutely positioned inside its own wrapper); the gradient scrim,
  text content, and `HeroNetworkPanel` are separate sibling layers stacked on
  top via z-index within the hero's relatively-positioned container, so
  there's no interaction risk. It gets a new, larger `wrapperClassName`
  (full-bleed hero height) instead of the current boxed/rounded side-image
  sizing, and the same photo URL/`alt` text as today.
- **`AnimatedCounter`** and the existing `STATS` array (clinics/providers/
  years/ages) are reused unchanged, just restyled for the dark background
  (moved from `HomePageContent.tsx` into `Hero.tsx`, since it's now
  hero-only data).
- **`data/social.ts`**: `Footer.tsx`'s `SOCIAL_LINKS` moved here verbatim
  (Facebook/Instagram/X/YouTube, real confirmed URLs).
- **`data/network.ts`**: `networkBrands` reused for the partner count and the
  Sri Lanka tile's real content.
- **`data/services.ts`** (`serviceCategories`) and **`data/locations.ts`**
  (`locations`) reused for real tile counts.
- **`BOOKING_URL`** (`lib/constants.ts`) reused for the "Book Appointment"
  tile and existing hero CTA — untouched, not modified.

## Theming (light/dark mode)

The hero is a fixed dark, photo-backed surface in both site themes — same
precedent as the existing `Footer`, which already renders as a fixed navy
surface regardless of the site's light/dark toggle via the `data-on-navy`
attribute (`app/globals.css`), which pins `--color-ivory`,
`--color-ivory-deep`, and `--color-teal-tint` to their light-mode hex values
whenever that attribute is present, specifically so light-colored text/icons
on a fixed-dark surface stay correct in both themes.

`Hero.tsx`'s root element gets `data-on-navy` (same as `Footer`'s `<footer>`
tag) and uses the existing `bg-navy`, `text-ivory`, `text-ivory/70` (etc.),
and `text-teal-tint` utility classes directly — no new one-off hex colors,
no new theme tokens. This also means the hero's dark background color
(`--color-navy`, `#1e2940`) matches the Footer's exact navy tone already used
elsewhere on the site, rather than introducing the mockup's separate,
unrelated `#0B1A1F`.

`HeroNetworkPanel`'s glass-card tiles use translucent white overlays
(`bg-white/10`, `border-white/16`, etc.) on top of the navy/photo backdrop —
these don't need theming since they're relative (alpha-blended) rather than
solid colors, so they read correctly regardless of the underlying theme.

## Accessibility

- Photo keeps its existing meaningful `alt` text.
- Icon-only social buttons get `aria-label`s (already the pattern in
  `Footer.tsx`'s current social markup, carried over unchanged into the new
  shared `SocialLinks` component).
- Decorative tile icons (the 6 bento tiles, the badge's pin icon) get
  `aria-hidden`.
- All interactive elements (buttons, links, social icons) keep visible
  focus rings consistent with the rest of the dark-navy surfaces already on
  the site (`focus-visible:ring-2 focus-visible:ring-teal-tint
  focus-visible:ring-offset-navy`, matching `Footer.tsx`'s existing pattern).
- Text contrast against the dark gradient scrim verified during
  implementation (headline highlight color, stat labels, tile body text) —
  existing `--color-teal-tint` light value (`#e4f5f6`) and `--color-ivory`
  light value (`#f8fafc`) are both light enough for AA contrast on the navy/
  photo-scrim background; no new tokens anticipated, but this gets a final
  contrast check during implementation.

## Testing

- **`Hero.test.tsx`**: headline/badge/subheading render; all 3 CTA `href`s
  correct (`BOOKING_URL`, `/doctors`, `/locations`); all 4 stat values
  present; social icons render via `SocialLinks` with correct `href`s/
  `aria-label`s; YouTube line renders.
- **`HeroNetworkPanel.test.tsx`**: all 6 tiles render with correct titles/
  links; dynamic counts match the real data lengths (partners, services,
  locations); Sri Lanka tile renders the real `st-joseph-hospital` name/
  description/link from `networkBrands`; "Explore the network" CTA links to
  `/network`.
- **`SocialLinks.test.tsx`**: all 4 links render with correct `href`s and
  `aria-label`s (Facebook/Instagram/X/YouTube).
- **`data/social.test.ts`**: shape validation (label/href/path present for
  all entries), mirroring the existing `data/network.test.ts` pattern.
- **`Footer.test.tsx`**: existing tests continue to pass unchanged (same
  rendered output, now via `SocialLinks` instead of inline markup) — update
  only if the existing tests query the removed inline structure directly
  rather than by role/label.
- **`HomePageContent.test.tsx`** (if it queries hero content directly):
  updated to match, since the hero markup now lives in `Hero.tsx`.

## Open decisions made during spec-writing (flagged for review)

1. **Kept `ParallaxImage`** instead of switching to a plain `next/image`
   background, since its scroll effect is confirmed compatible with the new
   layered layout (see Data reuse).
2. **Reused the existing `data-on-navy` + `bg-navy`/`text-ivory`/
   `text-teal-tint` tokens** for the hero's fixed-dark styling, instead of
   introducing a new one-off hex color matching the mockup's `#0B1A1F`.
3. **"Supporting Network" tile count** = `networkBrands.length - 1` (real
   partner count excluding KTMG itself), replacing the mockup's stale "3
   partners" example text.
4. **"Sri Lanka" tile sources directly from `networkBrands`**
   (`st-joseph-hospital` entry) rather than being new hand-written copy.
5. **Extracted `SocialLinks` as a shared component** (not just shared data),
   so `Footer` and `Hero` render social icons with byte-identical markup/
   styling rather than two independently-styled treatments.
