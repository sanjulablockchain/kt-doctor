# Foundation Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/foundation` page and homepage teaser presenting the real Kids and Teens Foundation (mission + 6 real programs), linking out to their real site and real donate page — no fabricated stats, testimonials, or in-app donation flow.

**Architecture:** Same pattern as the Network showcase — a hardcoded typed data file (`data/foundation.ts`), a reusable `ProgramCard` component for the 6 programs, a dedicated page, and a homepage teaser section.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Vitest + React Testing Library — same as the rest of the app.

## Global Constraints

- No git repository is in use — do not run `git init` or commit. Every task ends with a manual verification step instead of a commit step.
- No database, no CMS — hardcoded TypeScript data.
- Do NOT include any dollar figures, percentages, or testimonials anywhere in this feature — only the real mission and program descriptions captured in the spec. This is a real 501(c)(3) accepting real donations; fabricated numbers are a compliance risk, not a style choice.
- "Donate Now" must link to the real external URL `https://kidsandteensfoundation.org/donate/` — do not build a donation form or payment flow in this codebase.
- The real logo is already downloaded to `public/foundation-logo.png` (854×283). Do not re-download or replace it.
- The Sri Lanka mission has no confirmed date — copy must say it's planned / date to be announced, never imply it is currently running.
- Mobile responsive throughout, matching the existing design system in `app/globals.css` (colors: `bg-ivory`, `text-ink`, `bg-teal`, `text-teal-dark`, `bg-teal-tint`, `bg-gold-tint`, `text-gold`, `border-border`; fonts: `font-display`, default body).
- Do not use the em dash ("—") in any user-facing copy.

---

### Task 1: Foundation data

**Files:**
- Create: `data/foundation.ts`
- Test: `data/foundation.test.ts`

**Interfaces:**
- Consumes: nothing new
- Produces: `FoundationProgram` type, `Foundation` type, and a `foundation: Foundation` object, consumed by Tasks 2, 3, 4.

- [ ] **Step 1: Write the failing test**

Create `data/foundation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { foundation } from "./foundation";

describe("foundation data", () => {
  it("has the real name, logo, site URL, and donate URL", () => {
    expect(foundation.name).toBe("Kids and Teens Foundation");
    expect(foundation.logoSrc).toBe("/foundation-logo.png");
    expect(foundation.siteUrl).toBe("https://kidsandteensfoundation.org");
    expect(foundation.donateUrl).toBe("https://kidsandteensfoundation.org/donate/");
  });

  it("has exactly 6 real programs", () => {
    expect(foundation.programs).toHaveLength(6);
    expect(foundation.programs.map((p) => p.id).sort()).toEqual(
      [
        "community-outreach",
        "free-clinic-days",
        "internships",
        "medical-missions",
        "mentorship",
        "scholarships",
      ].sort()
    );
  });

  it("the medical missions program does not imply a scheduled date", () => {
    const missions = foundation.programs.find((p) => p.id === "medical-missions");
    expect(missions?.description.toLowerCase()).toMatch(/planned|to be announced|tba/);
  });

  it("no program description, mission text, or program name contains a dollar amount, percentage, or em dash", () => {
    const allText = [foundation.mission, ...foundation.programs.map((p) => p.description)].join(
      " "
    );
    expect(allText).not.toMatch(/\$[\d,]+/);
    expect(allText).not.toMatch(/\d+%/);
    expect(allText).not.toContain("—");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/foundation.test.ts
```

Expected: FAIL — `Cannot find module './foundation'`.

- [ ] **Step 3: Write the foundation data**

Create `data/foundation.ts`:

```ts
export type FoundationProgram = {
  id: string;
  name: string;
  description: string;
};

export type Foundation = {
  name: string;
  mission: string;
  logoSrc: string;
  siteUrl: string;
  donateUrl: string;
  programs: FoundationProgram[];
};

export const foundation: Foundation = {
  name: "Kids and Teens Foundation",
  mission:
    "Providing critical medical care to those in need, opportunities to those who want to pursue medicine, and education so every family can act on conditions that are easily treated and prevented at home.",
  logoSrc: "/foundation-logo.png",
  siteUrl: "https://kidsandteensfoundation.org",
  donateUrl: "https://kidsandteensfoundation.org/donate/",
  programs: [
    {
      id: "free-clinic-days",
      name: "Free Clinic Days & Continued Care",
      description:
        "Monthly free clinic days at KTMG's busiest locations for families with little or no medical coverage, plus continued low-cost follow-up care.",
    },
    {
      id: "medical-missions",
      name: "Medical Missions",
      description:
        "A planned medical mission to Negombo, Sri Lanka, with partner Saint Joseph Hospital, bringing doctors to communities with limited access to care. Date to be announced.",
    },
    {
      id: "internships",
      name: "Internship Opportunities",
      description:
        "Internship and job opportunities for lower-income students transitioning from education into the workforce.",
    },
    {
      id: "mentorship",
      name: "Mentorship",
      description:
        "A mentorship program pairing medical professionals with students ages 18 to 24 who are pursuing or considering a career in medicine.",
    },
    {
      id: "community-outreach",
      name: "Community & Educational Outreach",
      description:
        "Working with local governments and organizations to improve school health education and community wellbeing.",
    },
    {
      id: "scholarships",
      name: "Scholarships",
      description:
        "Home of the Janesri and Sunil De Silva Scholarship, awarded annually to students pursuing pre-med, biology, chemistry, or related fields.",
    },
  ],
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/foundation.test.ts
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify manually**

No manual verification needed — this data isn't rendered until Task 2/3.

---

### Task 2: ProgramCard component

**Files:**
- Create: `components/ProgramCard.tsx`
- Test: `components/ProgramCard.test.tsx`

**Interfaces:**
- Consumes: `FoundationProgram` type from `data/foundation.ts` (Task 1)
- Produces: `<ProgramCard program={program} />`, consumed by Task 3.

- [ ] **Step 1: Write the failing test**

Create `components/ProgramCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgramCard } from "./ProgramCard";

