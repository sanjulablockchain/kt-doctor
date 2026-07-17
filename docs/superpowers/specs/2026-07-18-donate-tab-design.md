# Floating Donate Tab — Design

## Goal

Add a standalone, always-visible "Donate" call-to-action pinned to the right
edge of the **homepage**, styled as a vertical gold tab (heart icon + vertical
"Donate" text) that gently animates to draw the eye and links out to the
foundation's donation page. Modeled on the stakeholder-supplied screenshot: a
gold tab, vertically centered on the right edge, clipped to the screen edge.

Scope is intentionally narrow: homepage only, one new component, links to the
existing foundation donate URL. No new donation flow, no payment integration.

## Placement decisions (confirmed with stakeholder)

- **Pages:** Homepage only. Not added to the global layout (unlike the
  existing `BackToTopButton` / `ContactWidget`, which are site-wide). It is
  mounted in `app/[locale]/page.tsx`.
- **Position:** Fixed to the right edge, vertically centered
  (`fixed right-0 top-1/2 -translate-y-1/2`). This deliberately clears the
  bottom-right `ContactWidget` (`bottom-5`/`bottom-8`) and the bottom-left
  `BackToTopButton`, so the three floating elements never collide.
- **Idle animation:** A subtle heart-beat pulse on the heart icon.
- **Mobile:** Same right-edge position, just more compact (smaller icon/text,
  tighter padding).

## Why a standalone edge tab (not reusing an existing widget)

The homepage already has a static "Donate Now" button inside the Foundation
teaser section (`app/[locale]/page.tsx`), but that scrolls out of view. The
floating tab keeps a persistent donate affordance on screen. It is kept
separate from `ContactWidget` because it has a different purpose (outbound
donation link vs. contact panel), a different anchor point (mid-right edge vs.
bottom-right), and a different color (gold vs. teal).

## Redirect target

Links to `foundation.donateUrl` (`https://kidsandteensfoundation.org/donate/`)
from `data/foundation.ts`, opening in a new tab with
`target="_blank" rel="noopener noreferrer"` — identical to the existing
"Donate Now" link on the homepage. No new constant is introduced; the
component reads `foundation.donateUrl` so there is a single source of truth.

## Component

New client component `components/DonateTab.tsx`:

- Renders a single `<a>` (not the next-intl `Link` — the target is an external
  URL, matching how the existing "Donate Now" anchor is written).
- Content: a heart `<svg>` (reusing the heart path already used in the
  homepage hero badge, marked `aria-hidden`) above the word "Donate".
- The "Donate" label is set vertically via `[writing-mode:vertical-rl]` so it
  reads top-to-bottom like the screenshot, while remaining real selectable
  text (not an image).
- Shape: rounded on the left, flush to the right edge
  (`rounded-l-2xl rounded-r-none`), `shadow-soft`.
- Color: `bg-gold text-white`, darkening to a new `gold-dark` token on
  hover/focus (see Design tokens below).
- Positioning: `fixed right-0 top-1/2 -translate-y-1/2 z-20` — `z-20` matches
  the other floating widgets.
- `"use client"` because it uses `useTranslations` from next-intl. It holds no
  React state — the pulse, hover, and entrance animations are all CSS-driven,
  so no `useEffect`/`matchMedia` is needed (reduced-motion is handled purely in
  CSS; see below).

## Interaction / animation

All motion is CSS-only, defined in `app/globals.css`. This matches the
project's hand-rolled, dependency-free approach to animation (no Framer Motion,
etc.).

- **Idle heart-beat:** a `@keyframes heartbeat` that scales the heart icon
  (~1 → ~1.15 → 1) in a short double-beat, repeating every few seconds.
  Applied via a small utility class on the heart `<svg>` only.
- **Hover / focus-visible:** the whole tab nudges outward from the edge
  (`hover:-translate-x-1 focus-visible:-translate-x-1`, transform transition)
  and the background darkens to `gold-dark`. A visible focus ring is retained
  for keyboard users.
