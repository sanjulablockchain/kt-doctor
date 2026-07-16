# Sri Lanka Initiatives — Design

## Goal

Represent three real, currently-under-represented Sri Lanka initiatives on the
site:

1. **Kids and Teens Foundation's "Transforming School Wellness in Sri Lanka"
   campaign** (kidsandteensfoundation.org) — 4 Negombo schools with active
   wellness-center programs. The site currently only has a vague, stale
   placeholder line about this ("date to be announced").
2. **St. Joseph Hospital Negombo** (sjhospital.lk) — a real, operating
   hospital "managed and operated by Kids & Teens Pediatric Medical Group,
   USA," which belongs in the site's "One Network" section alongside St.
   Gianna Medical Group and LA Intensive Pediatric Therapy.
3. **Asiacorp Insurance Brokers / ACIG** (acig.lk) — the local insurance
   partner coordinating coverage for St. Joseph Hospital patients. Gets a
   small, named, linked credit alongside the hospital — no dedicated
   section of its own.

## Decisions carried from brainstorming

- The existing "Medical Missions" program card in `data/foundation.ts`
  stays **exactly as-is, unchanged** — the new Sri Lanka section is
  additional content further down the page, not a replacement.
- **No dollar figures or per-school completion percentages** (e.g. "$47,500
  raised", "98% screening completion") are shown on kt-doctor — these are
  live, perishable snapshot numbers with no backend to keep them current.
  Instead, link out to kidsandteensfoundation.org for real-time figures.
- The 4 schools render as a **connected timeline** (a vertical line with dot
  markers, chosen via the visual companion over a divided-roster-list and a
  compact-table alternative) — deliberately different from the card-grid
  pattern used everywhere else on the site.
- `/foundation` has no i18n today (plain English, no `useTranslations`) — the
  new section follows that existing convention; no translation keys are
  added.
- ACIG's credit lives only on the St. Joseph Hospital network card (a small
  secondary link), not as its own section or card.

## Part 1: Foundation — Sri Lanka School Wellness section

### Data (`data/foundation.ts`)

Add two new exports (the existing `Foundation` type, `foundation` object, and
its `programs` array — including the unchanged "Medical Missions" entry —
stay exactly as they are today):

```ts
export type SriLankaSchool = {
  id: string;
  name: string;
  location: string;
  studentCount: string;
  programs: string[];
};

export type SriLankaProgram = {
  heading: string;
  mission: string;
};

export const sriLankaProgram: SriLankaProgram = {
  heading: "Transforming School Wellness in Sri Lanka",
  mission:
    "Converting and managing wellness centers at leading Negombo schools — bringing world-class pediatric care to students who need it most.",
};

export const sriLankaSchools: SriLankaSchool[] = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    programs: [
      "Vision Screening",
      "Dental Check-ups",
      "Nutrition Programs",
      "Mental Health Counseling",
    ],
  },
  {
    id: "st-josephs-college",
    name: "St. Joseph's College",
    location: "Negombo",
    studentCount: "900+ students",
    programs: [
      "Sports Physicals",
      "Immunization Drives",
      "First Aid Training",
      "Health Education",
    ],
  },
  {
    id: "loyola-college",
    name: "Loyola College",
    location: "Negombo",
    studentCount: "1,100+ students",
    programs: [
      "Telehealth Access",
      "Chronic Disease Mgmt",
      "Hygiene Programs",
      "Parent Workshops",
    ],
  },
  {
    id: "maristella-college",
    name: "Maristella College",
    location: "Negombo",
    studentCount: "800+ students",
    programs: [
      "Speech Therapy",
      "Occupational Therapy",
      "Sensory Programs",
      "Growth Monitoring",
    ],
  },
];
```

The 4 "impact areas" (name + one-sentence description, no stats) are static
JSX content directly in the page component — they're page-specific prose, not
reusable data, matching how `app/[locale]/foundation/page.tsx` already mixes
hardcoded strings ("Our programs") with imported data:

1. **Preventive Health Screenings** — "Early detection of health issues
   through regular screenings for vision, hearing, dental, and nutrition —
   reducing long-term healthcare costs."
2. **Student Mental Wellness** — "On-campus counseling and mental health
   support programs that improve academic performance, reduce absenteeism,
   and build resilience."
3. **International Healthcare Standards** — "Bringing US-trained pediatric
   expertise and evidence-based protocols to Sri Lanka, elevating the
   quality of school-based healthcare."
4. **Community Health Impact** — "Wellness centers serve not just students
   but entire families — creating a ripple effect of health literacy and
   preventive care across Negombo."

### Component: `components/SriLankaTimeline.tsx`

- Server component (no interactivity needed — static content).
- Props: `{ schools: SriLankaSchool[] }`.
- Renders the connected-timeline layout selected in brainstorming: a vertical
  teal line (`bg-teal-tint`) with a small filled dot (`bg-teal` circle,
  ring in `teal-tint`) beside each school, school name in `font-display`
  bold, `location · studentCount` as a muted meta line
  (`text-sm text-ink-soft`), and each program as a small pill
  (`rounded-full border border-border px-3 py-1 text-xs`, matching the pill
  style already used for `NetworkBrand.services` in `NetworkCard.tsx`).
