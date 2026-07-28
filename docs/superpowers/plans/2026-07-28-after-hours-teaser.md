# After-Hours Pediatric Urgent Care Teaser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standout homepage teaser for After-Hours Pediatric Urgent Care, placed directly below the Hero, linking out to `https://pediatricafterhour.com/`.

**Architecture:** One new presentational component, `AfterHoursCtaBanner`, following the existing `bg-surface` card + fixed-color accent-panel pattern already used by `ClinicNearYouCard`/`InfoStatCard`, wired into `HomePageContent.tsx` right after `<Hero />`. All copy flows through new `Home` namespace i18n keys; the external link and phone number are new/reused data, not new components.

**Tech Stack:** Next.js (App Router), React Server/Client Components, next-intl, Tailwind CSS, Vitest + Testing Library.

## Global Constraints

- Every UI change must be fully responsive (mobile, tablet, desktop) and support both dark mode and light mode.
- Any new user-facing text must be added to both `messages/en.json` and `messages/es.json`, with matching key structure in both. Never hardcode UI copy.
- Do not change existing values in `lib/constants.ts` or email-routing env vars without explicit confirmation. (The client has already explicitly confirmed the new phone number `(818) 280-4268` and the schedule copy below — this is new data being added, not a change to an existing constant.)
- Custom interactive elements need keyboard/focus support and ARIA labels where semantics aren't native.
- Never use the em dash (—) or en dash (–) anywhere in generated copy, UI text, or code — use a plain hyphen instead.
- Colocate `.test.ts`/`.test.tsx` files for new components, matching the existing unit/component-level coverage pattern. Do not add end-to-end/browser tests.
- Do not run end-to-end/manual browser verification (Playwright, dev server, screenshots) — verify via code review, `npm run lint`, and `npm test` only.

---

### Task 1: Add After-Hours data and build `AfterHoursCtaBanner`

**Files:**
- Modify: `lib/constants.ts`
- Modify: `messages/en.json:98-99` (insert between `statAges` and `whyChooseUsEyebrow`)
- Modify: `messages/es.json:98-99` (insert between `statAges` and `whyChooseUsEyebrow`)
- Create: `components/AfterHoursCtaBanner.tsx`
- Test: `components/AfterHoursCtaBanner.test.tsx`

**Interfaces:**
- Consumes: `networkBrands` from `@/data/network` (existing `pediatric-after-hour` entry, `externalUrl: "https://pediatricafterhour.com/"`); `renderWithIntl` test helper from `@/lib/test-utils`.
- Produces: `export function AfterHoursCtaBanner(): JSX.Element` — a self-contained card with no props, consumed by Task 2. Renders its own content; the caller is responsible for the outer `<section>`/max-width wrapper (matching how `ClinicNearYouCard` and `BookingCtaBanner` are used in `HomePageContent.tsx`).

- [ ] **Step 1: Add the new phone constant**

In `lib/constants.ts`, add this line directly after the existing `TEXT_PHONE_ES` constant:

```ts
export const AFTER_HOURS_PHONE = "(818) 280-4268";
```

- [ ] **Step 2: Add English copy keys**

In `messages/en.json`, inside the `"Home"` object, insert these keys immediately after `"statAges": "Ages served",` (line 98) and before `"whyChooseUsEyebrow"`:

```json
    "afterHoursEyebrow": "Urgent Care · After Hours",
    "afterHoursHeading": "Sick after six? Our doors are still open.",
    "afterHoursBody": "Board-certified pediatricians, same-day appointments, and virtual care any day of the week, at a fraction of the cost of an emergency room visit.",
    "afterHoursCta": "Get urgent care now",
    "afterHoursCallLabel": "Call {phone}",
    "afterHoursOpenNow": "Open now",
    "afterHoursWeeknightsLabel": "Weeknights",
    "afterHoursWeeknightsValue": "6pm-11pm",
    "afterHoursWeekendsLabel": "Weekends",
    "afterHoursWeekendsValue": "All day",
    "afterHoursVirtualLabel": "Virtual care",
    "afterHoursVirtualValue": "24/7",
```

- [ ] **Step 3: Add matching Spanish copy keys**

In `messages/es.json`, inside the `"Home"` object, insert these keys in the exact same position (after `"statAges": "Edades atendidas",`, line 98):

