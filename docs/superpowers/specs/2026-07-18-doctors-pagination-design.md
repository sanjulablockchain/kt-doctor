# Doctors page pagination — design

**Date:** 2026-07-18
**Status:** Approved (pending spec review)

## Problem

The doctors directory at `/doctors` renders all 56 providers at once in a
single 3-column grid ([components/DoctorsPageContent.tsx](../../../components/DoctorsPageContent.tsx)).
This makes for a very long page and a lot of scrolling. We want to break the
list into pages with numbered pagination controls.

## Goals

- Show **12 doctors per page** (4 full rows of 3 on desktop; ~5 pages for 56).
- **Numbered pagination**: `‹ Prev  1 2 3 … Next ›` controls below the grid.
- Pagination works on top of the existing search + location + specialty filters
  (it paginates the already-filtered result set).

## Non-goals

- No server-side pagination or data-fetching changes. All doctor data is already
  loaded and filtered on the client, so pagination is pure client state.
- No URL/query-param sync for the current page. Search and filters are not in the
  URL today; keeping page in React state matches that existing behavior. (Can be
  revisited later if shareable `?page=N` links are wanted.)
- No change to the "Showing X of Y providers" summary line.

## Approach

Add one small reusable `Pagination` component and wire page state into
`DoctorsPageContent`. Page state lives in React `useState`, consistent with how
search and filters already work.

## Components

### New: `components/Pagination.tsx`

A presentational client component.

**Props:**

```ts
{
  currentPage: number;       // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Behavior:**

- Renders `<nav aria-label={t("label")}>` containing a `‹ Previous` button, the
  numbered page buttons, and a `Next ›` button.
- Active page button: teal fill + `aria-current="page"` (mirrors the active-item
  style used in [components/FilterDropdown.tsx](../../../components/FilterDropdown.tsx)).
- `Previous` is `disabled` on page 1; `Next` is `disabled` on the last page.
- Page numbers use a **truncated window** when there are many pages, e.g.
  `1 … 4 [5] 6 … 10`, so the control stays compact if the list grows. With 56
  doctors (5 pages) no ellipsis appears, but the logic must not break at scale.
- Returns `null` when `totalPages <= 1` (nothing to paginate — e.g. a filter
  narrows the list to a single page).
- Reads its own labels via `useTranslations("Pagination")`.

**Styling:** Tailwind, matching existing controls — rounded buttons, `border`
tokens, `teal`/`teal-dark`/`teal-tint` for active/hover, `ink`/`ink-soft` text,
disabled state visually muted and non-interactive.

### Changed: `components/DoctorsPageContent.tsx`

- Add `const PAGE_SIZE = 12;` and `const [page, setPage] = useState(1);`.
- Compute `totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))`.
- Clamp: ensure the rendered page never exceeds `totalPages` (guard against a
  filter shrinking the list while on a high page).
- Reset `page` to 1 whenever `search`, `locationId`, or `specialty` change, so a
  filter change never strands the user on a now-empty page.
- Slice the filtered list to the current page:
  `filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)` and render that slice
  in the grid instead of the full `filtered` array.
- Render `<Pagination currentPage={page} totalPages={totalPages} onPageChange={...} />`
  below the grid.
- On page change, scroll back to the top of the grid (smooth) so the user lands on
  the first card of the new page rather than mid-list.

## Data flow

```
doctors (56) ──filterDoctors(search, location, specialty)──▶ filtered
filtered ──slice by page (12/page)──▶ visible cards in grid
filtered.length ──▶ totalPages ──▶ Pagination controls
Pagination onPageChange ──▶ setPage ──▶ re-slice + scroll to grid top
search / location / specialty change ──▶ setPage(1)
```

## Internationalization

New `Pagination` namespace added to both [messages/en.json](../../../messages/en.json)
and [messages/es.json](../../../messages/es.json):

| key         | en (example)          | es (example)              |
| ----------- | --------------------- | ------------------------- |
| `label`     | `Pagination`          | `Paginación`              |
| `previous`  | `Previous`            | `Anterior`                |
| `next`      | `Next`                | `Siguiente`               |
| `goToPage`  | `Go to page {page}`   | `Ir a la página {page}`   |

`goToPage` is used as the `aria-label` on each numbered page button for screen
readers.

## Edge cases

- **0 results:** `totalPages` clamps to 1, `Pagination` renders `null`, grid is
  empty (existing empty behavior preserved).
- **Filter narrows to ≤12 results:** one page, no controls shown.
- **Filter applied while on page 3:** page resets to 1.
- **List grows well beyond 5 pages:** ellipsis window keeps the control compact.

## Testing

- **New `components/Pagination.test.tsx`:**
  - Renders the expected number of page buttons for a given `totalPages`.
  - Clicking a page button / Prev / Next calls `onPageChange` with the right page.
  - `Previous` disabled on page 1; `Next` disabled on the last page.
  - Active page button has `aria-current="page"`.
  - Renders nothing when `totalPages <= 1`.
- **Updated [app/[locale]/doctors/page.test.tsx](../../../app/[locale]/doctors/page.test.tsx):**
  - Replace "renders all doctors by default" with a pagination-aware test: assert a
    page-1 doctor is visible and a known later-page doctor is *not*, then click page
    2 (or Next) and assert the later-page doctor appears.
  - Add a test: applying a filter resets to page 1.
  - The existing Spanish and location-filter tests remain valid (their result sets
    fit on a single page).

## Implementation notes

- Per [AGENTS.md](../../../AGENTS.md), this repo's Next.js has breaking changes;
  consult `node_modules/next/dist/docs/` before writing code. This feature is
  client-state only (the page is already a `"use client"` component) and touches no
  Next routing/data APIs, so the risk surface is small — but follow existing
  client-component patterns.
