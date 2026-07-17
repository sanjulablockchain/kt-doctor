# Floating Donate Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a gold vertical "Donate" tab pinned to the right edge of the homepage that gently animates and links out to the foundation's donation page.

**Architecture:** One new client component (`DonateTab`) mounted only on the homepage. It is a single external `<a>` styled as an edge tab, using existing design tokens plus one new `gold-dark` token. All animation is CSS-only (keyframes in `globals.css`), gated behind Tailwind's `motion-safe:` variant so it is inert under `prefers-reduced-motion`. Copy comes from a new next-intl `DonateTab` namespace.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2.4, next-intl 4.13, Tailwind CSS v4 (CSS-first `@theme`, no config file), Vitest 4 + Testing Library.

## Global Constraints

- **Redirect target:** `foundation.donateUrl` from `data/foundation.ts` (currently `https://kidsandteensfoundation.org/donate/`). Read it from the module — do NOT hardcode the URL string in the component. Open in a new tab: `target="_blank" rel="noopener noreferrer"`.
- **Scope:** Homepage only. Mount in `app/[locale]/page.tsx`. Do NOT add to `app/[locale]/layout.tsx` (that is where the site-wide `BackToTopButton`/`ContactWidget` live — the donate tab is intentionally not global).
- **Position:** `fixed right-0 top-1/2 -translate-y-1/2 z-20` (vertically centered right edge; `z-20` matches the other floating widgets; mid-height so it never collides with the bottom widgets).
- **New color token:** `--color-gold-dark: #bd8a34;` added to both the `:root` and `@theme inline` blocks of `app/globals.css`, following the existing `teal`/`teal-dark` pairing.
- **Motion:** All movement (idle heart-beat, entrance slide-in, hover nudge) must be disabled when the user prefers reduced motion. Achieve this with Tailwind's `motion-safe:` variant (equivalent to a `prefers-reduced-motion: no-preference` guard).
- **i18n:** New `DonateTab` namespace with keys `label` and `ariaLabel` in BOTH `messages/en.json` and `messages/es.json`. next-intl throws on a missing message, so both locales must be added together.
- **Site instructions (`AGENTS.md`):** This project's Next.js has undocumented breaking changes. Before writing component code, skim `node_modules/next/dist/docs/` for any client-component guidance that differs from stock Next.js. The component mirrors the existing `components/ContactWidget.tsx` (`"use client"` + `useTranslations` + `<a>`), which is a proven in-repo pattern.
- **Test command:** `npm test` runs the whole suite (`vitest run`). A single file: `npx vitest run <path>`.

---

## File Structure

- **Create** `components/DonateTab.tsx` — the tab component (client, no props, no state).
- **Create** `components/DonateTab.test.tsx` — unit tests for the component.
- **Modify** `app/globals.css` — add the `gold-dark` token and the `heartbeat` + `slide-in-right` keyframes.
- **Modify** `app/[locale]/page.tsx` — import and mount `<DonateTab />`.
- **Modify** `app/[locale]/page.test.tsx` — assert the tab is present on the homepage.
- **Modify** `messages/en.json` + `messages/es.json` — add the `DonateTab` namespace.

---

## Task 1: DonateTab component, i18n copy, and unit tests

**Files:**
- Create: `components/DonateTab.tsx`
- Create: `components/DonateTab.test.tsx`
- Modify: `messages/en.json:59` (insert `DonateTab` namespace after the `FloatingContact` block, before `"Home"`)
- Modify: `messages/es.json:59` (same insertion point)

**Interfaces:**
- Consumes: `foundation.donateUrl` from `@/data/foundation`; `renderWithIntl` from `@/lib/test-utils`.
- Produces: `export function DonateTab()` (named export, no props) from `@/components/DonateTab`. New i18n keys `DonateTab.label` and `DonateTab.ariaLabel` (EN + ES). The component's className references the CSS utilities `bg-gold-dark`, `animate-[heartbeat_...]`, and `animate-[slide-in-right_...]`, which Task 2 backs with real CSS (unit tests here do not depend on that CSS).

- [ ] **Step 1: Add the `DonateTab` namespace to `messages/en.json`**

Insert after the `FloatingContact` block's closing `},` (currently line 59), immediately before `"Home": {`:

```json
  "DonateTab": {
    "label": "Donate",
    "ariaLabel": "Donate to the Kids and Teens Foundation"
  },
```

- [ ] **Step 2: Add the `DonateTab` namespace to `messages/es.json`**

Insert at the same location (after the `FloatingContact` block, before `"Home"`):