```json
    "afterHoursEyebrow": "Atención de Urgencia · Fuera de Horario",
    "afterHoursHeading": "¿Enfermo después de las seis? Nuestras puertas siguen abiertas.",
    "afterHoursBody": "Pediatras certificados, citas el mismo día y atención virtual cualquier día de la semana, a una fracción del costo de una visita a la sala de emergencias.",
    "afterHoursCta": "Obtener atención de urgencia ahora",
    "afterHoursCallLabel": "Llamar al {phone}",
    "afterHoursOpenNow": "Abierto ahora",
    "afterHoursWeeknightsLabel": "Entre semana",
    "afterHoursWeeknightsValue": "6pm-11pm",
    "afterHoursWeekendsLabel": "Fines de semana",
    "afterHoursWeekendsValue": "Todo el día",
    "afterHoursVirtualLabel": "Atención virtual",
    "afterHoursVirtualValue": "24/7",
```

- [ ] **Step 4: Write the failing test file**

Create `components/AfterHoursCtaBanner.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { AfterHoursCtaBanner } from "./AfterHoursCtaBanner";
import { AFTER_HOURS_PHONE } from "@/lib/constants";

describe("AfterHoursCtaBanner", () => {
  it("renders the heading, body, and open-now status pill", () => {
    render(<AfterHoursCtaBanner />);
    expect(
      screen.getByText("Sick after six? Our doors are still open.")
    ).toBeInTheDocument();
    expect(screen.getByText(/board-certified pediatricians/i)).toBeInTheDocument();
    expect(screen.getByText("Open now")).toBeInTheDocument();
  });

  it("links the primary CTA to the After-Hours Pediatric Urgent Care site in a new tab", () => {
    render(<AfterHoursCtaBanner />);
    const cta = screen.getByRole("link", { name: /get urgent care now/i });
    expect(cta).toHaveAttribute("href", "https://pediatricafterhour.com/");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a tel: phone link with an accessible call label", () => {
    render(<AfterHoursCtaBanner />);
    const phone = screen.getByRole("link", { name: /call/i });
    expect(phone.getAttribute("href")).toMatch(/^tel:\+1\d{10}$/);
    expect(phone).toHaveAttribute("aria-label", `Call ${AFTER_HOURS_PHONE}`);
    expect(phone).toHaveTextContent(AFTER_HOURS_PHONE);
  });

  it("renders the schedule rows", () => {
    render(<AfterHoursCtaBanner />);
    expect(screen.getByText("Weeknights")).toBeInTheDocument();
    expect(screen.getByText("6pm-11pm")).toBeInTheDocument();
    expect(screen.getByText("Weekends")).toBeInTheDocument();
    expect(screen.getByText("All day")).toBeInTheDocument();
    expect(screen.getByText("Virtual care")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
  });

  it("renders the heading and status pill in Spanish when locale is es", () => {
    render(<AfterHoursCtaBanner />, "es");
    expect(
      screen.getByText("¿Enfermo después de las seis? Nuestras puertas siguen abiertas.")
    ).toBeInTheDocument();
    expect(screen.getByText("Abierto ahora")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npx vitest run components/AfterHoursCtaBanner.test.tsx`
Expected: FAIL — `components/AfterHoursCtaBanner` does not exist yet (module not found).

- [ ] **Step 6: Implement the component**

