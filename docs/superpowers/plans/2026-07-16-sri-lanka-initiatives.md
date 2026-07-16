# Sri Lanka Initiatives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real content for two Sri Lanka initiatives to the site: the Kids and Teens Foundation's "Transforming School Wellness in Sri Lanka" campaign (4 Negombo schools, on the `/foundation` page) and St. Joseph Hospital Negombo as a new network brand (on `/network` and the homepage), including a small ACIG partner credit on the hospital's card.

**Architecture:** Two independent data/component/wiring slices sharing the same pattern as the rest of the site: typed data in `data/*.ts`, a small presentational component, then wiring into the page(s) that consume it. Tasks 1-3 build the Foundation slice; Tasks 4-6 build the Network slice. Within each slice, data → component → page wiring, matching this repo's established task shape.

**Tech Stack:** Next.js App Router (React 19), TypeScript, Tailwind CSS v4 (design tokens in `app/globals.css`), Vitest + React Testing Library.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-16-sri-lanka-initiatives-design.md`.
- **No dollar amounts or percentages** anywhere in the new content (donation figures, completion rates) — link to `kidsandteensfoundation.org` instead of hardcoding perishable numbers.
- **No em dashes ("—")** in any text added to `data/foundation.ts` or `data/network.ts` — both files already have tests enforcing this (`data/foundation.test.ts`, `data/network.test.ts`), and the new content must satisfy them too.
- The existing "Medical Missions" program entry in `data/foundation.ts` (id `medical-missions`) stays **completely unchanged** — the new Sri Lanka section is additional, not a replacement.
- The 4 schools render as a **connected timeline** (vertical line + dot markers), not a card grid — this was chosen deliberately to look different from the rest of the site.
- ACIG's credit appears **only** as a small secondary link on St. Joseph Hospital's network card — no dedicated section, page, or card of its own.
- `/foundation` and `/network` have no i18n today (plain English, no `useTranslations`) — new content follows that convention; do not add translation keys.
- `public/sjh-logo.png` already exists (downloaded from the real sjhospital.lk site, 1248×386 PNG) — reference it directly, do not re-download or recreate it.
- This project has no git repository — skip any `git add`/`git commit` steps; verification is via test runs.
- Known gotcha: if a test run reports `Cannot read properties of undefined (reading 'config')` at module load time, that's a stale Vite cache, not a real bug — run `rm -rf node_modules/.vite` and retry.
- This codebase has had unrelated concurrent edits land mid-task before (new homepage sections, new imports). Before editing any file by anchor text, re-read the file and confirm the anchor still appears exactly once — if it doesn't match, STOP and report NEEDS_CONTEXT rather than guessing.

---

### Task 1: Foundation data — Sri Lanka program and schools

**Files:**
- Modify: `data/foundation.ts` (append new exports at the end of the file; do not touch anything above them)
- Modify: `data/foundation.test.ts` (append new test cases; do not touch existing ones)

**Interfaces:**
- Produces: `export type SriLankaSchool = { id: string; name: string; location: string; studentCount: string; programs: string[] }`, `export type SriLankaProgram = { heading: string; mission: string }`, `export const sriLankaProgram: SriLankaProgram`, `export const sriLankaSchools: SriLankaSchool[]` (4 items) — consumed by Task 2 (`SriLankaTimeline` props) and Task 3 (`app/[locale]/foundation/page.tsx`).

- [ ] **Step 1: Write the failing tests**

Read the current `data/foundation.test.ts` first to confirm it still matches (4 existing `it(...)` blocks inside `describe("foundation data", ...)`, ending with the "no program description..." test). Then append this new `describe` block **after** the closing `});` of `describe("foundation data", ...)`, as a sibling in the same file:

```ts
describe("sri lanka program data", () => {
  it("has the 4 real Negombo schools", () => {
    expect(sriLankaSchools.map((s) => s.id).sort()).toEqual(
      [
        "st-peters-college",
        "st-josephs-college",
        "loyola-college",
        "maristella-college",
      ].sort()
    );
  });

  it("every school has a non-empty location, student count, and at least one program", () => {
    for (const school of sriLankaSchools) {
      expect(school.location.length).toBeGreaterThan(0);
      expect(school.studentCount.length).toBeGreaterThan(0);
      expect(school.programs.length).toBeGreaterThan(0);
    }
  });

  it("has a non-empty program heading and mission", () => {
    expect(sriLankaProgram.heading.length).toBeGreaterThan(0);
    expect(sriLankaProgram.mission.length).toBeGreaterThan(0);
  });

  it("no sri lanka text contains a dollar amount, percentage, or em dash", () => {
    const allText = [
      sriLankaProgram.mission,
      ...sriLankaSchools.flatMap((s) => [s.name, s.location, s.studentCount, ...s.programs]),
    ].join(" ");
    expect(allText).not.toMatch(/\$[\d,]+/);
    expect(allText).not.toMatch(/\d+%/);
    expect(allText).not.toContain("—");
  });

  it("the existing medical-missions program is unchanged", () => {
    const missions = foundation.programs.find((p) => p.id === "medical-missions");
    expect(missions?.description).toBe(
      "A planned medical mission to Negombo, Sri Lanka, with partner Saint Joseph Hospital, bringing doctors to communities with limited access to care. Date to be announced."
    );
  });
});
```

Add `sriLankaProgram` and `sriLankaSchools` to the existing `import { foundation } from "./foundation";` line at the top of the file, so it reads:

```ts
import { foundation, sriLankaProgram, sriLankaSchools } from "./foundation";
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run data/foundation.test.ts`
Expected: FAIL — `sriLankaProgram` and `sriLankaSchools` are not exported yet.

- [ ] **Step 3: Write the implementation**

Append this to the end of `data/foundation.ts` (after the closing `};` of the existing `foundation` object — do not modify anything above it):

```ts

