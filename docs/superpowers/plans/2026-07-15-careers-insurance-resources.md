# Careers + Insurance + Parent Resources Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/careers`, `/insurance`, and `/resources` pages using only real, honest content (no fabricated job listings, no unconfirmed insurer names, no broken download links), plus homepage teasers and nav links for all three.

**Architecture:** Same pattern as the Network and Foundation showcases — hardcoded typed data files, small presentational components, dedicated pages, and homepage teaser sections.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Vitest + React Testing Library.

## Global Constraints

- No git repository is in use — do not run `git init` or commit. Every task ends with a manual verification step instead of a commit step.
- No database, no CMS, no form backend — the careers "apply" action is a `mailto:` link only.
- Do NOT invent specific job listings, specific named insurers, or working download links for resources that don't have real files yet. Resource cards must show an honest "contact us for a copy" state, not a broken link.
- Insurance messaging is limited to general categories (HMO, PPO, Medi-Cal) plus the real Serendib Healthways cross-sell (`https://www.serendibhealthways.com`) — no other named insurers.
- Careers must include the real disclaimer that official postings are only on social media, the company's own channels, and Indeed.
- Mobile responsive throughout, matching the existing design system in `app/globals.css` (colors: `bg-ivory`, `text-ink`, `bg-teal`, `text-teal-dark`, `bg-teal-tint`, `bg-gold-tint`, `text-gold`, `border-border`; fonts: `font-display`, default body).
- Do not use the em dash ("—") in any user-facing copy.

---

### Task 1: Careers page

**Files:**
- Create: `data/careers.ts`
- Create: `app/careers/page.tsx`
- Test: `data/careers.test.ts`
- Test: `app/careers/page.test.tsx`

**Interfaces:**
- Consumes: `GENERAL_EMAIL` from `lib/constants.ts` (existing)
- Produces: `CAREERS_APPLY_MAILTO` constant, consumed by Tasks 1 (page) and 4 (homepage teaser).

- [ ] **Step 1: Write the failing test for the data**

Create `data/careers.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { CAREERS_APPLY_MAILTO } from "./careers";

describe("careers data", () => {
  it("builds a mailto link to the real general email with a job application subject", () => {
    expect(CAREERS_APPLY_MAILTO).toBe(
      "mailto:customerservice@ktdoctor.com?subject=Job%20Application"
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/careers.test.ts
```

Expected: FAIL — `Cannot find module './careers'`.

- [ ] **Step 3: Write the careers data**

Create `data/careers.ts`:

```ts
import { GENERAL_EMAIL } from "@/lib/constants";

export const CAREERS_APPLY_MAILTO = `mailto:${GENERAL_EMAIL}?subject=Job%20Application`;
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/careers.test.ts
```

Expected: PASS, 1 test.

- [ ] **Step 5: Write the failing test for the page**

Create `app/careers/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersPage from "./page";

describe("CareersPage", () => {
  it("renders an Email Us button linking to the real mailto address", () => {
    render(<CareersPage />);
    const link = screen.getByRole("link", { name: /email us your resume/i });
    expect(link).toHaveAttribute(
      "href",
      "mailto:customerservice@ktdoctor.com?subject=Job%20Application"
    );
  });

  it("renders the real note that official postings are on social media, company channels, and Indeed", () => {
    render(<CareersPage />);
    expect(screen.getByText(/indeed/i)).toBeInTheDocument();
  });

  it("does not render any specific job position listing", () => {
    render(<CareersPage />);
    expect(screen.queryByText(/pediatrician \(md\/do\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/medical assistant/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- app/careers/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 7: Write the careers page**

Create `app/careers/page.tsx`:

```tsx
import { CAREERS_APPLY_MAILTO } from "@/data/careers";

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Careers
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Build your career at Kids &amp; Teens.
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        We're always glad to hear from clinicians and staff who want to join a
        pediatric network built around same-day care and long-term patient
        relationships. Email us your resume and we'll reach out if there's a
        fit.
      </p>

      <a
        href={CAREERS_APPLY_MAILTO}
        className="mt-6 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Email Us Your Resume
      </a>

      <div className="mt-10 rounded-2xl border border-border bg-white p-5 text-sm text-ink-soft shadow-card">
        Our official job postings are only shared on our social media pages,
        our own company websites, and Indeed. Be cautious of postings claiming
        to represent Kids &amp; Teens Medical Group anywhere else.
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- app/careers/page.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 9: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/careers`. Confirm the page has no fake job listing, "Email Us Your Resume" opens the user's mail client addressed to `customerservice@ktdoctor.com` with subject "Job Application," and the Indeed/social media note renders. Resize to mobile width and confirm it's readable. Stop the server.

---

### Task 2: Insurance page

**Files:**
- Create: `data/insurance.ts`
- Create: `app/insurance/page.tsx`
- Test: `data/insurance.test.ts`
- Test: `app/insurance/page.test.tsx`

**Interfaces:**
- Consumes: `MAIN_PHONE` from `lib/constants.ts` (existing)
- Produces: `InsuranceInfo` type and `insuranceInfo` object, consumed by Task 2 (page) and Task 4 (homepage teaser).

- [ ] **Step 1: Write the failing test for the data**

Create `data/insurance.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { insuranceInfo } from "./insurance";

