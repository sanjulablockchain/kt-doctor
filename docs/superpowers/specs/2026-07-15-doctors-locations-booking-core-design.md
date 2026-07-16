# Doctors / Locations / Booking Core — Design Spec

Date: 2026-07-15
Status: Approved (Phase 1 of the KTMG website rebuild)

## Background

KTMG (Kids & Teens Medical Group) currently runs its public site on WordPress
(`ktdoctor.com`), which is unreliable (observed Cloudflare 524 origin timeouts
during research, and a broken/empty "About us" page). Three prior rebuild
attempts exist:

- `https://ktmghealth-74jvgnj5.manus.space` — built by the boss, most complete
  (multi-brand network, Foundation/charity page, careers, blog, FAQ), but uses
  simplified/fictional doctor data and a Manus-platform-specific map
  implementation that doesn't work outside Manus hosting.
- `https://ktdoctor.vercel.app` and `https://ktmg-redesign.vercel.app` — built
  by the other developers. Both are missing the multi-brand network, the
  Foundation page, and the Serendib cross-sell that the boss's version has.
  This is the most likely reason the boss rejected them — not visual quality.

This spec covers **Phase 1 only**: the doctors directory, locations directory
(with map), and booking/portal/pay links. Later phases (sub-brands, Foundation,
blog, careers, insurance, EN/ES) are out of scope here and will get their own
specs.

The new site is being built quietly, in parallel with the existing site, and
is expected to take about 6 months before it replaces the current booking
flow. Until then, booking/doctor-lookup/appointment behavior must continue to
route to Healow exactly as it does today — the new site is a like-for-like
frontend rebuild first, not a booking-system replacement.

## Goals

- Replace the WordPress doctors/locations pages with a fast, reliable Next.js
  equivalent.
- Preserve real production behavior: Healow booking links, eClinicalWorks
  patient portal, healowpay.com payments — unchanged.
- Fix the boss's-mockup's oversimplified doctor-location data (1 doctor : 1
  location) with the real many-to-many structure.
- Ship an interactive locations map using our own Google Maps key (not tied to
  any third-party platform proxy).
- Mobile responsive throughout. Reuse existing KTMG logo assets.

## Explicitly out of scope for Phase 1

Sub-brands (St. Gianna Medical Group, LA Intensive Pediatric Therapy),
Foundation/charity page, blog, careers, insurance-logo strip, EN/ES language
toggle. These are deferred to the content/network phase that follows.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Hardcoded data** as typed TS files under `data/` — no database, no CMS, no
  admin panel for now (explicit call from the client — can be revisited
  later if content-update volume grows).
