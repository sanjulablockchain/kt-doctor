# Testimonials Page — Design

## Purpose

Add a static "Testimonials" page to the site, modeled on the real
`www.ktdoctor.com/share-your-experience/` page: an intro inviting patient
feedback, plus a list of every clinic linking out to that clinic's Google
reviews. Linked from the Header "More" dropdown and the Footer "Patients"
column, like every other content page.

## Route

`app/[locale]/testimonials/page.tsx` — a server component following the same
pattern as `insurance/page.tsx` and `network/page.tsx`: hardcoded English
copy (site convention: static content pages are not translated per-locale,
only shared components like Header/Footer/Home are), `max-w-4xl` container,
`metadata` export for title/description.

No new `data/testimonials.ts` file — the clinic list is already the single
source of truth in `data/locations.ts`; the only new "data" is a URL builder
function, not content.

## Content structure

1. Eyebrow: "Testimonials & Reviews"
2. H1: "Share Your Experience"
3. Intro paragraph adapted from the real page's copy: general pediatrics
   practice, integrated approach to care, offices across Greater LA, and
   that patient feedback is always appreciated.
4. Section heading "Google Reviews" + a responsive grid
   (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, matching the density of
   other link grids like `NetworkCard`'s) of all 24 clinics from
   `data/locations.ts`. Each clinic name is a link (`target="_blank"`,
   `rel="noopener noreferrer"`) to a generated Google Maps search URL built
   from the clinic's name + address — no real per-location Google Business
   URLs exist in this repo, so this is a functional stand-in that opens the
   correct clinic's Maps listing (where its reviews live) rather than a dead
   or placeholder link.
5. Closing paragraph inviting the reader to read what others are saying and
   share their own feedback, echoing the real page's closing line.

No Yelp section — the real page's "Share Review Now" button links to a real
Yelp business page URL this repo doesn't have. Omitted rather than guessed;
easy to add once the real URL is available.

## Google Maps URL helper

A local helper in the page file, same pattern as the `toE164` helper already
duplicated in `Header.tsx`/`Footer.tsx`/`insurance/page.tsx`:

```ts
function googleReviewsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Kids & Teens Medical Group ${location.name} ${location.address}`
  )}`;
}
```

## Navigation changes

- `components/Header.tsx`: add a "Testimonials" link in the "More" dropdown,
  after "Blog", pointing to `/testimonials`.
- `components/Footer.tsx`: add "Testimonials" as the last link in the
  existing "Patients" column, after "Resources".
- New translation keys `Header.testimonials` and `Footer.testimonials` in
  both `messages/en.json` ("Testimonials") and `messages/es.json`
  ("Testimonios") — the nav label is translated like every other nav item;
  the page body content itself stays English per the static-page convention
  above.

## Testing

- `app/[locale]/testimonials/page.test.tsx`: render the page, assert on the
  H1, that all 23 clinic names render, and that a sample clinic's link
  `href` matches the expected `google.com/maps/search` shape — following the
  `network`/`insurance` page test convention.
- Existing `Header.test.tsx` / `Footer.test.tsx` link-by-name assertions are
  unaffected by the new link (no count-based assertions to update).

## Out of scope

- No Yelp reviews section (no real URL available yet).
- No Spanish translation of the Testimonials page body copy (matches
  existing static-page convention).
- No new structured data file — reuses `data/locations.ts`.
- No real per-location Google Business review URLs — generated Maps search
  links are a functional stand-in until the client provides the real ones.