export type SriLankaSchool = {
  id: string;
  name: string;
  location: string;
  studentCount: string;
  programs: string[];
};

export type SriLankaProgram = {
  heading: string;
  mission: string;
};

export const sriLankaProgram: SriLankaProgram = {
  heading: "Transforming School Wellness in Sri Lanka",
  mission:
    "Converting and managing wellness centers at leading Negombo schools, bringing world-class pediatric care to students who need it most.",
};

export const sriLankaSchools: SriLankaSchool[] = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    programs: [
      "Vision Screening",
      "Dental Check-ups",
      "Nutrition Programs",
      "Mental Health Counseling",
    ],
  },
  {
    id: "st-josephs-college",
    name: "St. Joseph's College",
    location: "Negombo",
    studentCount: "900+ students",
    programs: [
      "Sports Physicals",
      "Immunization Drives",
      "First Aid Training",
      "Health Education",
    ],
  },
  {
    id: "loyola-college",
    name: "Loyola College",
    location: "Negombo",
    studentCount: "1,100+ students",
    programs: [
      "Telehealth Access",
      "Chronic Disease Mgmt",
      "Hygiene Programs",
      "Parent Workshops",
    ],
  },
  {
    id: "maristella-college",
    name: "Maristella College",
    location: "Negombo",
    studentCount: "800+ students",
    programs: [
      "Speech Therapy",
      "Occupational Therapy",
      "Sensory Programs",
      "Growth Monitoring",
    ],
  },
];
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run data/foundation.test.ts`
Expected: PASS (all tests in the file, both the pre-existing 4 and the new 5).

---

### Task 2: `SriLankaTimeline` component

**Files:**
- Create: `components/SriLankaTimeline.tsx`
- Test: `components/SriLankaTimeline.test.tsx`

**Interfaces:**
- Consumes: `SriLankaSchool` type from `@/data/foundation` (Task 1) — shape `{ id: string; name: string; location: string; studentCount: string; programs: string[] }`.
- Produces: `export function SriLankaTimeline({ schools }: { schools: SriLankaSchool[] })` — consumed by Task 3 in `app/[locale]/foundation/page.tsx` as `<SriLankaTimeline schools={sriLankaSchools} />`.

- [ ] **Step 1: Write the failing test**

Create `components/SriLankaTimeline.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SriLankaTimeline } from "./SriLankaTimeline";
import type { SriLankaSchool } from "@/data/foundation";

