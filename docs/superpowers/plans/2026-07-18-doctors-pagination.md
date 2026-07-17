# Doctors Page Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Break the 56-doctor grid on `/doctors` into pages of 12 with numbered pagination controls.

**Architecture:** All doctor data is already loaded and filtered client-side, so pagination is pure client state. Add one reusable presentational `Pagination` component (numbered pages, Prev/Next, ellipsis window) and wire `page` state into the existing `DoctorsPageContent` client component, slicing the already-filtered list.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, next-intl (i18n), Vitest + Testing Library.

## Global Constraints

- **This repo's Next.js has breaking changes** — consult `node_modules/next/dist/docs/` before writing Next-specific code. This feature is client-state only (the page is already `"use client"`) and touches no Next routing/data APIs.
- **Named exports** for components (e.g. `export function Pagination`), matching `DoctorCard` / `FilterDropdown`.
- **All user-facing strings via next-intl** — add keys to **both** `messages/en.json` and `messages/es.json`.
- **Page size is exactly 12.** 56 doctors → 5 pages.
- **Tests** use `renderWithIntl` from `@/lib/test-utils`, Vitest, and Testing Library. Run with `npx vitest run <file>`.
- **Tailwind tokens already in use:** `teal`, `teal-dark`, `teal-tint`, `ink`, `ink-soft`, `border`, `ivory`, `white`. Reuse these — do not introduce new colors.

---

## File Structure

- **Create** `components/Pagination.tsx` — presentational numbered-pagination control. Owns: page-slot layout (numbers + ellipsis), Prev/Next, disabled states, a11y. Depends on: `next-intl` (`Pagination` namespace).
- **Create** `components/Pagination.test.tsx` — unit tests for `Pagination`.
- **Modify** `messages/en.json` — add `Pagination` namespace.
- **Modify** `messages/es.json` — add `Pagination` namespace.
- **Modify** `components/DoctorsPageContent.tsx` — add `page` state, slice filtered list, render `Pagination`, reset-on-filter, scroll-to-results.
- **Modify** `app/[locale]/doctors/page.test.tsx` — update the default-render test for pagination; add page-navigation and filter-reset tests.

---

## Task 1: Pagination component

**Files:**
- Create: `components/Pagination.tsx`
- Create: `components/Pagination.test.tsx`
- Modify: `messages/en.json` (add `Pagination` namespace after the `Doctors` block)
- Modify: `messages/es.json` (add `Pagination` namespace after the `Doctors` block)

**Interfaces:**
- Consumes: `useTranslations("Pagination")` with keys `label`, `previous`, `next`, `goToPage` (takes `{ page }`).
- Produces: `export function Pagination(props: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }): JSX.Element | null`. Returns `null` when `totalPages <= 1`. Numbered page buttons have accessible name `Go to page {page}` and `aria-current="page"` on the active one; Prev/Next buttons are named `Previous` / `Next` and are `disabled` at the respective bounds.

- [ ] **Step 1: Add the `Pagination` i18n namespace to `messages/en.json`**

Find this block (end of the `Doctors` namespace) and add the `Pagination` block after it:

```json
    "showingProviders": "Showing {filtered} of {total} providers"
  },
  "Locations": {
```

Replace with:

```json
    "showingProviders": "Showing {filtered} of {total} providers"
  },
  "Pagination": {
    "label": "Pagination",
    "previous": "Previous",
    "next": "Next",
    "goToPage": "Go to page {page}"
  },
  "Locations": {
```

- [ ] **Step 2: Add the `Pagination` i18n namespace to `messages/es.json`**

Find this block and add the `Pagination` block after it:

```json
    "showingProviders": "Mostrando {filtered} de {total} médicos"
  },
  "Locations": {
```

Replace with:

```json
    "showingProviders": "Mostrando {filtered} de {total} médicos"
  },
  "Pagination": {
    "label": "Paginación",
    "previous": "Anterior",
    "next": "Siguiente",
    "goToPage": "Ir a la página {page}"
  },
  "Locations": {
```

- [ ] **Step 3: Write the failing test `components/Pagination.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders a button per page and reports clicks", async () => {
    const onPageChange = vi.fn();
    renderWithIntl(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );

    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 3" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("marks the current page with aria-current", () => {
    renderWithIntl(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("button", { name: "Go to page 1" })
    ).not.toHaveAttribute("aria-current");
  });

  it("disables Previous on the first page and Next on the last", () => {
    const { unmount } = renderWithIntl(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    unmount();

    renderWithIntl(
      <Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("moves to the neighbouring page via Previous and Next", async () => {
    const onPageChange = vi.fn();
    renderWithIntl(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("collapses long page lists with ellipses", () => {
    renderWithIntl(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 6" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to page 3" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to page 8" })
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("renders nothing when there is only one page", () => {
    renderWithIntl(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx vitest run components/Pagination.test.tsx`
