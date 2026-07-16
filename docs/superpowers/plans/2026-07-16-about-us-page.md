# About Us Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static About Us page at `/about` with hardcoded marketing copy, and link to it from the Header "More" dropdown and the Footer "About" column.

**Architecture:** A new server-component route `app/[locale]/about/page.tsx` follows the existing static-page pattern used by `app/[locale]/careers/page.tsx` and `app/[locale]/insurance/page.tsx` (hardcoded English copy, `Metadata` export, `max-w-4xl` container). It reuses live data from `@/data/locations` and `@/data/insurance` the same way the Home and Insurance pages already do. Navigation is wired up by adding a link in `components/Header.tsx` and `components/Footer.tsx`, backed by new `next-intl` message keys in `messages/en.json` and `messages/es.json`.

**Tech Stack:** Next.js 16 App Router, next-intl, Tailwind, Vitest + Testing Library.

## Global Constraints

- Static content pages (Careers, Insurance, Foundation, and now About) are hardcoded English copy — they are NOT translated per-locale. Only shared/interactive components (Header, Footer, Home) use `next-intl` message keys.
- This directory (`c:\dev\kt-doctor`) is **not a git repository** (`git status` fails with "not a git repository"). Skip all `git add` / `git commit` steps in this plan — run the verification command for each step and move on. Do not attempt to initialize a repo.
- Components that render the `Link` from `@/i18n/navigation` must be tested with `renderWithIntl` from `@/lib/test-utils`, not plain RTL `render` (confirmed via `components/LocationCard.test.tsx`).
- Follow the existing pill-list visual pattern: `rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark` for teal pills, `rounded-full bg-gold-tint px-4 py-2 font-display text-sm font-semibold text-gold` for gold pills (see `app/[locale]/page.tsx` and `app/[locale]/insurance/page.tsx`).

---

### Task 1: About page content, metadata, and test

**Files:**
- Create: `app/[locale]/about/page.tsx`
- Create: `app/[locale]/about/page.test.tsx`

**Interfaces:**
- Consumes: `locations` (array, `.length` used) from `@/data/locations`; `insuranceInfo.acceptedCategories` (`string[]`) from `@/data/insurance`; `BOOKING_URL` (`string`) from `@/lib/constants`; `Link` from `@/i18n/navigation`.
- Produces: default-exported `AboutPage` component and `metadata` export, at route `/about` (and `/es/about`). No other task consumes exports from this file directly — Task 2 links to the route path `/about` as a string, not an import.

- [ ] **Step 1: Write the page component**

