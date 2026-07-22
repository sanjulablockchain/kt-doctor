# Add Camarillo location + 5 providers — design

Date: 2026-07-22

## Problem

Add the Camarillo clinic to the site as a 25th location, matching the live
page at `www.ktdoctor.com/locations/camarillo-pediatric-clinic/`, including
the 5 providers listed there.

- Address: 2486 Ponderosa Dr N, Suite D-211, Camarillo, CA 93010
- Phone: (818) 361-5437
- Office hours: Mon–Fri 9AM–6PM · Telehealth: Mon–Sun 9AM–8PM
- Providers: Jon D'Andrea (MD), Heidi Erickson (CPNP), Lynn Garcia-Galan (MD),
  Brianne Guevara (CPNP), Deborah Marlow-Mejia (MD)

## Key context — this reverses a recent, deliberate decision

Camarillo and these exact 5 providers were **intentionally removed on
2026-07-17** (see the comment block in `data/doctors.ts`, and the note in
`docs/superpowers/specs/2026-07-18-location-booking-button-design.md`).
Reason: Healow — the practice's live booking system, treated as the source
of truth in that refresh — has no record of the Camarillo facility or any of
its 5 providers. The removal was locked in with tests.

Per client direction (2026-07-22), Camarillo is being re-added **with** all 5
providers, as shown on the live location page. Because the location and its
providers are not in Healow, they have no per-facility / per-doctor booking
deep links and will fall back to the shared `BOOKING_URL`. The
"Healow-confirmed only" invariant is relaxed specifically for Camarillo, and
the tests that enforce it are updated accordingly.

No UI/component changes are required: the location detail page, doctor detail
page, and `DoctorCard` already fall back to `BOOKING_URL` when a
`bookingUrl` / `healowUrl` is absent, and render an initials avatar when
`photoSrc` is absent.

## Changes

### 1. `data/locations.ts` — new `camarillo` entry

```ts
{
  id: "camarillo",
  name: "Camarillo",
  address: "2486 Ponderosa Dr N, Suite D-211, Camarillo, CA 93010",
  phone: "(818) 361-5437",
  email: "camarillo@ktdoctor.com",   // {cityslug}@ktdoctor.com convention — UNCONFIRMED
  extension: "",                      // unknown (not in Healow) — UNCONFIRMED
  // no bookingUrl: no Healow facility page; UI falls back to shared BOOKING_URL
  lat: 34.2308,
  lng: -119.0507,                     // city-level approx (matches file convention note)
  description: "The highest quality of general pediatric care, with board-certified pediatricians using an integrated and evidence-based approach. Services include comprehensive newborn care, well-child exams, and physicals, with specializations in adolescent medicine, pediatric infectious disease, asthma, and allergies. Care is available seven days a week, with after-hours access through extended telehealth hours.",
  hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
  photos: ["/locations/camarillo/1.png", "/locations/camarillo/2.png", "/locations/camarillo/3.png"],
}
```

A comment above the entry records that Camarillo is not in Healow (hence no
`bookingUrl`), and that `email`/`extension` are unconfirmed guesses pending
client confirmation (following the existing La Mirada precedent).

Corrections / decisions:
- **Description** rewritten from the source text (which mistakenly said "at
  their **San Pedro** office") and trimmed to the house style of other
  entries.
- **Photos** downloaded from the live Camarillo page's 3 gallery images to
  `public/locations/camarillo/{1,2,3}.png` (per client direction 2026-07-22).
  They are real KTMG clinic-interior shots (reception with the Kids & Teens
  logo, waiting room, exam room). Note: the 2nd source file is named
  `Torrance-Office-2.png` on the live site (a reused/shared asset), but the
  image itself is a generic interior; kept as requested.
- **lat/lng** are a city-level approximation consistent with the file's
  standing note (flagged for Geocoding API refinement before production).
  Value stays inside the SoCal bounding box the test enforces
  (lat 33–35, lng −119.5…−117.5).

### 2. `data/doctors.ts` — 5 new providers

Added as a clearly-commented group documenting that they are re-added per the
2026-07-22 client decision and are **not** in Healow (no `healowUrl`):

| id                     | name                 | credentials |
|------------------------|----------------------|-------------|
| `jon-dandrea`          | Jon D'Andrea         | MD          |
| `heidi-erickson`       | Heidi Erickson       | CPNP        |
| `lynn-garcia-galan`    | Lynn Garcia-Galan    | MD          |
| `brianne-guevara`      | Brianne Guevara      | CPNP        |
| `deborah-marlow-mejia` | Deborah Marlow-Mejia | MD          |

Each: `specialties: ["Pediatrics"]`, `locationIds: ["camarillo"]`, no
`healowUrl`, no `photoSrc`, no `bio` (none exist on the live page). Their
"Book Online" buttons fall back to the shared `BOOKING_URL`; their cards show
an initials avatar.

Placement: if the doctors listing renders in array order, insert
alphabetically by first name to match the file's ordering; otherwise add as a
contiguous commented block. (Verified during implementation.)

### 3. Tests

`data/locations.test.ts`:
- `24 → 25` (`toHaveLength`, and the "24 real clinics" wording).
- Invert "does not include Camarillo" → assert `camarillo` **is** present with
  its address.
- Exempt `camarillo` from the "every clinic has a Healow booking URL" rule
  (same handling as `telehealth`).

`data/doctors.test.ts`:
- `56 → 61`.
- Relax "every doctor has a Healow provider link" to allow the Camarillo
  group (e.g. `healowUrl` present OR `locationIds` includes `camarillo`).
- Remove `Jon D'Andrea` from the "removed doctors" assertion (keep Peter
  Jackson, Rachel Barbour, Aziz Nourmand).
- Add an assertion that the 5 Camarillo providers exist and reference
  `camarillo`.

`app/[locale]/locations/page.test.tsx`:
- "Showing 24 of 24 locations" → "25 of 25".

### 4. Hardcoded "24 clinics" copy → "25" (EN + ES)

The auto-counted stat (`locations.length`), map, and "Showing X of Y" line
will show 25; these literal strings must match:
- `messages/en.json` + `messages/es.json` — homepage tagline.
- `data/faq.ts` — "24 clinic locations" and "across 24 locations" (both
  EN/ES pairs). The "89+ providers" figure is left as-is (rounded "+", not a
  literal count).
- `data/network.ts` — KTMG network description (EN/ES).
- `app/[locale]/locations/page.tsx` + `app/[locale]/doctors/page.tsx` —
  metadata descriptions.
- `components/NetworkCard.test.tsx` — the pinned network-description string.

### 5. `docs/locations-mymaps-import.csv`

Append a Camarillo row (name, address, phone, lat, lng) for parity with the
other physical clinics.

## Verification

- `npm test` (or the project's test runner) passes with the updated
  assertions.
- `npm run build` / typecheck passes (new static params for
  `/locations/camarillo` and the 5 `/doctors/<id>` pages generate).
- Spot-check that no other test pins the old counts (24 locations / 56
  doctors) beyond those listed above.

## Out of scope

- Any UI/component changes (none needed — fallbacks already exist).
- Obtaining real Healow facility / provider booking links, real photos, or
  the confirmed email/extension (all flagged for client follow-up).
- Refining lat/lng to street precision (deferred to the standing
  Geocoding-API refinement flagged for all locations).
