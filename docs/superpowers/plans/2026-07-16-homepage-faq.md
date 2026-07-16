# Homepage FAQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Frequently Asked Questions" section to the homepage, placed above the final "Book an appointment today" CTA banner (which itself sits directly above the site footer).

**Architecture:** A typed data file (`data/faq.ts`) holds the 8 fixed Q&A pairs. A new client component (`components/FaqAccordion.tsx`) renders them as a single-open accordion using local `useState`. `app/[locale]/page.tsx` gets a new `<section>` wired to translated chrome copy (eyebrow/heading/subheading) plus the accordion.

**Tech Stack:** Next.js App Router (React 19, client components via `"use client"`), next-intl for i18n, Tailwind CSS v4 (project design tokens in `app/globals.css`), Vitest + React Testing Library + `@testing-library/user-event` for tests.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-16-homepage-faq-design.md`.
- The 8 Q&A pairs are **English-only** — do not add Spanish translations for `question`/`answer` text.
- The section chrome (eyebrow/heading/subheading) **is** translated — add matching keys to both `messages/en.json` and `messages/es.json`.
- Accordion is **single-open**: opening one question closes whichever other one was open. All start collapsed.
- Section placement: after the "Careers / Insurance / Resources / Services" teaser grid section, and immediately before the `{/* Bottom CTA */}` section, in `app/[locale]/page.tsx`.
- Follow existing design tokens exactly — do not invent new colors/spacing scales. Available tokens (from `app/globals.css`): `ivory`, `ivory-deep`, `ink`, `ink-soft`, `navy`, `teal`, `teal-dark`, `teal-tint`, `gold`, `gold-tint`, `border`; `shadow-card`; `font-display`.
- Reuse the exact chevron toggle icon markup already used in `components/Header.tsx` (the "more" dropdown) for visual consistency: path `d="m6 9 6 6 6-6"`, `strokeWidth="1.8"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, wrapped in a `<svg viewBox="0 0 24 24" fill="none">` with a `transition-transform` + conditional `rotate-180` class.
- **No git repository exists in this project** (`git status` fails with "not a git repository"). Skip all `git add`/`git commit` steps in this plan — verification via test runs is the completion signal for each task instead.
- Test command for a single file: `npx vitest run <path>` (project's `npm test` script is `vitest run` for the whole suite).

---

### Task 1: FAQ data file

**Files:**
- Create: `data/faq.ts`
- Test: `data/faq.test.ts`

**Interfaces:**
- Produces: `export type FaqItem = { id: string; question: string; answer: string }` and `export const faqs: FaqItem[]` — consumed by Task 3 (`FaqAccordion` props) and Task 4 (`page.tsx`).

- [ ] **Step 1: Write the failing test**

Create `data/faq.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { faqs } from "./faq";

describe("faq data", () => {
  it("has the 8 questions from the current homepage content", () => {
    expect(faqs.map((f) => f.id).sort()).toEqual(
      [
        "first-visit",
        "walk-ins",
        "insurance-plans",
        "ages-treated",
        "telehealth",
        "switch-doctor",
        "after-hours",
        "transfer-hmo",
      ].sort()
    );
  });

  it("every question and answer is non-empty text", () => {
    for (const faq of faqs) {
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run data/faq.test.ts`
Expected: FAIL — `data/faq.ts` does not exist (module not found).

- [ ] **Step 3: Write the implementation**

Create `data/faq.ts`:

```ts
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "first-visit",
    question: "What should I bring to my child's first visit?",
    answer:
      "Please bring your child's insurance card, a valid photo ID, any previous medical records or immunization history, and a list of current medications. For newborns, bring the hospital discharge paperwork. Arriving 15 minutes early helps us get your paperwork completed smoothly.",
  },
  {
    id: "walk-ins",
    question: "Do you accept walk-in patients?",
    answer:
      "Yes! We welcome walk-in patients at all of our 25+ clinic locations during regular business hours (Mon–Fri, 9AM–6PM). Same-day appointments are also available — you can book online in under a minute or call us directly. Wait times for walk-ins are typically under 30 minutes.",
  },
  {
    id: "insurance-plans",
    question: "What insurance plans do you accept?",
    answer:
      "We accept all major insurance plans including HMO, PPO, Medi-Cal, LA Care, Molina Healthcare, Blue Shield, Healthnet, Anthem, Optum, and Regal Medical Group. Coverage is never a barrier to care at our clinics. If you're unsure about your plan, call us and we'll verify your coverage.",
  },
  {
    id: "ages-treated",
    question: "What ages do you treat?",
    answer:
      "Kids & Teens Medical Group provides care for patients from birth through age 21. This includes newborns, infants, toddlers, school-age children, adolescents, and young adults. Our St. Gianna Medical Group locations also offer family practice for patients of all ages.",
  },
  {
    id: "telehealth",
    question: "How does telehealth work?",
    answer:
      "Our telehealth service connects you with your trusted KTMG pediatrician via secure video call. Available Mon–Sat 9AM–9PM and Sundays 12PM–6PM. Simply book online, and you'll receive a link to join your video visit. Your doctor can diagnose, prescribe medications, and send prescriptions directly to your pharmacy — all from the comfort of home.",
  },
  {
    id: "switch-doctor",
    question: "Can I switch my child's doctor within the network?",
    answer:
      "Absolutely. With 50+ providers across 25+ locations, you can switch pediatricians at any time. Your child's medical records are centralized and accessible from any KTMG clinic, so there's no paperwork or delays when transitioning to a new provider.",
  },
  {
    id: "after-hours",
    question: "Do you offer after-hours and weekend care?",
    answer:
      "Yes. Our Pediatric After Hours clinics provide evening and weekend urgent care staffed by board-certified pediatricians. Telehealth is also available 7 days a week, including evenings (until 9PM Mon–Sat) and Sundays (12PM–6PM). Your child can always be seen when they need care.",
  },
  {
    id: "transfer-hmo",
    question: "How do I transfer from another HMO/IPA?",
    answer:
      "Through our Serendib Healthways HMO/IPA, transferring is hassle-free. Our transfer team handles all the paperwork for you. Simply call (626) 655-4041 or visit serendibhealthways.com to schedule a call with our transfer team. The switch can happen immediately in most cases.",
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run data/faq.test.ts`
Expected: PASS (2 tests).

---

### Task 2: Section chrome translations

**Files:**
- Modify: `messages/en.json` (inside the `Home` object)
- Modify: `messages/es.json` (inside the `Home` object)

**Interfaces:**
- Produces: translation keys `Home.faqEyebrow`, `Home.faqHeading`, `Home.faqSubheading` — consumed by Task 4 via `t("faqEyebrow")` / `t("faqHeading")` / `t("faqSubheading")` where `t = useTranslations("Home")`.

- [ ] **Step 1: Add the English keys**

In `messages/en.json`, inside the `"Home"` object, find these existing lines:

```json
    "resourcesHeading": "Parent Resources",
    "resourcesBody": "Vaccine schedules, forms, and developmental guides.",
    "browseResources": "Browse parent resources",
    "bottomCtaHeading": "Your child can be seen today.",
```

Replace with (inserting the 3 new keys between `browseResources` and `bottomCtaHeading`):

```json
    "resourcesHeading": "Parent Resources",
    "resourcesBody": "Vaccine schedules, forms, and developmental guides.",
    "browseResources": "Browse parent resources",
    "faqEyebrow": "Questions parents ask",
    "faqHeading": "Frequently Asked Questions",
    "faqSubheading": "Everything you need to know about visiting our clinics.",
    "bottomCtaHeading": "Your child can be seen today.",
```

- [ ] **Step 2: Add the Spanish keys**

In `messages/es.json`, inside the `"Home"` object, find these existing lines:

```json
    "resourcesHeading": "Recursos para padres",
    "resourcesBody": "Calendarios de vacunas, formularios y guías de desarrollo.",
    "browseResources": "Ver recursos para padres",
    "bottomCtaHeading": "Su hijo puede ser atendido hoy.",
```

Replace with:

```json
    "resourcesHeading": "Recursos para padres",
    "resourcesBody": "Calendarios de vacunas, formularios y guías de desarrollo.",
    "browseResources": "Ver recursos para padres",
    "faqEyebrow": "Preguntas frecuentes de los padres",
    "faqHeading": "Preguntas Frecuentes",
    "faqSubheading": "Todo lo que necesita saber sobre cómo visitar nuestras clínicas.",
    "bottomCtaHeading": "Su hijo puede ser atendido hoy.",
```

(Note: the FAQ *questions and answers* stay English-only per the spec — this step only translates the section's eyebrow/heading/subheading chrome, consistent with every other section on the page.)

- [ ] **Step 3: Verify both files are still valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); console.log('valid')"`
Expected: prints `valid` with no errors.

---

### Task 3: `FaqAccordion` component

**Files:**
- Create: `components/FaqAccordion.tsx`
- Test: `components/FaqAccordion.test.tsx`

**Interfaces:**
- Consumes: `FaqItem` type from `@/data/faq` (Task 1) — shape `{ id: string; question: string; answer: string }`.
- Produces: `export function FaqAccordion({ items }: { items: FaqItem[] })` — a client component, consumed by Task 4 in `app/[locale]/page.tsx` as `<FaqAccordion items={faqs} />`.

- [ ] **Step 1: Write the failing test**

Create `components/FaqAccordion.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { FaqAccordion } from "./FaqAccordion";
import type { FaqItem } from "@/data/faq";

const items: FaqItem[] = [
  { id: "one", question: "First question?", answer: "First answer." },
  { id: "two", question: "Second question?", answer: "Second answer." },
];

describe("FaqAccordion", () => {
  it("renders every question", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByText("First question?")).toBeInTheDocument();
    expect(screen.getByText("Second question?")).toBeInTheDocument();
  });

  it("keeps every answer collapsed by default", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByText("First answer.")).not.toBeVisible();
  });

  it("expands an answer when its question is clicked", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: "First question?" }));
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("First answer.")).toBeVisible();
  });

  it("closes the previously open answer when a different question is clicked", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: "First question?" }));
    await user.click(screen.getByRole("button", { name: "Second question?" }));
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("re-collapses an open answer when its question is clicked again", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    const button = screen.getByRole("button", { name: "First question?" });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/FaqAccordion.test.tsx`
Expected: FAIL — `./FaqAccordion` module not found.

- [ ] **Step 3: Write the implementation**

Create `components/FaqAccordion.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/faq";

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-white shadow-card">
      {items.map((item) => {
        const isOpen = item.id === openId;
        const buttonId = `faq-button-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div key={item.id}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-display font-semibold text-ink transition-colors hover:text-teal-dark sm:py-5"
            >
              <span>{item.question}</span>
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
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-sm text-ink-soft sm:text-base"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/FaqAccordion.test.tsx`
Expected: PASS (5 tests).

---

### Task 4: Wire the FAQ section into the homepage

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/page.test.tsx`

**Interfaces:**
- Consumes: `faqs` from `@/data/faq` (Task 1), `FaqAccordion` from `@/components/FaqAccordion` (Task 3), translation keys `faqEyebrow`/`faqHeading`/`faqSubheading` from the existing `Home` namespace (Task 2).

- [ ] **Step 1: Write the failing test**

In `app/[locale]/page.test.tsx`, add this test inside the existing `describe("Home page", ...)` block (after the "renders a services teaser..." test, before the Spanish-locale test):

```tsx
  it("renders a FAQ section with the section heading and first question", () => {
    render(<Home />);
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /what should i bring to my child's first visit/i,
      })
    ).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/[locale]/page.test.tsx`
Expected: FAIL — heading/button not found (FAQ section doesn't exist in the page yet).

- [ ] **Step 3: Add the imports**

In `app/[locale]/page.tsx`, update the import block at the top of the file:

```tsx
import { insuranceInfo } from "@/data/insurance";
import { faqs } from "@/data/faq";
import { FaqAccordion } from "@/components/FaqAccordion";
```

(Add these two new lines; keep all existing imports as-is.)

- [ ] **Step 4: Add the FAQ section**

In `app/[locale]/page.tsx`, find the boundary between the teaser grid section and the bottom CTA section:

```tsx
        </div>
      </section>

      {/* Bottom CTA */}
```

Replace with (inserting a new FAQ section between them):

```tsx
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("faqEyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t("faqHeading")}
          </h2>
          <p className="mt-3 text-ink-soft">{t("faqSubheading")}</p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* Bottom CTA */}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run app/[locale]/page.test.tsx`
Expected: PASS (all tests in the file, including the new one).

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: PASS — all suites green, including `data/faq.test.ts`, `components/FaqAccordion.test.tsx`, and `app/[locale]/page.test.tsx`.

---

## Plan Self-Review Notes

- **Spec coverage:** data layer (Task 1), i18n chrome (Task 2), accordion component + single-open behavior (Task 3), placement + page wiring (Task 4) all covered. Mobile responsiveness is satisfied by reusing the existing `max-w-6xl`/`px-5 sm:px-8` container and card tokens rather than needing a separate task.
- **No placeholders:** every step has complete, runnable code.
- **Type consistency:** `FaqItem` (Task 1) is the only shape referenced everywhere — `{ id, question, answer }` — matched exactly in `FaqAccordion` props (Task 3) and test fixtures (Tasks 3 and 4).
