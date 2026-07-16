# Testimonials Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static `/testimonials` page listing every clinic with a link to that clinic's Google reviews, and wire it into the Header/Footer navigation.

**Architecture:** A server-component page (`app/[locale]/testimonials/page.tsx`) following the existing `insurance`/`network` page convention — hardcoded English copy, `data/locations.ts` as the source of clinic data, a local URL-builder helper. Nav wiring follows the existing `Header.tsx`/`Footer.tsx` + `messages/*.json` pattern used by every other nav item.

**Tech Stack:** Next.js App Router, React server components, Tailwind CSS, next-intl (nav labels only), Vitest + Testing Library.

## Global Constraints

- Static content pages are **not** translated per-locale — body copy stays English (only nav *labels* go through `next-intl`). Source: `docs/superpowers/specs/2026-07-16-testimonials-page-design.md`.
- No new `data/testimonials.ts` — reuse `data/locations.ts` as the single source of truth for clinics.
- No Yelp section — omitted until a real Yelp business URL is available.
- Google review links are generated Google Maps search URLs built from each clinic's `name` + `address` (no real per-location Google Business URLs exist in this repo).
- Nav label text: English "Testimonials", Spanish "Testimonios".

---

### Task 1: Testimonials page

**Files:**
- Create: `app/[locale]/testimonials/page.tsx`
- Test: `app/[locale]/testimonials/page.test.tsx`

**Interfaces:**
- Consumes: `locations` (array of `Location`) from `@/data/locations`; `Location` type from `@/lib/types` (fields used: `id`, `name`, `address`).
- Produces: default-exported `TestimonialsPage` component (no props) and a page-local `googleReviewsUrl(location: Location): string` helper (not exported — same pattern as the local `toE164` helper in `insurance/page.tsx`).

- [ ] **Step 1: Write the failing test**

Create `app/[locale]/testimonials/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { locations } from "@/data/locations";
import TestimonialsPage from "./page";

describe("TestimonialsPage", () => {
  it("renders the heading", () => {
    render(<TestimonialsPage />);
    expect(
      screen.getByRole("heading", { name: "Share Your Experience" })
    ).toBeInTheDocument();
  });

  it("renders a review link for every clinic location", () => {
    render(<TestimonialsPage />);
    for (const location of locations) {
      expect(screen.getByRole("link", { name: location.name })).toBeInTheDocument();
    }
  });

  it("links a clinic to a Google Maps search for its reviews", () => {
    render(<TestimonialsPage />);
    const link = screen.getByRole("link", { name: "Agoura Hills" });
    expect(link).toHaveAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        "Kids & Teens Medical Group Agoura Hills 5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301"
      )}`
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- app/[locale]/testimonials/page.test.tsx`
Expected: FAIL — `Cannot find module './page'` (the page doesn't exist yet).

- [ ] **Step 3: Write the page**

Create `app/[locale]/testimonials/page.tsx`:

```tsx
import type { Metadata } from "next";
import { locations } from "@/data/locations";
import type { Location } from "@/lib/types";

export const metadata: Metadata = {
  title: "Testimonials | Kids & Teens Medical Group",
  description:
    "Read what families are saying about Kids & Teens Medical Group, and share your own experience with our pediatric clinics across Greater LA.",
};

function googleReviewsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Kids & Teens Medical Group ${location.name} ${location.address}`
  )}`;
}

