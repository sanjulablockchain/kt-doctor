# Location "Book Appointment Now" Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a prominent per-location "Book Appointment Now" button to each location detail page, deep-linking Healow to that specific clinic.

**Architecture:** Store each clinic's real Healow per-facility deep link (`f=` code, harvested from the live site) as a `bookingUrl` on the `Location` data. The location detail page renders it as a primary CTA above the photos; the existing per-provider booking grid stays as a secondary path. The virtual Telehealth location has no facility link and falls back to the global `BOOKING_URL`.

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript, Tailwind CSS v4, Vitest + Testing Library.

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code (per AGENTS.md — this Next.js has breaking changes vs. training data).
- The location detail page uses **hardcoded English strings** (not next-intl); match that — the new button label is a plain string.
- `bookingUrl` values are **real production URLs** — copy them verbatim from the table in Task 1; do not hand-edit the `f=` codes.
- External booking links open in a new tab: `target="_blank" rel="noopener noreferrer"`.
- Reuse the existing pill-button styling already in the file; do not invent new colors.
- **Commits are deferred** per the user's standing preference (build + test without committing while the tree is dirty). Each task ends with a verification gate instead of a commit. Only commit if the user later asks.

---

### Task 1: Add `bookingUrl` to the Location data model and populate it

**Files:**
- Modify: `lib/types.ts` (add field to `Location` type)
- Modify: `data/locations.ts` (add `bookingUrl` to 23 clinics; update header comment)
- Test: `data/locations.test.ts`

**Interfaces:**
- Produces: `Location.bookingUrl?: string` — a full Healow per-facility deep link, or `undefined` for the telehealth pseudo-location. Consumed by Task 2's page.

**Booking URL data (harvested 2026-07-18 from the live location pages' "BOOK APPOINTMENT NOW" button — verbatim):**

| id            | bookingUrl |
|---------------|------------|
| agoura-hills  | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=8mqPBWAOD8V9GrMn` |
| arcadia       | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=9DQ48zAN6zAew2J6` |
| beverly-hills | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=ObYNDykzjWkpB3jQ` |
| canyon-country| `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=1ZQB8mAJZOAjdG4n` |
| culver-city   | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=mdbGr1kwdgvyLDwZ` |
| downey        | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=gLZ6qokap9VB7rEl` |
| glendale      | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=Qd1p2JAR0DkDozmN` |
| hollywood     | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=1&f=gBJw10krelVP4Rmo` |
| la-canada     | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=41Brm3AmMaAY2nDW` |
| mission-hills | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=ZNo3rwVYY0VqK04O` |
| northridge    | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=a8gDE7vnNqvjwXe2` |
| pasadena      | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=gBJw10kr7PvP4Rmo` |
| pico-rivera   | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=Qd1p2JAR0RkDozmN` |
| san-fernando  | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=8ryDOMA2yMvgLGWn` |
| santa-monica  | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=wOpGEdvXDLv3We9z` |
| san-pedro     | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=1&f=4XQdORVQQdVPzbZq` |
| tarzana       | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=Ng8dZoVoWrVJ3b9w` |
| torrance      | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=KDdE17AxW7vZx8jg` |
| valencia      | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=J28rg7vjX6VM9lOq` |
| van-nuys      | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=yQxbd9V5MlVROwY5` |
| west-hills    | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=xaqPX3Aq9BAQGJ46` |
| whittier      | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=WgeqlNApN5k5GEMQ` |
| la-mirada     | `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=1&f=06nB2aAKmLkgpJZq` |

`telehealth`: no `bookingUrl` (no live facility page; falls back to `BOOKING_URL`).

- [ ] **Step 1: Write the failing data-integrity tests**

Append to `data/locations.test.ts` (inside the existing `describe("locations data", …)` block):

```ts
  it("gives every real clinic a Healow per-facility booking URL; telehealth has none", () => {
    for (const loc of locations) {
      if (loc.id === "telehealth") {
        expect(loc.bookingUrl).toBeUndefined();
        continue;
      }
      expect(loc.bookingUrl).toMatch(
        /^https:\/\/healow\.com\/apps\/practice\/[^?]*-25634\?v=2&t=[12]&f=[A-Za-z0-9]+$/
      );
    }
  });

  it("gives each clinic a distinct facility booking URL", () => {
    const urls = locations
      .map((l) => l.bookingUrl)
      .filter((u): u is string => Boolean(u));
    expect(new Set(urls).size).toBe(urls.length);
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- data/locations.test.ts`
Expected: FAIL — the two new tests fail because `bookingUrl` is `undefined` on every location (`Property 'bookingUrl' does not exist` type error at compile, or `toMatch` receives `undefined`).

- [ ] **Step 3: Add the field to the `Location` type**

In `lib/types.ts`, add to the `Location` type (after the `photos: string[];` line):

```ts
  // Per-facility Healow booking deep link (the `f=` code), harvested from the
  // live location page's "Book Appointment Now" button. Absent for the
  // telehealth pseudo-location, which has no physical facility page.
  bookingUrl?: string;
```

- [ ] **Step 4: Populate `bookingUrl` on all 23 clinics**

In `data/locations.ts`, add a `bookingUrl` property to each clinic object using the table above. Place it on its own line after that clinic's `extension` line. Example for `agoura-hills`:

```ts
    extension: "207",
    bookingUrl:
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=8mqPBWAOD8V9GrMn",
    lat: 34.1361,
```

Repeat for all 23 clinics with their matching URL from the table. Do **not** add `bookingUrl` to the `telehealth` object.

Then update the file's header comment: append a sentence documenting the addition, e.g. after the existing block comment add:

```ts
//
// --- 2026-07-18: per-location booking links ---
// `bookingUrl` added for every physical clinic — the real Healow
// per-facility deep link (`f=` code) behind each live location page's "Book
// Appointment Now" button. This corrects the earlier assumption (see the old
// note in the location detail page) that Healow had no per-clinic deep link:
// it does, via the `f=` facility parameter. Telehealth has no facility page
// and intentionally has no bookingUrl (the UI falls back to BOOKING_URL).
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- data/locations.test.ts`
Expected: PASS — all tests in the file pass, including the two new ones.

- [ ] **Step 6: Typecheck the data layer**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 2: Render the primary "Book Appointment Now" CTA on the location page

**Files:**
- Modify: `app/[locale]/locations/[slug]/page.tsx`
- Test: `app/[locale]/locations/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `Location.bookingUrl?: string` (from Task 1); `BOOKING_URL` (from `@/lib/constants`).

- [ ] **Step 1: Write the failing page tests**

Append to `app/[locale]/locations/[slug]/page.test.tsx` (inside the existing `describe("LocationDetailPage", …)` block):

```ts
  it("renders a primary 'Book Appointment Now' CTA linking to the clinic's Healow facility URL", async () => {
    const ui = await LocationDetailPage({ params: Promise.resolve({ slug: "agoura-hills" }) });
    render(ui);

    const cta = screen.getByRole("link", { name: /book appointment now/i });
    expect(cta).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=8mqPBWAOD8V9GrMn"
    );
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("falls back to the shared practice booking URL on the telehealth location (no facility link)", async () => {
    const ui = await LocationDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    const cta = screen.getByRole("link", { name: /book appointment now/i });
    expect(cta).toHaveAttribute("href", BOOKING_URL);
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- "app/[locale]/locations/[slug]/page.test.tsx"`
Expected: FAIL — `getByRole("link", { name: /book appointment now/i })` throws "Unable to find role link" because no such button exists yet.

- [ ] **Step 3: Add the primary CTA button**

In `app/[locale]/locations/[slug]/page.tsx`, immediately after the phone paragraph (`<p className="mt-1 font-display font-semibold text-ink">{location.phone}</p>`), insert:

```tsx
      <a
        href={location.bookingUrl ?? BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal px-7 py-3.5 font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Book Appointment Now
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
```

- [ ] **Step 4: Demote the provider grid to a secondary path and remove the old fallback**

Replace the entire `{providers.length > 0 ? ( … ) : ( … )}` block (the provider grid + its `else` fallback `<a href={BOOKING_URL}>`) with a provider grid that only renders when providers exist — no `else`. Update the leading comment and the heading:

```tsx
      {providers.length > 0 && (
        <>
          {/* Secondary booking path. The primary CTA above deep-links Healow
              straight to this facility (per-location f= code, harvested from
              the live site). These per-provider links let a patient instead
              book directly with a named provider who practices here. */}
          <h2 className="mt-8 font-display text-lg font-bold text-ink">
            Prefer a specific provider?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Book directly with a provider who practices at this location.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {providers.map((doc) => (
              <a
                key={doc.id}
                href={doc.healowUrl ?? BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Book online with ${doc.name}`}
                className="group rounded-2xl border border-border bg-surface p-4 text-sm transition-colors hover:border-teal"
              >
                <span className="block font-display font-semibold text-ink">{doc.name}</span>
                <span className="mt-0.5 block text-ink-soft">{doc.credentials}</span>
                <span className="mt-2 flex items-center gap-1 font-display text-xs font-semibold text-teal-dark">
                  Book Online
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </>
      )}
