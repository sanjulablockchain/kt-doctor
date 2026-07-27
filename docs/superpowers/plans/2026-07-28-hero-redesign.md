# Homepage Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's light, two-column hero with a full-bleed dark photo hero (badge, headline, 3 CTAs, stat bar, social row) that has an embedded "One Network" quick-action panel overlapping its bottom, per the approved design spec.

**Architecture:** Extract the current inline hero JSX out of `components/HomePageContent.tsx` into a new self-contained `components/Hero.tsx`, which renders a new `components/HeroNetworkPanel.tsx` for the bottom panel. Both reuse existing data (`data/locations.ts`, `data/doctors.ts`, `data/network.ts`, `data/services.ts`), existing components (`ParallaxImage`, `AnimatedCounter`), and the existing "fixed navy surface" theming trick (`data-on-navy` + `bg-navy`/`text-ivory`/`text-teal-tint`) already used by `Footer.tsx`. Social icon data/markup is also extracted into a shared `data/social.ts` + `components/SocialLinks.tsx` so `Footer.tsx` and the new `Hero.tsx` render identical icons instead of duplicating them.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`), next-intl (bilingual en/es), Vitest + Testing Library.

**Reference:** Full design rationale in `docs/superpowers/specs/2026-07-28-hero-redesign-design.md`.

## Global Constraints

- Bilingual site: any new user-facing text must be added to both `messages/en.json` and `messages/es.json`, with identical key structure in both files.
- Every UI change must be fully responsive (mobile/tablet/desktop) and must not break in either light or dark site theme.
- Never use the em dash (—) in generated copy, UI text, or code.
- Do not modify values in `lib/constants.ts` (only import/consume `BOOKING_URL` as-is).
- New components get a colocated `.test.tsx` (Vitest + Testing Library); new data modules get a colocated `.test.ts`.
- Images need meaningful `alt` text; icon-only interactive elements need `aria-label`s; purely decorative icons get `aria-hidden`.
- Do not run Playwright/manual browser verification — the user checks visual results manually. Verify via code review, `npm run lint`, `npx tsc --noEmit`, and `npm run test`.

---

### Task 1: Extract social link data to `data/social.ts`

**Files:**
- Create: `data/social.ts`
- Create: `data/social.test.ts`

**Interfaces:**
- Consumes: nothing (this is the root data source).
- Produces: `export type SocialLink = { label: string; href: string; path: string }` and `export const socialLinks: SocialLink[]` (4 entries: Facebook, Instagram, X, YouTube) — consumed by Task 2's `SocialLinks` component.

- [ ] **Step 1: Write the failing test**

Create `data/social.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { socialLinks } from "./social";