const schools: SriLankaSchool[] = [
  {
    id: "school-a",
    name: "School A",
    location: "Negombo",
    studentCount: "500+ students",
    programs: ["Vision Screening", "Dental Check-ups"],
  },
  {
    id: "school-b",
    name: "School B",
    location: "Negombo",
    studentCount: "300+ students",
    programs: ["Telehealth Access"],
  },
];

describe("SriLankaTimeline", () => {
  it("renders every school's name, location, and student count", () => {
    render(<SriLankaTimeline schools={schools} />);
    expect(screen.getByText("School A")).toBeInTheDocument();
    expect(screen.getByText("Negombo · 500+ students")).toBeInTheDocument();
    expect(screen.getByText("School B")).toBeInTheDocument();
    expect(screen.getByText("Negombo · 300+ students")).toBeInTheDocument();
  });

  it("renders every school's program tags", () => {
    render(<SriLankaTimeline schools={schools} />);
    expect(screen.getByText("Vision Screening")).toBeInTheDocument();
    expect(screen.getByText("Dental Check-ups")).toBeInTheDocument();
    expect(screen.getByText("Telehealth Access")).toBeInTheDocument();
  });
});
```

Note: this component has no i18n dependency (matching `/foundation`'s existing plain-English convention), so use the plain `render` from `@testing-library/react` directly — not `renderWithIntl`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/SriLankaTimeline.test.tsx`
Expected: FAIL — `./SriLankaTimeline` module not found.

- [ ] **Step 3: Write the implementation**

Create `components/SriLankaTimeline.tsx`:

```tsx
import type { SriLankaSchool } from "@/data/foundation";

type SriLankaTimelineProps = {
  schools: SriLankaSchool[];
};

export function SriLankaTimeline({ schools }: SriLankaTimelineProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
      <div className="relative pl-6">
        <div
          className="absolute bottom-1 left-1.75 top-1 w-0.5 bg-teal-tint"
          aria-hidden="true"
        />
        <ul className="flex flex-col gap-4">
          {schools.map((school) => (
            <li key={school.id} className="relative">
              <span
                className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-teal-tint bg-teal"
                aria-hidden="true"
              />
              <p className="font-display text-base font-bold text-ink">{school.name}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {school.location} · {school.studentCount}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {school.programs.map((program) => (
                  <span
                    key={program}
                    className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/SriLankaTimeline.test.tsx`
Expected: PASS (2 tests).

---

### Task 3: Wire the Sri Lanka section into the Foundation page

**Files:**
- Modify: `app/[locale]/foundation/page.tsx`
- Modify: `app/[locale]/foundation/page.test.tsx`

**Interfaces:**
- Consumes: `sriLankaProgram`, `sriLankaSchools` from `@/data/foundation` (Task 1); `SriLankaTimeline` from `@/components/SriLankaTimeline` (Task 2); existing `foundation.siteUrl` (already `"https://kidsandteensfoundation.org"`, unchanged).

- [ ] **Step 1: Write the failing test**

Read the current `app/[locale]/foundation/page.test.tsx` first to confirm the anchor still matches. Add this test inside the existing `describe("FoundationPage", ...)` block, after the last existing test (`"has an h1 naming the Foundation itself..."`):