```json
  "DonateTab": {
    "label": "Donar",
    "ariaLabel": "Donar a la Fundación Kids and Teens"
  },
```

- [ ] **Step 3: Write the failing test**

Create `components/DonateTab.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { DonateTab } from "./DonateTab";
import { foundation } from "@/data/foundation";

describe("DonateTab", () => {
  it("links to the foundation donate URL, opening in a new tab", () => {
    render(<DonateTab />);
    const link = screen.getByRole("link", {
      name: /donate to the kids and teens foundation/i,
    });
    expect(link).toHaveAttribute("href", foundation.donateUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("shows the visible Donate label", () => {
    render(<DonateTab />);
    expect(screen.getByText("Donate")).toBeInTheDocument();
  });

  it("renders Spanish label and aria-label when locale is es", () => {
    render(<DonateTab />, "es");
    expect(
      screen.getByRole("link", { name: /donar a la fundación kids and teens/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Donar")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx vitest run components/DonateTab.test.tsx`
Expected: FAIL — cannot resolve `./DonateTab` (module does not exist yet).

- [ ] **Step 5: Implement the component**

Create `components/DonateTab.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { foundation } from "@/data/foundation";

// Floating donate call-to-action, homepage only. Pinned to the right edge,
// vertically centered so it clears the bottom-anchored ContactWidget and
// BackToTopButton. External link — uses a plain <a>, not next-intl's Link.
// All motion is gated behind `motion-safe:` so it is inert under
// prefers-reduced-motion; the keyframes live in app/globals.css.
export function DonateTab() {
  const t = useTranslations("DonateTab");

  return (
    <a
      href={foundation.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
      className="fixed right-0 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-2xl bg-gold px-1.5 py-3 text-white shadow-soft transition-all duration-200 hover:bg-gold-dark focus-visible:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 motion-safe:animate-[slide-in-right_400ms_ease-out] motion-safe:hover:-translate-x-1 motion-safe:focus-visible:-translate-x-1 sm:gap-2 sm:px-2.5 sm:py-4"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-4 w-4 motion-safe:animate-[heartbeat_2.5s_ease-in-out_infinite] sm:h-5 sm:w-5"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="font-display text-xs font-semibold uppercase tracking-wide [writing-mode:vertical-rl] sm:text-sm">
        {t("label")}
      </span>
    </a>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/DonateTab.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add components/DonateTab.tsx components/DonateTab.test.tsx messages/en.json messages/es.json
git commit -m "feat: add floating DonateTab component and i18n copy"
```

---

## Task 2: Design token and animation keyframes in globals.css

**Files:**
- Modify: `app/globals.css` (`:root` block ~line 27; `@theme inline` block ~line 44; append keyframes at end of file)

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind color utilities `bg-gold-dark` / `text-gold-dark` / `ring-gold-dark` (via the `gold-dark` token), and two global `@keyframes`: `heartbeat` and `slide-in-right`, consumed by Task 1's `animate-[...]` utilities.

- [ ] **Step 1: Add the `gold-dark` token to the `:root` block**

In `app/globals.css`, in the `:root { ... }` block, add directly under the existing `--color-gold-tint:` line:

```css
  --color-gold-dark: #bd8a34;
```

- [ ] **Step 2: Expose `gold-dark` in the `@theme inline` block**

In the `@theme inline { ... }` block, add under the existing `--color-gold-tint:` line so Tailwind generates the utilities:

```css
  --color-gold-dark: var(--color-gold-dark);
```

- [ ] **Step 3: Append the keyframes at the end of `app/globals.css`**

```css
@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.15);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(1);
  }
}

/* Slide the tab in from off the right edge on mount. Keeps the vertical
   centering (translateY -50%) throughout so it does not jump. */
@keyframes slide-in-right {
  from {
    transform: translate(100%, -50%);
    opacity: 0;
  }
  to {
    transform: translate(0, -50%);
    opacity: 1;
  }
}
```

- [ ] **Step 4: Verify the stylesheet compiles**

