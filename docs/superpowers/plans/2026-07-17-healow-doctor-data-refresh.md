# Healow Doctor/Location Data Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every doctor card a real per-doctor Healow booking link (instead of the shared practice-wide URL), and correct the doctor/location roster against the practice's live Healow booking system — add doctors Healow confirms that we're missing, fix wrong `locationIds`, and add the one new physical-address-free "Telehealth" pseudo-location Healow's data revealed.

**Architecture:** No new pages or major components — this is a targeted data refresh (`data/doctors.ts`, `data/locations.ts`) plus two small, additive changes: a new optional `healowUrl` field on `Doctor` (consumed by `DoctorCard`'s existing "Book Online" link with a fallback to the current shared `BOOKING_URL`), and optional `lat`/`lng` on `Location` (so a non-physical "Telehealth" entry can exist without a map pin).

**Tech Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, Vitest + React Testing Library — all existing, no new dependencies.

## Global Constraints

- All data changes must be traceable to the live pull already captured in
  `docs/superpowers/specs/2026-07-17-healow-doctor-data-refresh-design.md` — do not invent or
  guess data.
- Never silently delete a doctor or location that isn't confirmed in Healow — keep it, and make
  sure it falls back to the shared `BOOKING_URL` (no `healowUrl`) rather than breaking.
- Follow the existing one-line-per-doctor object-literal formatting already used in
  `data/doctors.ts` — do not reformat unrelated lines.
- Every task ends with tests passing (`npm test`) before moving to the next task.

---

### Task 1: Add `healowUrl` to `Doctor`, optional `lat`/`lng` to `Location`

**Files:**
- Modify: `lib/types.ts`
- Test: `lib/types.test.ts` (create — this file doesn't exist yet; a plain compile-time/shape check)

**Interfaces:**
- Produces: `Doctor.healowUrl?: string`, `Location.lat?: number`, `Location.lng?: number` —
  consumed by Task 2 (`DoctorCard`), Task 3 (`data/locations.ts`, `LocationsMap`), Task 4
  (`data/doctors.ts`).

- [ ] **Step 1: Write the failing test**

Create `lib/types.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import type { Doctor, Location } from "./types";

describe("Doctor type", () => {
  it("allows a doctor without healowUrl (backward compatible)", () => {
    const doc: Doctor = { id: "a", name: "A", credentials: "MD", specialties: [], locationIds: [] };
    expect(doc.healowUrl).toBeUndefined();
  });

  it("allows a doctor with healowUrl", () => {
    const doc: Doctor = {
      id: "a", name: "A", credentials: "MD", specialties: [], locationIds: [],
      healowUrl: "https://healow.com/apps/provider/a-123",
    };
    expect(doc.healowUrl).toBe("https://healow.com/apps/provider/a-123");
  });
});

describe("Location type", () => {
  it("allows a location without lat/lng (non-physical, e.g. telehealth)", () => {
    const loc: Location = {
      id: "telehealth", name: "Telehealth", address: "Video visits only — no physical address",
      phone: "", email: "", extension: "", description: "d",
      hours: { officeHours: "", telehealthHours: "" }, photos: [],
    };
    expect(loc.lat).toBeUndefined();
    expect(loc.lng).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- lib/types.test.ts
```

Expected: FAIL — TypeScript error, `lat`/`lng` are required on `Location`, and `healowUrl` doesn't
exist on `Doctor`.

- [ ] **Step 3: Update the types**

Modify `lib/types.ts` (full new contents):

```ts
export type LocationHours = {
  officeHours: string;
  telehealthHours: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  extension: string;
  lat?: number;
  lng?: number;
  description: string;
  hours: LocationHours;
  photos: string[];
};

export type Doctor = {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  locationIds: string[];
  bio?: string;
  photoSrc?: string;
  healowUrl?: string;
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- lib/types.test.ts
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/types.test.ts
git commit -m "feat: add optional healowUrl to Doctor and optional lat/lng to Location"
```

---

### Task 2: `DoctorCard` uses `healowUrl` when present, falls back to `BOOKING_URL`

**Files:**
- Modify: `components/DoctorCard.tsx`
- Modify: `components/DoctorCard.test.tsx`

**Interfaces:**
- Consumes: `Doctor.healowUrl` (Task 1), `BOOKING_URL` (`lib/constants.ts`, unchanged)
- Produces: no new exports — behavior change only, consumed by `DoctorsPageContent` (unchanged)
  and `app/[locale]/doctors/[slug]/page.tsx` if it also renders a booking link (check that file
  during this task; if it renders its own booking link independent of `DoctorCard`, apply the same
  fallback logic there too).

- [ ] **Step 1: Write the failing test**

Add this test to `components/DoctorCard.test.tsx` (keep the existing test in the file, add this
one below it):

```tsx
it("uses the doctor's own healowUrl when present, instead of the shared booking link", () => {
  render(
    <DoctorCard
      doctor={{
        id: "martin-fineberg",
        name: "Martin Fineberg",
        credentials: "MD, FAAP",
        specialties: ["Pediatrics"],
        locationIds: ["beverly-hills"],
        healowUrl: "https://healow.com/apps/provider/martin-fineberg-3161325",
      }}
      locationNames={["Beverly Hills"]}
    />
  );

  const bookLink = screen.getByRole("link", { name: /book online/i });
  expect(bookLink).toHaveAttribute(
    "href",
    "https://healow.com/apps/provider/martin-fineberg-3161325"
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/DoctorCard.test.tsx
```

Expected: FAIL — the link still points to the shared `BOOKING_URL`, not the doctor's `healowUrl`.

- [ ] **Step 3: Update `DoctorCard`**

In `components/DoctorCard.tsx`, change the `<a href={BOOKING_URL} ...>` line to:

```tsx
      <a
        href={doctor.healowUrl ?? BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
      >
        Book Online
      </a>
```

(Only the `href` line changes — everything else in the file stays the same.)

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/DoctorCard.test.tsx
```

Expected: PASS, 2 tests (the original test still passes because `doctor.healowUrl` is `undefined`
in that test's fixture, so it falls back to `BOOKING_URL` exactly as before).

- [ ] **Step 5: Check the doctor detail page for a duplicate booking link**

Read `app/[locale]/doctors/[slug]/page.tsx`. If it renders its own "Book Online"/"Book
Appointment" link directly (not through `DoctorCard`), apply the same
`doctor.healowUrl ?? BOOKING_URL` pattern there, and add an equivalent test case to that page's
test file mirroring Step 1. If it only ever renders via `DoctorCard`, no change is needed here —
note that finding in the commit message.

- [ ] **Step 6: Run the full test suite**

```bash
npm test
```

Expected: all existing tests still PASS.

- [ ] **Step 7: Commit**

```bash
git add components/DoctorCard.tsx components/DoctorCard.test.tsx
git commit -m "feat: prefer doctor's own Healow provider link over the shared booking URL"
```

---

### Task 3: Add the "Telehealth" pseudo-location and make the map skip it safely

**Files:**
- Modify: `data/locations.ts`
- Modify: `data/locations.test.ts`
- Modify: `components/LocationsMap.tsx`

**Interfaces:**
- Consumes: `Location.lat?`, `Location.lng?` (Task 1)
- Produces: a `locations` entry with `id: "telehealth"`, consumed by Task 4's `data/doctors.ts`
  (Trish Reyes references `locationIds: ["telehealth"]`).

- [ ] **Step 1: Update the failing assertions in `data/locations.test.ts`**

Change the count assertion (currently expects exactly 24) and the bounding-box test (which must
skip locations without lat/lng) and the description/hours test (Telehealth needs both, same as
every other location). Replace the whole file with:

```ts
import { describe, it, expect } from "vitest";
import { locations } from "./locations";

describe("locations data", () => {
  it("has exactly 25 real clinics plus the telehealth pseudo-location", () => {
    expect(locations).toHaveLength(25);
  });

  it("every location has a unique id", () => {
    const ids = locations.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every physical location has valid lat/lng within the Southern California bounding box", () => {
    for (const loc of locations) {
      if (loc.lat === undefined && loc.lng === undefined) continue; // telehealth has no address
      expect(loc.lat).toBeGreaterThan(33.0);
      expect(loc.lat).toBeLessThan(35.0);
      expect(loc.lng).toBeGreaterThan(-119.5);
      expect(loc.lng).toBeLessThan(-117.5);
    }
  });

  it("includes Pasadena with its real address and extension", () => {
    const pasadena = locations.find((l) => l.id === "pasadena");
    expect(pasadena).toBeDefined();
    expect(pasadena?.address).toBe("504 S Sierra Madre Blvd, Pasadena, CA 91107");
    expect(pasadena?.email).toBe("pasadena@ktdoctor.com");
    expect(pasadena?.extension).toBe("118");
  });

  it("includes the real Hollywood clinic in place of the old unconfirmed west-la placeholder", () => {
    expect(locations.find((l) => l.id === "west-la")).toBeUndefined();
    const hollywood = locations.find((l) => l.id === "hollywood");
    expect(hollywood).toBeDefined();
    expect(hollywood?.address).toBe("5255 W Sunset Blvd, Los Angeles, CA 90027");
  });

  it("every location has a description and office/telehealth hours", () => {
    for (const loc of locations) {
      expect(loc.description.length).toBeGreaterThan(0);
      expect(loc.hours.officeHours.length).toBeGreaterThan(0);
      expect(loc.hours.telehealthHours.length).toBeGreaterThan(0);
    }
  });

  it("every location photo points to a locally downloaded file under /locations/", () => {
    for (const loc of locations) {
      for (const photo of loc.photos) {
        expect(photo).toMatch(new RegExp(`^/locations/${loc.id}/`));
      }
    }
  });

  it("the telehealth pseudo-location has no lat/lng (not a physical clinic)", () => {
    const telehealth = locations.find((l) => l.id === "telehealth");
    expect(telehealth).toBeDefined();
    expect(telehealth?.lat).toBeUndefined();
    expect(telehealth?.lng).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/locations.test.ts
```

Expected: FAIL — `locations` still has 24 entries and no `telehealth` id.

- [ ] **Step 3: Add the Telehealth entry to `data/locations.ts`**

Add this object as the last entry in the `locations` array (right before the closing `];`, after
the existing `la-mirada` entry):

```ts
  {
    id: "telehealth",
    name: "Telehealth",
    address: "Video visits only — no physical address",
    phone: "(818) 361-5437",
    email: "customerservice@ktdoctor.com",
    extension: "",
    description:
      "Video visits with select Kids & Teens Medical Group providers, for patients who prefer or need a remote appointment instead of an in-person clinic visit.",
    hours: { officeHours: "By appointment", telehealthHours: "Monday-Sunday, 9AM-8PM" },
    photos: [],
  },
```

Also add a one-line comment above the `locations` array (directly under the existing top-of-file
comment block) noting why this entry exists:

```ts
// "telehealth" (added 2026-07-17) is not a physical clinic — Healow's live booking system
// confirmed one provider (Trish Reyes) is telehealth-only with no in-person clinic. It
// intentionally has no lat/lng so LocationsMap skips it instead of plotting a fake pin.
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/locations.test.ts
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Make `LocationsMap` skip locations without lat/lng**

Modify `components/LocationsMap.tsx` — change the marker-rendering line so it filters first:

```tsx
      {locations
        .filter((loc): loc is typeof loc & { lat: number; lng: number } => loc.lat !== undefined && loc.lng !== undefined)
        .map((loc) => (
          <MarkerF key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
        ))}
```

- [ ] **Step 6: Add a test for the skip behavior**

Add this test to `components/LocationsMap.test.tsx` (keep the existing test, add this one below
it):

```tsx
it("skips locations without lat/lng instead of crashing", () => {
  render(
    <LocationsMap
      locations={[
        { id: "a", name: "Alpha", address: "1 A St", phone: "1", email: "a@x.com", extension: "1", lat: 34, lng: -118, description: "d", hours: { officeHours: "h", telehealthHours: "h" }, photos: [] },
        { id: "telehealth", name: "Telehealth", address: "Video visits only", phone: "", email: "", extension: "", description: "d", hours: { officeHours: "h", telehealthHours: "h" }, photos: [] },
      ]}
    />
  );

  const markers = screen.getAllByTestId("marker");
  expect(markers).toHaveLength(1);
  expect(screen.getByText("Alpha")).toBeInTheDocument();
  expect(screen.queryByText("Telehealth")).not.toBeInTheDocument();
});
```

- [ ] **Step 7: Run the test to verify it passes**

```bash
npm test -- components/LocationsMap.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 8: Run the full test suite**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 9: Commit**

```bash
git add data/locations.ts data/locations.test.ts components/LocationsMap.tsx components/LocationsMap.test.tsx
git commit -m "feat: add non-physical Telehealth location, skip it safely on the map"
```

---

### Task 4: Rebuild `data/doctors.ts` from the live Healow pull

**Files:**
- Modify: `data/doctors.ts`
- Modify: `data/doctors.test.ts`
- Modify: `lib/filters.test.ts`

**Interfaces:**
- Consumes: `Doctor` type with `healowUrl` (Task 1), `telehealth` location id (Task 3)
- Produces: the corrected `doctors` array — no downstream interface changes, `DoctorsPageContent`
  and `DoctorCard` already consume `doctors` as before.

This task applies the full reconciliation captured in
`docs/superpowers/specs/2026-07-17-healow-doctor-data-refresh-design.md`:
41 doctors get a `healowUrl`, 18 of those also get corrected `locationIds`, and 15 real doctors
that were missing get added (7 of them also get a real downloaded photo).

- [ ] **Step 1: Update the two existing tests that hardcode data this refresh changes**

In `data/doctors.test.ts`, Martin Fineberg's `locationIds` assertion currently expects his old
(incorrect) 7-location set. Healow's live booking system only shows him bookable at 2 of those.
Replace that test:

```ts
  it("includes a doctor who practices at multiple locations, matching the live Healow roster", () => {
    const fineberg = doctors.find((d) => d.name === "Martin Fineberg");
    expect(fineberg).toBeDefined();
    expect(fineberg?.locationIds.sort()).toEqual(
      ["beverly-hills", "torrance"].sort()
    );
  });
```

In `lib/filters.test.ts`, the "combines locationId and search filters" test uses Martin
Fineberg + Pasadena, but he's no longer at Pasadena after this refresh. Replace it with a doctor
who genuinely is at Pasadena post-refresh (Barbara Rodriguez, now Pasadena-only):

```ts
  it("combines locationId and search filters", () => {
    const result = filterDoctors(doctors, { locationId: "pasadena", search: "rodriguez" });
    expect(result.map((d) => d.name)).toEqual(["Barbara Rodriguez"]);
  });
```

- [ ] **Step 2: Add new assertions for this refresh's key facts**

Add these tests to `data/doctors.test.ts` (append to the existing `describe` block):

```ts
  it("gives doctors confirmed in Healow a real per-doctor booking link", () => {
    const fineberg = doctors.find((d) => d.name === "Martin Fineberg");
    expect(fineberg?.healowUrl).toBe("https://healow.com/apps/provider/martin-fineberg-3161325");
  });

  it("does not invent a healowUrl for doctors Healow doesn't confirm", () => {
    const camarillo = doctors.find((d) => d.name === "Jon D'Andrea");
    expect(camarillo?.healowUrl).toBeUndefined();
  });

  it("includes doctors added by the 2026-07-17 Healow refresh", () => {
    const sapinoso = doctors.find((d) => d.name === "Christine Sapinoso");
    expect(sapinoso).toBeDefined();
    expect(sapinoso?.locationIds).toEqual(["northridge"]);
  });

  it("corrects Amrita Dosanjh's locations to match her live Healow roster", () => {
    const dosanjh = doctors.find((d) => d.name === "Amrita Dosanjh");
    expect(dosanjh).toBeDefined();
    expect(dosanjh?.locationIds.sort()).toEqual(
      ["west-hills", "northridge", "agoura-hills"].sort()
    );
  });

  it("re-adds providers previously (incorrectly) dropped, now confirmed active via Healow", () => {
    for (const name of ["Delaram Halavi", "Yeongbu Kim", "Ernestine Njie", "Alea Sohn"]) {
      expect(doctors.find((d) => d.name === name)).toBeDefined();
    }
  });
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
npm test -- data/doctors.test.ts lib/filters.test.ts
```

Expected: FAIL — current data doesn't match any of the new assertions yet.

- [ ] **Step 4: Replace the full contents of `data/doctors.ts`**

Replace the entire file with:

```ts
import type { Doctor } from "@/lib/types";

// Rebuilt from a scrape of the real, individual location pages at
// www.ktdoctor.com/locations/<slug>/ ("Meet Our Providers" sections), which
// carry full bios and headshots that the old /our-doctors/ directory page
// does not. Specialty data still does not exist on the real site beyond
// general pediatrics, so every doctor is hardcoded as ["Pediatrics"].
//
// Compared to the previous version of this file, the following providers
// were dropped because they no longer appeared on any real location page
// at the time (Michels Savannah, Patino Cecilia, Anwar Arastu, Vaseema
// Arastu, Hantman David — still unconfirmed as of the 2026-07-17 refresh
// below), and ~40 real providers were added that the old file was missing
// entirely. photoSrc is omitted for providers whose real site only shows a
// generic site-wide placeholder headshot ("Craig.png",
// "doctor-avatar-male.png", "doctor-avatar-female.png") — those fall back
// to the initials avatar in the UI instead of a fake-specific photo.
//
// --- 2026-07-17 refresh against the practice's live Healow booking system ---
// (see docs/superpowers/specs/2026-07-17-healow-doctor-data-refresh-design.md)
//
// Source: Healow's internal JSON APIs for the practice (apu_id=328711),
// enumerated across all 29 real facilities (including 5 "UC"/urgent-care
// facilities, which share the exact same street address as their base
// clinic and were folded into that clinic's locationIds rather than kept
// as separate locations).
//
// - `healowUrl` added for every doctor Healow confirmed (41 of the doctors
//   already in this file) — this is each doctor's real, stable Healow
//   provider page and should be used as their "Book Online" link instead of
//   the shared BOOKING_URL constant.
// - `locationIds` corrected for 18 doctors where Healow's live roster
//   disagreed with this file (in both directions — some doctors had
//   locations added, e.g. Amrita Dosanjh; some had stale/incorrect locations
//   removed, e.g. Martin Fineberg no longer shows as bookable at 5 of his 7
//   previously-listed clinics). Healow's live booking roster was treated as
//   the more current source of truth per client direction.
// - 15 real doctors were added that this file was missing, including 4 who
//   were previously dropped from this file (Delaram Halavi, Yeongbu Kim,
//   Ernestine Njie, Alea Sohn) but are confirmed still active via Healow —
//   the earlier removal of those 4 specifically was incorrect.
// - Healow's own bio text was found to be unreliable for many providers —
//   either "No Info Available" or, in at least two confirmed cases
//   (Hilma Benjamin's and Jose Vargas's Healow pages), bio text that
//   describes a completely different named person. Existing bios in this
//   file were therefore left untouched rather than overwritten; only the 2
//   new doctors above with a Healow bio that actually named the correct
//   person got one (Trish Reyes). Flag to the client: Healow's own
//   provider-bio data has a data-quality problem worth reporting upstream.
// - Doctors NOT found anywhere in Healow's 29 facilities (49 doctors,
//   including all 5 Camarillo-only doctors) were kept as-is, not deleted —
//   Camarillo itself doesn't appear in Healow's facility list either. These
//   doctors' "Book Online" CTA falls back to the shared BOOKING_URL since
//   they have no confirmed healowUrl. This is a real gap to raise with the
//   client: either these clinics/doctors are stale, or they're booked
//   through a channel this refresh didn't find.
export const doctors: Doctor[] = [
  { id: "adrienne-altman", name: "Adrienne C. Altman", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["valencia"], healowUrl: "https://healow.com/apps/provider/adrienne-altman-3156393", bio: "Grew up in Pennsylvania and New York. Undergraduate at Cornell University; medical school at SUNY Syracuse. Completed pediatric residency and a Pediatric Hematology/Oncology fellowship at UCLA before joining Dr. Greenwald in Valencia. Enjoys dressage riding.", photoSrc: "/doctors/adrienne-altman.png" },
  { id: "ahoo-sahba", name: "Ahoo Sahba", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["van-nuys"], healowUrl: "https://healow.com/apps/provider/ahoo-sahba-3161338", photoSrc: "/doctors/ahoo-sahba.png" },
  { id: "amrita-dosanjh", name: "Amrita Dosanjh", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["west-hills", "northridge", "agoura-hills"], healowUrl: "https://healow.com/apps/provider/amrita-dosanjh-3161324", photoSrc: "/doctors/amrita-dosanjh.png" },
  { id: "amy-wagner", name: "Amy Wagner", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge"], bio: "Compassionate pediatrician with over eight years of experience. Earned her MD from Wake Forest University School of Medicine and completed her pediatric internship and residency at Children's Hospital of Orange County. Enjoys spending time with her two children, playing poker, watching movies, reading, jogging, and playing guitar.", photoSrc: "/doctors/amy-wagner.webp" },
  { id: "ashlie-tam", name: "Ashlie Tam", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["arcadia", "la-canada", "pasadena"], bio: "Grew up on Long Island, New York. Earned a bachelor's in kinesiology and exercise science and a master's in nutrition from the University at Buffalo, then her Doctor of Osteopathic Medicine from NYIT College of Osteopathic Medicine. Completed her pediatrics residency at Sinai Hospital of Baltimore. Strives to provide personalized, holistic care that helps her patients thrive.", photoSrc: "/doctors/ashlie-tam.webp" },
  { id: "azam-jazayeri", name: "Azam Jazayeri", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["culver-city"], healowUrl: "https://healow.com/apps/provider/azam-jazayeri-3161350", photoSrc: "/doctors/azam-jazayeri.webp" },
  { id: "aziz-nourmand", name: "Aziz Nourmand", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["santa-monica"], photoSrc: "/doctors/aziz-nourmand.png" },
  { id: "banpreet-samra", name: "Banpreet Samra", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["northridge", "west-hills", "tarzana"], healowUrl: "https://healow.com/apps/provider/banpreet-samra-3672038" },
  { id: "barbara-rodriguez", name: "Barbara Rodriguez", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["pasadena"], healowUrl: "https://healow.com/apps/provider/barbara-rodriguez-3161337", bio: "Joined Kids & Teens Medical Group in 1989 and now serves as Co-Medical Director, with over 30 years of pediatric experience. A native Angeleno, she earned her degree in Biological Sciences from USC and her medical degree from Creighton University, completing her pediatric internship and residency at LAC+USC Medical Center. Bilingual in English and Spanish, she volunteers as an Assistant Clinical Professor for UCLA School of Nursing. Outside work she enjoys soccer, scuba diving, cooking, and family time.", photoSrc: "/doctors/barbara-rodriguez.webp" },
  { id: "benjamin-behroozan", name: "Benjamin Behroozan", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["hollywood", "santa-monica"], healowUrl: "https://healow.com/apps/provider/benjamin-behroozan-3350334", photoSrc: "/doctors/benjamin-behroozan.jpg" },
  { id: "beth-melin-perel", name: "Beth Melin-Perel", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["agoura-hills"], bio: "Brings extensive experience in general pediatrics and child development. Earned her bachelor's degree summa cum laude in biology from Washington University in St. Louis on a National Merit scholarship, attended the University of Arkansas Medical School on a full scholarship, and completed her pediatric residency at St. Christopher's Hospital for Children in Philadelphia. She has taught at Yale University and volunteers at the Westminster Free Clinic in Thousand Oaks. Enjoys gardening, movies, and healthy cooking.", photoSrc: "/doctors/beth-melin-perel.webp" },
  { id: "brian-bhatt", name: "Brian Bhatt", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "west-hills", "valencia"], healowUrl: "https://healow.com/apps/provider/brian-bhatt-3156398", bio: "Earned his Bachelor's in Biological Sciences from the University of Connecticut and his MD from St. George's University School of Medicine, then completed a three-year pediatric residency at NYU Langone Long Island Hospital. Fluent in English and Gujarati. Outside medicine he enjoys cooking, tennis, the beach, collecting vintage watches, and Marvel movie nights with family.", photoSrc: "/doctors/brian-bhatt.png" },
  { id: "carolina-ungs", name: "Carolina Ungs", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "downey"], healowUrl: "https://healow.com/apps/provider/carolina-ungs-3161341", photoSrc: "/doctors/carolina-ungs.webp" },
  { id: "carolyn-czaplicki", name: "Carolyn Czaplicki", credentials: "DO", specialties: ["Pediatrics"], locationIds: ["san-pedro"], healowUrl: "https://healow.com/apps/provider/carolyn-czaplicki-4048106", photoSrc: "/doctors/carolyn-czaplicki.png" },
  { id: "casie-mcguire", name: "Casie McGuire", credentials: "FNP-C", specialties: ["Pediatrics"], locationIds: ["valencia", "canyon-country"], healowUrl: "https://healow.com/apps/provider/casie-mcguire-3654055", photoSrc: "/doctors/casie-mcguire.png" },
  { id: "cheyanne-punsal", name: "Cheyanne Punsal", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["northridge"], bio: "Earned her BS in Nursing from California State University, Los Angeles. Started at Children's Hospital Los Angeles in 2013 through the Versant residency program, also working in Kaiser Permanente's inpatient and outpatient pediatrics units and as a clinical instructor at Mount Saint Mary's University. Earned her master's from Cal State Long Beach to become a Pediatric Nurse Practitioner. Enjoys family time, travel, food adventures, and hiking.", photoSrc: "/doctors/cheyanne-punsal.png" },
  { id: "chelsee-brubaker", name: "Chelsee Brubaker", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["downey", "pico-rivera"], bio: "Graduated from Vanguard University of Southern California with a BS in biology. Completed the Undergraduate Cancer Research Training Program at Charles Drew University/UCLA, then earned an MS in biomedical research technologies from Boston University School of Medicine and a Master of Physician Assistant Studies from Rocky Mountain University of Health Professions. Has extensive volunteer history at CHOC and Children's Hospital Boston. A California native who enjoys beaches, gardening, games, and music with her two dogs.", photoSrc: "/doctors/chelsee-brubaker.png" },
  { id: "cze-ja-tam", name: "Cze-Ja Tam", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["west-hills"], healowUrl: "https://healow.com/apps/provider/czeja-tam-3672058", photoSrc: "/doctors/cze-ja-tam.webp" },
  { id: "dinesh-ghiya", name: "Dinesh Ghiya", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["whittier"], bio: "Has over 30 years of experience providing comprehensive care to Southern California children and adolescents. Completed medical studies at Sawai Man Singh Medical College in Jaipur, India, and his residency at LSU Health Sciences in New Orleans. Speaks English and Hindi.", photoSrc: "/doctors/dinesh-ghiya.png" },
  { id: "divya-sanghvi", name: "Divya Sanghvi", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["whittier"], photoSrc: "/doctors/divya-sanghvi.png" },
  { id: "elder-ayala", name: "Elder Ayala", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["pasadena", "northridge", "van-nuys", "san-fernando"], bio: "The son of Puerto Rican immigrant parents, he has worked in medicine since age 20 in roles including Physical and Occupational Therapy Assistant, Central Service Technician, and Orthopaedic Technician before graduating from the Keck School of Medicine of USC's PA program in 1992. He has practiced primarily in the San Fernando Valley in adult and pediatric medicine, and is a 30-year martial arts practitioner who has worked to integrate that training into helping patients with anxiety, depression, ADHD, and obesity.", photoSrc: "/doctors/elder-ayala.webp" },
  { id: "emily-brandt", name: "Emily Brandt", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["glendale", "pasadena"], bio: "Earned her undergraduate degree in biology from Northeastern University and her Doctor of Medicine from the University of New England College of Osteopathic Medicine, completing her pediatric residency at LAC+USC Medical Center. Enjoys time with family and friends, cooking, reading, camping, tennis, and learning ukulele.", photoSrc: "/doctors/emily-brandt.png" },
  { id: "erik-saenz", name: "Erik Saenz", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["whittier"], healowUrl: "https://healow.com/apps/provider/erik-saenz-3672034" },
  { id: "erika-lee", name: "Erika Lee", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["arcadia", "pasadena", "northridge", "la-canada"], bio: "A certified pediatric nurse practitioner who joined Kids & Teens Medical Group in 2023. Completed undergraduate studies in Human Physiology and Biology at Boston University, then earned bachelor's and master's degrees in Nursing at Massachusetts General Hospital Institute of Health Professions.", photoSrc: "/doctors/erika-lee.webp" },
  { id: "faiza-iram", name: "Faiza Iram", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["downey"], healowUrl: "https://healow.com/apps/provider/faiza-iram-3672054", bio: "Fluent in English, Hindi/Urdu, Spanish, and Punjabi. Earned her medical degree from Universidad Iberoamericana School of Medicine in the Dominican Republic and completed her pediatrics residency at the University of Medicine and Dentistry of New Jersey. Passionate about understanding patients' cultural backgrounds to provide optimal care, and an advocate for vaccines and breastfeeding support. Enjoys hiking and cooking spicy Pakistani food.", photoSrc: "/doctors/faiza-iram.webp" },
  { id: "fatemeh-anari", name: "Fatemeh Anari", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["northridge"], healowUrl: "https://healow.com/apps/provider/fatemeh-anari-3156394", photoSrc: "/doctors/fatemeh-anari.png" },
  { id: "george-saade", name: "George Saade", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["pico-rivera"], photoSrc: "/doctors/george-saade.png" },
  { id: "grace-dasovich", name: "Grace Dasovich", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "la-canada", "west-hills"], bio: "A board-certified pediatrician specializing in general pediatrics and child development, with the practice since 2019. Earned her BS in biomedical engineering from Northwestern University and her MD from the University of Minnesota Medical School, completing her pediatrics residency at UC Irvine/Children's Hospital of Orange County. Outside medicine she enjoys family time, travel, and marathon running.", photoSrc: "/doctors/grace-dasovich.webp" },
  { id: "grace-yi", name: "Grace Yi", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["la-canada", "arcadia"], bio: "A graduate of the University of Pennsylvania with bachelor's and master's degrees in Nursing specializing in Pediatric Primary Care. Gained experience in in-patient hospital care at Children's Hospital of Philadelphia, school nursing in New York City, and primary care in Virginia. Volunteers with a faith-based Children's Ministry, and enjoys golf and exploring restaurants.", photoSrc: "/doctors/grace-yi.webp" },
  { id: "greta-vines-douglas", name: "Greta Vines-Douglas", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["san-pedro"], healowUrl: "https://healow.com/apps/provider/greta-vinesdouglas-4048111", photoSrc: "/doctors/greta-vines-douglas.jpg" },
  { id: "hanna-guilas", name: "Hanna Guilas", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["la-canada", "pasadena"], bio: "Earned her Bachelor of Science in Nursing from UCLA and began her career at Children's Hospital Los Angeles in 2018 through the Versant residency program, later transitioning to CHLA's Emergency Department. Earned her master's degree at Azusa Pacific University to become a Pediatric Nurse Practitioner. Enjoys family time, food adventures, and travel.", photoSrc: "/doctors/hanna-guilas.png" },
  { id: "hilma-benjamin", name: "Hilma Benjamin", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "west-hills"], healowUrl: "https://healow.com/apps/provider/hilma-benjamin-3156397", bio: "Graduated from the University of the Virgin Islands with a BS in biology, earned an MS in molecular and cellular biology from University of Maryland, Baltimore County, and received her MD from Penn State College of Medicine. Completed her pediatrics residency at All Children's Hospital and Tampa General Hospital, and serves as acting Medical Director of Extended Hours/After Hours Care. Special interests include child behavior, growth and development, dental care, nutrition, and physical education.", photoSrc: "/doctors/hilma-benjamin.webp" },
  { id: "janesri-de-silva", name: "Janesri De Silva", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["la-canada"], healowUrl: "https://healow.com/apps/provider/janesri-desilva-3161323", bio: "Medical Director for General Pediatrics and Adolescent Medicine. Earned her bachelor's in neuroscience from UCLA and her medical degree from the American University of the Caribbean, completing her pediatric residency at Kaiser Permanente Sunset and a fellowship in Adolescent Medicine at Children's Hospital Los Angeles. Chaired Northridge Hospital's pediatric department from 2014-2016. Bilingual, a mother of two, and enjoys yoga, dance, and piano.", photoSrc: "/doctors/janesri-de-silva.webp" },
  { id: "jenifer-chungafung", name: "Jenifer Chungafung", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["la-mirada"], healowUrl: "https://healow.com/apps/provider/jenifer-chungafung-3636023", photoSrc: "/doctors/jenifer-chungafung.png" },
  { id: "jean-pierre-ndikuriyo", name: "Jean-Pierre Ndikuriyo", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["santa-monica"] },
  { id: "jocelyn-zuniga", name: "Jocelyn Zuniga", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["arcadia", "downey"], healowUrl: "https://healow.com/apps/provider/jocelyn-zuniga-3161348", photoSrc: "/doctors/jocelyn-zuniga.png" },
  { id: "jon-dandrea", name: "Jon D'Andrea", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["camarillo"] },
  { id: "jose-vargas", name: "Jose Vargas", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["san-fernando", "van-nuys"], healowUrl: "https://healow.com/apps/provider/jose-vargas-3161343", bio: "Brings 35 years of experience in pediatric and family medicine in the San Fernando Valley. Completed the physician assistant program in family practice and pediatrics at Charles R. Drew University of Medicine and Science. Enjoys camping, hiking, and cycling, and promotes a healthy lifestyle to his patients and their families.", photoSrc: "/doctors/jose-vargas.webp" },
  { id: "joseph-gancayco", name: "Joseph Gancayco", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["downey"], bio: "Earned his undergraduate degree in biology from UC Irvine, a master's in nutrition from Columbia University, and his medical degree from California Northstate University, completing his pediatrics training at Harbor-UCLA Medical Center in Torrance. A native of LA County's South Bay who enjoys Marvel, dogs, LA sports, and travel.", photoSrc: "/doctors/joseph-gancayco.png" },
  { id: "kanguei-dai", name: "Kanguei Dai", credentials: "FNP", specialties: ["Pediatrics"], locationIds: ["downey"], bio: "A native Mandarin Chinese speaker with extensive emergency room experience. Completed her Bachelor's in Nursing in Taiwan, earned a master's degree from the University of Florida in 2003, and completed her Family Nurse Practitioner degree from Azusa Pacific University in 2020.", photoSrc: "/doctors/kanguei-dai.webp" },
  { id: "kelli-hernandez", name: "Kelli Hernandez", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["west-hills"], photoSrc: "/doctors/kelli-hernandez.png" },
  { id: "kelvin-duong", name: "Kelvin Duong", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["whittier", "pasadena", "arcadia", "la-canada"], bio: "Earned his Bachelor of Science in Nursing in Angwin, California, and began his nursing career at Children's Hospital Los Angeles in 2012, completing the Versant nursing residency with a focus on pediatric hematology/oncology. Earned his Pediatric Nurse Practitioner degree from California State University, Long Beach.", photoSrc: "/doctors/kelvin-duong.webp" },
  { id: "laurie-beth-juarez-morales", name: "Laurie Beth Juarez-Morales", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["san-fernando", "west-hills", "van-nuys"], healowUrl: "https://healow.com/apps/provider/lauriebeth-juarezmorales-3161351", bio: "Born and raised in the San Fernando Valley, where she has practiced for over a decade. Earned a molecular biology degree with an education minor from UCLA, conducting research at UCLA's Multiple Sclerosis Laboratory, before attending Loma Linda School of Medicine and completing her pediatric residency at UC Irvine. Fluent in Spanish and Tagalog. Former/incumbent Department Chair of Pediatrics at Pacifica Hospital of the Valley.", photoSrc: "/doctors/laurie-beth-juarez-morales.png" },
  { id: "lili-barajas", name: "Lili Barajas", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["san-fernando", "van-nuys"], bio: "A graduate of Bay Path University's PA program in Massachusetts, originally from LA. As a first-generation Mexican-American college student and medical provider, she is passionate about community service and inspiring other minorities to pursue healthcare careers. Enjoys hiking, beach running, and time with her two dogs.", photoSrc: "/doctors/lili-barajas.png" },
  { id: "louise-villanueva", name: "Louise Villanueva", credentials: "CPNP", specialties: ["Pediatrics"], locationIds: ["canyon-country", "northridge"], bio: "A dual-certified Pediatric Nurse Practitioner in Primary Care and Acute Care, with her Bachelor of Science in Nursing and Master of Science in Nursing from UCLA. Began her nursing career on an adult medical-surgical unit before transitioning to the NICU, which fueled her drive to become a Pediatric Nurse Practitioner. Enjoys staying active, traveling, and attending concerts.", photoSrc: "/doctors/louise-villanueva.png" },
  { id: "lourdes-mosqueda", name: "Lourdes Mosqueda", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["san-fernando", "pasadena", "arcadia"], photoSrc: "/doctors/lourdes-mosqueda.webp" },
  { id: "luis-garcia", name: "Luis Garcia", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "downey", "whittier"], healowUrl: "https://healow.com/apps/provider/luis-garcia-3350331", photoSrc: "/doctors/luis-garcia.png" },
  { id: "lynn-garcia-galan", name: "Lynn Garcia-Galan", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["camarillo"] },
  { id: "mario-cuevas", name: "Mario Cuevas", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["la-mirada"], healowUrl: "https://healow.com/apps/provider/mario-cuevas-3636024" },
  { id: "marek-zdarzyl", name: "Marek Zdarzyl", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["la-canada", "pasadena"], photoSrc: "/doctors/marek-zdarzyl.webp" },
  { id: "margaret-zdarzyl", name: "Margaret Zdarzyl", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["la-canada"], bio: "Earned her medical degree from Nicolaus Copernicus University in Poland and completed her internship and residency at White Memorial Medical Center in Los Angeles. Fluent in English, Polish, and Spanish. Passionate about helping children and believes deeply in patient education. Enjoys skiing and gardening.", photoSrc: "/doctors/margaret-zdarzyl.png" },
  { id: "maria-vega", name: "Maria Vega", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["downey"], healowUrl: "https://healow.com/apps/provider/maria-vega-3161344" },
  { id: "marianne-woods", name: "Marianne Woods", credentials: "MD, MSPH", specialties: ["Pediatrics"], locationIds: ["pasadena", "northridge", "van-nuys"], bio: "Graduated with honors in biology from California State University Long Beach and earned a Master of Science in Public Health from UCLA. Completed the 5th Pathway Medical Studies Program at UC Irvine and her pediatric internship and residency at Kaiser Foundation Hospital in Los Angeles, later spending years as a Kaiser Permanente staff pediatrician. A lifelong Southern California resident who raised two sons there and enjoys music, sports, and reading.", photoSrc: "/doctors/marianne-woods.webp" },
  { id: "mark-snyder", name: "Mark Snyder", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["west-hills", "agoura-hills"], healowUrl: "https://healow.com/apps/provider/mark-snyder-3161340", bio: "Joined Kids & Teens Medical Group in 2017. A California native from Woodland Hills, he earned his Bachelor of Science in Bioengineering from UC San Diego and his MD from the University of Kansas Medical School, completing his pediatrics residency at Cedars-Sinai Medical Center. Outside work he enjoys mountain biking, kayaking, astronomy, and following current events.", photoSrc: "/doctors/mark-snyder.png" },
  { id: "martin-fineberg", name: "Martin Fineberg", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "torrance"], healowUrl: "https://healow.com/apps/provider/martin-fineberg-3161325", bio: "Has practiced in the San Fernando Valley since 1988. A native of Melbourne, Australia, he studied medicine at the University of Melbourne and trained in pediatrics at the Royal Children's Hospital Melbourne before completing his residency at Emory University in Atlanta and additional neonatology training at Children's Hospital Los Angeles. Licensed in California and Australia, he has special interest in high-risk NICU graduates and children with pulmonary diseases.", photoSrc: "/doctors/martin-fineberg.png" },
  { id: "mealynne-ngu", name: "Mealynne Ngu", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["glendale", "la-canada"], bio: "A Board Certified Pediatric Nurse Practitioner with a Master of Nursing from the University of South Florida and over 6 years of pediatric experience in outpatient and Level One trauma centers. Passionate about health prevention education. Enjoys traveling, dining out, outdoor activities, and spending time with her American Eskimo dog." },
  { id: "mercy-aeri", name: "Mercy Aeri", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "torrance", "whittier"] },
  { id: "michael-green", name: "Michael Green", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["san-pedro"], healowUrl: "https://healow.com/apps/provider/michael-green-4048674" },
  { id: "miguel-sutter", name: "Miguel Sutter", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["van-nuys", "mission-hills"], healowUrl: "https://healow.com/apps/provider/miguel-sutter-3161356", bio: "A Certified Physician Assistant with over 24 years of experience and father of two. Hobbies include cycling, running, skiing, and spending time with family. Passionate about helping people.", photoSrc: "/doctors/miguel-sutter.png" },
  { id: "monique-craig", name: "Monique Craig", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["culver-city"], healowUrl: "https://healow.com/apps/provider/monique-craig-3161322", photoSrc: "/doctors/monique-craig.jpg" },
  { id: "najma-qamar", name: "Najma Qamar", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["arcadia"] },
  { id: "narindar-nat", name: "Narindar Nat", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["canyon-country", "northridge"], photoSrc: "/doctors/narindar-nat.webp" },
  { id: "negin-kohanfarsi", name: "Negin Kohanfarsi", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["agoura-hills", "west-hills"], bio: "Practices primarily at the West Hills location with some availability in Agoura Hills. Earned her Bachelor's degree in Sociology from UCLA and completed her Master's in Physician Assistant Studies at Western University of Health Sciences. Enjoys spending time with family and friends and baking pastries.", photoSrc: "/doctors/negin-kohanfarsi.png" },
  { id: "oliver-petalver", name: "Oliver Petalver", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["downey"], healowUrl: "https://healow.com/apps/provider/oliver-petalver-3161334", photoSrc: "/doctors/oliver-petalver.png" },
  { id: "padma-bala", name: "Padma Bala", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["agoura-hills", "san-fernando", "la-canada", "van-nuys", "west-hills"], bio: "An experienced pediatrician with expertise in both pediatrics and adolescent medicine. Graduated from Madras Medical College in India and completed her pediatrics residency at Rush Presbyterian Medical Center in Chicago, then served as a pediatrician in the United States Army Medical Corps with the rank of Lieutenant Colonel. Later joined Baylor Medical Group in Dallas, earning the best pediatrician award for many years. Interests include history, archaeology, and playing the Veena instrument.", photoSrc: "/doctors/padma-bala.png" },
  { id: "palak-shelat", name: "Palak Shelat", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "pasadena", "valencia", "canyon-country"], healowUrl: "https://healow.com/apps/provider/palak-shelat-3161339", bio: "Fluent in English, Gujarati, and Hindi. Born and raised in India, she came to the USA as a teenager. Earned her Bachelor's in Biological Sciences from the University of Connecticut as a New England Scholar and her MD from St. George's University School of Medicine with high honors, completing her pediatric residency at NYU Langone Long Island Hospital. Enjoys painting, tennis, meditation, yoga, and long walks on the beach.", photoSrc: "/doctors/palak-shelat.png" },
  { id: "perni-movsesian", name: "Perni Movsesian", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["hollywood"] },
  { id: "peter-jackson", name: "Peter Jackson", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["agoura-hills", "west-hills", "northridge", "santa-monica", "van-nuys"], photoSrc: "/doctors/peter-jackson.webp" },
  { id: "rachel-barbour", name: "Rachel Barbour", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["culver-city", "torrance", "santa-monica", "hollywood"], bio: "Earned her undergraduate degree in Biology and Global Poverty from UC Berkeley and her MD from Chicago Medical School, completing her pediatrics residency at the University of Arizona with a certification in Integrative Medicine and a fellowship in the Arizona LEND program. A Southern California native, she is passionate about building relationships with families in the community and enjoys family time, cooking, tennis, and travel.", photoSrc: "/doctors/rachel-barbour.webp" },
  { id: "rebecca-kim", name: "Rebecca Kim", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["hollywood", "torrance"] },
  { id: "rena-keynigshteyn", name: "Rena Keynigshteyn", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["tarzana", "culver-city"], healowUrl: "https://healow.com/apps/provider/rena-keynigshteyn-3161353", bio: "Has over 30 years dedicated to pediatric health. A graduate of Tashkent Pediatric Medical Institute, she completed her internship at Brookdale University Hospital and residency at White Memorial Medical Center, and treated children and adolescents in Culver City for 15 years before joining Kids & Teens Medical Group. A fluent Russian speaker.", photoSrc: "/doctors/rena-keynigshteyn.png" },
  { id: "rick-gutierrez", name: "Rick Gutierrez", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "whittier"], bio: "Born in Pasadena and raised in Gig Harbor, Washington. Graduated with honors from the University of Washington with a BS in Cellular, Molecular and Developmental Biology, attended the Keck School of Medicine of USC, and completed his pediatric residency at UCI/CHOC Children's Hospital. Chose pediatrics believing a strong, healthy foundation leads to a longer and more fulfilling life. Enjoys time with his two cats and visiting his nieces in Washington.", photoSrc: "/doctors/rick-gutierrez.png" },
  { id: "rohina-furmuly", name: "Rohina Furmuly", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "west-hills", "culver-city"], healowUrl: "https://healow.com/apps/provider/rohina-furmuly-3161326", bio: "A nationally board-certified physician assistant with a Bachelor of Science in physiological science from UCLA and a Master of Science in physician assistant studies from Western University of Health Sciences. Previously served veterans at the Department of Veterans Affairs Community Based Outpatient Clinic in Ventura County. Her research background includes work with UCLA Nuclear Medicine, Kaiser Permanente, and Amgen on Alzheimer's disease and dementia, with two co-authored publications. An avid traveler who enjoys reading, outdoor activities, and charitable work.", photoSrc: "/doctors/rohina-furmuly.png" },
  { id: "roobina-hakoopian", name: "Roobina Hakoopian", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["pasadena"], healowUrl: "https://healow.com/apps/provider/roobina-hakoopian-3672056" },
  { id: "susan-proum", name: "Susan Proum", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["agoura-hills", "northridge", "west-hills"], bio: "A Los Angeles native with interests in nutrition, asthma care, and adolescent medicine. Earned her medical degree from St. George's University School of Medicine and spent years practicing on the East Coast before returning to Los Angeles to join Kids & Teens Medical Group. Dedicated to meeting the needs of children through all developmental stages, from infants to adolescents. Enjoys cooking, reading, and outdoor activities.", photoSrc: "/doctors/susan-proum.png" },
  { id: "sylvia-lam", name: "Sylvia Lam", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["arcadia", "pasadena"], bio: "Brings over four decades of dedicated pediatric medical expertise, grounding her approach in clinical evidence with judicious use of lab tests and medications. Trained at Mercy Hospital of Chicago, University of Illinois Hospital, and Children's Memorial Hospital of Chicago. Specializes in allergy management, ADHD, and weight management. Multilingual, fluent in English, Mandarin, Cantonese, and Medical Spanish.", photoSrc: "/doctors/sylvia-lam.png" },
  { id: "sharmetha-ramanan", name: "Sharmetha Ramanan", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["pasadena"], healowUrl: "https://healow.com/apps/provider/sharmetha-ramanan-3161335", bio: "Earned her master's in pediatric nursing from Massachusetts General Hospital's Institute of Health Professions in Boston. Her pediatric career began volunteering at children's hospitals in Sri Lanka, and includes experience as a medical assistant at an Australian children's heart and lung center and research on infant neuro-cognitive development at Boston Children's Hospital.", photoSrc: "/doctors/sharmetha-ramanan.webp" },
  { id: "tatiana-genjoyan", name: "Tatiana Genjoyan", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["la-canada"], healowUrl: "https://healow.com/apps/provider/tatiana-genjoyan-3272030", photoSrc: "/doctors/tatiana-genjoyan.jpg" },
  { id: "tisha-pison", name: "Tisha Pison", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["downey"], healowUrl: "https://healow.com/apps/provider/tisha-pison-3161358", photoSrc: "/doctors/tisha-pison.jpg" },
  { id: "tutran-dang", name: "TuTran Dang", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["northridge", "van-nuys"], bio: "A board-certified physician assistant specializing in Family Medicine and Urgent Care. Graduated magna cum laude from Charles R. Drew University of Medicine and Science and is certified in Advanced Cardiac Life Support and Pediatric Advanced Life Support. Fluent in English and Vietnamese, serving diverse patient populations. Enjoys traveling, family time, and cooking.", photoSrc: "/doctors/tutran-dang.png" },
  { id: "tyler-clark", name: "Tyler Clark", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["van-nuys"], photoSrc: "/doctors/tyler-clark.png" },
  { id: "vatche-kaprielian", name: "Vatche Kaprielian", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["la-canada", "pasadena"], bio: "A nationally certified physician assistant who earned his biology degree from California Polytechnic University of Pomona. After working in multiple healthcare areas including business and insurance, he pursued physician assistant studies at the University of La Verne's inaugural program, graduating in December 2020. Enjoys family time with his nephews and nieces and working on cars.", photoSrc: "/doctors/vatche-kaprielian.png" },
  { id: "victor-tamashiro", name: "Victor Tamashiro", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["mission-hills"], healowUrl: "https://healow.com/apps/provider/victor-tamashiro-3161357", photoSrc: "/doctors/victor-tamashiro.webp" },
  { id: "victoria-millet", name: "Victoria Millet", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "san-fernando", "west-hills", "van-nuys"], bio: "Has practiced pediatrics since 1984 and joined Kids & Teens Medical Group in 2011. Earned her undergraduate degree from UCLA in zoology, her MS from USC, and completed her pediatrics residency at University Hospital San Diego and a pediatric infectious diseases fellowship at UCLA. Continues to consult on infectious diseases and teaches at Northridge Hospital's Family Practice Residency Program and UCLA School of Nursing.", photoSrc: "/doctors/victoria-millet.webp" },
  { id: "yussef-sakhai", name: "Yussef Sakhai", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "culver-city", "santa-monica"], healowUrl: "https://healow.com/apps/provider/yussef-sakhai-3672037", photoSrc: "/doctors/yussef-sakhai.png" },
  { id: "deborah-marlow-mejia", name: "Deborah Marlow-Mejia", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["camarillo"] },
  { id: "brianne-guevara", name: "Brianne Guevara", credentials: "CPNP", specialties: ["Pediatrics"], locationIds: ["camarillo"] },
  { id: "heidi-erickson", name: "Heidi Erickson", credentials: "CPNP", specialties: ["Pediatrics"], locationIds: ["camarillo"] },
  { id: "lisa-gutierrez", name: "Lisa Gutierrez", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["la-canada"], healowUrl: "https://healow.com/apps/provider/lisa-gutierrez-3374487" },
  { id: "alea-sohn", name: "Alea Sohn", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["torrance"], healowUrl: "https://healow.com/apps/provider/alea-sohn-3672062" },
  { id: "breanna-kikuchi", name: "Breanna Kikuchi", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["downey"], healowUrl: "https://healow.com/apps/provider/breanna-kikuchi-3602227" },
  { id: "christine-sapinoso", name: "Christine Sapinoso", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["northridge"], healowUrl: "https://healow.com/apps/provider/christine-sapinoso-3672039" },
  { id: "clarissa-gooze", name: "Clarissa Gooze", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["torrance"], healowUrl: "https://healow.com/apps/provider/clarissa-gooze-3794996", photoSrc: "/doctors/clarissa-gooze.png" },
  { id: "david-razi", name: "David Razi", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["hollywood"], healowUrl: "https://healow.com/apps/provider/david-razi-3672036" },
  { id: "delaram-halavi", name: "Delaram Halavi", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["beverly-hills"], healowUrl: "https://healow.com/apps/provider/delaram-halavi-3672055" },
  { id: "ernestine-njie", name: "Ernestine Njie", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["hollywood"], healowUrl: "https://healow.com/apps/provider/ernestine-njie-3672053" },
  { id: "helen-pensanti", name: "Helen Pensanti", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["glendale", "la-mirada"], healowUrl: "https://healow.com/apps/provider/helen-pensanti-3672050", photoSrc: "/doctors/helen-pensanti.png" },
  { id: "jasmine-berookim", name: "Jasmine Berookim", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["la-mirada"], healowUrl: "https://healow.com/apps/provider/jasmine-berookim-3672041" },
  { id: "lisa-tan", name: "Lisa Tan", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["northridge", "la-canada"], healowUrl: "https://healow.com/apps/provider/lisa-tan-3672060" },
  { id: "lousine-frandjian", name: "Lousine Frandjian", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["pasadena", "la-canada", "arcadia"], healowUrl: "https://healow.com/apps/provider/lousine-frandjian-3672046" },
  { id: "ruth-gabay", name: "Ruth Gabay", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["hollywood"], healowUrl: "https://healow.com/apps/provider/ruth-gabay-3672047" },
  { id: "sonal-patel", name: "Sonal Patel", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["la-canada"], healowUrl: "https://healow.com/apps/provider/sonal-patel-3672049", photoSrc: "/doctors/sonal-patel.png" },
  { id: "trish-reyes", name: "Trish Reyes", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["telehealth"], healowUrl: "https://healow.com/apps/provider/trish-reyes-3161336", bio: "Trish Reyes is a Family Nurse Practitioner Board Certified. She has over 25 years of experience in the medical field. Trish provides continuing and comprehensive healthcare for the individual and family across all ages, genders, diseases, and body systems in Primary Care. The emphasis of the holistic nature of health the knowledge of the patient in the context of the family and the community, emphasizing disease, prevention, and health promotion.", photoSrc: "/doctors/trish-reyes.png" },
  { id: "yeongbu-kim", name: "Yeongbu Kim", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["van-nuys", "glendale", "hollywood", "la-mirada"], healowUrl: "https://healow.com/apps/provider/yeongbu-kim-3653936" },
];
```

- [ ] **Step 5: Download the 7 real photos this refresh found for doctors who didn't have one**

These NPIs returned a real headshot (>15KB — Healow's generic placeholder silhouette is
consistently under ~6.5KB) for doctors who currently have no `photoSrc`. Run:

```bash
curl -sS -o public/doctors/amrita-dosanjh.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1972637676"
curl -sS -o public/doctors/clarissa-gooze.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1831079342"
curl -sS -o public/doctors/helen-pensanti.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1659707586"
curl -sS -o public/doctors/jenifer-chungafung.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1376684985"
curl -sS -o public/doctors/sonal-patel.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1346376894"
curl -sS -o public/doctors/trish-reyes.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1972002228"
curl -sS -o public/doctors/yussef-sakhai.png "https://healow.com/apps/ECWImgProcessor?action=providerProfile&npi=1518992015"
```

Verify each downloaded file is a real PNG over 15KB:

```bash
ls -la public/doctors/amrita-dosanjh.png public/doctors/clarissa-gooze.png public/doctors/helen-pensanti.png public/doctors/jenifer-chungafung.png public/doctors/sonal-patel.png public/doctors/trish-reyes.png public/doctors/yussef-sakhai.png
```

Expected: each file exists and is >15000 bytes. (If this repo is picked up fresh and these files
already exist from a prior run of this task, skip this step.)

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npm test -- data/doctors.test.ts lib/filters.test.ts
```