```tsx
  it("renders the Sri Lanka school wellness section with its heading and schools", () => {
    render(<FoundationPage />);
    expect(screen.getByText("Transforming School Wellness in Sri Lanka")).toBeInTheDocument();
    expect(screen.getByText("St. Peter's College")).toBeInTheDocument();
    expect(screen.getByText("Maristella College")).toBeInTheDocument();
  });

  it("renders a link to the live campaign for current donation progress", () => {
    render(<FoundationPage />);
    const campaignLink = screen.getByRole("link", {
      name: /see live campaign progress/i,
    });
    expect(campaignLink).toHaveAttribute("href", "https://kidsandteensfoundation.org");
    expect(campaignLink).toHaveAttribute("target", "_blank");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "app/[locale]/foundation/page.test.tsx"`
Expected: FAIL — the new section doesn't exist yet. All pre-existing tests in the file should still pass.

- [ ] **Step 3: Update the imports**

In `app/[locale]/foundation/page.tsx`, change:

```tsx
import { foundation } from "@/data/foundation";
import { ProgramCard } from "@/components/ProgramCard";
```

to:

```tsx
import { foundation, sriLankaProgram, sriLankaSchools } from "@/data/foundation";
import { ProgramCard } from "@/components/ProgramCard";
import { SriLankaTimeline } from "@/components/SriLankaTimeline";
```

- [ ] **Step 4: Add the new section**

Find this exact closing block at the end of the component (the programs grid, immediately before `</main>`):

```tsx
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {foundation.programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </main>
  );
}
```

Replace with:

```tsx
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {foundation.programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <span className="mt-14 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Sri Lanka Initiative
      </span>
      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {sriLankaProgram.heading}
      </h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{sriLankaProgram.mission}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold text-ink">
            Preventive Health Screenings
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Early detection of health issues through regular screenings for
            vision, hearing, dental, and nutrition, reducing long-term
            healthcare costs.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">Student Mental Wellness</p>
          <p className="mt-1 text-sm text-ink-soft">
            On-campus counseling and mental health support programs that
            improve academic performance, reduce absenteeism, and build
            resilience.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">
            International Healthcare Standards
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Bringing US-trained pediatric expertise and evidence-based
            protocols to Sri Lanka, elevating the quality of school-based
            healthcare.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">Community Health Impact</p>
          <p className="mt-1 text-sm text-ink-soft">
            Wellness centers serve not just students but entire families,
            creating a ripple effect of health literacy and preventive care
            across Negombo.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <SriLankaTimeline schools={sriLankaSchools} />
      </div>

      <a
        href={foundation.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
      >
        See live campaign progress &amp; donate →
      </a>
    </main>
  );
}
```

- [ ] **Step 5: Update the page metadata description**

In `app/[locale]/foundation/page.tsx`, change:

```tsx
export const metadata: Metadata = {
  title: "Kids and Teens Foundation | Kids & Teens Medical Group",
  description:
    "The Kids and Teens Foundation provides free clinic days, medical missions, mentorship, scholarships, and community outreach alongside Kids & Teens Medical Group.",
};
```

to:

```tsx
export const metadata: Metadata = {
  title: "Kids and Teens Foundation | Kids & Teens Medical Group",
  description:
    "The Kids and Teens Foundation provides free clinic days, medical missions, mentorship, scholarships, community outreach, and a school wellness initiative in Negombo, Sri Lanka, alongside Kids & Teens Medical Group.",
};
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run "app/[locale]/foundation/page.test.tsx"`
Expected: PASS (all tests in the file, including the 2 new ones).

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: PASS — all suites green.

---

### Task 4: Network data — St. Joseph Hospital and ACIG partner credit

**Files:**
- Modify: `data/network.ts`
- Modify: `data/network.test.ts`

**Interfaces:**
- Produces: `NetworkBrand` type gains an optional field `partnerCredit?: { label: string; url: string }`; `networkBrands` gains a 4th entry with `id: "st-joseph-hospital"` — consumed by Task 5 (`NetworkCard` rendering) and Task 6 (`app/[locale]/network/page.tsx`, `app/[locale]/page.tsx`).

- [ ] **Step 1: Write the failing tests**

Read the current `data/network.test.ts` first to confirm it still matches (5 existing `it(...)` blocks inside `describe("network brand data", ...)`). Then replace the first test:

```ts
  it("has exactly 3 brands: KTMG, St. Gianna, and LAIPT", () => {
    expect(networkBrands).toHaveLength(3);
    expect(networkBrands.map((b) => b.id).sort()).toEqual(
      ["ktmg", "laipt", "st-gianna"].sort()
    );
  });
```

with:

```ts
  it("has exactly 4 brands: KTMG, St. Gianna, LAIPT, and St. Joseph Hospital", () => {
    expect(networkBrands).toHaveLength(4);
    expect(networkBrands.map((b) => b.id).sort()).toEqual(
      ["ktmg", "laipt", "st-gianna", "st-joseph-hospital"].sort()
    );
  });
```

Then add these two new tests immediately after the existing "LAIPT links externally..." test, and before the "no brand description or tagline contains an em dash" test:

```ts
  it("St. Joseph Hospital links externally to sjhospital.lk with its real logo and an ACIG partner credit", () => {
    const sjh = networkBrands.find((b) => b.id === "st-joseph-hospital");
    expect(sjh?.externalUrl).toBe("https://www.sjhospital.lk");
    expect(sjh?.internalHref).toBeUndefined();
    expect(sjh?.logoSrc).toBe("/sjh-logo.png");
    expect(sjh?.services.length).toBeGreaterThan(0);
    expect(sjh?.partnerCredit).toEqual({
      label: "Insurance coordination via Asiacorp Insurance Brokers",
      url: "https://acig.lk",
    });
  });

  it("only St. Joseph Hospital has a partner credit", () => {
    const withoutSJH = networkBrands.filter((b) => b.id !== "st-joseph-hospital");
    for (const brand of withoutSJH) {
      expect(brand.partnerCredit).toBeUndefined();
    }
  });
```

(The existing "no brand description or tagline contains an em dash" test already iterates over all of `networkBrands`, so it automatically covers the new brand — no change needed there.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run data/network.test.ts`
Expected: FAIL — the brand count is still 3, `st-joseph-hospital` doesn't exist yet.

- [ ] **Step 3: Write the implementation**

In `data/network.ts`, change the `NetworkBrand` type from:

```ts
export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  logoSrc: string;
  externalUrl?: string;
  internalHref?: string;
};
```

to:

```ts
export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  logoSrc: string;
  externalUrl?: string;
  internalHref?: string;
  partnerCredit?: { label: string; url: string };
};
```

Then add this entry to the end of the `networkBrands` array (after the closing `},` of the `laipt` entry, before the array's closing `];`):

```ts
  {
    id: "st-joseph-hospital",
    name: "St. Joseph Hospital Negombo",
    tagline: "US-standard care in Negombo, Sri Lanka.",
    description:
      "A hospital in Negombo, Sri Lanka, managed and operated by Kids & Teens Pediatric Medical Group, USA, bringing American healthcare standards to affordable, accessible care.",
    services: [
      "Emergency & Outpatient Care",
      "Inpatient Care",
      "Telemedicine",
      "Pharmacy & Diagnostics",
    ],
    logoSrc: "/sjh-logo.png",
    externalUrl: "https://www.sjhospital.lk",
    partnerCredit: {
      label: "Insurance coordination via Asiacorp Insurance Brokers",
      url: "https://acig.lk",
    },
  },
```

`public/sjh-logo.png` already exists — do not create or download it.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run data/network.test.ts`
Expected: PASS (7 tests total: the file had 5, you replaced 1 in place and added 2 new ones, so 5 + 2 = 7).

---

### Task 5: `NetworkCard` renders the partner credit

**Files:**
- Modify: `components/NetworkCard.tsx`
- Modify: `components/NetworkCard.test.tsx`

**Interfaces:**
- Consumes: `NetworkBrand.partnerCredit?: { label: string; url: string }` (Task 4).
- No new exports — `NetworkCard`'s existing props (`{ brand: NetworkBrand; compact?: boolean }`) are unchanged.

- [ ] **Step 1: Write the failing test**