export default function TestimonialsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Testimonials & Reviews
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Share Your Experience
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Kids &amp; Teens Medical Group is a general pediatrics practice that
        takes an integrated approach to care, with offices across Greater LA
        offering high-quality pediatric care and pediatric urgent care
        services.
      </p>
      <p className="mt-3 max-w-2xl text-ink-soft">
        We always appreciate feedback from our valued patients, and
        we&apos;re thrilled that so many parents have shared their positive
        experiences with us.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        Google Reviews
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Select a clinic to read or leave a review on Google.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {locations.map((location) => (
          <a
            key={location.id}
            href={googleReviewsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-center font-display text-sm font-semibold text-teal-dark shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            {location.name}
          </a>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-ink-soft">
        Please read what others are saying about Kids &amp; Teens Medical
        Group above, and as always, we would love to collect your feedback
        too.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- app/[locale]/testimonials/page.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add app/\[locale\]/testimonials/page.tsx app/\[locale\]/testimonials/page.test.tsx
git commit -m "feat: add testimonials page"
```

---

### Task 2: Wire up navigation

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify (test): `components/Header.test.tsx`
- Modify (test): `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `t("testimonials")` via `useTranslations("Header")` / `useTranslations("Footer")` (already used by every other nav item in these files); `Link` from `@/i18n/navigation`.
- Produces: nothing new consumed elsewhere — this task only adds a link, matching the shape of the existing `network`/`careers` links.

- [ ] **Step 1: Write the failing tests**

In `components/Header.test.tsx`, add after the `"renders a nav link to /blog"` test:

```tsx
  it("renders a nav link to /testimonials", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Testimonials" })).toHaveAttribute(
      "href",
      "/testimonials"
    );
  });
```

In `components/Footer.test.tsx`, add a line inside the existing `"renders links to every page on the site"` test, right after the `Resources` assertion:

```tsx
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute("href", "/resources");
    expect(screen.getByRole("link", { name: "Testimonials" })).toHaveAttribute(
      "href",
      "/testimonials"
    );
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- components/Header.test.tsx components/Footer.test.tsx`
Expected: FAIL — both new assertions fail with "Unable to find an accessible element with the role 'link' and name 'Testimonials'" (translation key doesn't exist yet and the link isn't rendered).

- [ ] **Step 3: Add the translation keys**

In `messages/en.json`, add `"testimonials": "Testimonials"` to both the `Header` and `Footer` objects (after `"blog"` in `Header`, after `"resources"` in `Footer`):

```json
  "Header": {
    "doctors": "Doctors",
    "locations": "Locations",
    "more": "More",
    "aboutUs": "About Us",
    "network": "Network",
    "foundation": "Foundation",
    "careers": "Careers",
    "insurance": "Insurance",
    "resources": "Resources",
    "services": "Services",
    "blog": "Blog",
    "testimonials": "Testimonials",
    "payOnline": "Pay Online",
    "portalLogIn": "Portal Log In",
    "appointments": "Appointments",
    "toggleMenu": "Toggle menu"
  },
  "Footer": {
    "tagline": "Board-certified pediatric care across 24 Greater LA clinics, with same-day visits, telehealth, and a doctor your family can stick with.",
    "textLabel": "Text",
    "patients": "Patients",
    "about": "About",
    "aboutUs": "About Us",
    "doctors": "Doctors",
    "locations": "Locations",
    "insurance": "Insurance",
    "resources": "Resources",
    "testimonials": "Testimonials",
    "network": "Network",
    "foundation": "Foundation",
    "careers": "Careers",
    "rights": "All rights reserved."
  },
```

In `messages/es.json`, add `"testimonials": "Testimonios"` in the same two spots:

```json
  "Header": {
    "doctors": "Doctores",
    "locations": "Ubicaciones",
    "more": "Más",
    "aboutUs": "Sobre Nosotros",
    "network": "Red",
    "foundation": "Fundación",
    "careers": "Empleo",
    "insurance": "Seguro",
    "resources": "Recursos",
    "services": "Servicios",
    "blog": "Blog",
    "testimonials": "Testimonios",
    "payOnline": "Pagar en línea",
    "portalLogIn": "Portal del paciente",
    "appointments": "Citas",
    "toggleMenu": "Abrir menú"
  },
  "Footer": {
    "tagline": "Atención pediátrica certificada en 24 clínicas del área de Los Ángeles, con visitas el mismo día, telesalud y un médico con quien su familia puede continuar.",
    "textLabel": "Mensaje de texto",
    "patients": "Pacientes",
    "about": "Nosotros",
    "aboutUs": "Sobre Nosotros",
    "doctors": "Doctores",
    "locations": "Ubicaciones",
    "insurance": "Seguro",
    "resources": "Recursos",
    "testimonials": "Testimonios",
    "network": "Red",
    "foundation": "Fundación",
    "careers": "Empleo",
    "rights": "Todos los derechos reservados."
  },
```

- [ ] **Step 4: Add the Header link**

In `components/Header.tsx`, inside the "More" dropdown `<div>` (the one with `sm:flex sm:hidden`/`sm:flex` classes), add a new `Link` right after the existing `/blog` link:

```tsx
              <Link
                href="/blog"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("blog")}
              </Link>
              <Link
                href="/testimonials"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("testimonials")}
              </Link>
```

- [ ] **Step 5: Add the Footer link**

In `components/Footer.tsx`, inside the "Patients" column `<ul>`, add a new `<li>` right after the existing `/resources` link:

```tsx
              <li>
                <Link href="/resources" className="hover:text-ivory">
                  {t("resources")}
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-ivory">
                  {t("testimonials")}
                </Link>
              </li>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- components/Header.test.tsx components/Footer.test.tsx`
Expected: PASS (all tests in both files)

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: PASS (no regressions in other suites — Header/Footer changes are additive, and no other test asserts an exact link count in either component)

- [ ] **Step 8: Commit**

```bash
git add messages/en.json messages/es.json components/Header.tsx components/Footer.tsx components/Header.test.tsx components/Footer.test.tsx
git commit -m "feat: link testimonials page from header and footer nav"
```

---

## Self-Review Notes

- **Spec coverage:** Route + metadata (Task 1 Step 3), Google Reviews grid over all 24 `data/locations.ts` entries (Task 1 Step 3), no Yelp section (omitted, matches spec's out-of-scope), `googleReviewsUrl` helper (Task 1 Step 3), Header/Footer nav links + `en.json`/`es.json` keys (Task 2), tests for page + nav (Task 1 Step 1, Task 2 Step 1) — all spec sections have a corresponding task.
- **Placeholders:** none — every step has complete, copy-pasteable code.
- **Type consistency:** `googleReviewsUrl(location: Location)` matches the `Location` type's `name`/`address` fields exactly as defined in `lib/types.ts`; `t("testimonials")` key name matches across `en.json`, `es.json`, `Header.tsx`, and `Footer.tsx`.