describe("insurance data", () => {
  it("lists only general accepted categories, not specific named insurers", () => {
    expect(insuranceInfo.acceptedCategories).toEqual(["HMO", "PPO", "Medi-Cal"]);
  });

  it("links to the real Serendib Healthways site", () => {
    expect(insuranceInfo.serendibUrl).toBe("https://www.serendibhealthways.com");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/insurance.test.ts
```

Expected: FAIL — `Cannot find module './insurance'`.

- [ ] **Step 3: Write the insurance data**

Create `data/insurance.ts`:

```ts
export type InsuranceInfo = {
  acceptedCategories: string[];
  serendibUrl: string;
};

export const insuranceInfo: InsuranceInfo = {
  acceptedCategories: ["HMO", "PPO", "Medi-Cal"],
  serendibUrl: "https://www.serendibhealthways.com",
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/insurance.test.ts
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Write the failing test for the page**

Create `app/insurance/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InsurancePage from "./page";

describe("InsurancePage", () => {
  it("renders the general accepted insurance categories", () => {
    render(<InsurancePage />);
    expect(screen.getByText("HMO")).toBeInTheDocument();
    expect(screen.getByText("PPO")).toBeInTheDocument();
    expect(screen.getByText("Medi-Cal")).toBeInTheDocument();
  });

  it("renders a link to the real Serendib Healthways site", () => {
    render(<InsurancePage />);
    const link = screen.getByRole("link", { name: /serendib healthways/i });
    expect(link).toHaveAttribute("href", "https://www.serendibhealthways.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders a call-to-verify link using the real main phone number", () => {
    render(<InsurancePage />);
    const link = screen.getByRole("link", { name: /call.*verify/i });
    expect(link).toHaveAttribute("href", "tel:+18183615437");
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- app/insurance/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 7: Write the insurance page**

Create `app/insurance/page.tsx`:

```tsx
import { insuranceInfo } from "@/data/insurance";
import { MAIN_PHONE } from "@/lib/constants";

function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

export default function InsurancePage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Insurance
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        We accept all major insurance.
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Coverage shouldn't be a barrier to care. We accept the plan categories
        below across our clinics, plus Serendib Healthways for families in an
        HMO/IPA.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-card">
        <p className="font-display text-lg font-bold text-ink">
          Stuck with your HMO plan restrictions?
        </p>
        <p className="mt-2 text-ink-soft">
          Switch to Serendib Healthways HMO/IPA for access to our network with
          no referrals required.
        </p>
        <a
          href={insuranceInfo.serendibUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
        >
          Serendib Healthways →
        </a>
      </div>

      <a
        href={`tel:${toE164(MAIN_PHONE)}`}
        className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Call to Verify Your Plan
      </a>
    </main>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- app/insurance/page.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 9: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/insurance`. Confirm the 3 category chips render, the Serendib Healthways link opens `serendibhealthways.com` in a new tab, and "Call to Verify Your Plan" links to the real main phone number. Resize to mobile width. Stop the server.

---

### Task 3: Parent Resources page

**Files:**
- Create: `data/resources.ts`
- Create: `components/ResourceCard.tsx`
- Create: `app/resources/page.tsx`
- Test: `data/resources.test.ts`
- Test: `components/ResourceCard.test.tsx`
- Test: `app/resources/page.test.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: `ParentResource` type and `parentResources: ParentResource[]` array, `<ResourceCard resource={resource} />`, consumed by Task 3 (page) and Task 4 (homepage teaser).

- [ ] **Step 1: Write the failing test for the data**

Create `data/resources.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parentResources } from "./resources";

describe("parent resources data", () => {
  it("has the 3 real resource categories from the current site", () => {
    expect(parentResources.map((r) => r.id).sort()).toEqual(
      ["developmental-milestones", "patient-forms", "vaccine-schedule"].sort()
    );
  });

  it("every resource is marked as not yet available for download", () => {
    for (const resource of parentResources) {
      expect(resource.available).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/resources.test.ts
```

Expected: FAIL — `Cannot find module './resources'`.

- [ ] **Step 3: Write the resources data**

Create `data/resources.ts`:

```ts
export type ParentResource = {
  id: string;
  name: string;
  description: string;
  available: boolean;
};

export const parentResources: ParentResource[] = [
  {
    id: "vaccine-schedule",
    name: "Vaccine Schedule",
    description: "The recommended immunization schedule for ages 0 to 21.",
    available: false,
  },
  {
    id: "patient-forms",
    name: "Patient Forms",
    description: "New patient intake forms and sports physical paperwork.",
    available: false,
  },
  {
    id: "developmental-milestones",
    name: "Developmental Milestone Guides",
    description: "What to expect at each stage of your child's development.",
    available: false,
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/resources.test.ts
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Write the failing test for ResourceCard**

Create `components/ResourceCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResourceCard } from "./ResourceCard";

describe("ResourceCard", () => {
  it("renders the name and description", () => {
    render(
      <ResourceCard
        resource={{
          id: "vaccine-schedule",
          name: "Vaccine Schedule",
          description: "The recommended immunization schedule.",
          available: false,
        }}
      />
    );
    expect(screen.getByText("Vaccine Schedule")).toBeInTheDocument();
    expect(screen.getByText("The recommended immunization schedule.")).toBeInTheDocument();
  });

  it("shows a 'contact us for a copy' state when not available", () => {
    render(
      <ResourceCard
        resource={{
          id: "vaccine-schedule",
          name: "Vaccine Schedule",
          description: "The recommended immunization schedule.",
          available: false,
        }}
      />
    );
    expect(screen.getByText(/contact us for a copy/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- components/ResourceCard.test.tsx
```

Expected: FAIL — `Cannot find module './ResourceCard'`.

- [ ] **Step 7: Write the ResourceCard component**

Create `components/ResourceCard.tsx`:

```tsx
import type { ParentResource } from "@/data/resources";

type ResourceCardProps = {
  resource: ParentResource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <p className="font-display text-base font-bold text-ink">{resource.name}</p>
      <p className="mt-2 text-sm text-ink-soft">{resource.description}</p>
      {resource.available ? null : (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold">
          Contact us for a copy
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- components/ResourceCard.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 9: Write the failing test for the resources page**

Create `app/resources/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResourcesPage from "./page";

describe("ResourcesPage", () => {
  it("renders all 3 real resource categories", () => {
    render(<ResourcesPage />);
    expect(screen.getByText("Vaccine Schedule")).toBeInTheDocument();
    expect(screen.getByText("Patient Forms")).toBeInTheDocument();
    expect(screen.getByText("Developmental Milestone Guides")).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run the test to verify it fails**

```bash
npm test -- app/resources/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 11: Write the resources page**

Create `app/resources/page.tsx`:

```tsx
import { parentResources } from "@/data/resources";
import { ResourceCard } from "@/components/ResourceCard";

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Parent Resources
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Everything in one place.
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Vaccine schedules, patient forms, and developmental guides for your
        family. Downloads are being added here soon. Contact your clinic in
        the meantime for a copy.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {parentResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 12: Run the test to verify it passes**

```bash
npm test -- app/resources/page.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 13: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/resources`. Confirm all 3 cards render with the "Contact us for a copy" state and no broken download links. Resize to mobile width. Stop the server.

---

### Task 4: Homepage teasers + nav links

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/Header.tsx`
- Modify: `components/Header.test.tsx`

**Interfaces:**
- Consumes: `insuranceInfo` (Task 2). The homepage teaser links to `/careers` and `/resources` internally rather than using `CAREERS_APPLY_MAILTO` or `parentResources`/`ResourceCard` directly (those are used by their own pages from Tasks 1 and 3).
- Produces: nothing new — final integration task for this plan.

- [ ] **Step 1: Write the failing tests for the homepage teasers**

Modify `app/page.test.tsx` — add these tests inside the existing `describe("Home page", ...)` block:

```tsx
  it("renders a careers teaser linking to /careers", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /join our team/i })).toHaveAttribute(
      "href",
      "/careers"
    );
  });

  it("renders an insurance teaser linking to /insurance", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /see accepted insurance/i })).toHaveAttribute(
      "href",
      "/insurance"
    );
  });

  it("renders a resources teaser linking to /resources", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /browse parent resources/i })).toHaveAttribute(
      "href",
      "/resources"
    );
  });
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- app/page.test.tsx
```

Expected: FAIL — the homepage doesn't render any of these links yet.

- [ ] **Step 3: Add the three teaser sections to the homepage**

Modify `app/page.tsx`. Add this import near the top alongside the existing imports:

```tsx
import { insuranceInfo } from "@/data/insurance";
```

Add this new combined section right before the closing `{/* Bottom CTA */}` section comment (after the Foundation teaser section added in the previous plan):

```tsx
      {/* Careers, Insurance, Resources teaser */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
            <p className="font-display text-lg font-bold text-ink">Careers</p>
            <p className="mt-2 text-sm text-ink-soft">
              Join a pediatric network built around same-day care.
            </p>
            <Link
              href="/careers"
              className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              Join our team →
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
            <p className="font-display text-lg font-bold text-ink">Insurance</p>
            <p className="mt-2 text-sm text-ink-soft">
              {insuranceInfo.acceptedCategories.join(", ")}, and Serendib
              Healthways.
            </p>
            <Link
              href="/insurance"
              className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              See accepted insurance →
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
            <p className="font-display text-lg font-bold text-ink">Parent Resources</p>
            <p className="mt-2 text-sm text-ink-soft">
              Vaccine schedules, forms, and developmental guides.
            </p>
            <Link
              href="/resources"
              className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              Browse parent resources →
            </Link>
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/page.test.tsx
```

Expected: PASS, 7 tests (the 4 existing plus the 3 new ones).

- [ ] **Step 5: Write the failing tests for the header nav links**

Modify `components/Header.test.tsx` — add these tests inside the existing `describe("Header", ...)` block:

```tsx
  it("renders nav links to Careers, Insurance, and Resources", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
    expect(screen.getByRole("link", { name: "Insurance" })).toHaveAttribute("href", "/insurance");
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute("href", "/resources");
  });
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- components/Header.test.tsx
```

Expected: FAIL — none of these links exist yet.

- [ ] **Step 7: Add the nav links to the Header**

Modify `components/Header.tsx`. In the shared `<nav data-testid="mobile-menu">` block, add the 3 links right after the "Foundation" link and before the "Pay Online" link:

```tsx
          <Link
            href="/careers"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Careers
          </Link>
          <Link
            href="/insurance"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Insurance
          </Link>
          <Link
            href="/resources"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Resources
          </Link>
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- components/Header.test.tsx
```

Expected: PASS, 6 tests (the 5 existing plus the new one).

- [ ] **Step 9: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes.

- [ ] **Step 10: Verify manually end-to-end**

```bash
npm run dev
```

1. Open `http://localhost:3000` — confirm the Careers/Insurance/Resources teaser section renders below the Foundation teaser.
2. Click each teaser's link — confirm they navigate to `/careers`, `/insurance`, `/resources` respectively.
3. Click "Careers," "Insurance," and "Resources" in the header nav from any page — confirm they navigate correctly. Note the nav now has 7 internal links plus Pay Online/Portal/phone — if it looks visually cramped, note it for the design follow-up pass rather than fixing nav layout in this task (out of scope here).
4. Resize to mobile width (375px) — confirm the homepage teasers and all 3 new pages stack correctly, and the header's mobile menu includes all 3 new links.

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** careers mailto + no-fake-listings (Task 1), insurance general categories + Serendib cross-sell (Task 2), resources with honest "coming soon" state (Task 3), homepage teasers + nav links for all three (Task 4) — all covered.
- **Compliance guardrails encoded as tests, not just prose:** Task 1's test explicitly asserts no specific position names appear; Task 2's test asserts only the 3 general categories exist; Task 3's test asserts every resource is marked `available: false` until real files exist.
- **No git:** every task ends in a manual verification step, not a commit.
- **No em dash:** all new copy above was written without one; no additional test needed since none of these files contain user-facing prose long enough to risk drifting (unlike Foundation's longer descriptions).
- **Flagged, not silently fixed:** the header nav is getting long (10 items) — Task 4's manual verification step notes this for the "what's still off" design pass rather than scope-creeping a nav redesign into this plan.