Run: `npm run build`
Expected: build completes with no CSS/Tailwind errors (the `gold-dark` utilities and `animate-[heartbeat_...]` / `animate-[slide-in-right_...]` classes referenced by the component now resolve to real CSS).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add gold-dark token and donate-tab keyframes"
```

---

## Task 3: Mount on the homepage and integration-test

**Files:**
- Modify: `app/[locale]/page.tsx` (imports near top; render `<DonateTab />` as the last child of `<main>`, just before `</main>` at line 583)
- Modify: `app/[locale]/page.test.tsx` (add one test)

**Interfaces:**
- Consumes: `DonateTab` from `@/components/DonateTab` (Task 1); the `gold-dark`/keyframe CSS (Task 2).
- Produces: the tab rendered on the live homepage.

- [ ] **Step 1: Write the failing homepage test**

In `app/[locale]/page.test.tsx`, add this test inside the `describe("Home page", ...)` block (e.g. after the existing foundation-teaser test at line 46):

```tsx
  it("renders a floating Donate tab linking to the foundation donate page", () => {
    render(<Home />);
    const donateTab = screen.getByRole("link", {
      name: /donate to the kids and teens foundation/i,
    });
    expect(donateTab).toHaveAttribute(
      "href",
      "https://kidsandteensfoundation.org/donate/"
    );
    expect(donateTab).toHaveAttribute("target", "_blank");
  });
```

- [ ] **Step 2: Run the homepage tests to verify the new test fails**

Run: `npx vitest run "app/[locale]/page.test.tsx"`
Expected: the new test FAILS (`Unable to find an accessible element with the role "link" and name /donate to the kids and teens foundation/i`); all other tests still pass — importantly the existing "Donate Now link" test at line 41 stays green because its query `/donate now/i` does not match the tab's aria-label.

- [ ] **Step 3: Import DonateTab in the homepage**

In `app/[locale]/page.tsx`, add to the component imports (e.g. after the `FaqAccordion` import on line 20):

```tsx
import { DonateTab } from "@/components/DonateTab";
```

- [ ] **Step 4: Mount the tab as the last child of `<main>`**

In `app/[locale]/page.tsx`, immediately before the closing `</main>` tag (line 583), add:

```tsx
      <DonateTab />
```

- [ ] **Step 5: Run the homepage tests to verify they pass**

Run: `npx vitest run "app/[locale]/page.test.tsx"`
Expected: PASS (all tests, including the new one).

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: entire suite PASSES.

- [ ] **Step 7: Visual verification (real app)**

Run: `npm run dev`, open the homepage. Confirm:
- A gold vertical "Donate" tab sits centered on the right edge with a heart above vertical "Donate" text.
- The heart pulses subtly; on mount the tab slides in from the right.
- Hovering/focusing (Tab key) nudges the tab left, darkens it, and shows a focus ring; clicking opens `https://kidsandteensfoundation.org/donate/` in a new tab.
- On a narrow (mobile) viewport the tab is smaller but still clear of the bottom-right contact widget.
- With OS "reduce motion" enabled, the tab is static (no pulse, no slide-in, no hover nudge) but still links correctly.
- Switch locale to `/es` — the tab reads "Donar".

- [ ] **Step 8: Commit**

```bash
git add "app/[locale]/page.tsx" "app/[locale]/page.test.tsx"
git commit -m "feat: mount DonateTab on the homepage"
```

---

## Self-Review

**Spec coverage:**
- Right-edge vertical gold tab, homepage only → Task 1 (component) + Task 3 (mount, not layout). ✓
- Links to `foundation.donateUrl`, new tab → Task 1 + Global Constraints. ✓
- Idle heart-beat pulse → Task 2 `heartbeat` keyframe + Task 1 `animate-[heartbeat_...]`. ✓
- Hover slide-out + darken → Task 1 `motion-safe:hover:-translate-x-1` + `hover:bg-gold-dark`. ✓
- Entrance slide-in → Task 2 `slide-in-right` keyframe + Task 1 `animate-[slide-in-right_...]`. ✓
- Reduced-motion respected → `motion-safe:` variant gates all motion (Task 1). ✓
- `gold-dark` token → Task 2. ✓
- Compact on mobile → Task 1 base vs `sm:` sizing. ✓
- `DonateTab` i18n namespace EN + ES → Task 1. ✓
- Accessibility (real `<a>`, aria-label, aria-hidden heart, focus ring) → Task 1. ✓
- Tests (component + homepage) → Task 1 + Task 3. ✓

**Placeholder scan:** No TBD/TODO; every code step contains complete code. ✓

**Type consistency:** `DonateTab` named export used identically in Task 1, Task 3, and both test files. i18n keys `DonateTab.label` / `DonateTab.ariaLabel` consistent across component and tests. CSS names `heartbeat` / `slide-in-right` / `gold-dark` match between Task 2 (definition) and Task 1 (usage). ✓

## Out of Scope

- Adding the tab to any page other than the homepage.
- Any in-app donation/checkout or payment integration (links out).
- Changing the existing Foundation-teaser "Donate Now" button.
- A collapse-to-heart / expand-on-hover interaction (superseded by the vertical-tab screenshot).
