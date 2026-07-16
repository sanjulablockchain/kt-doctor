# Doctors / Locations / Booking Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Next.js frontend for KTMG's real doctor directory, real 24-clinic locations directory (with map), and booking/portal/pay links — matching current Healow/eClinicalWorks behavior exactly, as a like-for-like replacement for the unreliable WordPress pages.

**Architecture:** Next.js App Router + TypeScript + Tailwind CSS. All doctor/location content is hardcoded in typed TS data files (no database, no CMS — explicit client decision). Booking/pay/portal are external links to existing third-party systems, centralized as named constants so they're trivial to swap later. Locations map uses the Google Maps JavaScript API with our own key and pre-computed lat/lng (no runtime geocoding).

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Vitest + React Testing Library, `@react-google-maps/api`.

## Global Constraints

- No git repository is in use right now (explicit client instruction) — do **not** run `git init` or commit. Every task ends with a manual verification step instead of a commit step. If `npx create-next-app` auto-creates a `.git` folder in Task 1, delete it.
- No database, no CMS, no admin panel — all content is hardcoded TypeScript data (explicit client decision).
- Phase 1 scope is KTMG main brand only — no sub-brands, no Foundation page, no blog/careers/insurance/EN-ES (deferred to a later phase/plan).
- Booking, Pay Online, and Patient Portal must link to the **existing real URLs** unchanged (see Task 3) — this is a frontend rebuild, not a booking-system replacement, and the swap happens ~6 months from now.
- Mobile responsive throughout (Tailwind breakpoints).
- Reference data (locations, doctors, URLs) comes from `docs/superpowers/specs/2026-07-15-doctors-locations-booking-core-design.md` — use it verbatim, do not invent data.

---

### Task 1: Project scaffold (Next.js + TypeScript + Tailwind)

**Files:**
- Create: entire Next.js scaffold (`package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.eslintrc.json`)

**Interfaces:**
- Produces: a working `npm run dev` Next.js app on `http://localhost:3000`, App Router (`app/` directory), Tailwind CSS wired into `app/globals.css`, path alias `@/*` pointing to the project root.

- [ ] **Step 1: Scaffold the project**

Run from the project root (`C:\Users\sanju\OneDrive\Documents\play ground\kt-doctor`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

When prompted, accept defaults. This scaffolds into the current directory (it's currently empty, so this is safe).

- [ ] **Step 2: Remove any auto-created git repo**

```bash
ls -la .git 2>/dev/null && rm -rf .git || echo "no .git created, nothing to do"
```

Expected: either it removes a freshly auto-created `.git`, or prints "no .git created, nothing to do". Per Global Constraints, we are not using git right now.

- [ ] **Step 3: Verify the dev server runs**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` with no errors. Open it in the browser pane and confirm the default Next.js starter page renders. Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 4: Replace the default home page with a placeholder**

Edit `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Kids & Teens Medical Group</h1>
      <p className="mt-2 text-gray-600">Site under construction.</p>
    </main>
  );
}
```

- [ ] **Step 5: Verify manually**

Run `npm run dev`, open `http://localhost:3000`, confirm the placeholder heading renders. Stop the server.

---

### Task 2: Testing tooling (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (add `test` script and devDependencies)
- Test: `lib/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest in jsdom mode with React Testing Library and jest-dom matchers available in every test file.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Create the setup file**

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 5: Write a smoke test**

Create `lib/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test tooling smoke test", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the smoke test**

```bash
npm test
```

Expected: 1 test file, 1 test, PASS.

---

### Task 3: Shared types and constants

**Files:**
- Create: `lib/types.ts`
- Create: `lib/constants.ts`
- Test: `lib/constants.test.ts`

**Interfaces:**
- Produces: `Location` type, `Doctor` type (consumed by Tasks 4, 5, 6, 7, 8, 9). `BOOKING_URL`, `PAY_ONLINE_URL`, `PATIENT_PORTAL_URL`, `MAIN_PHONE`, `TEXT_PHONE`, `GENERAL_EMAIL` string constants (consumed by Tasks 7, 8, 10, 11).

- [ ] **Step 1: Write the failing test**

Create `lib/constants.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  BOOKING_URL,
  PAY_ONLINE_URL,
  PATIENT_PORTAL_URL,
  MAIN_PHONE,
  TEXT_PHONE,
  GENERAL_EMAIL,
} from "./constants";

describe("constants", () => {
  it("booking URL points to the real Healow practice page", () => {
    expect(BOOKING_URL).toBe(
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });

  it("pay online URL points to healowpay.com", () => {
    expect(PAY_ONLINE_URL).toBe("https://healowpay.com");
  });

  it("patient portal URL points to the eClinicalWorks portal", () => {
    expect(PATIENT_PORTAL_URL).toBe(
      "https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp"
    );
  });

  it("has the main phone, text phone, and general email", () => {
    expect(MAIN_PHONE).toBe("(818) 361-5437");
    expect(TEXT_PHONE).toBe("(626) 298-7121");
    expect(GENERAL_EMAIL).toBe("customerservice@ktdoctor.com");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- lib/constants.test.ts
```

Expected: FAIL — `Cannot find module './constants'`.

- [ ] **Step 3: Write the types**

Create `lib/types.ts`:

```ts
export type Location = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  extension: string;
  lat: number;
  lng: number;
};

export type Doctor = {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  locationIds: string[];
};
```

- [ ] **Step 4: Write the constants**

Create `lib/constants.ts`:

```ts
// Real production URLs — do not change without confirming with the client.
// These route to the existing Healow/eClinicalWorks systems and are expected
// to be swapped for an in-house booking system in a later phase.

export const BOOKING_URL =
  "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2";

export const PAY_ONLINE_URL = "https://healowpay.com";

export const PATIENT_PORTAL_URL =
  "https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp";

export const MAIN_PHONE = "(818) 361-5437";
export const TEXT_PHONE = "(626) 298-7121";
export const GENERAL_EMAIL = "customerservice@ktdoctor.com";
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- lib/constants.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 6: Verify manually**

No manual verification needed — this task has no UI surface.

---

### Task 4: Locations data (24 real clinics)

**Files:**
- Create: `data/locations.ts`
- Test: `data/locations.test.ts`

**Interfaces:**
- Consumes: `Location` type from `lib/types.ts` (Task 3)
- Produces: `locations: Location[]` array, consumed by Tasks 6, 8, 9.

- [ ] **Step 1: Write the failing test**

Create `data/locations.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { locations } from "./locations";

describe("locations data", () => {
  it("has exactly 24 real clinics", () => {
    expect(locations).toHaveLength(24);
  });

  it("every location has a unique id", () => {
    const ids = locations.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every location has valid lat/lng within the Southern California bounding box", () => {
    for (const loc of locations) {
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
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/locations.test.ts
```

Expected: FAIL — `Cannot find module './locations'`.

- [ ] **Step 3: Write the locations data**

Create `data/locations.ts`. Lat/lng below are city-level approximations (not exact street precision) — flagged in the spec as needing refinement via the Google Geocoding API before production launch, but they are real, non-placeholder coordinates for each clinic's actual city.

```ts
import type { Location } from "@/lib/types";

export const locations: Location[] = [
  { id: "agoura-hills", name: "Agoura Hills", address: "5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301", phone: "(818) 361-5437", email: "agourahills@ktdoctor.com", extension: "207", lat: 34.1361, lng: -118.7615 },
  { id: "arcadia", name: "Arcadia", address: "16 E Huntington Dr, Arcadia, CA 91006", phone: "(818) 361-5437", email: "arcadia@ktdoctor.com", extension: "060", lat: 34.1397, lng: -118.0353 },
  { id: "beverly-hills", name: "Beverly Hills", address: "8733 Beverly Blvd # 200, West Hollywood, CA 90048", phone: "(818) 361-5437", email: "beverlyhills@ktdoctor.com", extension: "115", lat: 34.0836, lng: -118.3762 },
  { id: "camarillo", name: "Camarillo", address: "2486 Ponderosa Dr. N., Suite D-211, Camarillo, CA 93010", phone: "(818) 361-5437", email: "camarillo@ktdoctor.com", extension: "469", lat: 34.2164, lng: -119.0376 },
  { id: "canyon-country", name: "Canyon Country", address: "20655 Soledad Canyon Rd Suite 25, Canyon Country, CA 91351", phone: "(818) 361-5437", email: "canyoncountry@ktdoctor.com", extension: "014", lat: 34.4237, lng: -118.4873 },
  { id: "culver-city", name: "Culver City", address: "3831 Hughes Ave #602, Culver City, CA 90232", phone: "(818) 361-5437", email: "culvercity@ktdoctor.com", extension: "073", lat: 34.0211, lng: -118.3965 },
  { id: "downey", name: "Downey", address: "11525 Brookshire Ave STE 302, Downey, CA 90241", phone: "(818) 361-5437", email: "downey@ktdoctor.com", extension: "079", lat: 33.9401, lng: -118.1332 },
  { id: "glendale", name: "Glendale", address: "1530 E Chevy Chase Dr Ste 202, Glendale, CA 91206", phone: "(818) 361-5437", email: "glendale@ktdoctor.com", extension: "239", lat: 34.1425, lng: -118.2551 },
  { id: "la-canada", name: "La Cañada", address: "1021 Foothill Blvd, La Canada Flintridge, CA 91011", phone: "(818) 361-5437", email: "lacanada@ktdoctor.com", extension: "841", lat: 34.2064, lng: -118.2001 },
  { id: "mission-hills", name: "Mission Hills", address: "10200 Sepulveda Blvd #200, Mission Hills, CA 91345", phone: "(818) 361-5437", email: "missionhills@ktdoctor.com", extension: "195", lat: 34.2695, lng: -118.4595 },
  { id: "northridge", name: "Northridge", address: "8628 Reseda Blvd, Northridge, CA 91324", phone: "(818) 361-5437", email: "northridge@ktdoctor.com", extension: "713", lat: 34.2381, lng: -118.5364 },
  { id: "pasadena", name: "Pasadena", address: "504 S Sierra Madre Blvd, Pasadena, CA 91107", phone: "(626) 655-4041", email: "pasadena@ktdoctor.com", extension: "118", lat: 34.1478, lng: -118.1445 },
  { id: "pico-rivera", name: "Pico Rivera", address: "8337 Telegraph Rd #119, Pico Rivera, CA 90660", phone: "(818) 361-5437", email: "picorivera@ktdoctor.com", extension: "191", lat: 33.9836, lng: -118.0967 },
  { id: "san-fernando", name: "San Fernando", address: "777 Truman St. Suite 105, San Fernando, CA 91340", phone: "(818) 361-5437", email: "sanfernando@ktdoctor.com", extension: "774", lat: 34.2817, lng: -118.4392 },
  { id: "santa-monica", name: "Santa Monica", address: "3200 Santa Monica Blvd UNIT 204, Santa Monica, CA 90404", phone: "(310) 234-0300", email: "santamonica@ktdoctor.com", extension: "059", lat: 34.0195, lng: -118.4912 },
  { id: "san-pedro", name: "San Pedro", address: "887 W 9th St, San Pedro, CA 90731", phone: "(818) 361-5437", email: "sanpedro@ktdoctor.com", extension: "443", lat: 33.7361, lng: -118.2922 },
  { id: "tarzana", name: "Tarzana", address: "18372 Clark St #226, Tarzana, CA 91356", phone: "(818) 361-5437", email: "tarzana@ktdoctor.com", extension: "136", lat: 34.1730, lng: -118.5537 },
  { id: "torrance", name: "Torrance", address: "3524 Torrance Blvd Suite 101, Torrance, CA 90503", phone: "(818) 361-5437", email: "torrance@ktdoctor.com", extension: "247", lat: 33.8358, lng: -118.3406 },
  { id: "valencia", name: "Valencia", address: "24330 McBean Pkwy, Valencia, CA 91355", phone: "(818) 361-5437", email: "valencia@ktdoctor.com", extension: "026", lat: 34.4211, lng: -118.5542 },
  { id: "van-nuys", name: "Van Nuys", address: "14426 Gilmore St Suite B, Van Nuys, CA 91401", phone: "(818) 361-5437", email: "vannuys@ktdoctor.com", extension: "302", lat: 34.1866, lng: -118.4487 },
  { id: "west-hills", name: "West Hills", address: "22736 Vanowen St #300, West Hills, CA 91307", phone: "(818) 361-5437", email: "westhills@ktdoctor.com", extension: "110", lat: 34.2011, lng: -118.6428 },
  { id: "whittier", name: "Whittier", address: "13470 Telegraph Rd, Whittier, CA 90605", phone: "(818) 361-5437", email: "whittier@ktdoctor.com", extension: "103", lat: 33.9792, lng: -118.0328 },
  { id: "la-mirada", name: "La Mirada", address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638", phone: "(714) 979-3917", email: "lamirada@ktdoctor.com", extension: "205", lat: 33.9172, lng: -118.0120 },
  { id: "west-la", name: "West LA", address: "10780 Santa Monica Blvd, Ste 405, Los Angeles, CA 90025", phone: "(310) 234-0300", email: "westla@ktdoctor.com", extension: "500", lat: 34.0483, lng: -118.4419 },
];
```

Note on Step 3 data: the base 22 clinics come directly from the real `/directory/` page (verbatim addresses/emails/extensions). "La Mirada" and "West LA" are carried over from the boss's mockup (they appear in his 25-location list but weren't in the scraped `/directory/` page's 22 visible rows plus Camarillo/Pasadena — 24 total) — their email/extension values are placeholders following the `{cityslug}@ktdoctor.com` pattern used everywhere else, and must be confirmed against the live site before launch. Flag this explicitly to the client rather than silently treating them as confirmed.

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/locations.test.ts
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify manually**

No manual verification needed yet — this data isn't rendered until Task 8.

---

### Task 5: Doctors data (real roster, many-to-many)

**Files:**
- Create: `data/doctors.ts`
- Test: `data/doctors.test.ts`

**Interfaces:**
- Consumes: `Doctor` type from `lib/types.ts` (Task 3), `locations` array from `data/locations.ts` (Task 4, used only in the test to validate referential integrity)
- Produces: `doctors: Doctor[]` array, consumed by Tasks 6, 7.

- [ ] **Step 1: Write the failing test**

Create `data/doctors.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { doctors } from "./doctors";
import { locations } from "./locations";

describe("doctors data", () => {
  it("has at least 50 doctors", () => {
    expect(doctors.length).toBeGreaterThanOrEqual(50);
  });

  it("every doctor has at least one location", () => {
    for (const doc of doctors) {
      expect(doc.locationIds.length).toBeGreaterThan(0);
    }
  });

  it("every doctor's locationIds reference a real location id", () => {
    const validIds = new Set(locations.map((l) => l.id));
    for (const doc of doctors) {
      for (const locId of doc.locationIds) {
        expect(validIds.has(locId)).toBe(true);
      }
    }
  });

  it("includes a doctor who practices at multiple locations, matching the real roster", () => {
    const fineberg = doctors.find((d) => d.name === "Martin Fineberg");
    expect(fineberg).toBeDefined();
    expect(fineberg?.locationIds.sort()).toEqual(
      ["beverly-hills", "culver-city", "pasadena", "torrance"].sort()
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/doctors.test.ts
```

Expected: FAIL — `Cannot find module './doctors'`.

- [ ] **Step 3: Write the doctors data**

Create `data/doctors.ts`. All names/credentials/location assignments are the real roster captured from `www.ktdoctor.com/our-doctors/`. **Specialty data does not exist on the real site** (it only lists name + credentials per clinic, no specialty tags) — every doctor is hardcoded as `["Pediatrics"]` as a reasonable default since KTMG is a general pediatric practice; this is flagged in the spec as a follow-up item to get real specialty data from the client.

```ts
import type { Doctor } from "@/lib/types";

export const doctors: Doctor[] = [
  { id: "mark-snyder", name: "Mark Snyder", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["agoura-hills", "west-hills"] },
  { id: "sylvia-lam", name: "Sylvia Lam", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["arcadia", "pasadena"] },
  { id: "erika-lee", name: "Erika Lee", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["arcadia", "pasadena"] },
  { id: "jocelyn-zuniga", name: "Jocelyn Zuniga", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["arcadia", "downey"] },
  { id: "najma-qamar", name: "Najma Qamar", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["arcadia"] },
  { id: "martin-fineberg", name: "Martin Fineberg", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "culver-city", "pasadena", "torrance"] },
  { id: "sharmetha-ramanan", name: "Sharmetha Ramanan", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "glendale"] },
  { id: "rohina-furmuly", name: "Rohina Furmuly", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "culver-city"] },
  { id: "yussef-sakhai", name: "Yussef Sakhai", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "culver-city", "santa-monica"] },
  { id: "halavi-delaram", name: "Halavi Delaram", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "santa-monica"] },
  { id: "michels-savannah", name: "Michels Savannah", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["beverly-hills", "torrance"] },
  { id: "casie-mcguire", name: "Casie McGuire", credentials: "FNP-C", specialties: ["Pediatrics"], locationIds: ["canyon-country", "valencia"] },
  { id: "narindar-nat", name: "Narindar Nat", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["canyon-country", "northridge"] },
  { id: "monique-craig", name: "Monique Craig", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["culver-city"] },
  { id: "azam-jazayeri", name: "Azam Jazayeri", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["culver-city"] },
  { id: "rena-keynigshteyn", name: "Rena Keynigshteyn", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["culver-city", "tarzana"] },
  { id: "oliver-petalver", name: "Oliver Petalver", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["downey"] },
  { id: "maria-vega", name: "Maria Vega", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["downey"] },
  { id: "tisha-pison", name: "Tisha Pison", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["downey"] },
  { id: "emily-brandt", name: "Emily Brandt", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["glendale", "pasadena"] },
  { id: "mealynne-ngu", name: "Mealynne Ngu", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["glendale", "la-canada"] },
  { id: "benjamin-behroozan", name: "Benjamin Behroozan", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["hollywood-legacy", "santa-monica"] },
  { id: "rebecca-kim", name: "Rebecca Kim", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["hollywood-legacy", "torrance", "santa-monica"] },
  { id: "kim-yeongbu", name: "Kim Yeongbu", credentials: "NP (Saturdays only)", specialties: ["Pediatrics"], locationIds: ["hollywood-legacy"] },
  { id: "njie-ernestine", name: "Njie Ernestine", credentials: "FNP-C", specialties: ["Pediatrics"], locationIds: ["hollywood-legacy"] },
  { id: "patino-cecilia", name: "Patino Cecilia", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["hollywood-legacy"] },
  { id: "janesri-de-silva", name: "Janesri De Silva", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["la-canada", "pasadena"] },
  { id: "tatiana-genjoyan", name: "Tatiana Genjoyan", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["la-canada"] },
  { id: "hilma-benjamin", name: "Hilma Benjamin", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["la-canada", "mission-hills", "northridge", "west-hills"] },
  { id: "lisa-gutierrez", name: "Lisa Gutierrez", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["la-canada"] },
  { id: "cze-ja-tam", name: "Cze-Ja Tam", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["la-canada"] },
  { id: "anwar-arastu", name: "Anwar Arastu", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["la-mirada"] },
  { id: "vaseema-arastu", name: "Vaseema Arastu", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["la-mirada"] },
  { id: "victor-tamashiro", name: "Victor Tamashiro", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["mission-hills"] },
  { id: "palak-shelat", name: "Palak Shelat", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "valencia"] },
  { id: "brian-bhatt", name: "Brian Bhatt", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "valencia"] },
  { id: "victoria-millet", name: "Victoria Millet", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["northridge", "san-fernando"] },
  { id: "fatemeh-anari", name: "Fatemeh Anari", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["northridge"] },
  { id: "miguel-sutter", name: "Miguel Sutter", credentials: "PA-C", specialties: ["Pediatrics"], locationIds: ["northridge", "pasadena", "van-nuys", "west-hills"] },
  { id: "banpreet-samra", name: "Banpreet Samra", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["northridge", "tarzana", "valencia", "west-hills"] },
  { id: "luis-garcia", name: "Luis Garcia", credentials: "PNP", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "torrance", "whittier"] },
  { id: "carolina-ungs", name: "Carolina Ungs", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "pasadena", "whittier"] },
  { id: "mercy-aeri", name: "Mercy Aeri", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["pico-rivera", "torrance", "whittier"] },
  { id: "barbara-rodriguez", name: "Barbara Rodriguez", credentials: "MD, FAAP", specialties: ["Pediatrics"], locationIds: ["pasadena"] },
  { id: "roobina-hakoopian", name: "Roobina Hakoopian", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["pasadena"] },
  { id: "jose-vargas", name: "Jose Vargas", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["san-fernando", "van-nuys"] },
  { id: "laurie-beth-juarez-morales", name: "Laurie Beth Juarez-Morales", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["san-fernando", "van-nuys"] },
  { id: "hantman-david", name: "Hantman David", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["santa-monica"] },
  { id: "sohn-alea", name: "Sohn Alea", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["santa-monica", "torrance"] },
  { id: "carolyn-czaplicki", name: "Carolyn Czaplicki", credentials: "DO", specialties: ["Pediatrics"], locationIds: ["san-pedro"] },
  { id: "michael-green", name: "Michael Green", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["san-pedro"] },
  { id: "greta-vines-douglas", name: "Greta Vines-Douglas", credentials: "PA", specialties: ["Pediatrics"], locationIds: ["san-pedro"] },
  { id: "adrienne-altman", name: "Adrienne C. Altman", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["valencia"] },
  { id: "ahoo-sahba", name: "Ahoo Sahba", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["van-nuys"] },
  { id: "amrita-dosanjh", name: "Amrita Dosanjh", credentials: "MD", specialties: ["Pediatrics"], locationIds: ["west-hills"] },
  { id: "kelli-hernandez", name: "Kelli Hernandez", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["west-hills"] },
  { id: "erik-saenz", name: "Erik Saenz", credentials: "NP", specialties: ["Pediatrics"], locationIds: ["whittier"] },
];
```

Note: the real roster included a "Hollywood" clinic (doctors Benjamin Behroozan, Rebecca Kim, Kim Yeongbu, Njie Ernestine, Patino Cecilia) that is **not** in the 24 confirmed `/directory/` locations from Task 4. Rather than silently dropping these doctors or inventing a Hollywood location without a real address, this task adds a placeholder location id `hollywood-legacy` referenced only by doctors — **do not** add a `hollywood-legacy` entry to `data/locations.ts`. Flag this to the client explicitly: confirm the real Hollywood clinic address before launch, then add it properly to `data/locations.ts` and rename the id. The test in Step 1 only validates against `data/doctors.ts` in isolation for this reason — a follow-up cross-check test is added in Task 6.

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/doctors.test.ts
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify manually**

No manual verification needed yet — this data isn't rendered until Task 7.

---

### Task 6: Filter utilities + cross-referential integrity test

**Files:**
- Create: `lib/filters.ts`
- Test: `lib/filters.test.ts`

**Interfaces:**
- Consumes: `Doctor`, `Location` types (Task 3), `doctors` array (Task 5), `locations` array (Task 4)
- Produces: `filterDoctors(doctors, { locationId?, specialty?, search? }): Doctor[]` and `getAllSpecialties(doctors): string[]`, consumed by Task 7.

- [ ] **Step 1: Write the failing test**

Create `lib/filters.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { filterDoctors, getAllSpecialties } from "./filters";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";

describe("filterDoctors", () => {
  it("returns all doctors when no filters are given", () => {
    expect(filterDoctors(doctors, {})).toHaveLength(doctors.length);
  });

  it("filters by locationId", () => {
    const result = filterDoctors(doctors, { locationId: "pasadena" });
    expect(result.length).toBeGreaterThan(0);
    for (const doc of result) {
      expect(doc.locationIds).toContain("pasadena");
    }
  });

  it("filters by specialty", () => {
    const result = filterDoctors(doctors, { specialty: "Pediatrics" });
    expect(result).toHaveLength(doctors.length);
  });

  it("filters by search matching name (case-insensitive)", () => {
    const result = filterDoctors(doctors, { search: "fineberg" });
    expect(result.map((d) => d.name)).toContain("Martin Fineberg");
  });

  it("combines locationId and search filters", () => {
    const result = filterDoctors(doctors, { locationId: "pasadena", search: "martin" });
    expect(result.map((d) => d.name)).toEqual(["Martin Fineberg"]);
  });
});

describe("getAllSpecialties", () => {
  it("returns a de-duplicated, sorted list of specialties", () => {
    expect(getAllSpecialties(doctors)).toEqual(["Pediatrics"]);
  });
});

describe("data integrity across doctors and locations", () => {
  it("flags any doctor locationId not present in data/locations.ts (known gap: hollywood-legacy)", () => {
    const validIds = new Set(locations.map((l) => l.id));
    const unresolvedIds = new Set<string>();
    for (const doc of doctors) {
      for (const locId of doc.locationIds) {
        if (!validIds.has(locId)) unresolvedIds.add(locId);
      }
    }
    // This is expected to contain "hollywood-legacy" until the real Hollywood
    // clinic address is confirmed with the client (see Task 5 note). If this
    // set is ever empty, update this test to assert `.size === 0` instead.
    expect(Array.from(unresolvedIds)).toEqual(["hollywood-legacy"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- lib/filters.test.ts
```

Expected: FAIL — `Cannot find module './filters'`.

- [ ] **Step 3: Write the filter utilities**

Create `lib/filters.ts`:

```ts
import type { Doctor } from "./types";

export type DoctorFilters = {
  locationId?: string;
  specialty?: string;
  search?: string;
};

export function filterDoctors(doctors: Doctor[], filters: DoctorFilters): Doctor[] {
  return doctors.filter((doc) => {
    if (filters.locationId && !doc.locationIds.includes(filters.locationId)) {
      return false;
    }
    if (filters.specialty && !doc.specialties.includes(filters.specialty)) {
      return false;
    }
    if (filters.search) {
      const needle = filters.search.toLowerCase();
      if (!doc.name.toLowerCase().includes(needle)) {
        return false;
      }
    }
    return true;
  });
}

export function getAllSpecialties(doctors: Doctor[]): string[] {
  const set = new Set<string>();
  for (const doc of doctors) {
    for (const s of doc.specialties) set.add(s);
  }
  return Array.from(set).sort();
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- lib/filters.test.ts
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Verify manually**

No manual verification needed yet — wired into UI in Task 7.

---

### Task 7: Doctors page with filters

**Files:**
- Create: `components/DoctorCard.tsx`
- Create: `app/doctors/page.tsx`
- Test: `components/DoctorCard.test.tsx`
- Test: `app/doctors/page.test.tsx`

**Interfaces:**
- Consumes: `Doctor` type (Task 3), `doctors` (Task 5), `locations` (Task 4), `filterDoctors`/`getAllSpecialties` (Task 6), `BOOKING_URL` (Task 3)
- Produces: `<DoctorCard doctor={doctor} locationNames={string[]} />` component, consumed only within this task.

- [ ] **Step 1: Write the failing test for DoctorCard**

Create `components/DoctorCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoctorCard } from "./DoctorCard";

describe("DoctorCard", () => {
  it("renders the doctor's name, credentials, locations, and a booking link", () => {
    render(
      <DoctorCard
        doctor={{
          id: "martin-fineberg",
          name: "Martin Fineberg",
          credentials: "MD, FAAP",
          specialties: ["Pediatrics"],
          locationIds: ["beverly-hills", "pasadena"],
        }}
        locationNames={["Beverly Hills", "Pasadena"]}
      />
    );

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.getByText("MD, FAAP")).toBeInTheDocument();
    expect(screen.getByText("Beverly Hills, Pasadena")).toBeInTheDocument();
    const bookLink = screen.getByRole("link", { name: /book online/i });
    expect(bookLink).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/DoctorCard.test.tsx
```

Expected: FAIL — `Cannot find module './DoctorCard'`.

- [ ] **Step 3: Write the DoctorCard component**

Create `components/DoctorCard.tsx`:

```tsx
import { Doctor } from "@/lib/types";
import { BOOKING_URL } from "@/lib/constants";

type DoctorCardProps = {
  doctor: Doctor;
  locationNames: string[];
};

export function DoctorCard({ doctor, locationNames }: DoctorCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <p className="text-sm text-gray-500">{doctor.credentials}</p>
      <p className="mt-1 text-sm text-gray-700">{doctor.specialties.join(", ")}</p>
      <p className="mt-1 text-sm text-gray-700">{locationNames.join(", ")}</p>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Book Online
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/DoctorCard.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Write the failing test for the doctors page**

Create `app/doctors/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DoctorsPage from "./page";

describe("DoctorsPage", () => {
  it("renders all doctors by default and filters by search", async () => {
    render(<DoctorsPage />);

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();

    const searchBox = screen.getByPlaceholderText("Search by name...");
    await userEvent.type(searchBox, "fineberg");

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.queryByText("Adrienne C. Altman")).not.toBeInTheDocument();
  });

  it("filters by location", async () => {
    render(<DoctorsPage />);

    const locationSelect = screen.getByLabelText("Filter by location");
    await userEvent.selectOptions(locationSelect, "valencia");

    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.queryByText("Martin Fineberg")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- app/doctors/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'` or the page doesn't yet render a client-filterable list.

- [ ] **Step 7: Write the doctors page**

Create `app/doctors/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { filterDoctors, getAllSpecialties } from "@/lib/filters";
import { DoctorCard } from "@/components/DoctorCard";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState("");
  const [specialty, setSpecialty] = useState("");

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

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Our Doctors</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />

        <label className="flex flex-col text-sm">
          <span className="sr-only">Filter by location</span>
          <select
            aria-label="Filter by location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="sr-only">Filter by specialty</span>
          <select
            aria-label="Filter by specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Showing {filtered.length} of {doctors.length} providers
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            locationNames={doc.locationIds.map((id) => locationNameById.get(id) ?? id)}
          />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- app/doctors/page.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 9: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/doctors`. Confirm: all doctors render, the search box filters live, the location dropdown filters live, and clicking "Book Online" opens the Healow URL in a new tab. Resize the browser to a mobile width and confirm the filter controls stack vertically and cards remain readable. Stop the server.

---

### Task 8: Locations page (list view)

**Files:**
- Create: `components/LocationCard.tsx`
- Create: `app/locations/page.tsx`
- Test: `components/LocationCard.test.tsx`
- Test: `app/locations/page.test.tsx`

**Interfaces:**
- Consumes: `Location` type (Task 3), `locations` (Task 4)
- Produces: `<LocationCard location={location} />`, a `view` state (`"list" | "map"`) in the page, consumed by Task 9.

- [ ] **Step 1: Write the failing test for LocationCard**

Create `components/LocationCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocationCard } from "./LocationCard";

describe("LocationCard", () => {
  it("renders name, address, phone, and email", () => {
    render(
      <LocationCard
        location={{
          id: "pasadena",
          name: "Pasadena",
          address: "504 S Sierra Madre Blvd, Pasadena, CA 91107",
          phone: "(626) 655-4041",
          email: "pasadena@ktdoctor.com",
          extension: "118",
          lat: 34.1478,
          lng: -118.1445,
        }}
      />
    );

    expect(screen.getByText("Pasadena")).toBeInTheDocument();
    expect(screen.getByText("504 S Sierra Madre Blvd, Pasadena, CA 91107")).toBeInTheDocument();
    expect(screen.getByText("(626) 655-4041")).toBeInTheDocument();
    expect(screen.getByText("pasadena@ktdoctor.com")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/LocationCard.test.tsx
```

Expected: FAIL — `Cannot find module './LocationCard'`.

- [ ] **Step 3: Write the LocationCard component**

Create `components/LocationCard.tsx`:

```tsx
import { Location } from "@/lib/types";

type LocationCardProps = {
  location: Location;
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{location.name}</h3>
      <p className="mt-1 text-sm text-gray-700">{location.address}</p>
      <p className="mt-1 text-sm text-gray-700">{location.phone}</p>
      <p className="mt-1 text-sm text-gray-700">{location.email}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/LocationCard.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Write the failing test for the locations page (list view only)**

Create `app/locations/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsPage from "./page";

describe("LocationsPage", () => {
  it("renders all 24 locations in list view by default", () => {
    render(<LocationsPage />);
    expect(screen.getByText("Showing 24 of 24 locations")).toBeInTheDocument();
    expect(screen.getByText("Pasadena")).toBeInTheDocument();
    expect(screen.getByText("Whittier")).toBeInTheDocument();
  });

  it("has a List/Map toggle with List selected by default", () => {
    render(<LocationsPage />);
    const listButton = screen.getByRole("button", { name: "List" });
    const mapButton = screen.getByRole("button", { name: "Map" });
    expect(listButton).toBeInTheDocument();
    expect(mapButton).toBeInTheDocument();
    expect(listButton).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm test -- app/locations/page.test.tsx
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 7: Write the locations page (list view; map view is a placeholder until Task 9)**

Create `app/locations/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/LocationCard";

type View = "list" | "map";

export default function LocationsPage() {
  const [view, setView] = useState<View>("list");

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Find a Clinic</h1>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
          className={`rounded px-4 py-2 text-sm font-medium ${
            view === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          List
        </button>
        <button
          type="button"
          aria-pressed={view === "map"}
          onClick={() => setView("map")}
          className={`rounded px-4 py-2 text-sm font-medium ${
            view === "map" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Map
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Showing {locations.length} of {locations.length} locations
      </p>

      {view === "list" ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex h-96 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400">
          Map view — added in the next task
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- app/locations/page.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 9: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/locations`. Confirm all 24 clinics render as cards in List view, and clicking "Map" swaps to the placeholder box. Resize to mobile width and confirm cards stack in a single column. Stop the server.

---

### Task 9: Google Maps integration for locations

**Files:**
- Create: `components/LocationsMap.tsx`
- Modify: `app/locations/page.tsx`
- Create: `.env.local.example`
- Test: `components/LocationsMap.test.tsx`

**Interfaces:**
- Consumes: `Location[]` (Task 4), `view` state from `app/locations/page.tsx` (Task 8)
- Produces: `<LocationsMap locations={locations} />`, consumed by `app/locations/page.tsx` only.

- [ ] **Step 1: Install the maps library**

```bash
npm install @react-google-maps/api
```

- [ ] **Step 2: Write the failing test**

Create `components/LocationsMap.test.tsx`. This mocks `@react-google-maps/api` so the test doesn't depend on network access or a real API key:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocationsMap } from "./LocationsMap";

vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  MarkerF: ({ title }: { title: string }) => <div data-testid="marker">{title}</div>,
}));

describe("LocationsMap", () => {
  it("renders one marker per location", () => {
    render(
      <LocationsMap
        locations={[
          { id: "a", name: "Alpha", address: "1 A St", phone: "1", email: "a@x.com", extension: "1", lat: 34, lng: -118 },
          { id: "b", name: "Beta", address: "2 B St", phone: "2", email: "b@x.com", extension: "2", lat: 34.1, lng: -118.1 },
        ]}
      />
    );

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/LocationsMap.test.tsx
```

Expected: FAIL — `Cannot find module './LocationsMap'`.

- [ ] **Step 4: Write the LocationsMap component**

Create `components/LocationsMap.tsx`:

```tsx
"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Location } from "@/lib/types";

type LocationsMapProps = {
  locations: Location[];
};

const containerStyle = { width: "100%", height: "24rem" };

// Centered roughly on the Greater LA area, covering all 24 clinics.
const center = { lat: 34.1, lng: -118.3 };

export function LocationsMap({ locations }: LocationsMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
      {locations.map((loc) => (
        <MarkerF key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
      ))}
    </GoogleMap>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- components/LocationsMap.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 6: Wire the map into the locations page**

Modify `app/locations/page.tsx` — replace the placeholder map block:

```tsx
import { LocationsMap } from "@/components/LocationsMap";
```

Add this import near the top alongside the existing imports, then replace:

```tsx
        <div className="mt-4 flex h-96 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400">
          Map view — added in the next task
        </div>
```

with:

```tsx
        <div className="mt-4">
          <LocationsMap locations={locations} />
        </div>
```

- [ ] **Step 7: Create the env var example file**

Create `.env.local.example`:

```
# Get a key from https://console.cloud.google.com/google/maps-apis
# Restrict it to the Maps JavaScript API and this site's domain(s).
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

- [ ] **Step 8: Run the full test suite**

```bash
npm test
```

Expected: all tests still PASS (the mocked test from Step 5 doesn't require a real key).

- [ ] **Step 9: Verify manually**

Copy `.env.local.example` to `.env.local` and fill in a real Google Maps JavaScript API key (get one from the client or create a temporary one for local testing). Run:

```bash
npm run dev
```

Open `http://localhost:3000/locations`, click "Map", and confirm 24 pins render clustered around the Greater LA area with no console errors. Without a key, confirm the "Loading map..." placeholder shows instead of a broken/blank map. Stop the server.

---

### Task 10: Header (nav, mobile menu, booking/pay/portal links)

**Files:**
- Create: `components/Header.tsx`
- Test: `components/Header.test.tsx`

**Interfaces:**
- Consumes: `BOOKING_URL`, `PAY_ONLINE_URL`, `PATIENT_PORTAL_URL`, `MAIN_PHONE` (Task 3)
- Produces: `<Header />`, consumed by `app/layout.tsx` in Task 12.

- [ ] **Step 1: Write the failing test**

Create `components/Header.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";

describe("Header", () => {
  it("renders nav links to Doctors and Locations", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
  });

  it("renders the real booking, pay online, and patient portal links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /appointments/i })).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
    expect(screen.getByRole("link", { name: /pay online/i })).toHaveAttribute(
      "href",
      "https://healowpay.com"
    );
    expect(screen.getByRole("link", { name: /portal log in/i })).toHaveAttribute(
      "href",
      "https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp"
    );
  });

  it("toggles the mobile menu open and closed", async () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(screen.getByTestId("mobile-menu")).toHaveClass("hidden");

    await userEvent.click(toggle);
    expect(screen.getByTestId("mobile-menu")).not.toHaveClass("hidden");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/Header.test.tsx
```

Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 3: Write the Header component**

Create `components/Header.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKING_URL, PAY_ONLINE_URL, PATIENT_PORTAL_URL, MAIN_PHONE } from "@/lib/constants";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold">
          Kids & Teens Medical Group
        </Link>

        <nav className="hidden gap-4 sm:flex">
          <Link href="/doctors">Doctors</Link>
          <Link href="/locations">Locations</Link>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            Appointments
          </a>
          <a href={PAY_ONLINE_URL} target="_blank" rel="noopener noreferrer">
            Pay Online
          </a>
          <a href={PATIENT_PORTAL_URL} target="_blank" rel="noopener noreferrer">
            Portal Log In
          </a>
          <a href={`tel:${MAIN_PHONE.replace(/[^\d+]/g, "")}`}>{MAIN_PHONE}</a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="sm:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      <nav
        data-testid="mobile-menu"
        className={`flex flex-col gap-2 p-4 sm:hidden ${menuOpen ? "" : "hidden"}`}
      >
        <Link href="/doctors">Doctors</Link>
        <Link href="/locations">Locations</Link>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Appointments
        </a>
        <a href={PAY_ONLINE_URL} target="_blank" rel="noopener noreferrer">
          Pay Online
        </a>
        <a href={PATIENT_PORTAL_URL} target="_blank" rel="noopener noreferrer">
          Portal Log In
        </a>
        <a href={`tel:${MAIN_PHONE.replace(/[^\d+]/g, "")}`}>{MAIN_PHONE}</a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/Header.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Verify manually**

No standalone manual verification needed yet — wired into the layout in Task 12.

---

### Task 11: Footer (contact info, quick links)

**Files:**
- Create: `components/Footer.tsx`
- Test: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `MAIN_PHONE`, `TEXT_PHONE`, `GENERAL_EMAIL` (Task 3)
- Produces: `<Footer />`, consumed by `app/layout.tsx` in Task 12.

- [ ] **Step 1: Write the failing test**

Create `components/Footer.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the phone, text line, and email as clickable links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "(818) 361-5437" })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
    expect(screen.getByRole("link", { name: /626\) 298-7121/ })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
    expect(screen.getByRole("link", { name: "customerservice@ktdoctor.com" })).toHaveAttribute(
      "href",
      "mailto:customerservice@ktdoctor.com"
    );
  });

  it("renders quick links to Doctors and Locations", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/Footer.test.tsx
```

Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Write the Footer component**

Create `components/Footer.tsx`:

```tsx
import Link from "next/link";
import { MAIN_PHONE, TEXT_PHONE, GENERAL_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 p-6 text-sm text-gray-600">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-gray-800">Kids & Teens Medical Group</p>
          <p className="mt-2">
            <a href={`tel:${MAIN_PHONE.replace(/[^\d+]/g, "")}`}>{MAIN_PHONE}</a>
          </p>
          <p>
            Text:{" "}
            <a href={`sms:${TEXT_PHONE.replace(/[^\d+]/g, "")}`}>{TEXT_PHONE}</a>
          </p>
          <p>
            <a href={`mailto:${GENERAL_EMAIL}`}>{GENERAL_EMAIL}</a>
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Quick Links</p>
          <ul className="mt-2 flex flex-col gap-1">
            <li>
              <Link href="/doctors">Doctors</Link>
            </li>
            <li>
              <Link href="/locations">Locations</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/Footer.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Verify manually**

No standalone manual verification needed yet — wired into the layout in Task 12.

---

### Task 12: Root layout and home page

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Test: `app/page.test.tsx`

**Interfaces:**
- Consumes: `<Header />` (Task 10), `<Footer />` (Task 11), `BOOKING_URL` (Task 3)
- Produces: the final wired app — no further tasks depend on this one.

- [ ] **Step 1: Write the failing test for the home page**

Create `app/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders links to find a doctor, find a clinic, and book an appointment", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: /find a doctor/i })).toHaveAttribute(
      "href",
      "/doctors"
    );
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
    expect(screen.getByRole("link", { name: /book/i })).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- app/page.test.tsx
```

Expected: FAIL — the current placeholder page has none of these links.

- [ ] **Step 3: Rewrite the home page**

Modify `app/page.tsx`:

```tsx
import Link from "next/link";
import { BOOKING_URL } from "@/lib/constants";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold">Kids & Teens Medical Group</h1>
      <p className="mt-2 text-gray-600">
        Board-certified pediatric care across Greater LA.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700"
        >
          Book an Appointment
        </a>
        <Link
          href="/doctors"
          className="rounded border border-gray-300 px-6 py-3 text-center font-medium hover:bg-gray-50"
        >
          Find a Doctor
        </Link>
        <Link
          href="/locations"
          className="rounded border border-gray-300 px-6 py-3 text-center font-medium hover:bg-gray-50"
        >
          Find a Clinic
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/page.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Wire Header and Footer into the root layout**

Modify `app/layout.tsx` to render `<Header />` above `{children}` and `<Footer />` below it, keeping the existing `<html>`/`<body>` structure and metadata that `create-next-app` generated:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kids & Teens Medical Group",
  description: "Board-certified pediatric care across Greater LA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Run the full test suite**

```bash
npm test
```

Expected: every test file across all 12 tasks passes.

- [ ] **Step 7: Verify manually end-to-end**

```bash
npm run dev
```

Walk through the whole site in the browser pane:
1. Open `http://localhost:3000` — confirm header, home page CTAs, and footer render.
2. Click "Find a Doctor" — confirm `/doctors` loads, filters work, "Book Online" opens Healow.
3. Click "Find a Clinic" — confirm `/locations` loads, List/Map toggle works, map shows pins (if `.env.local` has a real key).
4. Click "Portal Log In" and "Pay Online" in the header — confirm they open the real eClinicalWorks and healowpay.com URLs in new tabs.
5. Resize to mobile width (375px) — confirm the header's mobile menu toggle works and both pages remain usable.

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** Tech stack (Task 1), types/constants (Task 3), locations data (Task 4), doctors data (Task 5), doctors page with filters (Task 7), locations page with map (Tasks 8–9), booking/pay/portal links (Tasks 3, 10, 11), mobile responsiveness (verified manually in Tasks 7, 8, 12), KTMG-only brand scope (no sub-brand code anywhere) — all covered.
- **Known gaps carried forward from the spec, not silently resolved:** the `hollywood-legacy` location placeholder (Task 5/6), approximate (city-level, not street-level) lat/lng (Task 4), missing real specialty data (Task 5), and `la-mirada`/`west-la` email/extension values inferred from a naming pattern rather than confirmed (Task 4) — all explicitly flagged in-line for the client to confirm before launch, matching the spec's "Known gaps / risks" section.
- **No git:** every task ends in a manual verification step, not a commit, per the Global Constraints.