- **Google Maps JavaScript API**, our own API key via env var
  (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`). Lat/lng hardcoded per location (geocode
  once, store the result — do not live-geocode on page load, which is what
  the boss's mockup does and which fails outside the Manus proxy).
- Deploy target: Vercel.

## Data model

```ts
type Location = {
  id: string;          // slug, e.g. "agoura-hills"
  name: string;         // "Agoura Hills"
  address: string;      // full street address
  phone: string;        // main clinic line, e.g. "(818) 361-5437"
  email: string;        // clinic-specific inbox, e.g. agourahills@ktdoctor.com
  extension: string;    // phone extension for this clinic, e.g. "207"
  lat: number;
  lng: number;
};

type Doctor = {
  id: string;
  name: string;
  credentials: string;   // "MD, FAAP" | "PNP" | "PA-C" | "NP" | "DO" | "FNP-C" | ...
  specialties: string[]; // e.g. ["Pediatrics"], ["Pediatrics", "ADHD"]
  locationIds: string[]; // many-to-many — most doctors have 1, some have 2-4
};
```

Booking links are NOT per-doctor. Every "Book Appointment" / "Book Online" CTA
site-wide points to the same Healow practice URL (see Booking section below).

## Real reference data (captured from ktdoctor.com, 2026-07-15)

### Locations — 24 clinics (from `/directory/`)

| Location | Address | Email | Ext |
|---|---|---|---|
| Agoura Hills | 5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301 | agourahills@ktdoctor.com | 207 |
| Arcadia | 16 E Huntington Dr, Arcadia, CA 91006 | arcadia@ktdoctor.com | 060 |
| Beverly Hills | 8733 Beverly Blvd # 200, West Hollywood, CA 90048 | beverlyhills@ktdoctor.com | 115 |
| Camarillo | 2486 Ponderosa Dr. N., Suite D-211, Camarillo, CA 93010 | camarillo@ktdoctor.com | 469 |
| Canyon Country | 20655 Soledad Canyon Rd Suite 25, Canyon Country, CA 91351 | canyoncountry@ktdoctor.com | 014 |
| Culver City | 3831 Hughes Ave #602, Culver City, CA 90232 | culvercity@ktdoctor.com | 073 |
| Downey | 11525 Brookshire Ave STE 302, Downey, CA 90241 | downey@ktdoctor.com | 079 |
| Glendale | 1530 E Chevy Chase Dr Ste 202, Glendale, CA 91206 | glendale@ktdoctor.com | 239 |
| La Cañada | 1021 Foothill Blvd, La Canada Flintridge, CA 91011 | lacanada@ktdoctor.com | 841 |
| Mission Hills | 10200 Sepulveda Blvd #200, Mission Hills, CA 91345 | missionhills@ktdoctor.com | 195 |
| Northridge | 8628 Reseda Blvd, Northridge, CA 91324 | northridge@ktdoctor.com | 713 |
| Pasadena | 504 S Sierra Madre Blvd, Pasadena, CA 91107 | pasadena@ktdoctor.com | 118 |
| Pico Rivera | 8337 Telegraph Rd #119, Pico Rivera, CA 90660 | picorivera@ktdoctor.com | 191 |
| San Fernando | 777 Truman St. Suite 105, San Fernando, CA 91340 | sanfernando@ktdoctor.com | 774 |
| Santa Monica | 3200 Santa Monica Blvd UNIT 204, Santa Monica, CA 90404 | santamonica@ktdoctor.com | 059 |
| San Pedro | 887 W 9th St, San Pedro, CA 90731 | sanpedro@ktdoctor.com | 443 |
| Tarzana | 18372 Clark St #226, Tarzana, CA 91356 | tarzana@ktdoctor.com | 136 |
| Torrance | 3524 Torrance Blvd Suite 101, Torrance, CA 90503 | torrance@ktdoctor.com | 247 |
| Valencia | 24330 McBean Pkwy, Valencia, CA 91355 | valencia@ktdoctor.com | 026 |
| Van Nuys | 14426 Gilmore St Suite B, Van Nuys, CA 91401 | vannuys@ktdoctor.com | 302 |
| West Hills | 22736 Vanowen St #300, West Hills, CA 91307 | westhills@ktdoctor.com | 110 |
| Whittier | 13470 Telegraph Rd, Whittier, CA 90605 | whittier@ktdoctor.com | 103 |

Note: 24 locations listed in the directory. The main phone number for most
clinics is (818) 361-5437; a few (per the boss's mockup, needs re-verification
against ktdoctor.com directly) use different area-code numbers — verify before
launch.

Lat/lng are not yet captured — need to be geocoded once (Google Geocoding API
or manual lookup) and hardcoded into `data/locations.ts` as part of
implementation, not computed at runtime.

### Doctors — grouped by clinic (from `/our-doctors/`, real roster)

This is real data — many doctors appear at multiple clinics. Representative
sample (not exhaustive — full roster should be re-scraped/verified against
ktdoctor.com at implementation time since it may have changed):

- Martin Fineberg, MD, FAAP — Beverly Hills, Culver City, Pasadena, Torrance
- Hilma Benjamin, MD, FAAP — Mission Hills, Northridge, West Hills, La Cañada
- Miguel Sutter, PA-C — Northridge, Pasadena, Van Nuys, West Hills
- Sylvia Lam, MD, FAAP — Arcadia, Pasadena
- Erika Lee, PNP — Arcadia, Pasadena
- Rohina Furmuly, PA-C — Beverly Hills, Culver City
- Yussef Sakhai, MD — Beverly Hills, Culver City, Santa Monica
- Rena Keynigshteyn, MD — Culver City, Tarzana
- Narindar Nat, MD, FAAP — Canyon Country, Northridge
- Sharmetha Ramanan, PNP — Beverly Hills, Glendale
- Jocelyn Zuniga, MD/MD FAAP — Arcadia, Downey
- Mealynne Ngu, PNP — Glendale, La Cañada
- Michels Savannah, NP — Beverly Hills, Torrance
- Rebecca Kim, NP — Hollywood, Torrance, Santa Monica (as "Kim Rebecca")
- Luis Garcia, PNP/NP — Pico Rivera, Whittier, Torrance
- Carolina Ungs, MD — Pico Rivera, Pasadena, Whittier
- Mercy Aeri, PA/MD — Pico Rivera, Torrance, Whittier
- Victoria Millet, MD, FAAP — Northridge, San Fernando
- Halavi Delaram, PA — Beverly Hills, Santa Monica
- Banpreet Samra, PA — Tarzana, Northridge, West Hills, Valencia
- Janesri De Silva, MD, FAAP — La Cañada, Pasadena (network founder/CEO)
- Benjamin Behroozan, MD — Hollywood, Santa Monica
- Jose Vargas, PA — San Fernando, Van Nuys
- Laurie Beth Juarez-Morales, MD — San Fernando, Van Nuys
- Emily Brandt, MD — Glendale, Pasadena
- Barbara Rodriguez, MD, FAAP — Pasadena
- Mark Snyder, MD, FAAP — Agoura Hills, West Hills
- Casie McGuire, FNP-C — Canyon Country, Valencia
- Palak Shelat, MD, FAAP — Northridge, Valencia
- Brian Bhatt, MD, FAAP — Northridge, Valencia
- Adrienne C. Altman, MD — Valencia
- Ahoo Sahba, MD — Van Nuys
- Amrita Dosanjh, MD — West Hills
- Anwar Arastu, MD — La Mirada
- Vaseema Arastu, MD, FAAP — La Mirada
- Victor Tamashiro, MD — Mission Hills
- Monique Craig, PA — Culver City
- Azam Jazayeri, MD — Culver City
- Oliver Petalver, PA-C — Downey
- Maria Vega, PNP — Downey
- Tisha Pison, PNP — Downey
- Kim Yeongbu, NP (Saturdays only) — Hollywood
- Njie Ernestine, FNP-C — Hollywood
- Patino Cecilia, NP — Hollywood
- Tatiana Genjoyan, PNP — La Cañada
- Lisa Gutierrez, NP — La Cañada
- Cze-Ja Tam, NP — La Cañada
- Fatemeh Anari, PA-C — Northridge
- Kelli Hernandez, NP — West Hills
- Roobina Hakoopian, NP — Pasadena
- Hantman David, MD — Santa Monica
- Sohn Alea, NP — Santa Monica, Torrance
- Carolyn Czaplicki, DO — San Pedro
- Michael Green, PA — San Pedro
- Greta Vines-Douglas, PA — San Pedro
- Erik Saenz, NP — Whittier

**Action item for implementation:** re-verify this full roster directly
against `www.ktdoctor.com/our-doctors/` at build time (site availability was
intermittent during research — some 524 timeouts), since staff may add/remove
doctors before Phase 1 ships.

### Booking / portal / pay integration (real URLs, confirmed working links)

- **Book Appointment** (site-wide, all doctors, no per-doctor deep link):
  `https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2`
- **Pay Online**: `https://healowpay.com`
- **Patient Portal** (separate system — eClinicalWorks, not Healow):
  `https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp`
- Main phone: `(818) 361-5437` · Text line: `(626) 298-7121`
- General email: `customerservice@ktdoctor.com`

These should be stored as named constants (not scattered literals) so they're
trivial to swap when the in-house booking system replaces Healow in ~6 months.

## Pages (Phase 1)

- `/doctors` — filterable by location + specialty. Search by name. Each card
  shows credentials, specialties, all clinic locations the doctor practices
  at, and a "Book Online" CTA (site-wide Healow link).
- `/locations` — List/Map toggle. List view: address, phone, email, hours (if
  available). Map view: Google Maps with a pin per clinic, using our own API
  key and hardcoded lat/lng (geocoded once, not at runtime).
- Global header/footer: Book Appointment, Pay Online, Patient Portal links as
  above.

## Known gaps / risks to track

- Doctor roster and location list must be re-verified against the live site
  before launch — research hit intermittent Cloudflare 524s, so some data may
  be stale or incomplete.
- A few clinic phone numbers may differ from the primary (818) 361-5437 number
  (seen in the boss's mockup) — needs confirmation against the real directory.
- Lat/lng values are not yet captured for any location — must be geocoded
  during implementation, not left as a TODO in production code.
- No CMS/DB for now, per explicit client decision — if content update
  frequency becomes a burden on the small dev team, revisit this in a later
  phase.

## Next steps

1. Write an implementation plan (writing-plans skill).
2. Initialize the actual Next.js project (git init, scaffold, CLAUDE.md).
3. After Phase 1 ships, spec Phase 2: sub-brands, Foundation/charity page,
   blog, careers, insurance, EN/ES.