Create `components/AfterHoursCtaBanner.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { AFTER_HOURS_PHONE } from "@/lib/constants";
import { networkBrands } from "@/data/network";

const afterHoursBrand = networkBrands.find((b) => b.id === "pediatric-after-hour")!;

// Homepage teaser for the After-Hours Pediatric Urgent Care partner brand
// (see data/network.ts). Modeled on ClinicNearYouCard/InfoStatCard's
// surface-card-plus-accent-panel pattern, but not a single whole-card link
// (like BookingCtaBanner) since it carries two independent CTAs: an external
// link and a tel: link.
export function AfterHoursCtaBanner() {
  const t = useTranslations("Home");
  const telHref = `tel:+1${AFTER_HOURS_PHONE.replace(/\D/g, "")}`;

  const buttonFocusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card md:flex-row">
      {/* Content — above the schedule panel on mobile, left of it on desktop. */}
      <div className="order-2 flex flex-1 flex-col justify-center p-7 sm:p-10 md:order-1">
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("afterHoursEyebrow")}
        </span>
        <h2 className="mt-2 max-w-md font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t("afterHoursHeading")}
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">{t("afterHoursBody")}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={afterHoursBrand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark ${buttonFocusRing}`}
          >
            {t("afterHoursCta")}
          </a>
          <a
            href={telHref}
            aria-label={t("afterHoursCallLabel", { phone: AFTER_HOURS_PHONE })}
            className={`rounded-full border border-border bg-surface px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark ${buttonFocusRing}`}
          >
            {AFTER_HOURS_PHONE}
          </a>
        </div>
      </div>

      {/* Schedule panel — fixed teal gradient, same tokens as InfoStatCard's
          "teal" variant, so it reads identically in light and dark mode. */}
      <div className="order-1 flex shrink-0 flex-col gap-5 bg-gradient-to-br from-teal to-teal-dark p-7 text-white sm:p-8 md:order-2 md:w-[38%]">
        <span className="inline-flex w-fit items-center gap-2 font-display text-xs font-semibold uppercase tracking-wide text-white/90">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-white motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
            <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          {t("afterHoursOpenNow")}
        </span>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              {t("afterHoursWeeknightsLabel")}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-white">
              {t("afterHoursWeeknightsValue")}
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              {t("afterHoursWeekendsLabel")}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-white">
              {t("afterHoursWeekendsValue")}
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              {t("afterHoursVirtualLabel")}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-white">
              {t("afterHoursVirtualValue")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run components/AfterHoursCtaBanner.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 8: Commit**

```bash
git add lib/constants.ts messages/en.json messages/es.json components/AfterHoursCtaBanner.tsx components/AfterHoursCtaBanner.test.tsx
git commit -m "feat: add AfterHoursCtaBanner component for the urgent care teaser"
```

---

### Task 2: Wire the teaser into the homepage, after the Hero

**Files:**
- Modify: `components/HomePageContent.tsx:9-52` (add import, insert new section, adjust adjacent section's top padding)
- Modify: `app/[locale]/page.test.tsx`

**Interfaces:**
- Consumes: `AfterHoursCtaBanner` from Task 1 (`@/components/AfterHoursCtaBanner`); existing `Reveal` component (`@/components/Reveal`), already imported in `HomePageContent.tsx`.
- Produces: nothing new consumed by later tasks — this is the final integration point.

- [ ] **Step 1: Write the failing page-level tests**

In `app/[locale]/page.test.tsx`, add these two tests inside the existing `describe("Home page", ...)` block (anywhere after the other `it(...)` blocks is fine, e.g. right after the "telehealth teaser" tests at the end):

```tsx
  it("renders an after-hours urgent care teaser linking to the external partner site", async () => {
    await renderHome();
    expect(
      screen.getByText("Sick after six? Our doors are still open.")
    ).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /get urgent care now/i });
    expect(cta).toHaveAttribute("href", "https://pediatricafterhour.com/");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("renders the after-hours teaser heading in Spanish when locale is es", async () => {
    await renderHome("es");
    expect(
      screen.getByText("¿Enfermo después de las seis? Nuestras puertas siguen abiertas.")
    ).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run app/[locale]/page.test.tsx`
Expected: FAIL on the two new tests — the heading text isn't rendered anywhere on the homepage yet.

- [ ] **Step 3: Add the import**

In `components/HomePageContent.tsx`, add this import directly after the existing `import { Hero } from "@/components/Hero";` line (line 9):

```tsx
import { AfterHoursCtaBanner } from "@/components/AfterHoursCtaBanner";
```

- [ ] **Step 4: Insert the new section after the Hero**

In `components/HomePageContent.tsx`, the JSX currently reads (starting at line 50):

```tsx
  return (
    <main>
      <Hero />

      {/* Why families choose us */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
```

Replace it with:

```tsx
  return (
    <main>
      <Hero />

      {/* After-hours urgent care teaser — placed directly under the Hero
          since this is a time-sensitive message for a visitor who needs
          care right now, outside normal office hours. */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
        <Reveal>
          <AfterHoursCtaBanner />
        </Reveal>
      </section>

      {/* Why families choose us */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
```

(Note the "Why families choose us" section's top padding — `pt-20 sm:pt-24` — moves to the new section above it, since the new section is now the one directly under the Hero. "Why families choose us" drops back to the plain `pb-16` used by every other mid-page section.)

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run app/[locale]/page.test.tsx`
Expected: PASS, including the two new tests.

- [ ] **Step 6: Run the full test suite and lint**

Run: `npm test`
Expected: all tests pass, no regressions.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/HomePageContent.tsx "app/[locale]/page.test.tsx"
git commit -m "feat: surface the after-hours urgent care teaser on the homepage"
```
