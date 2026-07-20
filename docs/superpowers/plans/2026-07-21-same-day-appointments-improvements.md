# Same-Day Appointments Page Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a photo in a two-column layout to the Same-Day Appointments service page and a "More Services" button to every service detail page, matching the site's existing theme and responsive behavior.

**Architecture:** All service detail pages render through one shared server-component template (`app/[locale]/services/[slug]/page.tsx`). Changes are data-driven: an optional `imageSrc` on the `Service` type switches that page into a two-column image layout; pages without an image keep their current single-column layout. The "More Services" button is added to both layouts. All styling reuses existing design tokens and the About-page button classes, so light/dark themes and breakpoints work automatically.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19, next-intl 4, Tailwind CSS 4, `next/image`, Vitest + Testing Library.

## Global Constraints

- This repo's Next.js is v16 with breaking changes — mirror the already-working `next/image` usage in `app/[locale]/blog/[slug]/page.tsx` (`unoptimized`, explicit `width`/`height`). Do NOT use the deprecated `priority` prop; `preload` replaces it in v16 (not needed here).
- Internal navigation uses `Link` from `@/i18n/navigation` (locale-aware). Never use plain `next/link` or a bare `<a>` for internal routes.
- `BOOKING_URL` is imported from `@/lib/constants` — do not hardcode or change the URL string.
- Localize user-facing labels via inline `locale === "es" ? … : …` ternaries, matching how this file already localizes `name`/`description`.
- Reuse existing design tokens only (`teal`, `teal-dark`, `ink`, `ink-soft`, `border`, `surface`, `shadow-soft`, `font-display`). Do not introduce new colors or CSS.
- Run tests with `npm test` (`vitest run`). Single file: `npx vitest run "app/[locale]/services/[slug]/page.test.tsx"`.

---

## File Structure

- **Modify** `data/services.ts` — add optional image fields to the `Service` type; populate them on the `same-day-appointments` service.
- **Modify** `app/[locale]/services/[slug]/page.tsx` — add the two-column image layout branch and the "More Services" button (both layouts); localize button labels.
- **Modify** `app/[locale]/services/[slug]/page.test.tsx` — add tests for the image, the button, and their Spanish variants.
- **Provide (user action, not code)** `public/services/same-day-appointments.png` — the photo binary. The folder is created in Task 2; the file is dropped in by the user.

---

## Task 1: Two-column image layout for services that have an image

**Files:**
- Modify: `data/services.ts` (type at lines 1-9; `same-day-appointments` object at lines 120-127)
- Modify: `app/[locale]/services/[slug]/page.tsx`
- Test: `app/[locale]/services/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `serviceCategories` from `@/data/services`; `BackLink`; `BOOKING_URL`.
- Produces: `Service` type gains optional `imageSrc?: string`, `imageAlt?: string`, `imageAltEs?: string`. The template renders an `<img>` (via `next/image`) with the service's alt text when `imageSrc` is set, and no `<img>` when it is not.

- [ ] **Step 1: Add image fields to the `Service` type**

In `data/services.ts`, replace the `Service` type (lines 1-9) with:

```ts
export type Service = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  longDescription: string;
  longDescriptionEs: string;
  imageSrc?: string;
  imageAlt?: string;
  imageAltEs?: string;
};
```

- [ ] **Step 2: Populate the image fields on `same-day-appointments`**

In `data/services.ts`, in the `same-day-appointments` service object (currently lines 120-127), add the three fields after `longDescriptionEs`:

```ts
        imageSrc: "/services/same-day-appointments.png",
        imageAlt: "A pediatrician smiling with a young child holding a teddy bear",
        imageAltEs: "Una pediatra sonriendo con una niña pequeña que sostiene un osito de peluche",
```

- [ ] **Step 3: Write the failing tests**

In `app/[locale]/services/[slug]/page.test.tsx`, add these tests inside the `describe` block:

```tsx
  it("renders the service image with English alt text for same-day-appointments", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "same-day-appointments" }),
    });
    render(ui);
    expect(screen.getByRole("img", { name: /teddy bear/i })).toBeInTheDocument();
  });

  it("renders the service image with Spanish alt text when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "same-day-appointments", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("img", { name: /osito de peluche/i })).toBeInTheDocument();
  });

  it("renders no image for services without one", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth" }),
    });
    render(ui);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npx vitest run "app/[locale]/services/[slug]/page.test.tsx"`
Expected: The three new tests FAIL (no `img` rendered yet); existing tests still PASS.

- [ ] **Step 5: Add the image import and two-column layout branch**

In `app/[locale]/services/[slug]/page.tsx`:

Add the `Image` import after the `notFound` import (line 2):

```tsx
import Image from "next/image";
```

In `ServiceDetailPage`, after the existing `longDescription` line (line 50), add:

```tsx
  const imageAlt = locale === "es" ? service.imageAltEs : service.imageAlt;
```

Then, immediately before the existing `return (` (line 52), insert the image-layout branch:

```tsx
  if (service.imageSrc) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <BackLink href="/services" messageKey="backToServices" namespace="Services" />

        <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {categoryName}
        </span>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {name}
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={service.imageSrc}
              alt={imageAlt ?? name}
              width={800}
              height={1000}
              unoptimized
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-lg font-semibold text-ink-soft">{description}</p>
            <p className="mt-6 text-ink-soft">{longDescription}</p>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </main>
    );
  }
```

Leave the existing single-column `return (...)` (lines 52-73) unchanged — it is the no-image branch.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run "app/[locale]/services/[slug]/page.test.tsx"`
Expected: All tests PASS (new image tests + all existing tests).