describe("social link data", () => {
  it("has exactly 4 links: Facebook, Instagram, X, YouTube", () => {
    expect(socialLinks).toHaveLength(4);
    expect(socialLinks.map((s) => s.label)).toEqual(["Facebook", "Instagram", "X", "YouTube"]);
  });

  it("every link has a real https href and a non-empty svg path", () => {
    for (const social of socialLinks) {
      expect(social.href).toMatch(/^https:\/\//);
      expect(social.path.length).toBeGreaterThan(0);
    }
  });

  it("Facebook links to the confirmed page", () => {
    const facebook = socialLinks.find((s) => s.label === "Facebook");
    expect(facebook?.href).toBe("https://www.facebook.com/pediatriciansincalifornia/");
  });

  it("X links to the confirmed handle", () => {
    const x = socialLinks.find((s) => s.label === "X");
    expect(x?.href).toBe("https://x.com/KTDoctorGroup");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run data/social.test.ts`
Expected: FAIL with "Cannot find module './social'" (file doesn't exist yet).

- [ ] **Step 3: Create `data/social.ts`** (moving the array verbatim from `components/Footer.tsx:21-42`, unchanged values)

```ts
export type SocialLink = {
  label: string;
  href: string;
  path: string;
};

// Official channels — confirmed with the client. Icons are single-path brand
// glyphs on a 24×24 grid, filled with currentColor so the chip controls color.
export const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/pediatriciansincalifornia/",
    path: "M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/napediatricurgentcare/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "X",
    href: "https://x.com/KTDoctorGroup",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCpc-umQeo6CQFLHq4bTWeUQ",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run data/social.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add data/social.ts data/social.test.ts
git commit -m "feat: add shared social link data source"
```

---

### Task 2: Extract shared `SocialLinks` component and wire it into `Footer.tsx`

**Files:**
- Create: `components/SocialLinks.tsx`
- Create: `components/SocialLinks.test.tsx`
- Modify: `components/Footer.tsx:19-42` (delete inline `SOCIAL_LINKS`), `components/Footer.tsx:112-131` (use `<SocialLinks />`)

**Interfaces:**
- Consumes: `socialLinks` from `@/data/social` (Task 1).
- Produces: `export function SocialLinks()` (no props) — a `<ul>` of icon-button links, rendered by `Footer.tsx` now and by `Hero.tsx` in Task 5.

- [ ] **Step 1: Write the failing test**

Create `components/SocialLinks.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { SocialLinks } from "./SocialLinks";

describe("SocialLinks", () => {
  it("renders all 4 social links with correct hrefs and labels", () => {
    render(<SocialLinks />);
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/pediatriciansincalifornia/"
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/napediatricurgentcare/"
    );
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/KTDoctorGroup"
    );
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UCpc-umQeo6CQFLHq4bTWeUQ"
    );
  });

  it("opens every link in a new tab safely", () => {
    render(<SocialLinks />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/SocialLinks.test.tsx`
Expected: FAIL with "Cannot find module './SocialLinks'"

- [ ] **Step 3: Create `components/SocialLinks.tsx`**

```tsx
import { socialLinks } from "@/data/social";

export function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {socialLinks.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-ivory/75 transition-colors hover:border-teal hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
              <path d={social.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/SocialLinks.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Wire `SocialLinks` into `Footer.tsx`**

In `components/Footer.tsx`, add the import right after the existing `Link` import:

```tsx
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/SocialLinks";
```

Delete the entire comment + `SOCIAL_LINKS` array block (currently lines 19-42):

```tsx
// Official channels — confirmed with the client. Icons are single-path brand
// glyphs on a 24×24 grid, filled with currentColor so the chip controls color.
const SOCIAL_LINKS = [
  // ...4 entries...
];
```

Replace the `<ul>` block that maps over `SOCIAL_LINKS` (currently lines 114-130):

```tsx
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-ivory/75 transition-colors hover:border-teal hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                        <path d={social.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
```

with:

```tsx
              <div className="mt-3">
                <SocialLinks />
              </div>
```

- [ ] **Step 6: Run the existing Footer test suite to confirm no regression**

Run: `npx vitest run components/Footer.test.tsx`
Expected: PASS (all existing tests, unchanged — same roles/names/hrefs/attributes are still rendered, just via the shared component)

- [ ] **Step 7: Commit**

```bash
git add components/SocialLinks.tsx components/SocialLinks.test.tsx components/Footer.tsx
git commit -m "refactor: extract shared SocialLinks component out of Footer"
```

---

### Task 3: Add the new `Hero` i18n namespace (en + es)

**Files:**
- Modify: `messages/en.json` (insert new `"Hero"` object between the `"Home"` and `"Doctors"` blocks)
- Modify: `messages/es.json` (same insertion point)

**Interfaces:**
- Consumes: nothing.
- Produces: a new `Hero` namespace with 16 keys, consumed via `useTranslations("Hero")` in Task 4 (`HeroNetworkPanel.tsx`) and Task 5 (`Hero.tsx`).

- [ ] **Step 1: Insert the new `Hero` namespace into `messages/en.json`**

Find this exact text (the end of the `"Home"` block, right before `"Doctors"`):

```json
    "browseAllResourcesTitle": "Browse all resources",
    "browseAllResourcesBody": "See every guide, form, and video we have for your family in one place.",
    "viewAllResources": "View all resources"
  },
  "Doctors": {
```

Replace it with:

```json
    "browseAllResourcesTitle": "Browse all resources",
    "browseAllResourcesBody": "See every guide, form, and video we have for your family in one place.",
    "viewAllResources": "View all resources"
  },
  "Hero": {
    "followUs": "Follow us",
    "youtubeLine": "Health tips weekly on YouTube",
    "exploreNetwork": "Explore the network",
    "bookAppointmentTile": "Book Appointment",
    "bookAppointmentBody": "Online in under a minute, or call us.",
    "bookAppointmentTag": "Today",
    "supportingNetworkTile": "Supporting Network",
    "supportingNetworkBody": "{count} partner organizations across the network.",
    "servicesTile": "Services",
    "servicesBody": "Well-child, urgent, vaccines, and more.",
    "telehealthTile": "Telehealth",
    "telehealthBody": "Secure video visits from home.",
    "telehealthTag": "7 days",
    "locationsTile": "Locations",
    "locationsBody": "Addresses, hours, and a live map.",
    "sriLankaTag": "Negombo"
  },
  "Doctors": {
```

- [ ] **Step 2: Insert the matching `Hero` namespace into `messages/es.json`**

Find this exact text (the end of the `"Home"` block, right before `"Doctors"`):

```json
    "browseAllResourcesTitle": "Ver todos los recursos",
    "browseAllResourcesBody": "Vea todas las guías, formularios y videos que tenemos para su familia en un solo lugar.",
    "viewAllResources": "Ver todos los recursos"
  },
  "Doctors": {
```

Replace it with:

```json
    "browseAllResourcesTitle": "Ver todos los recursos",
    "browseAllResourcesBody": "Vea todas las guías, formularios y videos que tenemos para su familia en un solo lugar.",
    "viewAllResources": "Ver todos los recursos"
  },
  "Hero": {
    "followUs": "Síganos",
    "youtubeLine": "Consejos de salud cada semana en YouTube",
    "exploreNetwork": "Explorar la red",
    "bookAppointmentTile": "Reservar una cita",
    "bookAppointmentBody": "En línea en menos de un minuto, o llámenos.",
    "bookAppointmentTag": "Hoy",
    "supportingNetworkTile": "Red de Apoyo",
    "supportingNetworkBody": "{count} organizaciones asociadas en toda la red.",
    "servicesTile": "Servicios",
    "servicesBody": "Niño sano, urgencias, vacunas y más.",
    "telehealthTile": "Telesalud",
    "telehealthBody": "Consultas seguras por video desde casa.",
    "telehealthTag": "7 días",
    "locationsTile": "Ubicaciones",
    "locationsBody": "Direcciones, horarios y un mapa en vivo.",
    "sriLankaTag": "Negombo"
  },
  "Doctors": {
```

- [ ] **Step 3: Verify both files are still valid JSON and nothing else broke**

Run: `npm run test`
Expected: PASS (full existing suite — this confirms both JSON files still parse correctly; nothing consumes the new keys yet)

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/es.json
git commit -m "feat: add Hero i18n namespace for the redesigned homepage hero"
```

---

### Task 4: Build `HeroNetworkPanel.tsx`

**Files:**
- Create: `components/HeroNetworkPanel.tsx`
- Create: `components/HeroNetworkPanel.test.tsx`

**Interfaces:**
- Consumes: `Home.networkEyebrow` / `Home.networkHeading` (existing), `Hero.*` namespace (Task 3), `networkBrands` from `@/data/network`, `serviceCategories` from `@/data/services`, `locations` from `@/data/locations`, `BOOKING_URL` from `@/lib/constants`, `Link` from `@/i18n/navigation`.
- Produces: `export function HeroNetworkPanel()` (no props) — consumed by `Hero.tsx` in Task 5.

- [ ] **Step 1: Write the failing test**

Create `components/HeroNetworkPanel.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { HeroNetworkPanel } from "./HeroNetworkPanel";
import { networkBrands } from "@/data/network";
import { serviceCategories } from "@/data/services";
import { locations } from "@/data/locations";

describe("HeroNetworkPanel", () => {
  it("renders the eyebrow, heading, and explore-network CTA", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByText("One Network")).toBeInTheDocument();
    expect(screen.getByText("More ways to care for your family.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore the network/i })).toHaveAttribute(
      "href",
      "/network"
    );
  });

  it("renders all 6 tiles with correct links", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByRole("link", { name: /book appointment/i })).toHaveAttribute(
      "href",
      expect.stringContaining("healow.com")
    );
    expect(screen.getByRole("link", { name: /supporting network/i })).toHaveAttribute(
      "href",
      "/network"
    );
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /telehealth/i })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("shows the real partner count on the Supporting Network tile", () => {
    render(<HeroNetworkPanel />);
    const expectedCount = networkBrands.length - 1;
    expect(
      screen.getByText(`${expectedCount} partner organizations across the network.`)
    ).toBeInTheDocument();
  });

  it("shows the real service count as the Services tile's tag", () => {
    render(<HeroNetworkPanel />);
    const expectedCount = serviceCategories.flatMap((c) => c.services).length;
    expect(screen.getByText(String(expectedCount))).toBeInTheDocument();
  });

  it("shows the real location count as the Locations tile's tag", () => {
    render(<HeroNetworkPanel />);
    expect(screen.getByText(String(locations.length))).toBeInTheDocument();
  });

  it("renders the Sri Lanka tile from real network data", () => {
    render(<HeroNetworkPanel />);
    const sriLanka = networkBrands.find((b) => b.id === "st-joseph-hospital");
    expect(sriLanka).toBeDefined();
    const link = screen.getByRole("link", { name: /negombo/i });
    expect(link).toHaveAttribute("href", sriLanka?.externalUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/HeroNetworkPanel.test.tsx`
Expected: FAIL with "Cannot find module './HeroNetworkPanel'"

- [ ] **Step 3: Create `components/HeroNetworkPanel.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { networkBrands } from "@/data/network";
import { serviceCategories } from "@/data/services";
import { locations } from "@/data/locations";

type HeroTileProps = {
  icon: ReactNode; // inner <path>/<rect>/<circle> of a 24x24 stroke icon
  tag?: string;
  title: string;
  body: string;
  href: string;
  external?: boolean;
};

const tileClass =
  "flex flex-col rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

function HeroTile({ icon, tag, title, body, href, external = false }: HeroTileProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/12 text-teal-tint">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-4.5 w-4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </span>
        {tag && (
          <span className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-ivory/70">
            {tag}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-sm font-bold text-ivory">{title}</p>
      <p className="mt-1 text-xs leading-snug text-ivory/65">{body}</p>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={tileClass}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={tileClass}>
      {content}
    </Link>
  );
}

export function HeroNetworkPanel() {
  const tHome = useTranslations("Home");
  const t = useTranslations("Hero");
  const locale = useLocale();

  const partnerCount = networkBrands.length - 1;
  const serviceCount = serviceCategories.flatMap((category) => category.services).length;
  const sriLanka = networkBrands.find((brand) => brand.id === "st-joseph-hospital");

  return (
    <div className="relative mx-5 mt-6 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:mx-8 sm:p-6 lg:absolute lg:inset-x-6 lg:bottom-6 lg:mx-0 lg:mt-0 xl:inset-x-10 xl:bottom-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-teal-tint">
            {tHome("networkEyebrow")}
          </p>
          <p className="mt-1 font-display text-lg font-bold text-ivory sm:text-xl">
            {tHome("networkHeading")}
          </p>
        </div>
        <Link
          href="/network"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-display text-sm font-semibold text-ivory transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          {t("exploreNetwork")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <HeroTile
          href={BOOKING_URL}
          external
          tag={t("bookAppointmentTag")}
          title={t("bookAppointmentTile")}
          body={t("bookAppointmentBody")}
          icon={
            <>
              <rect x="3" y="4.5" width="18" height="16" rx="2" />
              <path d="M16 2.5v4M8 2.5v4M3 10h18" />
            </>
          }
        />
        <HeroTile
          href="/network"
          tag={String(partnerCount)}
          title={t("supportingNetworkTile")}
          body={t("supportingNetworkBody", { count: partnerCount })}
          icon={
            <>
              <circle cx="12" cy="12" r="3" />
              <circle cx="5" cy="6" r="2.2" />
              <circle cx="19" cy="6" r="2.2" />
              <circle cx="5" cy="18" r="2.2" />
              <circle cx="19" cy="18" r="2.2" />
              <path d="M6.6 7.4 10 10.4M17.4 7.4 14 10.4M6.6 16.6 10 13.6M17.4 16.6 14 13.6" />
            </>
          }
        />
        <HeroTile
          href="/services"
          tag={String(serviceCount)}
          title={t("servicesTile")}
          body={t("servicesBody")}
          icon={
            <path d="m9 12 2 2 4-4M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10Z" />
          }
        />
        <HeroTile
          href="/services/telehealth"
          tag={t("telehealthTag")}
          title={t("telehealthTile")}
          body={t("telehealthBody")}
          icon={
            <>
              <rect x="2.5" y="5" width="14" height="12" rx="2.5" />
              <path d="M16.5 10.5 21.5 7.5v9l-5-3z" />
            </>
          }
        />
        <HeroTile
          href="/locations"
          tag={String(locations.length)}
          title={t("locationsTile")}
          body={t("locationsBody")}
          icon={
            <>
              <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.25" />
            </>
          }
        />
        {sriLanka && (
          <HeroTile
            href={sriLanka.externalUrl ?? "/network"}
            external={Boolean(sriLanka.externalUrl)}
            tag={t("sriLankaTag")}
            title={sriLanka.name}
            body={locale === "es" ? sriLanka.descriptionEs : sriLanka.description}
            icon={
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.6 2.4 2.6 15.2 0 18M12 3c-2.6 2.4-2.6 15.2 0 18" />
              </>
            }
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/HeroNetworkPanel.test.tsx`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add components/HeroNetworkPanel.tsx components/HeroNetworkPanel.test.tsx
git commit -m "feat: add HeroNetworkPanel with 6 quick-action tiles"
```

---

### Task 5: Build `Hero.tsx` and wire it into `HomePageContent.tsx`

**Files:**
- Create: `components/Hero.tsx`
- Create: `components/Hero.test.tsx`
- Modify: `components/HomePageContent.tsx` (replace the inline `{/* Hero */}` section with `<Hero />`; remove now-unused `AnimatedCounter`/`BOOKING_URL` imports and the `STATS` construction)

**Interfaces:**
- Consumes: `Home.*` namespace (existing), `Hero.*` namespace (Task 3), `SocialLinks` (Task 2), `HeroNetworkPanel` (Task 4), `ParallaxImage`, `AnimatedCounter`, `locations` from `@/data/locations`, `doctors` from `@/data/doctors`, `BOOKING_URL` from `@/lib/constants`.
- Produces: `export function Hero()` (no props) — consumed by `HomePageContent.tsx`.

- [ ] **Step 1: Write the failing test**

Create `components/Hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { Hero } from "./Hero";
import { locations } from "@/data/locations";
import { BOOKING_URL } from "@/lib/constants";

describe("Hero", () => {
  it("renders the badge, headline, and subheading", () => {
    render(<Hero />);
    expect(screen.getByText(`${locations.length} clinics across Greater LA`)).toBeInTheDocument();
    expect(screen.getByText("Compassionate pediatric care,")).toBeInTheDocument();
    expect(screen.getByText("close to home.")).toBeInTheDocument();
  });

  it("renders the 3 CTA buttons with correct hrefs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /book an appointment/i })).toHaveAttribute(
      "href",
      BOOKING_URL
    );
    expect(screen.getByRole("link", { name: /find a doctor/i })).toHaveAttribute(
      "href",
      "/doctors"
    );
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("renders all 4 stat labels", () => {
    render(<Hero />);
    expect(screen.getByText("Clinic locations")).toBeInTheDocument();
    expect(screen.getByText("Board-certified providers")).toBeInTheDocument();
    expect(screen.getByText("Years of pediatric care")).toBeInTheDocument();
    expect(screen.getByText("Ages served")).toBeInTheDocument();
  });

  it("renders the social row and the YouTube line", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByText("Health tips weekly on YouTube")).toBeInTheDocument();
  });

  it("renders the embedded One Network panel", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /explore the network/i })).toHaveAttribute(
      "href",
      "/network"
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/Hero.test.tsx`
Expected: FAIL with "Cannot find module './Hero'"

- [ ] **Step 3: Create `components/Hero.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { ParallaxImage } from "@/components/ParallaxImage";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SocialLinks } from "@/components/SocialLinks";
import { HeroNetworkPanel } from "@/components/HeroNetworkPanel";

export function Hero() {
  const t = useTranslations("Home");
  const tHero = useTranslations("Hero");

  const stats = [
    { label: t("statClinics"), value: `${locations.length}` },
    { label: t("statProviders"), value: `${doctors.length}+` },
    { label: t("statYears"), value: "18+" },
    { label: t("statAges"), value: "0-21" },
  ];

  return (
    <section data-on-navy className="relative overflow-hidden bg-navy lg:min-h-[44rem]">
      <ParallaxImage
        src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
        alt="A pediatrician examining a young patient during a check-up"
        width={1200}
        height={1400}
        wrapperClassName="absolute inset-0 h-full w-full"
        speed={0.12}
        preload
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:pb-60">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ivory">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
            <path
              d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          {t("badge", { count: locations.length })}
        </span>

        <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ivory sm:text-5xl lg:text-[3.4rem]">
          {t("headingStart")}{" "}
          <span className="text-teal-tint">{t("headingHighlight")}</span>
        </h1>

        <p className="max-w-lg text-lg text-ivory/75">{t("subheading")}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
              <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2.5v4M8 2.5v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t("bookAppointment")}
          </a>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
              <path
                d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 15v1a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
            </svg>
            {t("findDoctor")}
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-display text-sm font-semibold text-ivory transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
              <path
                d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.25" stroke="currentColor" strokeWidth="2" />
            </svg>
            {t("findClinic")}
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:w-fit sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <p className="font-display text-2xl font-extrabold text-ivory">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-0.5 text-xs leading-tight text-ivory/65">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-ivory/50">
            {tHero("followUs")}
          </p>
          <SocialLinks />
          <span aria-hidden className="hidden h-6 w-px bg-white/20 sm:block" />
          <p className="text-sm text-ivory/70">{tHero("youtubeLine")}</p>
        </div>
      </div>

      <HeroNetworkPanel />
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/Hero.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Wire `Hero` into `HomePageContent.tsx`**

Add the import, right after the other `@/components/*` imports:

```tsx
import { Hero } from "@/components/Hero";
```

Remove these two now-unused imports (they're only used by the hero code being deleted below; `locations` and `doctors` themselves stay imported, since the rest of the page still uses them):

```tsx
import { BOOKING_URL } from "@/lib/constants";
```

```tsx
import { AnimatedCounter } from "@/components/AnimatedCounter";
```

Remove the `STATS` construction block (currently right before the `return (`):

```tsx
  const STATS = [
    { label: t("statClinics"), value: `${locations.length}` },
    { label: t("statProviders"), value: `${doctors.length}+` },
    { label: t("statYears"), value: "18+" },
    { label: t("statAges"), value: "0-21" },
  ];
```

Find this exact block (the current inline hero, `components/HomePageContent.tsx:60-156`) and delete it entirely:

```tsx
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-teal-tint/60 to-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path
                  d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {t("badge", { count: locations.length })}
            </span>

            <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              {t("headingStart")}{" "}
              <span className="text-teal-dark">{t("headingHighlight")}</span>
            </h1>

            <p className="max-w-lg text-lg text-ink-soft">{t("subheading")}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 2.5v4M8 2.5v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {t("bookAppointment")}
              </a>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 15v1a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
                </svg>
                {t("findDoctor")}
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.25" stroke="currentColor" strokeWidth="2" />
                </svg>
                {t("findClinic")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
              alt="A pediatrician examining a young patient during a check-up"
              width={1200}
              height={1400}
              wrapperClassName="h-[22rem] rounded-[2rem] shadow-soft sm:h-[26rem]"
              speed={0.18}
              preload
            />

            <div className="relative z-10 mx-4 -mt-10 rounded-2xl border border-border bg-surface p-5 shadow-card sm:absolute sm:-bottom-8 sm:left-6 sm:right-6 sm:mx-0 sm:mt-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <p className="font-display text-2xl font-extrabold text-teal-dark">
                      <AnimatedCounter value={stat.value} />
                    </p>
                    <p className="mt-0.5 text-xs leading-tight text-ink-soft">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
```

Replace it with:

```tsx
      <Hero />
```

- [ ] **Step 6: Run the full test suite to confirm no regression**

Run: `npm run test`
Expected: PASS (every existing test still passes; no test currently queries the removed inline hero markup directly, since `HomePageContent.tsx` has no dedicated test file)

- [ ] **Step 7: Commit**

```bash
git add components/Hero.tsx components/Hero.test.tsx components/HomePageContent.tsx
git commit -m "feat: redesign homepage hero as a full-bleed dark photo hero"
```

---

### Task 6: Final verification

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS (all tests across the repo, including the new `data/social.test.ts`, `components/SocialLinks.test.tsx`, `components/HeroNetworkPanel.test.tsx`, `components/Hero.test.tsx`, and unchanged `components/Footer.test.tsx`)

- [ ] **Step 2: Run the linter**

Run: `npm run lint`
Expected: no errors (in particular: no unused-import warnings on `components/HomePageContent.tsx` for the removed `BOOKING_URL`/`AnimatedCounter` imports)

- [ ] **Step 3: Run the TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: no type errors

- [ ] **Step 4: Manual note for the implementer (not automated)**

Per this repo's testing conventions, do not run Playwright or a manual dev-server browser check — the user reviews the visual result themselves. If Steps 1-3 all pass, the task is complete from an implementation-verification standpoint. Flag to the user in your final summary that exact spacing around the `HeroNetworkPanel`'s desktop overlap (`lg:min-h-[44rem]` on the section, `lg:pb-60` on the content column, `lg:bottom-6`/`xl:bottom-8` on the panel) is a best-effort responsive translation of a fixed 1440×1080 mockup and may want a quick visual eyeball pass.

- [ ] **Step 5: Commit** (only if any fixes were needed in Steps 1-3; otherwise this task produces no diff and needs no commit)
