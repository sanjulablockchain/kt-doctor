# Homepage Hero Parallax Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero photo drift slightly slower than the page as the visitor scrolls past it, using a small self-contained component — no other section of the page changes.

**Architecture:** A new client component, `ParallaxImage`, wraps `next/image` in an `overflow-hidden` box and translates the image on scroll via a `requestAnimationFrame`-throttled listener. It replaces the hero's plain image wrapper in `app/[locale]/page.tsx` one-for-one — same `src`/`alt`/dimensions, no other markup around it changes.

**Tech Stack:** Next.js 16.2.10 (App Router), React, `next/image`, Vitest + Testing Library (jsdom). No new dependencies.

## Global Constraints

- No new npm dependencies — implement with a plain React hook, not a library (per approved spec).
- Effect is scoped to the hero image only; no other section, no new decorative assets (per approved spec).
- Must fully disable (no listener attached, no transform applied) when `prefers-reduced-motion: reduce` matches.
- Must not break SSR — no `window`/`document` access outside a `useEffect`.
- The touched `priority` prop on the hero image (`app/[locale]/page.tsx:127`) is deprecated in this Next.js version (16.0.0+) — migrate it to `preload` as part of this change, per `AGENTS.md`'s instruction to heed deprecation notices in this non-stock Next.js setup.

---

### Task 1: `ParallaxImage` component

**Files:**
- Create: `components/ParallaxImage.tsx`
- Test: `components/ParallaxImage.test.tsx`

**Interfaces:**
- Produces: `ParallaxImage`, a named export from `components/ParallaxImage.tsx`, with props:
  ```ts
  type ParallaxImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    wrapperClassName: string; // sizing (height) + rounding/shadow for the crop window
    preload?: boolean;        // default false — forwarded to next/image's `preload` prop
    speed?: number;           // default 0.2 — fraction of scroll delta the image drifts by
  };
  ```
  Task 2 imports and renders `<ParallaxImage {...props} />` with no other knowledge of its internals.

- [ ] **Step 1: Write the failing tests**

Create `components/ParallaxImage.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParallaxImage } from "./ParallaxImage";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe("ParallaxImage", () => {
  it("renders the image with the given src and alt", () => {
    mockMatchMedia(false);
    render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="A pediatrician examining a young patient"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    expect(
      screen.getByAltText("A pediatrician examining a young patient")
    ).toBeInTheDocument();
  });

  it("does not attach a scroll listener when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="test image"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.anything()
    );
  });

  it("attaches a passive scroll listener when reduced motion is not preferred", () => {
    mockMatchMedia(false);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="test image"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
  });

  it("removes the scroll listener on unmount", () => {
    mockMatchMedia(false);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="test image"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/ParallaxImage.test.tsx`
Expected: FAIL — `components/ParallaxImage.tsx` does not exist yet (`Cannot find module './ParallaxImage'` or similar).

- [ ] **Step 3: Implement `ParallaxImage`**

Create `components/ParallaxImage.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type ParallaxImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  wrapperClassName: string;
  preload?: boolean;
  speed?: number;
};

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  wrapperClassName,
  preload = false,
  speed = 0.2,
}: ParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    if (!wrapper || !image) return;

    let frameId: number | null = null;

    function updatePosition() {
      frameId = null;
      if (!wrapper || !image) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const maxOffset = Math.max(0, (image.offsetHeight - wrapper.offsetHeight) / 2);
      const viewportCenter = window.innerHeight / 2;
      const wrapperCenter = wrapperRect.top + wrapperRect.height / 2;
      const rawOffset = (viewportCenter - wrapperCenter) * speed;
      const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
      image.style.transform = `translateY(${clampedOffset}px)`;
    }

    function onScroll() {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(updatePosition);
    }

    updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [speed]);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${wrapperClassName}`}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        preload={preload}
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run components/ParallaxImage.test.tsx`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add components/ParallaxImage.tsx components/ParallaxImage.test.tsx
git commit -m "feat: add ParallaxImage component for subtle scroll-driven drift"
```

---

### Task 2: Wire `ParallaxImage` into the homepage hero

**Files:**
- Modify: `app/[locale]/page.tsx:119-129`

**Interfaces:**
- Consumes: `ParallaxImage` from `components/ParallaxImage.tsx` (Task 1) — props `{ src, alt, width, height, wrapperClassName, preload }`.

- [ ] **Step 1: Add the import**

In `app/[locale]/page.tsx`, add alongside the other component imports (near `import { NetworkCard } from "@/components/NetworkCard";`):

```tsx
import { ParallaxImage } from "@/components/ParallaxImage";
```

- [ ] **Step 2: Replace the hero image block**

Replace this block at `app/[locale]/page.tsx:119-129`:

```tsx
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
                alt="A pediatrician examining a young patient during a check-up"
                width={1200}
                height={1400}
                className="h-[22rem] w-full object-cover sm:h-[26rem]"
                priority
              />
            </div>
```

with:

```tsx
          <div className="relative">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
              alt="A pediatrician examining a young patient during a check-up"
              width={1200}
              height={1400}
              wrapperClassName="h-[22rem] rounded-[2rem] shadow-soft sm:h-[26rem]"
              preload
            />
```

(The rest of the `<div className="relative">` block — the floating stats card below it — is unchanged; only the image wrapper `<div>` is replaced.)

- [ ] **Step 3: Run the existing homepage test suite**

Run: `npx vitest run "app/[locale]/page.test.tsx"`
Expected: PASS — same hero copy, links, and CTAs as before; `ParallaxImage` renders the same `alt` text so no existing assertion changes.

- [ ] **Step 4: Manually verify in the browser**

Start the dev server if it isn't already running (`npm run dev`), open the homepage, and scroll past the hero. Confirm:
- The hero photo drifts subtly relative to the page as you scroll, and stays fully covering its rounded card at all scroll positions (no gaps at the top/bottom edges).
- In DevTools, enabling "Emulate CSS media feature prefers-reduced-motion: reduce" and reloading disables the effect — the image no longer moves on scroll.

- [ ] **Step 5: Commit**

```bash
git add app/\[locale\]/page.tsx
git commit -m "feat: apply parallax drift to homepage hero image"
```