Expected: FAIL — cannot resolve `./Pagination` (module does not exist yet).

- [ ] **Step 5: Implement `components/Pagination.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Build the list of page slots to render. Small totals show every page; large
// totals collapse to first / last / a window around the current page, with
// "ellipsis" markers for the gaps, so the control stays compact as the list grows.
function getPageItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) items.push("ellipsis");
  for (let page = left; page <= right; page++) items.push(page);
  if (right < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
}

const arrowClass =
  "flex items-center gap-1 rounded-full border border-border bg-ivory px-4 py-2 text-sm text-ink transition-colors hover:border-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("Pagination");

  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label={t("label")}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={arrowClass}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
          <path
            d="m15 18-6-6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("previous")}
      </button>

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="px-1 text-sm text-ink-soft"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={t("goToPage", { page: item })}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`min-w-[2.5rem] rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
              item === currentPage
                ? "border-teal bg-teal text-white"
                : "border-border bg-ivory text-ink hover:border-teal hover:text-teal-dark"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={arrowClass}
      >
        {t("next")}
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
          <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/Pagination.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 7: Commit**

```bash
git add components/Pagination.tsx components/Pagination.test.tsx messages/en.json messages/es.json
git commit -m "feat: add reusable Pagination component"
```

Note: `messages/en.json` and `messages/es.json` already have unrelated uncommitted working-tree changes. Stage them with `git add` as above (this stages the whole file). If you must avoid committing the pre-existing changes, use `git add -p messages/en.json messages/es.json` and stage only the new `Pagination` block hunks.

---

## Task 2: Wire pagination into the doctors page

**Files:**
- Modify: `components/DoctorsPageContent.tsx`
- Modify: `app/[locale]/doctors/page.test.tsx`

**Interfaces:**
- Consumes: `Pagination` from `@/components/Pagination` (see Task 1 signature).
- Produces: paginated grid — renders only the current page's 12 doctors; `Pagination` below the grid; page resets to 1 on any filter change; page change scrolls the results region into view.

**Doctor ordering reference** (file order = display order; `filterDoctors` does not re-sort). Page 1 = doctors 1–12 (`Adrienne C. Altman` … `Cze-Ja Tam`). Page 2 = doctors 13–24, starting `Erik Saenz`, `Faiza Iram`. `Martin Fineberg` is doctor 27 → page 3. These names are used in the tests below.

- [ ] **Step 1: Update `app/[locale]/doctors/page.test.tsx` (write the failing tests)**

Replace the entire file contents with:

```tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import DoctorsPage from "./page";

describe("DoctorsPage", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView; the page calls it on page change.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("shows only the first page of doctors and filters by search", async () => {
    renderWithIntl(<DoctorsPage />);

    // Adrienne is on page 1; Faiza is page 2 and Martin page 3, so both are hidden.
    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.queryByText("Faiza Iram")).not.toBeInTheDocument();
    expect(screen.queryByText("Martin Fineberg")).not.toBeInTheDocument();

    const searchBox = screen.getByPlaceholderText("Search by name...");
    await userEvent.type(searchBox, "fineberg");

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.queryByText("Adrienne C. Altman")).not.toBeInTheDocument();
  });

  it("navigates to the second page of results", async () => {
    renderWithIntl(<DoctorsPage />);

    expect(screen.queryByText("Faiza Iram")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(screen.getByText("Faiza Iram")).toBeInTheDocument();
    expect(screen.queryByText("Adrienne C. Altman")).not.toBeInTheDocument();
  });

  it("resets to the first page when a filter changes", async () => {
    renderWithIntl(<DoctorsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    expect(screen.getByText("Faiza Iram")).toBeInTheDocument();

    // "a" matches most names, so multiple pages remain and pagination stays visible.
    await userEvent.type(screen.getByPlaceholderText("Search by name..."), "a");

    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("filters by location", async () => {
    renderWithIntl(<DoctorsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Filter by location" }));
    await userEvent.click(screen.getByRole("option", { name: "Valencia" }));

    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.queryByText("Martin Fineberg")).not.toBeInTheDocument();
  });

  it("renders the heading and search placeholder in Spanish when locale is es", () => {
    renderWithIntl(<DoctorsPage />, "es");
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre...")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify the pagination ones fail**

Run: `npx vitest run app/[locale]/doctors/page.test.tsx`
Expected: FAIL — "shows only the first page…" fails because the current page renders all doctors (so `Faiza Iram` / `Martin Fineberg` are present), and "navigates to the second page…" fails because there is no `Go to page 2` button yet.

- [ ] **Step 3: Update `components/DoctorsPageContent.tsx`**

Replace the entire file contents with:

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { filterDoctors, getAllSpecialties } from "@/lib/filters";
import { DoctorCard } from "@/components/DoctorCard";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 12;

export function DoctorsPageContent() {
  const t = useTranslations("Doctors");
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLParagraphElement>(null);

  const specialties = useMemo(() => getAllSpecialties(doctors), []);

  const filtered = useMemo(
    () =>
      filterDoctors(doctors, {
        search: search || undefined,
        locationId: locationId || undefined,
        specialty: specialty || undefined,
      }),
    [search, locationId, specialty]
  );

  const locationNameById = useMemo(
    () => new Map(locations.map((l) => [l.id, l.name])),
    []
  );

  // Any filter change returns the user to the first page, so a filter can never
  // leave them stranded on a page that no longer exists.
  useEffect(() => {
    setPage(1);
  }, [search, locationId, specialty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description", { count: doctors.length })}</p>

      <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-border bg-white p-4 shadow-card sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-border bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
        />

        <FilterDropdown
          ariaLabel={t("filterByLocation")}
          value={locationId}
          placeholder={t("allLocations")}
          options={locations.map((loc) => ({ value: loc.id, label: loc.name }))}
          onChange={setLocationId}
        />

        <FilterDropdown
          ariaLabel={t("filterBySpecialty")}
          value={specialty}
          placeholder={t("allSpecialties")}
          options={specialties.map((s) => ({ value: s, label: s }))}
          onChange={setSpecialty}
        />
      </div>

      <p
        ref={resultsRef}
        className="mt-6 scroll-mt-24 text-sm font-medium text-ink-soft"
      >
        {t("showingProviders", { filtered: filtered.length, total: doctors.length })}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            locationNames={doc.locationIds.map((id) => locationNameById.get(id) ?? id)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </main>
  );
}
```

