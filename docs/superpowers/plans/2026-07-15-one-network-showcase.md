# One Network Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "One Network" page and homepage teaser presenting KTMG alongside its two sister companies (St. Gianna Medical Group, LA Intensive Pediatric Therapy), using each brand's real logo, services, and external site link.

**Architecture:** Same pattern as Phase 1 — a hardcoded typed data file (`data/network.ts`), a reusable presentational card component, a dedicated page, and a homepage section. No new booking/doctor/location data for the sub-brands; they link out to their own real sites.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Vitest + React Testing Library — same as the rest of the app.

## Global Constraints

- No git repository is in use — do not run `git init` or commit. Every task ends with a manual verification step instead of a commit step.
- No database, no CMS — hardcoded TypeScript data, consistent with `data/doctors.ts` and `data/locations.ts`.
- St. Gianna and LAIPT get NO doctor/location data or booking integration in this codebase — only a logo, description, services list, and an external link.
- Do not use the placeholder `mailto:contact@mysite.com` found on St. Gianna's site anywhere — it's an unconfigured template artifact, not a real contact.
- Real logos are already downloaded to `public/sgm-logo.png` (678×386) and `public/laipt-logo.png` (500×500). Do not re-download or replace them.
- Mobile responsive throughout (Tailwind breakpoints), matching the existing design system in `app/globals.css` (colors: `bg-ivory`, `text-ink`, `bg-teal`, `text-teal-dark`, `bg-teal-tint`, `bg-gold-tint`, `text-gold`, `border-border`; fonts: `font-display`, default body).
- Do not use the em dash ("—") in any user-facing copy — use a period, comma, or colon instead (client's explicit preference; reads as "AI-generated" to them).

---

### Task 1: Network brand data

**Files:**
- Create: `data/network.ts`
- Test: `data/network.test.ts`

**Interfaces:**
- Consumes: nothing new (plain data file)
- Produces: `NetworkBrand` type and `networkBrands: NetworkBrand[]` array (3 entries), consumed by Tasks 2, 3, 4.

- [ ] **Step 1: Write the failing test**

Create `data/network.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { networkBrands } from "./network";

describe("network brand data", () => {
  it("has exactly 3 brands: KTMG, St. Gianna, and LAIPT", () => {
    expect(networkBrands).toHaveLength(3);
    expect(networkBrands.map((b) => b.id).sort()).toEqual(
      ["ktmg", "laipt", "st-gianna"].sort()
    );
  });

  it("KTMG links internally to /doctors and has no external URL", () => {
    const ktmg = networkBrands.find((b) => b.id === "ktmg");
    expect(ktmg?.internalHref).toBe("/doctors");
    expect(ktmg?.externalUrl).toBeUndefined();
    expect(ktmg?.logoSrc).toBe("/clinic-logo.svg");
  });

  it("St. Gianna links externally to sgmdoctor.com with its real logo", () => {
    const sgm = networkBrands.find((b) => b.id === "st-gianna");
    expect(sgm?.externalUrl).toBe("https://www.sgmdoctor.com");
    expect(sgm?.internalHref).toBeUndefined();
    expect(sgm?.logoSrc).toBe("/sgm-logo.png");
    expect(sgm?.services.length).toBeGreaterThan(0);
  });

  it("LAIPT links externally to laipt.org with its real logo", () => {
    const laipt = networkBrands.find((b) => b.id === "laipt");
    expect(laipt?.externalUrl).toBe("https://www.laipt.org");
    expect(laipt?.internalHref).toBeUndefined();
    expect(laipt?.logoSrc).toBe("/laipt-logo.png");
    expect(laipt?.services.length).toBeGreaterThan(0);
  });

  it("no brand description or tagline contains an em dash", () => {
    for (const brand of networkBrands) {
      expect(brand.tagline).not.toContain("—");
      expect(brand.description).not.toContain("—");
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/network.test.ts
```

Expected: FAIL — `Cannot find module './network'`.

- [ ] **Step 3: Write the network data**

Create `data/network.ts`:

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

export const networkBrands: NetworkBrand[] = [
  {
    id: "ktmg",
    name: "Kids & Teens Medical Group",
    tagline: "The flagship pediatric network.",
    description:
      "Board-certified pediatric care across 24 clinics in Greater LA, for ages 0 to 21.",
    services: ["Primary Care", "Urgent Care", "Telehealth", "Newborn Care"],
    logoSrc: "/clinic-logo.svg",
    internalHref: "/doctors",
  },
  {
    id: "st-gianna",
    name: "St. Gianna Medical Group",
    tagline: "Family practice for all ages.",
    description:
      "Comprehensive healthcare for adults and children, with same-day appointments and 24/7 booking. Partners with KTMG to extend care beyond pediatrics.",
    services: [
      "Same-Day Appointments",
      "24/7 Booking",
      "Telehealth",
      "Advanced Wound Care",
    ],
    logoSrc: "/sgm-logo.png",
    externalUrl: "https://www.sgmdoctor.com",
  },
  {
    id: "laipt",
    name: "LA Intensive Pediatric Therapy",
    tagline: "Expert pediatric therapy since 2010.",
    description:
      "Individual and center-based speech, occupational, and developmental therapy for children.",
    services: ["Speech Therapy", "Occupational Therapy", "Sensory Integration"],
    logoSrc: "/laipt-logo.png",
    externalUrl: "https://www.laipt.org",
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/network.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Verify manually**

No manual verification needed — this data isn't rendered until Task 2/3.

---

### Task 2: NetworkCard component

**Files:**
- Create: `components/NetworkCard.tsx`
- Test: `components/NetworkCard.test.tsx`

**Interfaces:**
- Consumes: `NetworkBrand` type from `data/network.ts` (Task 1)
- Produces: `<NetworkCard brand={brand} compact={boolean} />`, consumed by Tasks 3 and 4. `compact` (default `false`) hides the services list and tagline for the homepage teaser use case.

- [ ] **Step 1: Write the failing test**

Create `components/NetworkCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NetworkCard } from "./NetworkCard";

const ktmgBrand = {
  id: "ktmg",
  name: "Kids & Teens Medical Group",
  tagline: "The flagship pediatric network.",
  description: "Board-certified pediatric care across 24 clinics.",
  services: ["Primary Care", "Urgent Care"],
  logoSrc: "/clinic-logo.svg",
  internalHref: "/doctors",
};

const sgmBrand = {
  id: "st-gianna",
  name: "St. Gianna Medical Group",
  tagline: "Family practice for all ages.",
  description: "Comprehensive healthcare for adults and children.",
  services: ["Same-Day Appointments", "24/7 Booking"],
  logoSrc: "/sgm-logo.png",
  externalUrl: "https://www.sgmdoctor.com",
};

describe("NetworkCard", () => {
  it("renders an internal link for a brand with internalHref", () => {
    render(<NetworkCard brand={ktmgBrand} />);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /browse doctors/i });
    expect(link).toHaveAttribute("href", "/doctors");
  });

  it("renders an external link for a brand with externalUrl, opening in a new tab", () => {
    render(<NetworkCard brand={sgmBrand} />);
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /visit site/i });
    expect(link).toHaveAttribute("href", "https://www.sgmdoctor.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the full services list by default", () => {
    render(<NetworkCard brand={sgmBrand} />);
    expect(screen.getByText("Same-Day Appointments")).toBeInTheDocument();
    expect(screen.getByText("24/7 Booking")).toBeInTheDocument();
  });

  it("hides the services list and tagline in compact mode", () => {
    render(<NetworkCard brand={sgmBrand} compact />);
    expect(screen.queryByText("Same-Day Appointments")).not.toBeInTheDocument();
    expect(screen.queryByText("Family practice for all ages.")).not.toBeInTheDocument();
    expect(screen.getByText("Comprehensive healthcare for adults and children.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/NetworkCard.test.tsx
```

Expected: FAIL — `Cannot find module './NetworkCard'`.

- [ ] **Step 3: Write the NetworkCard component**

Create `components/NetworkCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { NetworkBrand } from "@/data/network";

type NetworkCardProps = {
  brand: NetworkBrand;
  compact?: boolean;
};

export function NetworkCard({ brand, compact = false }: NetworkCardProps) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <div className="flex h-14 items-center">
        <Image
          src={brand.logoSrc}
          alt={`${brand.name} logo`}
          width={140}
          height={44}
          unoptimized
          className="h-full w-auto object-contain"
        />
      </div>

      <p className="mt-4 font-display text-lg font-bold text-ink">{brand.name}</p>

      {!compact && (
        <p className="mt-1 text-sm font-semibold text-teal-dark">{brand.tagline}</p>
      )}

      <p className="mt-2 text-sm text-ink-soft">{brand.description}</p>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {brand.services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-teal-tint px-3 py-1 text-xs font-semibold text-teal-dark"
            >
              {service}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5">
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
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/NetworkCard.test.tsx
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify manually**

No standalone manual verification needed yet — wired into pages in Tasks 3 and 4.

---

### Task 3: /network page

**Files:**
- Create: `app/network/page.tsx`
- Test: `app/network/page.test.tsx`

**Interfaces:**
- Consumes: `networkBrands` (Task 1), `NetworkCard` (Task 2)
- Produces: the `/network` route, consumed only by navigation links added in Task 4.

- [ ] **Step 1: Write the failing test**

Create `app/network/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NetworkPage from "./page";

describe("NetworkPage", () => {
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
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- app/network/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Write the network page**

Create `app/network/page.tsx`:

```tsx
import { networkBrands } from "@/data/network";
import { NetworkCard } from "@/components/NetworkCard";

export default function NetworkPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        One Network
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        More ways to care for your family.
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Kids &amp; Teens Medical Group works alongside two sister companies to
        cover family practice and pediatric therapy, all under one trusted
        network.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {networkBrands.map((brand) => (
          <NetworkCard key={brand.id} brand={brand} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/network/page.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/network`. Confirm all 3 cards render with real logos, the KTMG card's "Browse doctors →" goes to `/doctors`, and the other two cards' "Visit site →" links open `sgmdoctor.com`/`laipt.org` in new tabs. Resize to mobile width and confirm cards stack in a single column. Stop the server.

---

### Task 4: Homepage network teaser + nav link

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/Header.tsx`
- Modify: `components/Header.test.tsx`

**Interfaces:**
- Consumes: `networkBrands` (Task 1), `NetworkCard` (Task 2)
- Produces: nothing new — this is the final integration task for this plan.

- [ ] **Step 1: Write the failing test for the homepage teaser**

Modify `app/page.test.tsx` — add a new test to the existing `describe("Home page", ...)` block (keep the existing test as-is):

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

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- app/page.test.tsx
```

Expected: FAIL — the new assertions find nothing, since `app/page.tsx` doesn't render brand names yet.

- [ ] **Step 3: Add the network teaser section to the homepage**

Modify `app/page.tsx`. Add the import near the top alongside the existing imports:

```tsx
import { networkBrands } from "@/data/network";
import { NetworkCard } from "@/components/NetworkCard";
```

Add this new section right before the closing `{/* Find a clinic */}` section comment (i.e., insert it as a new section between the "Doctors preview" section and the "Find a clinic" section):

```tsx
      {/* Network teaser */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              One Network
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              More ways to care for your family.
            </h2>
          </div>
          <Link
            href="/network"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            See the full network →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {networkBrands.map((brand) => (
            <NetworkCard key={brand.id} brand={brand} compact />
          ))}
        </div>
      </section>
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/page.test.tsx
```

Expected: PASS, 3 tests (the 2 existing plus the new one).

- [ ] **Step 5: Write the failing test for the header nav link**

Modify `components/Header.test.tsx` — add this test to the existing `describe("Header", ...)` block:

```tsx
  it("renders a nav link to /network", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute("href", "/network");
  });
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- components/Header.test.tsx
```

Expected: FAIL — no "Network" link exists yet.

- [ ] **Step 7: Add the nav link to the Header**

Modify `components/Header.tsx`. In the shared `<nav data-testid="mobile-menu">` block, add a "Network" link right after the "Locations" link:

```tsx
          <Link
            href="/locations"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Locations
          </Link>
          <Link
            href="/network"
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            Network
          </Link>
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- components/Header.test.tsx
```

Expected: PASS, 4 tests (the 3 existing plus the new one).

- [ ] **Step 9: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes (Phase 1 tests plus this plan's new tests).

- [ ] **Step 10: Verify manually end-to-end**

```bash
npm run dev
```

1. Open `http://localhost:3000` — confirm the "One Network" teaser section renders below the doctors preview, with 3 compact cards (no services list/tagline) and a "See the full network →" link.
2. Click "See the full network →" — confirm it navigates to `/network` and shows the full cards with services lists.
3. Click "Network" in the header nav — confirm it also navigates to `/network` from any page.
4. Click each sub-brand's "Visit site →" — confirm `sgmdoctor.com` and `laipt.org` open in new tabs.
5. Resize to mobile width (375px) — confirm the homepage teaser and `/network` page both stack correctly, and the header's mobile menu includes the new "Network" link.

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** Real logos/data (Task 1), reusable card component with compact/full variants (Task 2), dedicated `/network` page (Task 3), homepage teaser + nav link (Task 4) — all covered. No doctor/location data added for the sub-brands, matching the spec's explicit scope boundary.
- **Known gaps carried forward from the spec:** the placeholder `contact@mysite.com` email is explicitly excluded from the data (Task 1) rather than silently included.
- **No git:** every task ends in a manual verification step, not a commit, per the Global Constraints.
- **No em dash:** verified via an explicit data-level test in Task 1 covering the one place copy is most likely to drift back toward it.