- Wrapped in the same `rounded-3xl border border-border bg-white p-8
  shadow-card` container style used elsewhere on this page, so it reads as
  part of the same design system despite the different internal layout.

### Page wiring (`app/[locale]/foundation/page.tsx`)

New section appended after the existing "Our programs" grid:

- Eyebrow: reuse the page's existing eyebrow style, text "Sri Lanka
  Initiative".
- Heading: `{sriLankaProgram.heading}`.
- Body: `{sriLankaProgram.mission}`.
- The 4 impact areas in a 2-column grid (matching the "Why families choose
  us" feature-list grid pattern on the homepage: bold name + description,
  no icons needed here since there's no icon set for these 4 concepts).
- `<SriLankaTimeline schools={sriLankaSchools} />`.
- A single CTA link, "See live campaign progress & donate →", pointing to
  the existing `foundation.siteUrl` (no new URL field needed — the live
  donation progress bar lives on that same foundation homepage).

Update the page's `metadata.description` to mention the Sri Lanka program.

## Part 2: Network — St. Joseph Hospital + ACIG credit

### Type change (`data/network.ts`)

Add one new optional field to the existing `NetworkBrand` type (all other
fields and the 3 existing brand objects stay unchanged):

```ts
export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  logoSrc: string;
  externalUrl?: string;
  internalHref?: string;
  partnerCredit?: { label: string; url: string };
};
```

### New brand entry

```ts
{
  id: "st-joseph-hospital",
  name: "St. Joseph Hospital Negombo",
  tagline: "US-standard care in Negombo, Sri Lanka.",
  description:
    "A hospital in Negombo, Sri Lanka, managed and operated by Kids & Teens Pediatric Medical Group, USA — bringing American healthcare standards to affordable, accessible care.",
  services: [
    "Emergency & Outpatient Care",
    "Inpatient Care",
    "Telemedicine",
    "Pharmacy & Diagnostics",
  ],
  logoSrc: "/sjh-logo.png",
  externalUrl: "https://www.sjhospital.lk",
  partnerCredit: {
    label: "Insurance coordination via Asiacorp Insurance Brokers",
    url: "https://acig.lk",
  },
},
```

`public/sjh-logo.png` has already been downloaded from the real
sjhospital.lk site (1248×386 PNG, same acquisition pattern as the other
brand logos already in `public/`).

### `components/NetworkCard.tsx`

Render `partnerCredit` when present: a small secondary link below the
existing "Visit site →" / "Browse doctors →" CTA, styled as muted text with
an underline-on-hover (clearly secondary to the primary CTA, e.g.
`text-xs text-ink-soft hover:text-teal-dark underline-offset-2
hover:underline`), opening in a new tab (`target="_blank" rel="noopener
noreferrer"`). Absent for the 3 existing brands (no visual change to them).

### Grid and copy updates for 4 brands

- `app/[locale]/page.tsx` (homepage "Network teaser", compact cards):
  `grid-cols-1 gap-5 sm:grid-cols-3` → `grid-cols-1 gap-5 sm:grid-cols-2
  lg:grid-cols-4`.
- `app/[locale]/network/page.tsx`: same grid change
  (`sm:grid-cols-2 lg:grid-cols-3` → `sm:grid-cols-2 lg:grid-cols-4`); body
  copy "works alongside two sister companies" → "works alongside three
  sister companies"; `metadata.description` updated to include St. Joseph
  Hospital Negombo.

## Testing

- `data/foundation.test.ts`: assert `sriLankaSchools` has the 4 expected
  school ids, each with non-empty `programs`; assert `sriLankaProgram`
  fields are non-empty. Assert the existing "medical-missions" program in
  `foundation.programs` is unchanged (still present, same description).
- `components/SriLankaTimeline.test.tsx`: renders all 4 school names and
  their program pills.
- `app/[locale]/foundation/page.test.tsx`: new assertion that the Sri Lanka
  section heading and at least one school name render.
- `data/network.test.ts` (if it exists) or `components/NetworkCard.test.tsx`:
  new case asserting `partnerCredit` renders a link to `acig.lk` when
  present, and is absent for brands without it.
- `app/[locale]/network/page.test.tsx` and `app/[locale]/page.test.tsx`:
  update/add assertions covering St. Joseph Hospital's presence in both
  grids.

## Out of scope

- Live/dynamic donation figures or completion-rate stats (explicitly
  deferred to linking out to kidsandteensfoundation.org).
- A dedicated ACIG page, card, or section.
- Spanish translations for any of this content (`/foundation` and
  `/network` have no i18n today; not introduced here).
- Any change to the existing "Medical Missions" program card's own text.