```

Note: `BOOKING_URL` stays imported — it is still used by both the CTA fallback and the per-provider fallback.

- [ ] **Step 5: Run the page tests to verify they pass**

Run: `npm test -- "app/[locale]/locations/[slug]/page.test.tsx"`
Expected: PASS — all four tests pass (the two existing provider-link tests plus the two new CTA tests).

- [ ] **Step 6: Run the full test suite and typecheck**

Run: `npm test` then `npx tsc --noEmit`
Expected: all tests pass; no type errors.

- [ ] **Step 7: Verify in the running app**

Use the `verify` (or `run`) skill to launch the app, open `/en/locations/agoura-hills`, and confirm the "Book Appointment Now" button appears above the photos and points to the Agoura Hills facility URL. Spot-check `/en/locations/telehealth` (button falls back to `BOOKING_URL`) and one `t=1` clinic (`/en/locations/hollywood`).

---

## Self-Review

**Spec coverage:**
- Data model (`bookingUrl` on `Location`) → Task 1. ✓
- Harvest + store all 23 facility links → Task 1 (data table embedded). ✓
- Primary CTA button on each page → Task 2 Step 3. ✓
- Keep per-provider grid as secondary → Task 2 Step 4. ✓
- Telehealth fallback to `BOOKING_URL` → Task 1 (no bookingUrl) + Task 2 Step 3 (`?? BOOKING_URL`) + test. ✓
- Correct the outdated "no per-clinic deep link" comment → Task 1 header comment + Task 2 Step 4 comment. ✓
- Data-integrity test for facility-link shape + uniqueness → Task 1 Step 1. ✓
- Remove old empty-state fallback button → Task 2 Step 4. ✓

**Placeholder scan:** No TBD/TODO; all code and all 23 URLs are literal. ✓

**Type consistency:** `bookingUrl?: string` defined in Task 1 (`lib/types.ts`), consumed as `location.bookingUrl ?? BOOKING_URL` in Task 2. Names match. ✓