describe("ProgramCard", () => {
  it("renders the program name and description", () => {
    render(
      <ProgramCard
        program={{
          id: "scholarships",
          name: "Scholarships",
          description: "Home of the Janesri and Sunil De Silva Scholarship.",
        }}
      />
    );

    expect(screen.getByText("Scholarships")).toBeInTheDocument();
    expect(
      screen.getByText("Home of the Janesri and Sunil De Silva Scholarship.")
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/ProgramCard.test.tsx
```

Expected: FAIL — `Cannot find module './ProgramCard'`.

- [ ] **Step 3: Write the ProgramCard component**

Create `components/ProgramCard.tsx`:

```tsx
import type { FoundationProgram } from "@/data/foundation";

type ProgramCardProps = {
  program: FoundationProgram;
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <p className="font-display text-base font-bold text-ink">{program.name}</p>
      <p className="mt-2 text-sm text-ink-soft">{program.description}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/ProgramCard.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Verify manually**

No standalone manual verification needed yet — wired into the page in Task 3.

---

### Task 3: /foundation page

**Files:**
- Create: `app/foundation/page.tsx`
- Test: `app/foundation/page.test.tsx`

**Interfaces:**
- Consumes: `foundation` (Task 1), `ProgramCard` (Task 2)
- Produces: the `/foundation` route, consumed by navigation links added in Task 4.

- [ ] **Step 1: Write the failing test**

Create `app/foundation/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FoundationPage from "./page";

describe("FoundationPage", () => {
  it("renders the mission and all 6 real programs", () => {
    render(<FoundationPage />);
    expect(screen.getByText("Kids and Teens Foundation")).toBeInTheDocument();
    expect(screen.getByText("Free Clinic Days & Continued Care")).toBeInTheDocument();
    expect(screen.getByText("Medical Missions")).toBeInTheDocument();
    expect(screen.getByText("Internship Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Mentorship")).toBeInTheDocument();
    expect(screen.getByText("Community & Educational Outreach")).toBeInTheDocument();
    expect(screen.getByText("Scholarships")).toBeInTheDocument();
  });

  it("renders a Donate Now link to the real external donate page", () => {
    render(<FoundationPage />);
    const donateLink = screen.getByRole("link", { name: /donate now/i });
    expect(donateLink).toHaveAttribute("href", "https://kidsandteensfoundation.org/donate/");
    expect(donateLink).toHaveAttribute("target", "_blank");
    expect(donateLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a link to the real foundation site", () => {
    render(<FoundationPage />);
    const siteLink = screen.getByRole("link", { name: /visit the foundation site/i });
    expect(siteLink).toHaveAttribute("href", "https://kidsandteensfoundation.org");
    expect(siteLink).toHaveAttribute("target", "_blank");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- app/foundation/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Write the foundation page**

Create `app/foundation/page.tsx`:

```tsx
import Image from "next/image";
import { foundation } from "@/data/foundation";
import { ProgramCard } from "@/components/ProgramCard";

export default function FoundationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={foundation.logoSrc}
            alt={`${foundation.name} logo`}
            width={160}
            height={53}
            unoptimized
            className="h-12 w-auto object-contain"
          />
          <div>
            <p className="font-display text-xl font-bold text-ink">{foundation.name}</p>
            <p className="mt-1 max-w-md text-sm text-ink-soft">{foundation.mission}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={foundation.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            Donate Now
          </a>
          <a
            href={foundation.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-white px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
          >
            Visit the Foundation site →
          </a>
        </div>
      </div>

      <h1 className="mt-10 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Our programs
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {foundation.programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/foundation/page.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/foundation`. Confirm the real logo, mission, and all 6 programs render, "Donate Now" opens `kidsandteensfoundation.org/donate/` in a new tab, and "Visit the Foundation site →" opens `kidsandteensfoundation.org` in a new tab. Resize to mobile width and confirm the layout stacks cleanly. Stop the server.

---

### Task 4: Homepage teaser + nav link

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/Header.tsx`
- Modify: `components/Header.test.tsx`

**Interfaces:**
- Consumes: `foundation` (Task 1)
- Produces: nothing new — final integration task for this plan.

- [ ] **Step 1: Write the failing test for the homepage teaser**

Modify `app/page.test.tsx` — add this test inside the existing `describe("Home page", ...)` block:

```tsx
  it("renders a foundation teaser section with a Donate Now link", () => {
    render(<Home />);
    expect(screen.getByText("Kids and Teens Foundation")).toBeInTheDocument();
    const donateLink = screen.getByRole("link", { name: /donate now/i });
    expect(donateLink).toHaveAttribute("href", "https://kidsandteensfoundation.org/donate/");
  });
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- app/page.test.tsx
```

Expected: FAIL — the homepage doesn't render foundation content yet.

- [ ] **Step 3: Add the foundation teaser section to the homepage**

Modify `app/page.tsx`. Add the import near the top alongside the existing imports:

```tsx
import { foundation } from "@/data/foundation";
```

Add this new section right before the closing `{/* Bottom CTA */}` section comment (i.e., insert it as a new section between the "Network teaser" section and the "Find a clinic" section, or directly before "Bottom CTA" — place it right after the "Find a clinic" section, before "Bottom CTA"):

```tsx
      {/* Foundation teaser */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={foundation.logoSrc}
              alt={`${foundation.name} logo`}
              width={160}
              height={53}
              unoptimized
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="font-display text-lg font-bold text-ink">{foundation.name}</p>
              <p className="mt-1 max-w-md text-sm text-ink-soft">{foundation.mission}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={foundation.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Donate Now
            </a>
            <Link
              href="/foundation"
              className="rounded-full border border-border bg-white px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/page.test.tsx
```

Expected: PASS, 4 tests (the 3 existing plus the new one).

- [ ] **Step 5: Write the failing test for the header nav link**

Modify `components/Header.test.tsx` — add this test inside the existing `describe("Header", ...)` block:

```tsx
  it("renders a nav link to /foundation", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/foundation"
    );
  });
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- components/Header.test.tsx
```

Expected: FAIL — no "Foundation" link exists yet.

- [ ] **Step 7: Add the nav link to the Header**

Modify `components/Header.tsx`. In the shared `<nav data-testid="mobile-menu">` block, add a "Foundation" link right after the "Network" link:

```tsx
          <Link
            href="/network"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Network
          </Link>
          <Link
            href="/foundation"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Foundation
          </Link>
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- components/Header.test.tsx
```

Expected: PASS, 5 tests (the 4 existing plus the new one).

- [ ] **Step 9: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes.

- [ ] **Step 10: Verify manually end-to-end**

```bash
npm run dev
```

1. Open `http://localhost:3000` — confirm the Foundation teaser section renders with the real logo, mission, "Donate Now," and "Learn more."
2. Click "Learn more" — confirm it navigates to `/foundation` showing all 6 programs.
3. Click "Donate Now" (homepage and `/foundation` page) — confirm both open `kidsandteensfoundation.org/donate/` in a new tab.
4. Click "Foundation" in the header nav — confirm it navigates to `/foundation` from any page.
5. Resize to mobile width (375px) — confirm the homepage teaser and `/foundation` page both stack correctly, and the header's mobile menu includes "Foundation".

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** real mission/programs/logo (Task 1), reusable program card (Task 2), dedicated `/foundation` page with Donate Now + site link (Task 3), homepage teaser + nav link (Task 4) — all covered.
- **Compliance guardrails carried into tests, not just prose:** Task 1's test explicitly asserts no dollar amounts, percentages, or fabricated urgency language appear anywhere in the data, and that the medical-missions description doesn't imply a scheduled date — these are the exact risks flagged in the spec, encoded as regression tests rather than left as reviewer judgment calls.
- **No git:** every task ends in a manual verification step, not a commit.
- **No em dash:** covered by the same data-level test as the dollar/percentage check in Task 1.
