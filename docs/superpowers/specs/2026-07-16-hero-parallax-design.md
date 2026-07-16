# Homepage Hero Parallax — Design

## Goal

Add a subtle parallax effect to the homepage hero photo so it drifts slightly
slower than the page as the visitor scrolls past it, adding a touch of depth
to an otherwise static hero. Scope is intentionally narrow: the hero image
only, nothing else on the page.

## Why hero-only

The homepage's other sections are almost entirely white cards and text — the
hero photo (`app/[locale]/page.tsx:120-129`) and the "Why families choose us"
clinic photo (`app/[locale]/page.tsx:150-158`) are the only large images.
Stakeholder confirmed a subtle, single-element effect over a multi-section
"scrollytelling" treatment: lower risk, no new decorative assets needed, and
avoids the effect reading as gimmicky.

## Approach

Self-contained scroll-position hook, no new dependency (the codebase has zero
animation libraries today and hand-rolls its own interactions, e.g. the
rotating FAQ chevron, hover translate/shadow utilities). Rejected alternatives:

- **CSS scroll-driven animations** (`animation-timeline: scroll()`) — no JS,
  but Safari support is still inconsistent; not worth the risk for a live
  clinic site's hero.
- **Framer Motion** (`useScroll`/`useTransform`) — nicest DX, but a ~50kb
  dependency for exactly one effect used nowhere else.

## Implementation

New client component `components/ParallaxImage.tsx` wrapping `next/image`,
used as a drop-in replacement for the current hero `<Image>`:

- Props mirror the subset of `next/image` props the hero call site uses today
  (`src`, `alt`, `width`, `height`, `className`, `priority`), plus an optional
  `speed` (default ~0.2, meaning the image moves at 20% of the scroll delta
  relative to its container).
- Internally: `ParallaxImage` renders its own `overflow-hidden` wrapper `div`
  around the `<Image>` (replacing the plain wrapper `div` currently at
  `app/[locale]/page.tsx:120`), with a `ref` on the wrapper (to measure its
  position in the viewport) and a second `ref` forwarded directly onto the
  `<Image>` (to apply and measure the transform). `next/image` has forwarded
  `ref` to the underlying `<img>` since a stable v13.0.6 — confirmed against
  `node_modules/next/dist/docs` for this project's Next 16.2.10 install — so
  this is documented, stable behavior, not a fragile assumption. A scroll
  listener (`{ passive: true }`) is attached in a `useEffect`, throttled via
  `requestAnimationFrame` (one pending frame at a time, not one handler call
  per scroll event).
- The image itself is rendered oversized relative to its wrapper (absolutely
  positioned, ~116% of the wrapper's height, `object-cover`) so it has room to
  translate without revealing empty space at either edge. On each scroll
  frame: compare the wrapper's vertical center to the viewport's center,
  multiply the difference by `speed`, clamp the result to the actual
  oversized-vs-wrapper height difference (measured via `offsetHeight`, not
  assumed), and apply it as `translateY(...)` directly on the image element.
  The wrapper's `overflow-hidden` clips anything at the clamped extremes, so
  the effect is bounded by construction, not just by convention.
- Also fixes a deprecation in the touched code: the hero's current `priority`
  prop (`app/[locale]/page.tsx:127`) is deprecated as of Next.js 16.0.0 in
  favor of `preload` (confirmed in the same docs check) — since this exact
  prop is being touched to migrate to `ParallaxImage`, it's updated to
  `preload` in the same change.
- `prefers-reduced-motion: reduce` check (via `matchMedia`, read once on
  mount): when set, the scroll listener is never attached and no transform is
  applied — the image behaves exactly as it does today.
- Server-render-safe: the transform is applied via a `useEffect`, so there is
  no window/document access during SSR; the image renders normally with no
  transform until the effect runs on the client.

## Site instructions note

Per `AGENTS.md`, this project's Next.js has undocumented breaking changes
from stock Next.js — before writing `next/image` wrapper code, check
`node_modules/next/dist/docs/` for any relevant image/client-component
guidance that might differ from standard Next.js conventions.

## Placement

Only `app/[locale]/page.tsx:120-129` changes: swap the `<Image>` for
`<ParallaxImage>` with the same props. No other section, no other page.

## Testing

- New `components/ParallaxImage.test.tsx`:
  - Renders the image with the given `src`/`alt` (behaves like a normal
    image when scroll/motion APIs aren't exercised in jsdom).
  - When `prefers-reduced-motion: reduce` is mocked as matching, no scroll
    listener is attached (assert via a spy on `addEventListener`).
- No changes expected to `app/[locale]/page.test.tsx` (same image, same
  alt text, just wrapped).

## Out of scope

- Parallax on the "Why families choose us" clinic photo or any other section
  (explicitly deferred — hero only, per stakeholder decision).
- Any new decorative background shapes/blobs.
- Horizontal parallax or multi-layer depth effects.