- [ ] **Step 4: Run the doctors page tests to verify they pass**

Run: `npx vitest run app/[locale]/doctors/page.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `npm test`
Expected: PASS — all suites green, including the new `Pagination` suite.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/DoctorsPageContent.tsx app/[locale]/doctors/page.test.tsx
git commit -m "feat: paginate the doctors directory (12 per page)"
```

---

## Manual verification (after Task 2)

- [ ] Run `npm run dev`, open `http://localhost:3001/doctors`.
- [ ] Confirm 12 cards on page 1 and a `‹ Prev  1 2 3 4 5  Next ›` control below the grid.
- [ ] `Previous` is disabled on page 1; `Next` disabled on page 5.
- [ ] Clicking a page number swaps the 12 cards and scrolls up to the results count; the active page is highlighted teal.
- [ ] Applying a search/location/specialty filter snaps back to page 1; when a filter yields ≤12 results the control disappears.
- [ ] Switch locale to `es` (`/es/doctors`) and confirm `Anterior` / `Siguiente` labels.

---

## Self-Review

**Spec coverage** (against `docs/superpowers/specs/2026-07-18-doctors-pagination-design.md`):
- 12 per page → `PAGE_SIZE = 12` (Task 2). ✓
- Numbered pagination with Prev/Next → `Pagination` component (Task 1). ✓
- Active page teal + `aria-current` → Task 1 Step 5 + test. ✓
- Prev disabled page 1 / Next disabled last → Task 1 Step 5 + test. ✓
- Ellipsis window for large lists → `getPageItems` (Task 1) + test. ✓
- Returns `null` when `totalPages <= 1` → Task 1 Step 5 + test. ✓
- Reset to page 1 on filter change → `useEffect` (Task 2) + test. ✓
- Clamp page to `totalPages` → `currentPage = Math.min(...)` (Task 2). ✓
- Slice filtered list → `visible` (Task 2). ✓
- Scroll to results on page change → `goToPage` + `resultsRef` (Task 2). ✓
- i18n `Pagination` namespace in en + es → Task 1 Steps 1–2. ✓
- New `Pagination.test.tsx` → Task 1. ✓
- Updated doctors page test (page-1 doctor visible, later-page hidden, navigate, reset) → Task 2. ✓
- Existing Spanish + location-filter tests preserved → Task 2 Step 1 (kept intact). ✓

**Placeholder scan:** none — every step has concrete code/commands. ✓

**Type consistency:** `Pagination` prop names (`currentPage`, `totalPages`, `onPageChange`) match between the component (Task 1), its tests (Task 1), and the call site (Task 2). `getPageItems` returns `(number | "ellipsis")[]`, consumed only within the component. `resultsRef` typed `HTMLParagraphElement` matches the `<p>` it is attached to. ✓