Expected: PASS, all tests including the new ones from Step 2.

- [ ] **Step 7: Run the full test suite**

```bash
npm test
```

Expected: all tests PASS across the whole project.

- [ ] **Step 8: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/doctors` (or the locale-prefixed equivalent, e.g. `/en/doctors`).
Confirm:
- Search for "Sapinoso", "Halavi", "Yeongbu Kim" — each should now appear (previously missing).
- Search for "Dosanjh" — her card should show a real photo (not initials) and list Northridge,
  West Hills, and Agoura Hills.
- Search for "Fineberg" — his card should now list only Beverly Hills and Torrance.
- Click "Book Online" on Fineberg's or Dosanjh's card — confirm it opens
  `https://healow.com/apps/provider/martin-fineberg-3161325` (or the corresponding doctor URL),
  not the generic practice search page.
- Click "Book Online" on a Camarillo doctor (e.g. Jon D'Andrea) — confirm it still falls back to
  the generic shared Healow URL (no broken link).
- Open `/locations`, switch to Map view — confirm no console errors (Telehealth has no pin, which
  is correct).

Stop the server once confirmed.

- [ ] **Step 9: Commit**

```bash
git add data/doctors.test.ts lib/filters.test.ts data/doctors.ts public/doctors/amrita-dosanjh.png public/doctors/clarissa-gooze.png public/doctors/helen-pensanti.png public/doctors/jenifer-chungafung.png public/doctors/sonal-patel.png public/doctors/trish-reyes.png public/doctors/yussef-sakhai.png
git commit -m "feat: refresh doctor roster and booking links from live Healow data

Adds healowUrl (real per-doctor booking deep link) to 41 confirmed doctors,
corrects locationIds for 18 of them against Healow's live roster, adds 15
real doctors this file was missing (including 4 previously mis-dropped),
and downloads 7 real headshots Healow had that we didn't."
```

---

### Task 5: Final full-suite verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite one more time**

```bash
npm test
```

Expected: PASS, every test file.

- [ ] **Step 2: Type-check the project**

```bash
npx tsc --noEmit
```

Expected: no errors (confirms the optional `lat`/`lng`/`healowUrl` changes don't break any other
consumer of `Location`/`Doctor` this plan didn't touch).

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

Walk through `/doctors` and `/locations` end-to-end once more (both list and map views, both
locales if the locale switcher is easy to reach) and confirm nothing regressed. Stop the server.

---

## Self-Review Notes

- **Spec coverage:** per-doctor Healow booking links (Tasks 1–2), location/roster corrections
  from the live pull (Task 4), the UC-facilities-fold-into-base-clinic decision (already baked
  into Task 4's data, no separate location entries created), the Telehealth pseudo-location
  (Task 3), Camarillo kept-but-flagged (Task 4's file comment + fallback behavior), photo refresh
  for the 7 doctors Healow had real photos for (Task 4 Step 5) — all covered.
- **Known gaps carried forward, not silently resolved:** Camarillo and 48 other doctors remain
  unconfirmed against Healow (documented in the `data/doctors.ts` header comment); Healow's own
  bio data quality problem (name-mismatched bios) is flagged for the client, not fixed upstream;
  UC facility addresses were confirmed identical to their base clinic only for 3 of the 5 (Downey,
  Pasadena, Northridge) — West Hills UC and Van Nuys UC were folded on the same assumption but not
  individually address-verified, worth a quick manual double-check before launch.
- **Type consistency:** `Doctor.healowUrl` (Task 1) is consumed identically in `DoctorCard` (Task
  2) and populated in `data/doctors.ts` (Task 4) using the same field name throughout. `Location.lat`/`lng` (Task 1) made optional is consumed by `LocationsMap`'s filter (Task 3) and the new
  `telehealth` entry (Task 3) that omits them.