- [ ] **Step 7: Commit**

```bash
git add data/services.ts "app/[locale]/services/[slug]/page.tsx" "app/[locale]/services/[slug]/page.test.tsx"
git commit -m "feat: add two-column image layout to same-day appointments service page"
```

---

## Task 2: "More Services" button on every service page + localized labels

**Files:**
- Modify: `app/[locale]/services/[slug]/page.tsx`
- Test: `app/[locale]/services/[slug]/page.test.tsx`
- Create (folder): `public/services/` (user drops `same-day-appointments.png` here)

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation`; `BOOKING_URL`; the `locale` value already read from `params`.
- Produces: both layout branches render a two-button row — a primary "Book an Appointment" `<a>` to `BOOKING_URL` and a secondary "More Services" `<Link href="/services">`, with labels localized for `es`.

- [ ] **Step 1: Write the failing tests**

In `app/[locale]/services/[slug]/page.test.tsx`, add these tests inside the `describe` block:

```tsx
  it("renders a More Services link to /services on a service page", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth" }),
    });
    render(ui);
    expect(screen.getByRole("link", { name: /more services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("renders a More Services link on the image-layout page too", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "same-day-appointments" }),
    });
    render(ui);
    expect(screen.getByRole("link", { name: /more services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("localizes the booking and More Services labels when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("link", { name: /reservar una cita/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /más servicios/i })).toHaveAttribute(
      "href",
      "/es/services"
    );
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run "app/[locale]/services/[slug]/page.test.tsx"`
Expected: The three new tests FAIL (no "More Services" link, no Spanish labels yet); all other tests PASS.

- [ ] **Step 3: Add the `Link` import and localized labels**

In `app/[locale]/services/[slug]/page.tsx`:

Add the import after the `BackLink` import (line 4):

```tsx
import { Link } from "@/i18n/navigation";
```

After the `imageAlt` line added in Task 1, add the label constants:

```tsx
  const bookLabel = locale === "es" ? "Reservar una Cita" : "Book an Appointment";
  const moreServicesLabel = locale === "es" ? "Más Servicios" : "More Services";
```

- [ ] **Step 4: Replace the single button with the button row in BOTH branches**

In the **image branch** (added in Task 1), replace the single `<a>…Book an Appointment</a>` block with:

```tsx
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
              >
                {bookLabel}
              </a>
              <Link
                href="/services"
                className="rounded-full border border-border bg-surface px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                {moreServicesLabel}
              </Link>
            </div>
```

In the **no-image branch** (original layout), replace the single `<a>…Book an Appointment</a>` block (lines 65-72) with:

```tsx
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {bookLabel}
        </a>
        <Link
          href="/services"
          className="rounded-full border border-border bg-surface px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
        >
          {moreServicesLabel}
        </Link>
      </div>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run "app/[locale]/services/[slug]/page.test.tsx"`
Expected: All tests PASS, including the existing "renders a Book an Appointment link to the real booking URL" test (English label unchanged).

- [ ] **Step 6: Create the image folder and add the photo**

Create the directory `public/services/` and place the provided PNG at `public/services/same-day-appointments.png`.

```bash
mkdir -p public/services
```

Then the user copies the attached PNG to `public/services/same-day-appointments.png`. (If the file is not yet available, everything still builds; the image element renders with its alt text until the file is present.)

- [ ] **Step 7: Commit**

```bash
git add "app/[locale]/services/[slug]/page.tsx" "app/[locale]/services/[slug]/page.test.tsx"
git commit -m "feat: add More Services button and localized labels to service pages"
```

---

## Task 3: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: All tests PASS.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: Build succeeds with no type errors. Confirm `/services/same-day-appointments` prerenders without error.

- [ ] **Step 3: Manual check in dev**

Run: `npm run dev`, then open `http://localhost:3000/services/same-day-appointments`.

Confirm:
- Desktop (≥1024px): image and text sit side by side; two buttons in a row.
- Mobile (<1024px): image stacks above the text; buttons stack vertically.
- The photo renders (once `public/services/same-day-appointments.png` exists).
- "More Services" navigates to `/services`.
- Visit `http://localhost:3000/es/services/same-day-appointments`: labels show "Reservar una Cita" / "Más Servicios"; "More Services" goes to `/es/services`.
- Toggle OS dark mode: both buttons remain legible (secondary uses `bg-surface`/`border-border`/`text-ink`).
- A page without an image (e.g. `/services/telehealth`) is unchanged except for the new "More Services" button.

---

## Self-Review

**Spec coverage:**
- Image on same-day page → Task 1 (data + image branch). ✓
- Two-column desktop / stacked mobile → Task 1 (`grid-cols-1 lg:grid-cols-2`). ✓
- "More Services" button linking to services page, all service pages → Task 2. ✓
- Match theme/dark/responsive → reused tokens + About-page classes throughout. ✓
- Localize both button labels → Task 2 label constants. ✓
- Image asset path `public/services/same-day-appointments.png` → Task 2 Step 6. ✓
- Read Next.js v16 image docs / mirror blog usage → Global Constraints + Task 1 markup. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code. ✓

**Type consistency:** `imageSrc`/`imageAlt`/`imageAltEs` defined in Task 1 Step 1 and consumed in Task 1 Step 5. `bookLabel`/`moreServicesLabel` defined in Task 2 Step 3 and used in Task 2 Step 4. `Link` import matches usage. ✓
