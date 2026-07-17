# Location "Book Appointment Now" button — design

Date: 2026-07-18

## Problem

Each location detail page (`/locations/<slug>`) should have a prominent
**Book Appointment Now** button that deep-links Healow to that specific
clinic — matching the button on every location page of the live site
(`www.ktdoctor.com/locations/<slug>/`).

## Key finding (corrects a prior assumption)

The current location page carries this comment:

> Booking is per-provider: Healow has no per-clinic deep link (its practice
> URL always lands on the same default location), so we route patients
> straight to the booking page of a provider who actually practices here.

**This is wrong.** The live site's **BOOK APPOINTMENT NOW** button uses a
per-facility deep link of the form:

```
https://healow.com/apps/practice/...-25634?v=2&t=2&f=<FACILITY_CODE>
```

The `f=` code is distinct per clinic and lands Healow on the correct
facility. Confirmed on two pages:

- Agoura Hills → `f=8mqPBWAOD8V9GrMn`
- Downey       → `f=gLZ6qokap9VB7rEl`

So a real per-location booking button is achievable. The outdated comment
will be corrected as part of this work.

## Approach

1. **Harvest** the `BOOK APPOINTMENT NOW` href from all live location pages,
   extracting the `f=` code and mapping each real-site slug to our codebase
   location `id`.
2. **Store** the full booking URL on each `Location` as `bookingUrl`
   (mirrors how `Doctor` already stores a full `healowUrl`, per repo
   convention of keeping explicit scraped values in the data files).
3. **Render** a primary "Book Appointment Now" CTA on each location page,
   with the existing per-provider grid kept below as a secondary path.

## Data model

Add one optional field to the `Location` type in `lib/types.ts`:

```ts
bookingUrl?: string; // per-facility Healow deep link (f= code); harvested
                     // from the live location page's "Book Appointment Now"
```

Optional (not required) because the virtual **Telehealth** location has no
physical facility page on the live site and therefore no `f=` code — it
falls back to the global `BOOKING_URL`.

### Slug mapping (codebase `id` → live-site slug)

| id            | live slug                                             |
|---------------|-------------------------------------------------------|
| agoura-hills  | agoura-hills-pediatrician                             |
| arcadia       | arcadia-clinic                                        |
| beverly-hills | beverly-hills-clinic                                  |
| canyon-country| canyon-country-pediatric-clinic                       |
| culver-city   | culver-city-pediatric-clinic                          |
| downey        | downey                                                |
| glendale      | glendale-pediatric-clinic                             |
| hollywood     | hollywood-clinic                                      |
| la-canada     | la-canada-flintridge                                  |
| mission-hills | mission-hills                                         |
| northridge    | northridge                                            |
| pasadena      | pasadena                                              |
| pico-rivera   | pico-rivera-pediatric-clinic                          |
| san-fernando  | san-fernando-pediatric-clinic                         |
| santa-monica  | santa-monica-pediatric-clinic                         |
| san-pedro     | san-pedro-pediatric-clinic                            |
| tarzana       | tarzana-pediatric-clinic                              |
| torrance      | torrance-pediatric-clinic                             |
| valencia      | valencia-pediatric-clinic                             |
| van-nuys      | van-nuys-pediatric-clinic                             |
| west-hills    | west-hills-pediatric-clinic                           |
| whittier      | whittier-pediatric-clinic-whitter-telehealth-kidsandteens |
| la-mirada     | la-mirada                                             |
| telehealth    | (none — no facility page; falls back to BOOKING_URL)  |

Camarillo exists on the live site but was intentionally removed from the
codebase earlier; it is skipped.

## UI

On the location detail page, directly below the phone number and above the
photo grid, render a primary CTA button:

- Label: **Book Appointment Now** (with a right-arrow, matching the site).
- Style: reuse the existing pill button —
  `rounded-full bg-teal px-7 py-3.5 font-display font-semibold text-white
  shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark`.
- `href`: `location.bookingUrl ?? BOOKING_URL`, opened in a new tab
  (`target="_blank" rel="noopener noreferrer"`).

The existing per-provider booking grid stays, kept below as a secondary
option. Its intro heading softens from "Book with a provider at this
location" to a secondary-path framing (e.g. "Prefer a specific provider?").
The old empty-state fallback button (shown only when a location had no
providers) is removed — the new primary CTA covers that case for every
location.

The page uses hardcoded English strings today (it is not wired through
next-intl), so the new label is a hardcoded string, consistent with the
rest of the page.

## Testing

Extend `app/[locale]/locations/[slug]/page.test.tsx`:

- The primary "Book Appointment Now" button renders on a location page and
  its `href` equals that location's `bookingUrl`.
- For the telehealth location (no `bookingUrl`), the button falls back to
  `BOOKING_URL`.
- The per-provider grid still renders for a location that has providers.

Add a data-integrity assertion in `data/locations.test.ts`:

- Every non-telehealth location has a `bookingUrl` matching the Healow
  facility-link shape (`…-25634?v=2&t=2&f=…`).

## Out of scope

- Changing the global `BOOKING_URL`, provider `healowUrl`s, or the
  locations list page.
- Re-verifying addresses/hours/providers (covered by prior work).
