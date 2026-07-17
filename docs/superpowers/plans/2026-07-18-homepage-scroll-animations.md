# Homepage Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add subtle, cohesive scroll-driven motion to the homepage — parallax on the hero and building photos, and fade-and-slide-up reveals (with stagger) on the card grids and FAQ items.

**Architecture:** Three hand-rolled, dependency-free primitives: a shared `usePrefersReducedMotion` hook, a `Reveal` wrapper component (IntersectionObserver, fires once), and a `ParallaxImage` refactored to consume the shared hook. The homepage wires these in; `FaqAccordion` and `ResourceCard` get small additive props so the effect stays homepage-scoped.

**Tech Stack:** Next.js (repo's modified build — see `AGENTS.md`), React client components, Tailwind CSS v4, TypeScript, Vitest + Testing Library (jsdom).

## Global Constraints

- **No new dependencies.** Hand-rolled `IntersectionObserver` / `requestAnimationFrame` only.
- **All motion inert under `prefers-reduced-motion: reduce`** and when `IntersectionObserver` is unavailable (SSR / no-JS / jsdom) — content must render fully visible in those cases, never trapped at `opacity-0`.
- **Reveals fire once** (disconnect observer after first intersection).
- **Stagger:** `delayMs = Math.min(index, 4) * 70` (70ms cascade, capped at the 5th item).
- **Motion tokens:** reveal offset `translate-y-4` (~16px), duration `duration-700`, `ease-out`; parallax speed hero `0.18`, building `0.12`.
- **Reveal reach:** doctors, network, resources, stories grids + their section headers + FAQ items. Banner rows (find-a-clinic, foundation, careers/insurance, bottom CTA, partners), the services pill cloud, and the hero stats counter are unchanged.
- **Test command:** `npx vitest run <path>`. **Lint:** `npm run lint`.
- Existing tests (`components/ParallaxImage.test.tsx`, `components/FaqAccordion.test.tsx`, `app/[locale]/page.test.tsx`, `components/AnimatedCounter.test.tsx`) must remain green.

---

## File Structure

- **Create** `lib/usePrefersReducedMotion.ts` — shared reactive reduced-motion hook.
- **Create** `lib/usePrefersReducedMotion.test.tsx` — hook test.
- **Create** `components/Reveal.tsx` — fade-and-slide-up-on-scroll wrapper.
- **Create** `components/Reveal.test.tsx` — component test.
- **Modify** `components/ParallaxImage.tsx` — consume shared hook (behavior unchanged).
- **Modify** `components/ResourceCard.tsx` — add optional `className` prop.
- **Modify** `components/FaqAccordion.tsx` — add optional `revealOnScroll` prop.
- **Modify** `app/[locale]/page.tsx` — set parallax speeds, wrap headers + cards in `Reveal`, enable FAQ reveals.

> **Note on scope trims from the spec:** the spec mentioned extracting a `useParallax` hook. `ParallaxImage` is its only consumer, so per YAGNI the scroll math stays inline in `ParallaxImage`; only the reduced-motion check is unified via the shared hook. `AnimatedCounter` and `DonateTab` are left untouched (`DonateTab` already gates motion via Tailwind `motion-safe:`; `AnimatedCounter` works and refactoring adds risk with no user-facing gain).

---

## Task 1: `usePrefersReducedMotion` hook

**Files:**
- Create: `lib/usePrefersReducedMotion.ts`
- Test: `lib/usePrefersReducedMotion.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `usePrefersReducedMotion(): boolean` — reactive; reads the value synchronously on first client render and updates on media-query change. Returns `false` on the server.

- [ ] **Step 1: Write the failing test**

Create `lib/usePrefersReducedMotion.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function Probe() {
  const reduced = usePrefersReducedMotion();
  return <span>{reduced ? "reduced" : "full"}</span>;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe("usePrefersReducedMotion", () => {
  it("returns false when the user has not requested reduced motion", () => {
    mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByText("full")).toBeInTheDocument();
  });

  it("returns true when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByText("reduced")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/usePrefersReducedMotion.test.tsx`
Expected: FAIL — cannot resolve `./usePrefersReducedMotion`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/usePrefersReducedMotion.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Shared reactive check for the OS "reduce motion" setting. The useState
// initializer reads the value synchronously on the first client render so
// motion-gating effects (parallax, reveals) see the correct value immediately
// rather than a first-paint `false`. SSR-safe: returns false on the server.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/usePrefersReducedMotion.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/usePrefersReducedMotion.ts lib/usePrefersReducedMotion.test.tsx
git commit -m "feat: add shared usePrefersReducedMotion hook"
```

---

## Task 2: `Reveal` component

**Files:**
- Create: `components/Reveal.tsx`
- Test: `components/Reveal.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` from `@/lib/usePrefersReducedMotion`.
- Produces: `Reveal({ children, delayMs?, className? })` — wraps children in a `div` that fades/slides up once on viewport entry. Props: `children: ReactNode`, `delayMs?: number` (default 0), `className?: string` (default "").

**Behavior note (FOUC safety):** On the server and first client paint the wrapper renders **shown**. After mount, if motion is allowed and `IntersectionObserver` exists, it "arms" (hides) and observes; the observer callback reveals it once, then disconnects. Every reveal target on the homepage is below the fold, so the arm→hide→reveal cycle is never visible. When reduced motion is set or `IntersectionObserver` is absent (jsdom / no-JS), it stays shown — content is never stuck invisible.

- [ ] **Step 1: Write the failing test**

Create `components/Reveal.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

const originalMatchMedia = window.matchMedia;
const originalIO = globalThis.IntersectionObserver;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

// Minimal IntersectionObserver stand-in that lets a test fire the callback.
class MockIO {
  static instances: MockIO[] = [];
  callback: IntersectionObserverCallback;
  elements: Element[] = [];
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    MockIO.instances.push(this);
  }
  observe(el: Element) {
    this.elements.push(el);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: this.elements[0] } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  globalThis.IntersectionObserver = originalIO;
  MockIO.instances = [];
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  it("renders children fully visible when IntersectionObserver is unavailable", () => {
    mockMatchMedia(false);
    // jsdom has no IntersectionObserver; assert the fallback keeps content shown.
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal>
        <p>hello</p>
      </Reveal>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("opacity-100");
    expect(container.firstChild).not.toHaveClass("opacity-0");
  });

  it("stays visible and does not observe under reduced motion", () => {
    mockMatchMedia(true);
    globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal>
        <p>hi</p>
      </Reveal>
    );
    expect(MockIO.instances.length).toBe(0);
    expect(container.firstChild).toHaveClass("opacity-100");
  });

  it("arms hidden then reveals once on intersection when motion is allowed", () => {
    mockMatchMedia(false);
    globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal>
        <p>reveal me</p>
      </Reveal>
    );
    // Armed after mount effect: hidden until it intersects.
    expect(container.firstChild).toHaveClass("opacity-0");
    expect(MockIO.instances.length).toBe(1);

    act(() => {
      MockIO.instances[0].trigger(true);
    });
    expect(container.firstChild).toHaveClass("opacity-100");
    expect(container.firstChild).not.toHaveClass("opacity-0");
  });

  it("applies a transition delay for staggering", () => {
    mockMatchMedia(false);
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal delayMs={140}>
        <p>staggered</p>
      </Reveal>
    );
    expect(container.firstChild).toHaveStyle({ transitionDelay: "140ms" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Reveal.test.tsx`
Expected: FAIL — cannot resolve `./Reveal`.

- [ ] **Step 3: Write minimal implementation**

Create `components/Reveal.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type RevealProps = {
  children: ReactNode;
  delayMs?: number;
  className?: string;
};

// Fade-and-slide-up-on-scroll wrapper. Renders children in a div that animates
// from translate-y-4/opacity-0 to fully visible the first time it enters the
// viewport, then stays put (fires once). Inert under reduced motion or when
// IntersectionObserver is unavailable: in those cases it renders fully visible
// so content is never trapped hidden (SSR / no-JS / jsdom). Because every reveal
// target on the homepage sits below the fold, the post-mount arm→hide step is
// never visible.
export function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;

    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const hidden = armed && !revealed && !reducedMotion;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${
        hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Reveal.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/Reveal.tsx components/Reveal.test.tsx
git commit -m "feat: add Reveal fade-and-slide-up scroll component"
```

---

## Task 3: Refactor `ParallaxImage` to use the shared hook

**Files:**
- Modify: `components/ParallaxImage.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` from `@/lib/usePrefersReducedMotion`.
- Produces: `ParallaxImage` unchanged public API (`src, alt, width, height, wrapperClassName, preload?, speed?`).

This is a behavior-preserving refactor: swap the inline `window.matchMedia(...)` check for the shared hook. The existing `components/ParallaxImage.test.tsx` is the spec — no new tests. The hook's synchronous initializer means `reducedMotion` is correct on first render, so the effect still early-returns (attaches no scroll listener) under reduced motion.

- [ ] **Step 1: Confirm the existing tests currently pass**

Run: `npx vitest run components/ParallaxImage.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 2: Apply the refactor**

In `components/ParallaxImage.tsx`, change the imports at the top:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
```

Then replace the start of the effect. Change this:

```tsx
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
```

…to this (add the hook call above the effect, and gate on it inside):

```tsx
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
```

Finally, update the effect dependency array at the bottom of the effect from `[speed]` to `[speed, prefersReducedMotion]`:

```tsx
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [speed, prefersReducedMotion]);
```

- [ ] **Step 3: Run the existing tests to verify they still pass**

Run: `npx vitest run components/ParallaxImage.test.tsx`
Expected: PASS (4 tests) — same behavior, now via the shared hook.

- [ ] **Step 4: Commit**

```bash
git add components/ParallaxImage.tsx
git commit -m "refactor: route ParallaxImage reduced-motion check through shared hook"
```

---

## Task 4: `ResourceCard` optional `className` prop

**Files:**
- Modify: `components/ResourceCard.tsx`
- Test: `components/ResourceCard.test.tsx`

**Interfaces:**
- Produces: `ResourceCard({ resource, className? })` — `className` (default "") is appended to the root card's classes. Existing callers (`ResourcesPageContent`) are unaffected.

This lets the homepage pass `h-full` so revealed resource cards keep equal height inside their `Reveal` wrappers, without changing the card on the `/resources` page.

- [ ] **Step 1: Write the failing test**

Add this test to `components/ResourceCard.test.tsx` (inside the existing `describe` block; keep existing imports — add `renderWithIntl`/`screen` only if not already present):

```tsx
  it("appends a custom className to the card root", () => {
    const resource = {
      id: "r1",
      name: "Immunization Schedule",
      nameEs: "Calendario de vacunación",
      description: "When to vaccinate.",
      descriptionEs: "Cuándo vacunar.",
      available: true,
      href: "/x",
      external: false,
    };
    const { container } = renderWithIntl(
      <ResourceCard resource={resource} className="h-full" />
    );
    expect(container.firstChild).toHaveClass("h-full");
  });
```

> If the existing test file does not already import `renderWithIntl` and reference `ResourceCard`, add at the top:
> ```tsx
> import { renderWithIntl } from "@/lib/test-utils";
> import { ResourceCard } from "./ResourceCard";
> ```
> Match the shape of `ParentResource` in `data/resources.ts` — if fields differ from the sample above, copy an existing fixture from the current test file instead.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ResourceCard.test.tsx`
Expected: FAIL — `className` is not applied (prop ignored).

- [ ] **Step 3: Write minimal implementation**

In `components/ResourceCard.tsx`, update the props type and the root `div`:

```tsx
type ResourceCardProps = {
  resource: ParentResource;
  className?: string;
};

export function ResourceCard({ resource, className = "" }: ResourceCardProps) {
  const t = useTranslations("Resources");
  const locale = useLocale();
  const name = locale === "es" ? resource.nameEs : resource.name;
  const description = locale === "es" ? resource.descriptionEs : resource.description;

  return (
    <div
      className={`rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft ${className}`}
    >
```

(Leave the rest of the component unchanged.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/ResourceCard.test.tsx`
Expected: PASS (all tests, including the new one).

- [ ] **Step 5: Commit**

```bash
git add components/ResourceCard.tsx components/ResourceCard.test.tsx
git commit -m "feat: allow ResourceCard to accept an extra className"
```

---

## Task 5: `FaqAccordion` opt-in `revealOnScroll` prop

**Files:**
- Modify: `components/FaqAccordion.tsx`
- Test: `components/FaqAccordion.test.tsx`

**Interfaces:**
- Consumes: `Reveal` from `@/components/Reveal`.
- Produces: `FaqAccordion({ items, revealOnScroll? })` — when `revealOnScroll` is true (default false), each item is wrapped in a `Reveal` with staggered `delayMs`. Default-off keeps existing behavior/tests unchanged.

- [ ] **Step 1: Write the failing test**

Add to `components/FaqAccordion.test.tsx` (inside the existing `describe`; reuse the file's existing fixture/import style — the snippet below assumes a `faqs`-like array is already imported or defined in the file):

```tsx
  it("still renders every question when revealOnScroll is enabled", () => {
    renderWithIntl(<FaqAccordion items={faqs} revealOnScroll />);
    for (const item of faqs) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });
```

> If the existing test file imports the real data as something other than `faqs` (e.g. it builds a local fixture), use that same source here. The point is only to assert questions still render with the flag on.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/FaqAccordion.test.tsx`
Expected: FAIL — `revealOnScroll` is not a valid prop / has no effect (TypeScript error or the assertion path differs). If it happens to pass because the prop is silently ignored, that's fine — proceed; the implementation below adds the real behavior.

- [ ] **Step 3: Write minimal implementation**

Edit `components/FaqAccordion.tsx`. Update imports and props:

```tsx
"use client";

import { Fragment, useState } from "react";
import { useLocale } from "next-intl";
import type { FaqItem } from "@/data/faq";
import { Reveal } from "@/components/Reveal";

type FaqAccordionProps = {
  items: FaqItem[];
  revealOnScroll?: boolean;
};

export function FaqAccordion({ items, revealOnScroll = false }: FaqAccordionProps) {
```

Then change the `.map` so each item's card is defined once and wrapped conditionally. Replace the current `return (` block inside `items.map(...)` so the map callback takes an index and returns either a `Reveal` (keyed) or a keyed `Fragment`:

```tsx
      {items.map((item, i) => {
        const isOpen = item.id === openId;
        const buttonId = `faq-button-${item.id}`;
        const panelId = `faq-panel-${item.id}`;
        const question = locale === "es" ? item.questionEs : item.question;
        const answer = locale === "es" ? item.answerEs : item.answer;

        const card = (
          <div className="rounded-2xl bg-white shadow-card">
            <h3 className="contents">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-display font-bold text-ink transition-colors hover:text-teal-dark sm:py-5"
              >
                <span>{question}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-4 w-4 shrink-0 text-teal-dark transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-sm text-ink-soft sm:text-base"
            >
              {answer}
            </div>
          </div>
        );

        return revealOnScroll ? (
          <Reveal key={item.id} delayMs={Math.min(i, 4) * 70}>
            {card}
          </Reveal>
        ) : (
          <Fragment key={item.id}>{card}</Fragment>
        );
      })}
```

(The wrapping `<div className="flex flex-col gap-3">` container stays as-is.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/FaqAccordion.test.tsx`
Expected: PASS (existing tests + the new one). Default-off path is DOM-identical (keyed `Fragment` adds no node).

- [ ] **Step 5: Commit**

```bash
git add components/FaqAccordion.tsx components/FaqAccordion.test.tsx
git commit -m "feat: add opt-in scroll reveal to FaqAccordion items"
```

---

## Task 6: Wire animations into the homepage

**Files:**
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Reveal` from `@/components/Reveal`; `ParallaxImage` (`speed` prop); `ResourceCard` (`className` prop); `FaqAccordion` (`revealOnScroll` prop).
- Produces: the finished animated homepage. No new exports.

- [ ] **Step 1: Add the `Reveal` import**

Near the other component imports in `app/[locale]/page.tsx`, add:

```tsx
import { Reveal } from "@/components/Reveal";
```

- [ ] **Step 2: Set parallax speeds**

Hero image — add `speed={0.18}`:

```tsx
            <ParallaxImage
              src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
              alt="A pediatrician examining a young patient during a check-up"
              width={1200}
              height={1400}
              wrapperClassName="h-[22rem] rounded-[2rem] shadow-soft sm:h-[26rem]"
              speed={0.18}
              preload
            />
```

Building image ("Why families choose us") — add `speed={0.12}`:

```tsx
          <ParallaxImage
            src="https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?auto=format&fit=crop&w=1000&q=80"
            alt="Modern medical clinic building with a glass facade"
            width={1000}
            height={1000}
            wrapperClassName="h-72 rounded-[2rem] shadow-card sm:h-96"
            speed={0.12}
          />
```

- [ ] **Step 3: Doctors preview — reveal header + stagger cards**

Wrap the header block in `Reveal`, and wrap each card in `Reveal` with stagger + `h-full` on the card. Replace the header `div` opening/closing and the `.map`:

```tsx
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                  {t("teamEyebrow")}
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  {t("teamHeading", { count: doctors.length })}
                </h2>
              </div>
              <Link
                href="/doctors"
                className="font-display font-semibold text-teal-dark hover:text-teal"
              >
                {t("browseAllDoctors")} →
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {previewDoctors.map((doc, i) => (
              <Reveal key={doc.id} delayMs={Math.min(i, 4) * 70} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-white p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:border-teal hover:shadow-soft">
                  {doc.photoSrc ? (
                    <Image
                      src={doc.photoSrc}
                      alt={doc.name}
                      width={64}
                      height={64}
                      className="mx-auto h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-bold ${
                        avatarTints[i % avatarTints.length]
                      }`}
                    >
                      {initials(doc.name)}
                    </div>
                  )}
                  <p className="mt-3 font-display text-sm font-bold text-ink">{doc.name}</p>
                  <p className="text-xs text-ink-soft">{doc.credentials}</p>
                </div>
              </Reveal>
            ))}
          </div>
```

- [ ] **Step 4: Network teaser — reveal header + stagger cards**

Replace the header block and the `.map`:

```tsx
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                {t("networkEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("networkHeading")}
              </h2>
            </div>
            <Link
              href="/network"
              className="font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("seeFullNetwork")} →
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {networkBrands.map((brand, i) => (
            <Reveal key={brand.id} delayMs={Math.min(i, 4) * 70} className="h-full">
              <NetworkCard brand={brand} compact />
            </Reveal>
          ))}
        </div>
```

- [ ] **Step 5: Resources — reveal header + stagger cards (incl. the "browse all" tile)**

Replace the eyebrow/heading/body block and the grid:

```tsx
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("resourcesHeading")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t("resourcesSectionHeading")}
          </h2>
          <p className="mt-2 max-w-lg text-ink-soft">{t("resourcesBody")}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parentResources.map((resource, i) => (
            <Reveal key={resource.id} delayMs={Math.min(i, 4) * 70} className="h-full">
              <ResourceCard resource={resource} className="h-full" />
            </Reveal>
          ))}

          <Reveal
            delayMs={Math.min(parentResources.length, 4) * 70}
            className="h-full"
          >
            <Link
              href="/resources"
              className="flex h-full flex-col items-start justify-center rounded-2xl border border-border bg-teal-tint p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <p className="font-display text-base font-bold text-teal-dark">
                {t("browseAllResourcesTitle")}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{t("browseAllResourcesBody")}</p>
              <span className="mt-3 font-display text-sm font-semibold text-teal-dark">
                {t("viewAllResources")} →
              </span>
            </Link>
          </Reveal>
        </div>
```

- [ ] **Step 6: Featured Stories — reveal header + stagger cards**

Replace the eyebrow/heading block and the grid:

```tsx
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("storiesEyebrow")}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("storiesHeading")}
          </h2>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story, i) => {
            const title = locale === "es" ? story.titleEs : story.title;

            return (
              <Reveal key={story.id} delayMs={Math.min(i, 4) * 70} className="h-full">
                <Link
                  href={`/blog/${story.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <Image
                    src={story.imageSrc}
                    alt={title}
                    width={300}
                    height={225}
                    unoptimized
                    className="h-36 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-ink-soft">{story.date}</p>
                    <p className="mt-2 font-display text-base font-bold text-ink">{title}</p>
                    <span className="mt-auto pt-4 font-display text-sm font-semibold text-teal-dark">
                      {t("readFullStory")} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
```

- [ ] **Step 7: FAQ — reveal header + enable item reveals**

Wrap the centered header in `Reveal` and pass `revealOnScroll` to `FaqAccordion`:

```tsx
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                {t("faqEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("faqHeading")}
              </h2>
              <p className="mt-3 text-ink-soft">{t("faqSubheading")}</p>
            </div>
          </Reveal>

          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={faqs} revealOnScroll />
          </div>
```

- [ ] **Step 8: Run the homepage tests + full suite + lint**

Run: `npx vitest run app/[locale]/page.test.tsx`
Expected: PASS (content is in the DOM and visible under jsdom's missing IO).

Run: `npx vitest run`
Expected: PASS (entire suite green).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 9: Manual verification (real browser)**

Use the `run` (or `verify`) skill to launch the app and confirm on the homepage:
- Hero photo drifts slower than the hero text on scroll; building image drifts gently.
- Doctors, network, resources, stories cards fade-and-slide up with a subtle left-to-right stagger as each grid enters view; FAQ items reveal in sequence.
- Each reveal happens once (scrolling back up does not replay).
- With OS "reduce motion" enabled, everything appears immediately with no parallax or reveal.

- [ ] **Step 10: Commit**

```bash
git add "app/[locale]/page.tsx"
git commit -m "feat: add subtle scroll parallax and reveals to the homepage"
```

---

## Self-Review

**Spec coverage:**
- Hero parallax (slower than text) → Task 6 Step 2 (`speed={0.18}`) on the existing `ParallaxImage` (internal-drift), refactored in Task 3. ✓
- Building image parallax → Task 6 Step 2 (`speed={0.12}`). ✓
- Fade-and-slide-up card sections (doctors, network, resources, stories) → Task 6 Steps 3–6. ✓
- FAQ item reveals → Task 5 + Task 6 Step 7. ✓
- Subtle stagger → `Math.min(index, 4) * 70` everywhere. ✓
- Reveal once → observer disconnects on first intersection (Task 2). ✓
- Reduced-motion + no-JS/SSR safety → Task 1 hook + Task 2 fallbacks; verified in tests. ✓
- Equal-height grids preserved → `h-full` on wrappers + cards; `ResourceCard` className (Task 4); `NetworkCard` already `h-full`. ✓
- Homepage-scoped (no other pages affected) → additive opt-in props on `FaqAccordion`/`ResourceCard`. ✓
- No new dependencies → confirmed. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step shows full code. ✓

**Type consistency:** `usePrefersReducedMotion(): boolean` used identically in `Reveal` and `ParallaxImage`. `Reveal` props (`children`, `delayMs`, `className`) match all call sites. `delayMs` stagger formula identical across Task 5 and Task 6. `ResourceCard` `className` and `FaqAccordion` `revealOnScroll` match their call sites in Task 6. ✓
