# Careers Page Enrichment — Design Spec

Date: 2026-07-29
Status: Proposed (pending user spec review)

## Background

The current `/careers` page ([`components/CareersPageContent.tsx`](../../../components/CareersPageContent.tsx))
already ships the [2026-07-24 redesign](2026-07-24-careers-page-redesign-design.md): hero, a
4-item perks strip, a single Benefits section, a filterable Open Positions list with a
details modal, a single Culture band, an application form, and the anti-scam notice.

The client (Sanjula, `@ktdoctor.com`) now wants the page enriched with company-story,
culture, and network content, using two references shared in chat:

- Screenshots from `https://www.ktdoctor.com/careers/` (a video thumbnail, a team photo
  under a branded tent, two stacked team/care photos) and a separate wireframe/mockup
  screenshot of a "Find where you belong" role-category browser (this one contains a
  literal placeholder — "PHOTO - PHYSICIANS AT WORK" — so it is a design reference, not
  scraped content).
- The live `ktdoctor.com` site and the `/network` page in this app, for supporting data.

### Research findings (grounds this spec in verified facts)

- **Real media confirmed via live-browser inspection** (a plain fetch does not surface
  these — they load through the site's slider/JS): a 2-minute promo video
  `wp-content/uploads/2024/09/48-Kt-2Min-Video-V6-1.mp4` (26.3 MB, `video/mp4`) with poster
  frame `Screenshot-58.png.webp`; team-under-tent photo `ktmgnewupdated-1536x989.png.webp`;
  team photo `KidsTeensMedicalGroup-0033-1.jpg` (3600x2401); two stock hero backgrounds
  (`AdobeStock_931738183.jpeg`, `tim-gouw-...-unsplash.jpg.webp`).
- **No founder biography exists anywhere** — not on `ktdoctor.com` (homepage, careers page,
  about page nav), not in this repo. The only verifiable facts: the practice is legally
  organized as "Janesri De Silva MD, A Professional Corporation" (see `BOOKING_URL` in
  `lib/constants.ts`), and the Kids and Teens Foundation runs the "Janesri and Sunil De
  Silva Scholarship" (`data/foundation.ts`). No other biographical detail is invented.
- **"Why choose us" bullets are real**, pulled from the live site: flexibility to manage
  hours and patient relationships, full support of an experienced administrative team and
  senior doctors, clinical processes refined over years of experience, established
  partnerships with hospitals/labs/MCOs/ACOs. These already closely match this app's
  existing `cultureValue1-4` copy.
- **Benefits copy is real**: 401(k) with profit sharing, health & dependent care coverage,
  tuition discounts, generous vacation/holiday/sick leave, and a "unique restricted bonus"
  described as easing student loans and supporting retirement goals.
- **LA network data needs no new content** — `data/locations.ts` already has all 25 real
  clinics with lat/lng, and `components/LocationsMap.tsx` (Leaflet-based, dynamically
  imported, no-SSR) already renders them with theme-aware tiles, popups, and directions
  links, used on `/locations` and `/network`.
- **No FAQ exists on the live site.** The pasted FAQ screenshot text was garbled (OCR/font
  artifact); decoded to 7 plausible candidate-FAQ questions (see the New data model section
  below), drafted from facts already established in this codebase.
- **The "Find where you belong" role browser is a design reference, not live content.** Its
  8 category labels are used as-is; per-category descriptions are drafted to match the one
  real example shown ("Physicians — Deliver comprehensive pediatric care while working
  with experienced clinical and administrative teams").

## Goals

- Enrich the existing careers page with real company-story, culture, and network content,
  without fabricating facts about real named individuals.
- Reuse existing data and components wherever the content already exists in this app
  (`data/locations.ts`, `LocationsMap`, `data/careers.ts` departments/positions) instead of
  duplicating it.
- Clearly flag drafted-but-unverified content (founder story, FAQ answers, 7 of 8 role
  category descriptions) so the client can correct it before launch, matching the existing
  precedent of the seed position list being "client to confirm."
- Keep the page fully responsive, dark/light-mode correct, bilingual (EN/ES), and accessible.

## Page structure (new section order)

Sections in **bold** are new; the rest already exist and are unchanged in position.

1. **Hero** — unchanged.
2. **Our Story** (new) — eyebrow + heading, 2-3 short paragraphs: founding narrative ("18+
   years," "largest pediatric group in Greater LA," legally organized under Janesri De
   Silva MD), a clearly-scoped mention of Sunil and Janesri De Silva tied only to the
   verified Foundation scholarship fact, and the real 2-minute video embedded alongside
   (poster image, `<video controls preload="none">`, no autoplay). A caption states the
   video has no captions/transcript available (accessibility note, see below).
3. **Why Choose Us** (new, split out of the current Culture band) — the 4 real bullets
   (flexibility and scheduling, administrative + senior-doctor support, refined clinical
   processes, established partnerships), each as a short card, with the real team-tent
   photo as a supporting image. Replaces `cultureValue1-4` as a standalone section rather
   than a sidebar list.
4. Perks strip — unchanged.
5. **Benefits deep-dive** (replaces the current single Benefits section) — 4 category
   groups matching the client's request: **Health & Wellbeing** (medical/dental/vision,
   dependent care), **Financial Benefits** (401(k) + profit sharing, the loan-easing
   bonus), **Work-Life Support** (generous PTO, flexible scheduling), **Professional
   Development** (tuition discounts, CME/licensure support). Each group is a card with a
   heading, 2-3 line items, and an icon; keeps the existing `benefits.jpg` as the section's
   supporting image (see Media plan).
6. **The Values Behind Our Care** (new, replaces the narrative half of the old Culture
   band) — the 4 values currently only named in passing inside `cultureBody`'s prose
   (compassion, teamwork, innovation, personalized care). Each gets a new short
   1-sentence description drafted for this section (they have never been individually
   described before, only listed in a sentence), presented as 4 cards with the real
   team photo as a supporting image.
7. **LA Network** (new) — heading + short intro, live stats (25 clinics, 61 providers, 18+
   years — counts pulled from `locations.length` / `doctors.length`, not hardcoded), and
   the existing `LocationsMap` component fed `locations` from `data/locations.ts` directly.
8. **Find Where You Belong** (new) — 8 role-category cards (Physicians, Advanced Practice
   Providers, Nursing & Clinical Support, Medical Assistants, Front Office & Patient
   Services, Clinic Operations & Leadership, Corporate & Administrative Services, Students
   & Early Careers), each mapped to one or more `Department` values in `data/careers.ts`,
   showing a live open-role count computed from `positions`, and an "Explore roles" button
   that sets the department filter and scrolls to Open Positions. Real per-category photos
   don't exist (only one category had a reference image, and it was a gray placeholder),
   so the section uses one generic supporting image (the existing `culture.jpg`, freed up
   by retiring the old Culture band) rather than 8 fabricated category photos.
9. Open Positions — unchanged (now also reachable via the role browser).
10. Application form — unchanged.
11. **Candidate FAQ** (new) — accordion, 7 items (see below), drafted answers flagged for
    client review.
12. Anti-scam notice — unchanged.

## New data model

### `data/careers.ts` additions

```ts
export type RoleCategoryId =
  | "physicians"
  | "advancedPractice"
  | "nursingClinicalSupport"
  | "medicalAssistants"
  | "frontOffice"
  | "clinicOperations"
  | "corporateAdmin"
  | "studentsEarlyCareers";

export type RoleCategory = {
  id: RoleCategoryId;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  departments: Department[]; // which existing Department values this category filters to
};

export const roleCategories: RoleCategory[] = [ /* 8 entries, drafted, client to confirm */ ];
```

`departments` lets a category map to more than one existing `Department` (e.g. "Nursing &
Clinical Support" -> `["Clinical Support"]`, "Corporate & Administrative Services" ->
`["Administration", "Finance"]`). Open-role counts are computed at render time via
`positions.filter(p => category.departments.includes(p.department)).length`, never
hardcoded, so they can never drift from the real seed list.

### `data/careersFaq.ts` (new file)

```ts
export type FaqItem = {
  id: string;
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
};

export const careersFaq: FaqItem[] = [ /* 7 entries, drafted */ ];
```

Draft questions (decoded from the pasted screenshot, English shown; final copy drafted in
both languages in the spec's data file, all client-reviewable before launch):

1. Can I apply for more than one position?
2. Are full-time and part-time opportunities available?
3. Can I select a preferred clinic location?
4. Can I refer someone for an opportunity?
5. Does KTMG provide professional development support?
6. How will I know whether a job advertisement is genuine?
7. Can I request an accommodation during recruitment?

### Story content — `data/foundation.ts` reuse + new inline copy

No new data file; the "Our Story" section reads its founder/foundation mention from the
existing `foundation` export (name, mission, scholarship program already there) rather than
introducing new biographical fields. New narrative copy (the story paragraphs themselves)
lives in `messages/*.json` under `Careers`, consistent with how the rest of the page's prose
is handled.

## Components

New, in the existing per-section-component style (`JobApplicationForm`,
`PositionDetailsModal`, `FilterDropdown` are the existing precedent):

- `components/CareersStory.tsx` — story copy + video player.
- `components/CareersRoleBrowser.tsx` — the 8 "Find where you belong" cards; accepts an
  `onExplore(departments: Department[])` callback so `CareersPageContent` can drive the
  existing department filter and scroll to `#positions`.
- `components/CareersFaq.tsx` — accessible accordion (native `<details>`/`<summary>` or a
  small custom disclosure with `aria-expanded`, following whichever pattern is cheaper and
  matches existing keyboard/focus conventions in this codebase).

Not new: "Why Choose Us," "Values," and "Benefits deep-dive" are restructured inline in
`CareersPageContent.tsx` (same pattern as the current Benefits/Culture sections — cards
mapped from const arrays), since they don't need standalone interactive state.

"LA Network" reuses `components/LocationsMap.tsx` directly, unmodified, passing
`locations` from `data/locations.ts`.

## Media plan

Download and self-host under `public/careers/`, following the existing
`public/careers/SOURCES.md` provenance convention (extend the same file rather than
starting a new one):

| File | Source | Use |
|------|--------|-----|
| `story-video.mp4` | `ktdoctor.com/wp-content/uploads/2024/09/48-Kt-2Min-Video-V6-1.mp4` | Our Story section (video) |
| `story-video-poster.jpg` | `.../2024/10/Screenshot-58.png.webp` | video poster frame |
| `team-tent.jpg` | `.../2024/10/ktmgnewupdated-1536x989.png.webp` | Why Choose Us section (supporting image) |
| `team-photo.jpg` | `.../2024/09/KidsTeensMedicalGroup-0033-1.jpg` | Values Behind Our Care section (supporting image) |

The video is reused directly from the client's own production site (not a third-party
licensing concern). It ships with `preload="none"`, explicit `width`/`height`, and the poster
image, so it never auto-downloads on page load; a play button triggers loading. No captions
or transcript exist upstream — this is flagged as an accessibility gap in Risks below, not
silently dropped.

Existing `hero.jpg` and `benefits.jpg` (current Unsplash-sourced photos) are kept in their
current sections. `culture.jpg` is freed up by retiring the old single Culture band (split
into Why Choose Us and Values, which get the two new real team photos instead) and is
reassigned to the Find Where You Belong section per above.

## Internationalization

All new copy (story paragraphs, "Why Choose Us" card text, Values descriptions, Benefits
category headings/items, LA Network intro, role category titles/descriptions, FAQ
questions/answers, and any new labels/aria-labels) is added to both `messages/en.json` and
`messages/es.json` under the existing `Careers` namespace, with matching key structure,
following the current file's pattern exactly. Existing keys being repurposed: `cultureValue1-4` (currently the operational bullets)
become the 4 Why Choose Us cards as-is; `cultureBody`'s prose mention of compassion,
teamwork, innovation, and personalized care is replaced by 4 new, individually-drafted
value descriptions for the Values section; `cultureHeading` ("More than a workplace") is
reused as the Values section heading. No key is left orphaned.

## Accessibility

- Video: `<video>` with native `controls`, keyboard-operable by default; caption gap noted
  as a known limitation in the section copy itself (e.g. a small "no captions available"
  note) rather than silently omitted.
- FAQ accordion: correct `aria-expanded`/`aria-controls` or native `<details>` semantics,
  fully keyboard operable.
- Role browser cards: real `<button>`/`<a>` elements (not `div` click handlers), visible
  focus states matching existing card patterns on this page.
- All new images get bilingual, non-decorative alt text with no em dash, matching the
  existing convention.

## Testing

- `data/careers.test.ts` — extend for `roleCategories` (every category has a non-empty
  `departments` array pointing at real `Department` values; no em dash).
- `data/careersFaq.test.ts` (new) — every FAQ item has EN/ES question and answer; no em dash.
- `components/CareersStory.test.tsx`, `CareersRoleBrowser.test.tsx`, `CareersFaq.test.tsx`
  (new) — render checks, role-browser "Explore" callback fires with the right departments,
  FAQ items expand/collapse and are keyboard-operable.
- `components/CareersPageContent.test.tsx` — extend for the new sections' presence, and that
  clicking "Explore" in the role browser narrows the Open Positions list the same way the
  existing department filter does.
- `npm run test` and `npm run build` green before completion.

## Build phasing

- **Batch 1**: Our Story + video, Why Choose Us, Values Behind Our Care, LA Network map.
  Mostly new copy plus reusing existing components/data (`LocationsMap`, `foundation.ts`).
- **Batch 2**: Find Where You Belong role browser, Benefits deep-dive restructure,
  Candidate FAQ. More new interactive component work.

Each batch ships with `npm run test` and `npm run build` green; no commits are made unless
separately requested.

## Out of scope

- No changes to the application form, mailer, or server action (already built).
- No per-role job-detail sub-pages beyond the existing details modal.
- No video re-encoding/compression tooling unless the 26 MB file proves problematic in
  practice (flagged as a risk, not preemptively solved).
- No changes to `lib/constants.ts` values or email-routing env vars.
- No end-to-end/browser verification of the shipped page (per this repo's Testing policy);
  code review + typecheck/lint/unit tests only, except where Playwright was explicitly used
  here to research real content that a plain fetch could not surface.

## Risks

- **Founder story accuracy**: drafted from the only two verifiable facts available. Clearly
  labeled as a starting draft in the spec and in an implementation-time code comment, not
  presented as verified biography.
- **FAQ answers are drafted, not sourced**: same treatment — clearly a draft for client
  review, consistent with how the seed position list was already handled.
- **7 of 8 role-category descriptions are drafted** (only "Physicians" has a real reference
  sentence); flagged for client review.
- **Video weight (26 MB)**: acceptable for a `preload="none"` click-to-play embed, but adds
  meaningfully to repo size. If this becomes a problem later, re-encoding is a follow-up,
  not part of this change.
- **No captions/transcript for the video**: an accessibility gap inherited from the source
  file; disclosed in the UI rather than hidden.

## Next step

Write the implementation plan (writing-plans skill) after the client approves this spec.
