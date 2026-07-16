# One Network Showcase — Design Spec

Date: 2026-07-15
Status: Approved (Phase 2, part 1 of the KTMG website rebuild)

## Background

The boss's manus.space mockup includes an "Our Network" section presenting
KTMG alongside two sister companies — St. Gianna Medical Group and LA
Intensive Pediatric Therapy — each linking out to their own real external
site. Both prior developer redesigns omitted this section entirely, which is
one of the reasons the boss rejected them (see
[docs/superpowers/specs/2026-07-15-doctors-locations-booking-core-design.md](2026-07-15-doctors-locations-booking-core-design.md)).

This spec covers restoring that network showcase, built from real content
scraped directly from the two sister companies' live sites — not the
fictionalized copy in the boss's mockup.

## Goals

- Give KTMG's site a "One Network" page and homepage teaser presenting all
  three brands.
- Use each sub-brand's real logo, real services, and real contact info.
- Link out to the sub-brands' own sites for booking/more info — do not
  duplicate their doctor/location data in this codebase (explicit client
  decision: those are separate businesses with their own existing sites).

## Real reference data (captured 2026-07-15)

### St. Gianna Medical Group — sgmdoctor.com

- Real logo saved to `public/sgm-logo.png` (678×386, downloaded directly from
  `sgmdoctor.com/wp-content/uploads/2024/06/Asset-1.png`)
- Tagline (their own copy): "From Checkups to Urgent Care — Pediatric
  Services Near You"
- Real services/features: same-day appointments, 24/7 booking, most
  insurances accepted, telehealth, advanced wound care, instant medical
  records access
- Explicitly describes itself as partnered with "LA's Largest Pediatric
  Medical Group" (KTMG)
- Phone: 818-308-4100 (primary contact number found on their site)
- External URL: `https://www.sgmdoctor.com`

### LA Intensive Pediatric Therapy — laipt.org

- Real logo saved to `public/laipt-logo.png` (500×500, downloaded directly
  from `laipt.org/wp-content/uploads/2025/07/image-1-1.png`)
- Real services: speech therapy, occupational therapy, developmental/sensory
  therapy methods (NDT, Sensory Integration, PROMPT, and others), individual
  and center-based programs
- Address: 10780 Santa Monica Blvd, Suite 405, Los Angeles, CA 90025 — this
  matches the `west-la` location already hardcoded in
  `data/locations.ts` (Task 4 of Phase 1) as a KTMG location; note this for
  implementation — the `west-la` KTMG location and the LAIPT address are the
  same building, but they remain two separate `data/*.ts` records (KTMG
  locations vs. network brands) since they're different legal entities.
- Phone: (310) 234-0300
- Email: customerservice@laipt.org
- External URL: `https://www.laipt.org`

### KTMG (flagship, this site)

- Uses the existing `/clinic-logo.svg` and existing doctor/location data.
- Links internally to `/doctors` instead of an external URL.

## Data model

New file `data/network.ts`:

```ts
export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  logoSrc: string;       // local path, e.g. "/sgm-logo.png"
  externalUrl?: string;  // omitted for the KTMG flagship card
  internalHref?: string; // "/doctors" for the KTMG flagship card only
};
```

## Pages

- `/network` — intro heading, then the 3 brand cards in a grid. Each card:
  logo, name, tagline, short description, services list (chips), and a CTA
  ("Visit site →" for sub-brands opening the external URL in a new tab,
  "Browse doctors →" for KTMG linking internally to `/doctors`).
- Homepage teaser — a smaller version of the same 3 cards (logo, name,
  one-line description, CTA) in a new section, with a "See the full network
  →" link to `/network`.

## Explicitly out of scope

- No doctor or location data for St. Gianna or LAIPT inside this codebase.
- No booking integration for the sub-brands beyond linking to their own
  sites (they have their own booking systems).
- No EN/ES translation of this content (later phase).

## Known gaps / risks to track

- St. Gianna's site has a placeholder `mailto:contact@mysite.com` link (an
  unconfigured template artifact) — do not use that email anywhere; use only
  the phone number and external URL captured above.
- Confirm both external URLs and logos still resolve before launch (both were
  live and returned valid images as of 2026-07-15).

## Next steps

1. Write an implementation plan (writing-plans skill).
2. After this ships, move to the next Phase 2 sub-project (Foundation page,
   or Blog + Careers + Insurance, or EN/ES — to be decided with the client).
