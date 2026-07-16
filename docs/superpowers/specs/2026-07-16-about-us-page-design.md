# About Us Page — Design

## Purpose

Add a static "About Us" page to the site, linked from the Header "More" dropdown and the Footer "About" column (which currently links to Network/Foundation/Careers but has no About page of its own).

## Route

`app/[locale]/about/page.tsx` — a server component following the same pattern as `careers/page.tsx` and `insurance/page.tsx`: hardcoded English marketing copy (site convention: static content pages are not translated per-locale, only interactive/shared components like Header/Footer/Home are), `max-w-4xl` container, `metadata` export for title/description.

No new `data/about.ts` file — the content is one-off prose, not structured/reusable data, consistent with how `careers`/`insurance` inline their copy.

## Content structure

1. Eyebrow: "About Us"
2. H1: "Kids & Teens Pediatric Medical Group"
3. Tagline: "Caring for the Future Generations in Greater Los Angeles"
4. Paragraph introducing the practice, followed by a pill list of care areas (routine check-ups, allergies, ADHD, urgent care, prenatal consultations, after-hours care) — styled like the Home page's specialty pill cloud.
5. Paragraph on locations + insurance, reusing live data (`locations.length` from `@/data/locations`, `insuranceInfo.acceptedCategories` from `@/data/insurance`) the same way the Home and Insurance pages already do, plus a note on affordable payment options for uninsured families.
6. Closing paragraph + CTA: primary "Book an Appointment" button (`BOOKING_URL`), secondary "Find a Clinic" link (`/locations`).

## Navigation changes

- `components/Header.tsx`: add an "About Us" link as the first item in the "More" dropdown, before "Network", pointing to `/about`.
- `components/Footer.tsx`: add "About Us" as the first link in the existing "About" column.
- New translation keys `Header.aboutUs` and `Footer.aboutUs` in both `messages/en.json` and `messages/es.json` (nav label is translated like every other nav item; the about page body content itself stays English per the static-page convention above).

## Testing

- `app/[locale]/about/page.test.tsx`: render the page, assert on the H1, the CTA link's href, and that accepted insurance categories render — following the `careers`/`insurance` page test convention.
- Existing `Header.test.tsx` / `Footer.test.tsx` link-by-name assertions are unaffected by the new link (no count-based assertions to update).

## Out of scope

- No Spanish translation of the About page body copy (matches existing static-page convention).
- No new structured data file.