Read the current `components/NetworkCard.test.tsx` first. Add this new fixture after the existing `sgmBrand` const:

```tsx
const sjhBrand = {
  id: "st-joseph-hospital",
  name: "St. Joseph Hospital Negombo",
  tagline: "US-standard care in Negombo, Sri Lanka.",
  description: "A hospital in Negombo, Sri Lanka, managed by KTMG USA.",
  services: ["Emergency Care", "Telemedicine"],
  logoSrc: "/sjh-logo.png",
  externalUrl: "https://www.sjhospital.lk",
  partnerCredit: {
    label: "Insurance coordination via Asiacorp Insurance Brokers",
    url: "https://acig.lk",
  },
};
```

Then add these two tests inside the existing `describe("NetworkCard", ...)` block, after the last existing test (`"anchors the CTA link to the bottom of the card..."`):

```tsx
  it("renders a partner credit link when the brand has one", () => {
    render(<NetworkCard brand={sjhBrand} />);
    const creditLink = screen.getByRole("link", {
      name: /insurance coordination via asiacorp insurance brokers/i,
    });
    expect(creditLink).toHaveAttribute("href", "https://acig.lk");
    expect(creditLink).toHaveAttribute("target", "_blank");
    expect(creditLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not render a partner credit link when the brand has none", () => {
    render(<NetworkCard brand={ktmgBrand} />);
    expect(screen.queryByText(/insurance coordination/i)).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/NetworkCard.test.tsx`
Expected: FAIL — no partner credit link is rendered yet.

- [ ] **Step 3: Write the implementation**

In `components/NetworkCard.tsx`, find this exact block:

```tsx
      <div className="mt-auto pt-5">
        {brand.internalHref ? (
          <Link
            href={brand.internalHref}
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            Browse doctors →
          </Link>
        ) : (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            Visit site →
          </a>
        )}
      </div>
```

Replace with:

```tsx
      <div className="mt-auto pt-5">
        {brand.internalHref ? (
          <Link
            href={brand.internalHref}
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            Browse doctors →
          </Link>
        ) : (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            Visit site →
          </a>
        )}

        {brand.partnerCredit && (
          <a
            href={brand.partnerCredit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs text-ink-soft underline-offset-2 hover:text-teal-dark hover:underline"
          >
            {brand.partnerCredit.label}
          </a>
        )}
      </div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/NetworkCard.test.tsx`
Expected: PASS (all tests in the file, including the 2 new ones).

---

### Task 6: Wire St. Joseph Hospital into the network page and homepage

**Files:**
- Modify: `app/[locale]/network/page.tsx`
- Modify: `app/[locale]/network/page.test.tsx`
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/page.test.tsx`

**Interfaces:**
- Consumes: `networkBrands` (now 4 entries, Task 4), `NetworkCard` (now renders `partnerCredit`, Task 5). No new exports produced.

- [ ] **Step 1: Write the failing tests**

Read `app/[locale]/network/page.test.tsx` first to confirm it still matches. Replace its two existing tests:

```tsx
  it("renders all 3 brands with their real names", () => {
    render(<NetworkPage />);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    expect(screen.getByText("LA Intensive Pediatric Therapy")).toBeInTheDocument();
  });

  it("renders external links for the two sub-brands", () => {
    render(<NetworkPage />);
    const externalLinks = screen.getAllByRole("link", { name: /visit site/i });
    expect(externalLinks).toHaveLength(2);
    expect(externalLinks.map((l) => l.getAttribute("href")).sort()).toEqual(
      ["https://www.laipt.org", "https://www.sgmdoctor.com"].sort()
    );
  });