- **Entrance:** a one-shot `@keyframes slide-in-right` that slides the tab in
  from off the right edge on mount.
- **Reduced motion:** a single `@media (prefers-reduced-motion: reduce)` block
  in `globals.css` disables the heart-beat and entrance animations (sets
  `animation: none`) and neutralizes the transition, so the tab is completely
  static for those users. Hover color change (non-motion) may remain.

## Mobile responsiveness

- Base (mobile) styles are compact: smaller heart (`h-4 w-4`-ish), smaller
  label text, tighter padding.
- `sm:` breakpoint bumps up icon size, text size, and padding for
  tablet/desktop.
- Because the tab is vertically centered and narrow, it does not overlap the
  bottom-anchored widgets or the main content column (which is capped at
  `max-w-7xl` and centered, leaving edge gutters on large screens; on small
  screens the tab's small width intrudes only slightly over the gutter, which
  is the accepted trade-off for an always-visible donate CTA).

## Design tokens

`app/globals.css` gains one new token, following the existing
`teal` / `teal-dark` pairing convention (gold currently has only `gold` and
`gold-tint`):

- `--color-gold-dark: #bd8a34;` (a darker gold for the hover/focus state),
  added in both the `:root` block and the `@theme inline` block so
  `bg-gold-dark` / `text-gold-dark` become available Tailwind v4 utilities.

## i18n

New `DonateTab` namespace added to `messages/en.json` and `messages/es.json`:

- `label`: `"Donate"` / `"Donar"` — the visible vertical text.
- `ariaLabel`: `"Donate to the Kids and Teens Foundation"` /
  `"Donar a la Fundación Kids and Teens"` — the accessible name on the anchor,
  so screen-reader users get more context than the bare word.

## Accessibility

- Real `<a>` element: keyboard-focusable and operable by default.
- Descriptive `aria-label` (from i18n) on the anchor.
- Heart `<svg>` marked `aria-hidden` (decorative).
- Visible `focus-visible` ring.
- Motion respects `prefers-reduced-motion` (see above).

## Site instructions note

Per `AGENTS.md`, this project's Next.js has undocumented breaking changes from
stock Next.js. Before writing the component, check `node_modules/next/dist/docs/`
for any relevant client-component / `next-intl` guidance. The component is a
plain client component using `useTranslations` and an `<a>`, mirroring existing
components (`ContactWidget`, `BackToTopButton`), so no exotic APIs are expected.

## Files touched

- **New** `components/DonateTab.tsx` — the component.
- **New** `components/DonateTab.test.tsx` — tests (see below).
- **Edit** `app/[locale]/page.tsx` — import and mount `<DonateTab />` as the
  last child of `<main>`.
- **Edit** `app/globals.css` — add `--color-gold-dark` token; add
  `@keyframes heartbeat` + `@keyframes slide-in-right`, their utility classes,
  and the `prefers-reduced-motion` block.
- **Edit** `messages/en.json` + `messages/es.json` — add the `DonateTab`
  namespace.

## Testing

- New `components/DonateTab.test.tsx`, following the existing
  `NextIntlClientProvider`-wrapped component test pattern (as in
  `components/FaqAccordion.test.tsx`):
  - Renders a link whose accessible name is the `ariaLabel` string.
  - The link's `href` equals `foundation.donateUrl` and it has
    `target="_blank"` and `rel` containing `noopener`.
  - The visible `label` text ("Donate") is present.
- `app/[locale]/page.test.tsx`: verify the added tab does not break existing
  assertions (there will now be two donate links — the section "Donate Now"
  and the floating tab). Adjust any query that assumes a single donate link
  (prefer `aria-label`-based queries to disambiguate).

## Out of scope

- Adding the tab to any page other than the homepage.
- Any in-app donation/checkout flow or payment integration (links out to the
  existing foundation site).
- Changing the existing Foundation-teaser "Donate Now" button.
- A collapse-to-heart / expand-on-hover interaction (the earlier reference
  images) — superseded by the stakeholder's vertical-tab screenshot.
