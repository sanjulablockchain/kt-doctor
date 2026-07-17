# Homepage Scroll Animations — Design Spec

**Date:** 2026-07-18
**Status:** Approved (design)

## Goal

Add cohesive, subtle scroll-driven motion to the homepage (`app/[locale]/page.tsx`):

1. **Parallax** on the hero photo (photo content travels slightly slower than the
   text beside/above it) and on the "Why families choose us" building image.
2. **Fade-and-slide-up reveals** on the card sections (doctors, network, resources,
   stories) and FAQ items as they enter the viewport, with a subtle stagger.

The overriding constraint from the brief: **smooth and subtle, not distracting** —
small movement, gentle easing, and each reveal fires **once**.

## Scope decisions (confirmed with user)

- **Redo as one unified system**, replacing the current per-component parallax
  logic with shared primitives. (The hero photo and building image already had a
  bespoke internal-drift parallax; the hero stats already count up on scroll via
  `AnimatedCounter` — that stays.)
- **Hand-rolled**, no animation library. Matches existing conventions
  (`IntersectionObserver`, `requestAnimationFrame`) and avoids risk against the
  repo's modified Next.js build (see `AGENTS.md`).
- **Reveal once** on first entry, then the element stays put.
- **Subtle stagger** for grouped items (~70ms cascade, capped).
- **Reveal reach:** all four card grids (doctors, network, resources, stories) +
  FAQ items + their section headers. Simple banner rows (find-a-clinic, foundation,
  careers/insurance, bottom CTA, partners) stay static to avoid over-animating.
- **Hero parallax technique:** keep the layout-safe **internal-drift** approach
  (no whole-column translation), tuned so the hero reads as clearly-but-gently
  lagging the text.

## Architecture

Three primitives, all client-side, all gated on reduced motion:

### 1. `lib/usePrefersReducedMotion.ts` (new)

Shared hook returning a reactive `boolean` for `(prefers-reduced-motion: reduce)`.
Consolidates the matchMedia check currently duplicated in `ParallaxImage`,
`AnimatedCounter`, and `DonateTab`.

- SSR-safe: returns `false` on the server / before mount, subscribes to the media
  query on mount and updates on change.
- `ParallaxImage` and (optionally) `AnimatedCounter` are refactored to use it. The
  existing reduced-motion behavior of each is preserved.

### 2. `components/Reveal.tsx` (new)

The fade-and-slide-up primitive. Renders a wrapper element around its children and
transitions it into view once.

**Props**
- `children: React.ReactNode`
- `delayMs?: number` — transition delay, used to stagger grouped items (default 0)
- `className?: string` — extra classes on the wrapper (e.g. `h-full` in grids)
- `as?: "div" | "li"` — element tag (default `div`; `li` for FAQ list items)

**Behavior**
- Hidden state: `opacity-0 translate-y-4` (~16–20px). Shown state:
  `opacity-100 translate-y-0`. Transition: `transition-all`, ~600ms, ease-out,
  `transitionDelay: delayMs`.
- Uses one `IntersectionObserver` (threshold ~0.15, or rootMargin bottom `-10%`).
  On first intersection it flips to the shown state and **disconnects** (fires once).
- **Arming to avoid FOUC / no-JS trap:** on the server and first client paint the
  wrapper renders in the *shown* state. After mount, if motion is allowed AND
  `IntersectionObserver` exists, it "arms" (switches to hidden) and starts
  observing. Because every reveal target is below the fold, the arm→hide→reveal
  cycle is never visible. If reduced motion is set or `IntersectionObserver` is
  unavailable (jsdom, no-JS), it stays shown — content is never stuck invisible.
- The reveal transform lives on the wrapper; inner cards keep their own
  `hover:-translate-y-1` (separate elements → no transform conflict).

**Stagger helper**: callers pass `delayMs={Math.min(i, 4) * 70}` so a 4-up row
cascades but large grids don't drag (cap at the 5th item).

**Equal-height grids**: the wrapper becomes the grid cell. Pass `className="h-full"`
on the `Reveal`, and ensure cards that rely on `mt-auto` fill their cell:
- `NetworkCard` already has `h-full` — no change.
- Story cards (the inline `<Link>` with `flex-col` + `mt-auto`) get `h-full` added.
- Doctor / resource cards get `h-full` for aligned borders (cosmetic but tidy).

### 3. `components/ParallaxImage.tsx` (refactor)

Extract the scroll math into an internal `useParallax({ speed })` (ref-based,
`requestAnimationFrame`-throttled scroll listener, clamped offset — same math as
today) and route the reduced-motion check through `usePrefersReducedMotion`.

- **Technique unchanged:** image is 116% tall inside an `overflow-hidden` frame;
  the `<img>` translates within the frame so the photo content moves slower than
  surrounding text. Layout-safe (no neighbor overlap).
- `speed` prop already exists. Hero uses a slightly stronger value (~0.18) so it
  clearly lags the text; building image stays gentle (~0.12). Both remain subtle.

## Application map (`app/[locale]/page.tsx`)

| Section | Change |
|---|---|
| Hero photo (`ParallaxImage`) | `speed≈0.18` (was 0.2 default) |
| Hero stats | unchanged (`AnimatedCounter`) |
| "Why families choose us" image (`ParallaxImage`) | `speed≈0.12` |
| Doctors preview | wrap each card in `Reveal` w/ stagger; header block in `Reveal` |
| Network cards | wrap each `NetworkCard` in `Reveal` w/ stagger; header in `Reveal` |
| Resources grid | wrap each card (incl. "browse all" tile) in `Reveal` w/ stagger; header in `Reveal` |
| Stories grid | wrap each card in `Reveal` w/ stagger; header in `Reveal` |
| FAQ items | via new opt-in prop on `FaqAccordion` (below) |
| Banners (find-a-clinic, foundation, careers/insurance, bottom CTA, partners) | no change |

### `components/FaqAccordion.tsx` — opt-in reveal

Add an optional `revealOnScroll?: boolean` prop (default `false`). When true, each
FAQ item is wrapped in `Reveal` (`as="li"` if the list is `ul/li`, else `div`) with
a staggered `delayMs`. Default-off keeps every other page that uses `FaqAccordion`
unchanged. The homepage passes `revealOnScroll`.

## Motion tokens (tunable)

- Reveal offset: `translate-y-4` (~16px)
- Reveal duration: ~600ms, ease-out
- Reveal stagger: 70ms per item, capped at index 4
- Reveal trigger: IO threshold ~0.15 (or rootMargin bottom `-10%`)
- Parallax speed: hero ~0.18, building ~0.12

## Accessibility & correctness

- All motion is inert under `prefers-reduced-motion: reduce` (content shown, no
  transform, no parallax).
- Content is always in the DOM and visible when JS/IO is unavailable → existing
  homepage tests (`getByText` / `getByRole`) keep passing; no test changes needed
  beyond possibly asserting the new behavior is optional.
- No new dependencies.

## Testing

- `Reveal`: unit test that (a) children render and are visible when
  `IntersectionObserver` is undefined (jsdom default), (b) reduced-motion path
  renders shown. (IO-driven transition is not exercisable in jsdom; covered by the
  fallback assertion.)
- `usePrefersReducedMotion`: unit test via mocked `matchMedia`.
- `FaqAccordion`: existing tests must still pass with `revealOnScroll` defaulting
  off; add one asserting items still render when it's on.
- Homepage: existing `page.test.tsx` assertions must remain green.

## Out of scope

- No changes to hero stats counter, no library adoption, no motion on banner rows,
  no changes to non-homepage pages' behavior.