```

with:

```tsx
  it("renders all 4 brands with their real names", () => {
    render(<NetworkPage />);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    expect(screen.getByText("LA Intensive Pediatric Therapy")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph Hospital Negombo")).toBeInTheDocument();
  });

  it("renders external links for the three sub-brands", () => {
    render(<NetworkPage />);
    const externalLinks = screen.getAllByRole("link", { name: /visit site/i });
    expect(externalLinks).toHaveLength(3);
    expect(externalLinks.map((l) => l.getAttribute("href")).sort()).toEqual(
      ["https://www.laipt.org", "https://www.sgmdoctor.com", "https://www.sjhospital.lk"].sort()
    );
  });
```

Read `app/[locale]/page.test.tsx` next to confirm the "renders a network teaser section linking to /network" test still matches. Replace it:

```tsx
  it("renders a network teaser section linking to /network", () => {
    render(<Home />);
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    expect(screen.getByText("LA Intensive Pediatric Therapy")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see the full network/i })).toHaveAttribute(
      "href",
      "/network"
    );
  });
```

with:

```tsx
  it("renders a network teaser section linking to /network", () => {
    render(<Home />);
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    expect(screen.getByText("LA Intensive Pediatric Therapy")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph Hospital Negombo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see the full network/i })).toHaveAttribute(
      "href",
      "/network"
    );
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run "app/[locale]/network/page.test.tsx" "app/[locale]/page.test.tsx"`
Expected: FAIL — St. Joseph Hospital doesn't render on either page yet (still only 3 brands).

- [ ] **Step 3: Update `app/[locale]/network/page.tsx`**

Change:

```tsx
export const metadata: Metadata = {
  title: "Our Network | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group, St. Gianna Medical Group, and LA Intensive Pediatric Therapy: one trusted network covering pediatrics, family practice, and pediatric therapy.",
};
```

to:

```tsx
export const metadata: Metadata = {
  title: "Our Network | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group, St. Gianna Medical Group, LA Intensive Pediatric Therapy, and St. Joseph Hospital Negombo: one trusted network covering pediatrics, family practice, pediatric therapy, and hospital care in Sri Lanka.",
};
```

Change:

```tsx
      <p className="mt-2 max-w-xl text-ink-soft">
        Kids &amp; Teens Medical Group works alongside two sister companies to
        cover family practice and pediatric therapy, all under one trusted
        network.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
```

to:

```tsx
      <p className="mt-2 max-w-xl text-ink-soft">
        Kids &amp; Teens Medical Group works alongside three sister companies
        to cover family practice, pediatric therapy, and hospital care in Sri
        Lanka, all under one trusted network.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
```

- [ ] **Step 4: Update the homepage network teaser grid**

In `app/[locale]/page.tsx`, find the `{/* Network teaser */}` section and change:

```tsx
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {networkBrands.map((brand) => (
            <NetworkCard key={brand.id} brand={brand} compact />
          ))}
        </div>
```

to:

```tsx
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {networkBrands.map((brand) => (
            <NetworkCard key={brand.id} brand={brand} compact />
          ))}
        </div>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run "app/[locale]/network/page.test.tsx" "app/[locale]/page.test.tsx"`
Expected: PASS (all tests in both files).

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: PASS — all suites green.

---

## Plan Self-Review Notes

- **Spec coverage:** Foundation data + no-stats rule (Task 1), timeline component (Task 2), foundation page wiring + live-campaign link (Task 3), network data + partner credit type (Task 4), card rendering (Task 5), network/homepage grid + copy updates (Task 6) — all spec sections have a task. The "Medical Missions card unchanged" requirement has an explicit regression test (Task 1, Step 1's 5th test).
- **No placeholders:** every step has complete, runnable code; all new prose (mission text, impact area descriptions, hospital description/tagline) is final text, not draft language.
- **Type consistency:** `SriLankaSchool` (Task 1) is used identically in `SriLankaTimeline`'s props (Task 2) and the page wiring (Task 3). `NetworkBrand.partnerCredit` (Task 4) is used identically in `NetworkCard` (Task 5) and referenced (but not re-declared) in Task 6.
- **Em dash / stats check:** every new string added to `data/foundation.ts` and `data/network.ts` was checked against the existing "no em dash" tests in those files and contains no `$` or `%` figures, satisfying the Global Constraints.
