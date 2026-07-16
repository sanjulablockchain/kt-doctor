# Healow Doctor/Location Data Refresh — Design Spec

Date: 2026-07-17
Status: Approved

## Background

The `/doctors` page (`data/doctors.ts`, `data/locations.ts`, `components/DoctorCard.tsx`) was
built from a scrape of the old WordPress site (`ktdoctor.com`) per
[2026-07-15-doctors-locations-booking-core-design.md](2026-07-15-doctors-locations-booking-core-design.md).
That data has drifted from reality. The client pointed out, using the practice's real Healow
booking widget (`https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2`),
three concrete problems:

1. Every doctor card's "Book Online" CTA links to the same generic Healow URL, regardless of
   which doctor or location the card represents.
2. Some real doctors are missing from our roster entirely.
3. Some doctors' `locationIds` are wrong or incomplete.

Live investigation (via an authenticated browser session against the real Healow site) confirmed
all three and surfaced the underlying mechanism, summarized below.

## Findings

### Healow has a real per-doctor deep link

Every provider has a stable personal booking page:
`https://healow.com/apps/provider/<healow_uri>` (e.g.
`https://healow.com/apps/provider/fatemeh-anari-3156394`). The page is server-rendered HTML
(no client-side data fetch) and contains: bio ("About"), education, hospital affiliations,
accepted insurances, a canonical self-link labeled "healow URL", and tabs for every location that
doctor practices at. This is what "Book Online" should link to per doctor, instead of the
practice-wide search-results URL used today.

### Healow exposes clean internal JSON APIs (no HTML scraping needed for the roster)

Both are same-origin `POST` endpoints on `healow.com`, discovered by reading the page's own JS:

- `GetOAFacilitiesForPracticeBySpecialityOrProvider` — returns every facility for the practice.
  Confirmed the practice (`apu_id=328711`) has **29 facilities**, not 24/25 as in our current
  `data/locations.ts`:

  | id | name | id | name | id | name |
  |---|---|---|---|---|---|
  | 86 | Northridge UC | 82 | Van Nuys UC | 114 | Downey |
  | 74 | Northridge | 98 | Valencia | 132 | Downey UC |
  | 115 | Tarzana | 123 | Canyon Country | 121 | Whittier |
  | 125 | Mission Hills | 122 | Agoura Hills | 141 | San Pedro |
  | 75 | San Fernando | 77 | Beverly Hills | 134 | La Mirada |
  | 80 | West Hills | 130 | Santa Monica | 126 | Telehealth |
  | 79 | West Hills UC | 129 | Hollywood | 85 | Pasadena UC |
  | 81 | Van Nuys | 116 | Culver City | 73 | Pasadena |
  | | | 91 | Glendale | 97 | Torrance |
  | | | 76 | La Canada | 111 | Arcadia |
  | | | | | 103 | Pico Rivera |

- `GetOAProvidersForPracticeByLocation` (params: `apu_id`, `facility_id`, requires a CSRF header
  read from `<meta name="_csrf">`/`<meta name="_csrf_header">`) — returns every provider at a
  given facility: `fname`, `lname`, `degree`, `gender`, `oa_specialties`, `languages`,
  `accept_new_patients`, and critically `healow_uri` (the slug for the deep link above).

- Provider photo: `https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=<npi>` —
  confirmed to return a real `image/png`. As with the existing data (see the comment at the top
  of the current `data/doctors.ts`), some providers only have a generic placeholder silhouette
  here rather than a real headshot; the refresh must detect and skip those the same way the
  current data already does (by content, e.g. matching file size/hash against known generic
  placeholders), not add a fake-specific photo.

### "UC" (Urgent Care) facilities are real, separate locations with separate rosters

Confirmed by direct comparison: **Northridge** (facility 74) has 7 providers (Fatemeh Anari,
Banpreet Samra, Palak Shelat, Christine Sapinoso, Hilma Benjamin, Brian Bhatt, Lisa Tan).
**Northridge UC** (facility 86) has exactly 1 provider (Amrita Dosanjh) — not a subset or
duplicate of the base clinic's roster. The same pattern exists for West Hills UC, Van Nuys UC,
Downey UC, and Pasadena UC. This is the concrete mechanism behind the client's "Amrita Dosanjh
location is wrong" observation: our data has her at `west-hills` only; Healow shows her at
Northridge UC, a location that doesn't exist at all in our current `data/locations.ts`.

### Camarillo is not in Healow's facility list