Create `app/[locale]/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import { BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Kids & Teens Medical Group",
  description:
    "Kids & Teens Pediatric Medical Group provides compassionate, comprehensive pediatric care across Greater Los Angeles, from routine check-ups to urgent care and after-hours visits.",
};

const CARE_AREAS = [
  "Routine check-ups",
  "Allergies",
  "ADHD",
  "Urgent care",
  "Prenatal consultations",
  "After-hours care",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        About Us
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Kids &amp; Teens Pediatric Medical Group
      </h1>
      <p className="mt-2 max-w-xl font-display text-lg font-semibold text-teal-dark">
        Caring for the Future Generations in Greater Los Angeles
      </p>

      <p className="mt-5 max-w-2xl text-ink-soft">
        Kids &amp; Teens Medical Group is a pediatric practice dedicated to
        providing compassionate, comprehensive care for children and
        adolescents. Our team of board-certified pediatricians is committed
        to offering personalized care tailored to your child&apos;s unique
        needs. We offer a wide range of services, including:
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {CARE_AREAS.map((area) => (
          <span
            key={area}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {area}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">
        With {locations.length} locations throughout Los Angeles and beyond,
        we&apos;re here to serve your family&apos;s needs. We accept most
        major insurance plans, including any HMO/IPA:
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-gold-tint px-4 py-2 font-display text-sm font-semibold text-gold"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">
        For those without insurance, we offer affordable payment options.
        Rest assured, your child&apos;s health is our top priority. Schedule
        an appointment today and let us help your family thrive.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          Book an Appointment
        </a>
        <Link
          href="/locations"
          className="rounded-full border border-border bg-white px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
        >
          Find a Clinic
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Write the test**

Create `app/[locale]/about/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the practice name as the main heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /kids & teens pediatric medical group/i })
    ).toBeInTheDocument();
  });

  it("renders a Book an Appointment link to the real booking URL", () => {
    render(<AboutPage />);
    const link = screen.getByRole("link", { name: /book an appointment/i });
    expect(link).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });

  it("renders a Find a Clinic link to /locations", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("mentions the real number of clinic locations", () => {
    render(<AboutPage />);
    expect(screen.getByText(new RegExp(`${locations.length} locations`, "i"))).toBeInTheDocument();
  });

  it("renders every accepted insurance category", () => {
    render(<AboutPage />);
    for (const category of insuranceInfo.acceptedCategories) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 3: Run the test suite for this file**

Run: `npx vitest run app/[locale]/about/page.test.tsx`
Expected: all 5 tests PASS.

---

### Task 2: Wire up navigation (Header, Footer, translations)

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/Header.test.tsx`
- Modify: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: route path `/about` (string, from Task 1). Does not import anything from `app/[locale]/about/page.tsx`.
- Produces: `Header.aboutUs` and `Footer.aboutUs` message keys, consumable by any future component via `useTranslations("Header")` / `useTranslations("Footer")`.

- [ ] **Step 1: Add message keys to `messages/en.json`**

In the `"Header"` object, add `"aboutUs": "About Us"` right after `"more": "More",`:

```json
  "Header": {
    "doctors": "Doctors",
    "locations": "Locations",
    "more": "More",
    "aboutUs": "About Us",
    "network": "Network",
```

In the `"Footer"` object, add `"aboutUs": "About Us"` right after `"about": "About",`:

```json
  "Footer": {
    "tagline": "Board-certified pediatric care across 24 Greater LA clinics, with same-day visits, telehealth, and a doctor your family can stick with.",
    "textLabel": "Text",
    "patients": "Patients",
    "about": "About",
    "aboutUs": "About Us",
    "doctors": "Doctors",
```

- [ ] **Step 2: Add message keys to `messages/es.json`**

In the `"Header"` object, add `"aboutUs": "Sobre Nosotros"` right after `"more": "Más",`:

```json
  "Header": {
    "doctors": "Doctores",
    "locations": "Ubicaciones",
    "more": "Más",
    "aboutUs": "Sobre Nosotros",
    "network": "Red",
```

In the `"Footer"` object, add `"aboutUs": "Sobre Nosotros"` right after `"about": "Nosotros",`:

```json
  "Footer": {
    "tagline": "Atención pediátrica certificada en 24 clínicas del área de Los Ángeles, con visitas el mismo día, telesalud y un médico con quien su familia puede continuar.",
    "textLabel": "Mensaje de texto",
    "patients": "Pacientes",
    "about": "Nosotros",
    "aboutUs": "Sobre Nosotros",
    "doctors": "Doctores",
```

- [ ] **Step 3: Write the failing Header test**

In `components/Header.test.tsx`, add a new test after the `"renders a nav link to /network"` test (around line 52):

```tsx
  it("renders a nav link to /about", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about");
  });
```

- [ ] **Step 4: Run the Header test to verify it fails**

Run: `npx vitest run components/Header.test.tsx`
Expected: FAIL — no link named "About Us" found.

- [ ] **Step 5: Add the Header nav link**

In `components/Header.tsx`, the dropdown menu currently starts like this (around line 103-114):

```tsx
            <div
              className={`flex flex-col gap-1 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-56 sm:flex-col sm:gap-0.5 sm:rounded-2xl sm:border sm:border-border sm:bg-white sm:p-2 sm:shadow-card ${
                moreOpen ? "sm:flex" : "sm:hidden"
              }`}
            >
              <Link
                href="/network"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("network")}
              </Link>
```

Add an "About Us" link immediately before the `/network` link, so the block reads:

```tsx
            <div
              className={`flex flex-col gap-1 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-56 sm:flex-col sm:gap-0.5 sm:rounded-2xl sm:border sm:border-border sm:bg-white sm:p-2 sm:shadow-card ${
                moreOpen ? "sm:flex" : "sm:hidden"
              }`}
            >
              <Link
                href="/about"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("aboutUs")}
              </Link>
              <Link
                href="/network"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("network")}
              </Link>
```

- [ ] **Step 6: Run the Header test to verify it passes**

Run: `npx vitest run components/Header.test.tsx`
Expected: all tests PASS.

- [ ] **Step 7: Write the failing Footer test**

In `components/Footer.test.tsx`, add an assertion inside the existing `"renders links to every page on the site"` test (around line 24-36), right after the opening `render(<Footer />);` line:

```tsx
  it("renders links to every page on the site", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
```

(leave the remaining lines of that test unchanged)

- [ ] **Step 8: Run the Footer test to verify it fails**

Run: `npx vitest run components/Footer.test.tsx`
Expected: FAIL — no link named "About Us" found.

- [ ] **Step 9: Add the Footer nav link**

In `components/Footer.tsx`, the "About" column currently starts like this (around line 81-90):

```tsx
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("about")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/network" className="hover:text-ivory">
                  {t("network")}
                </Link>
              </li>
```

Add an "About Us" link as the first `<li>` in that list:

```tsx
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("about")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/about" className="hover:text-ivory">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-ivory">
                  {t("network")}
                </Link>
              </li>
```

- [ ] **Step 10: Run the Footer test to verify it passes**

Run: `npx vitest run components/Footer.test.tsx`
Expected: all tests PASS.

- [ ] **Step 11: Run the full test suite**

Run: `npm test`
Expected: all tests PASS, no regressions.

---

## Self-Review Notes

- **Spec coverage:** Route/content/metadata → Task 1. Nav in Header + Footer + translation keys → Task 2. Test coverage for both → included in each task. All spec sections covered.
- **Placeholder scan:** none found — all steps contain complete, runnable code.
- **Type consistency:** `AboutPage` is a default export consumed only by its own test via relative import (`./page`); no cross-task type surface beyond the `/about` string path used in Task 2, which matches Task 1's route.