Our current data has a `camarillo` location with 5 doctors (Jon D'Andrea, Lynn Garcia-Galan,
Deborah Marlow-Mejia, Brianne Guevara, Heidi Erickson). It does not appear anywhere in the
practice's 29-facility list. Per client decision: **keep it**, flagged as unconfirmed (it may not
be live in this Healow instance yet, may be under a different practice ID, or may need a
phone-only booking path) rather than deleting real content on the strength of one missing
dropdown entry.

## Goals

- Replace the single site-wide `BOOKING_URL` on every `DoctorCard` with each doctor's real Healow
  provider deep link, where one was found during the refresh.
- Add the 5 confirmed UC facilities as their own `Location` entries (not merged into their base
  clinic), since they have independently staffed, independently bookable rosters.
- Re-pull the full doctor roster from Healow's 29 facilities (a full re-scrape, not a targeted
  patch, per client decision) — add missing doctors, correct `locationIds`, refresh bios/photos
  from the current live data.
- Preserve doctors/locations not confirmed in Healow (Camarillo) rather than silently deleting
  them; flag explicitly instead.

## Out of scope

- Changing the location-level "Book Online" behavior (site header/footer/location cards)
  beyond what's needed for the doctor-level fix — those keep the shared `BOOKING_URL` constant.
- Any change to `ktdoctor.com` itself, or to the Healow/eClinicalWorks systems.
- Insurance-plan display, visit-reason selection, or any other booking-widget feature beyond
  linking to the right page.
- Camarillo's true status (live clinic vs. stale data) — flagged for the client to confirm, not
  resolved here.

## Data model changes

`lib/types.ts`:

```ts
export type Doctor = {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  locationIds: string[];
  bio?: string;
  photoSrc?: string;
  healowUrl?: string; // NEW — per-doctor Healow provider deep link, when confirmed live
};
```

`Location` is unchanged in shape; 5 new entries are added (`northridge-uc`, `west-hills-uc`,
`van-nuys-uc`, `downey-uc`, `pasadena-uc`), each following the existing `Location` shape (address
determined from Healow's facility data during implementation — may be identical to or distinct
from the base clinic's address; confirm per-facility during the pull rather than assuming).

## Behavior changes

`components/DoctorCard.tsx`: the "Book Online" link uses `doctor.healowUrl` when present, and
falls back to the existing shared `BOOKING_URL` constant otherwise (covers Camarillo doctors and
any doctor the refresh couldn't confirm against Healow).

## Data collection approach

Pulled directly from the live Healow site (already have an authenticated session, no separate
tooling needed):

1. Call `GetOAFacilitiesForPracticeBySpecialityOrProvider` once → confirm the 29 facilities
   (already captured above).
2. Call `GetOAProvidersForPracticeByLocation` once per facility ID (29 calls) → build the full
   current roster with `locationIds` derived directly from which facilities each `healow_uri`
   appears under (a doctor appearing under 3 facility IDs gets all 3 in `locationIds`).
3. For each unique provider surfaced, fetch `/apps/provider/<healow_uri>` (plain HTML GET, no
   browser rendering needed since it's server-rendered) → extract bio, education, and confirm the
   canonical `healowUrl`.
4. For each unique provider, fetch the photo endpoint → keep it only if it isn't a known generic
   placeholder (compare against the placeholder file(s) already identified in the current data).
5. Diff the result against current `data/doctors.ts` / `data/locations.ts`:
   - Doctors found in Healow but missing from our data → add.
   - Doctors present in both but with different `locationIds` → correct.
   - Doctors in our data but not found anywhere in Healow's 29 facilities → **keep**, do not
     silently delete (matches the Camarillo precedent) — flag in a code comment for client
     confirmation, same pattern the existing data file already uses.
   - Bios/photos → refresh from the live pull for every doctor Healow has data for.

## Known gaps / risks to track

- Camarillo (5 doctors) unconfirmed against Healow — flagged in-line, not resolved.
- UC facility addresses need to be captured per-facility during implementation (not assumed equal
  to the base clinic's address).
- `accept_new_patients` field semantics in the JSON response weren't fully verified against the
  UI's "Accepting New Patients" badge during investigation — worth a quick sanity check during
  implementation before using it for anything user-facing.
- Photo placeholder detection relies on matching known generic images by size/content, the same
  approach the current data file already uses — not foolproof if Healow adds new generic
  placeholder variants.

## Next steps

1. Write an implementation plan (writing-plans skill).
2. Execute the data pull and rebuild `data/doctors.ts` / `data/locations.ts` per the approach
   above.
3. Update `lib/types.ts` and `components/DoctorCard.tsx` for the new `healowUrl` field/behavior.
4. Manual verification: spot-check several doctor cards' "Book Online" links resolve to the
   correct individual Healow provider page, and that the new UC locations render correctly on
   `/locations`.
