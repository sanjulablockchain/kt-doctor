# EN/ES Plan B (Remaining Translations) — Design Spec

Date: 2026-07-17
Status: Approved

## Background

The original EN/ES toggle (Plan A) shipped full Spanish translation for Header,
Footer, Home, Doctors, and Locations, and explicitly deferred everything else
as a future "Plan B." Since then the site has grown well past what Plan B
originally meant: Network, Foundation (now including a Sri Lanka initiative
section), Careers, Insurance, Resources, and two brand-new pages (About,
Testimonials) are all still English-only. Two entirely new dynamic content
systems were also added after Plan B was scoped: Services (`/services` + 21
`/services/[slug]` detail pages) and Blog (`/blog` + 4 `/blog/[slug]` detail
pages). The homepage also grew five new sections since Plan A shipped
(Services pill-cloud, Featured Stories, Trusted Partners, FAQ, and a
standalone Resources section), only some of which are already wired for
translation.

## Goals

Ship full, natural (not literal/word-for-word) Spanish translation for
everything listed under Scope below, matching the quality bar already set by
Header/Footer/Home/Doctors/Locations.

## Explicitly split into two phases (per client decision, 2026-07-17)

**This spec covers Phase 1 only.** Phase 2 (a separate future spec/plan) will
cover the two large dynamic content bodies: the 21 real service descriptions
in `data/services.ts` and the 4 full blog articles in `data/stories.ts`. Both
of those files stay completely untouched in Phase 1 — this is a deliberate
scope boundary, not an oversight.

## Current state (verified 2026-07-17)

Already fully translated (Plan A, untouched by this spec): Header, Footer,
Home's hero/why-choose-us/doctors-preview/network-teaser/clinic-near-you/
careers-insurance-teaser sections, Doctors page, Locations page. Also already
translated as a side effect of other work: Header/Footer's `aboutUs` and
`testimonials` nav labels, and three Home.* keys (`partnersHeading`,
`faqEyebrow`/`faqHeading`/`faqSubheading`) — both `en.json` and `es.json`
already have these keys populated.

Still English-only (this spec's scope):

**Static pages** (become `"use client"` content components wrapped by a thin
Server Component `page.tsx`, matching the established Doctors/Locations
pattern, so `generateMetadata`/`metadata` exports keep working):
- `/network` — eyebrow, heading, intro paragraph. `NetworkCard`'s own text
  (brand names, taglines, descriptions, service tag pills, "Browse
  doctors"/"Visit site" links) comes from `data/network.ts` and
  `components/NetworkCard.tsx` — both get translated too (this is a small,
  fixed dataset, unlike Services/Blog).
- `/foundation` — eyebrow, heading, "Our programs" label, "Donate now"/"Visit
  the Foundation site" buttons, the Sri Lanka Initiative section (eyebrow,
  heading, the 4 initiative blurb titles/bodies), "See live campaign progress
  & donate" link. `ProgramCard` and `SriLankaTimeline` component text.
  `data/foundation.ts` content (mission, program names/descriptions,
  `sriLankaProgram`, `sriLankaSchools`) gets translated too — small, fixed
  dataset.
- `/careers` — all copy, including the "official job postings" notice.
- `/insurance` — all copy. `data/insurance.ts` category labels (HMO, PPO,
  Medi-Cal — these are the same real terms in Spanish, so likely pass
  through unchanged, confirm during implementation).
- `/resources` — page chrome. `data/resources.ts` resource names/descriptions
  get translated (5 items — small, fixed dataset like Network/Foundation).
  `ResourceCard`'s "Contact us for a copy" state text.
- `/about` — all copy, including the `CARE_AREAS` pill list.
- `/testimonials` — all copy (the Google Reviews CTA text; location names
  stay as real proper nouns, unchanged).

**Homepage sections** (in `app/[locale]/page.tsx`):
- Services pill-cloud — eyebrow ("{count} Specialties"), heading
  ("Comprehensive Pediatric Services"), "View all services" link. The
  individual pill labels are service names from `data/services.ts` — those
  stay English in Phase 1 per the Phase 2 boundary above.
- Featured Stories — eyebrow ("From Our Blog"), heading ("Featured
  Stories"), "Read the full story" link text. Article titles/dates/excerpts
  come from `data/stories.ts` — stay English in Phase 1.
- Resources section — heading ("Everything your family needs, in one
  place."), the "Browse all resources" tile's heading/body/link text.
  (`resourcesHeading`/`resourcesBody` keys already exist and are already
  translated.)
- FAQ section — `FaqAccordion` component has no hardcoded strings to
  translate (it only renders `data/faq.ts` content), but `data/faq.ts`'s 8
  question/answer pairs get translated (small, fixed dataset).
- Trusted Partners — already fully wired (`partnersHeading` key exists);
  partner names (Children's Hospital LA, Cedars-Sinai, etc.) are real proper
  nouns and stay unchanged in both languages. Nothing to do here.

**Services/Blog index and detail page chrome only** (not their data):
- `/services` — eyebrow ("What We Offer"), heading ("Comprehensive Pediatric
  Care"), intro paragraph. Category names and service names/descriptions
  (from `data/services.ts`) stay English — Phase 2.
- `/services/[slug]` — "Back to Services" link. Service name/description/
  longDescription (from data) stay English — Phase 2.
- `/blog` — eyebrow ("From Our Blog"), heading ("Parent Stories & Tips"),
  intro paragraph. Story titles/dates/excerpts (from `data/stories.ts`) stay
  English — Phase 2.
- `/blog/[slug]` — "Back to Blog" link. Story title/date/author/excerpt/
  sections (from data) stay English — Phase 2.

## Architecture

Same pattern as Plan A: pages needing translations become `"use client"`
content components using `useTranslations`, wrapped by a thin Server
Component `page.tsx` that keeps `export const metadata`. Reusable components
that render translated strings (`NetworkCard`, `ProgramCard`,
`SriLankaTimeline`, `ResourceCard`) take a `useTranslations` call themselves
rather than receiving translated strings as props, matching how `Header`/
`Footer` already work.

New `messages/en.json` / `messages/es.json` namespaces needed: `Network`,
`Foundation`, `Careers`, `Insurance`, `Resources`, `About`, `Testimonials`.
Existing `Home` namespace gets new keys for the Services pill-cloud,
Featured Stories, and Resources-section chrome. New `Services` and `Blog`
namespaces get chrome-only keys (eyebrow/heading/intro/back-link), reusing
the existing English-only data for names/descriptions/content.

Data files that get bilingual content: `data/network.ts`, `data/foundation.ts`,
`data/resources.ts`, `data/faq.ts`. Given these are small, fixed-size
datasets (not the 21-item/4-article volume reserved for Phase 2), the
simplest approach — matching no existing per-locale-data precedent in this
codebase — needs a decision: either (a) each data file becomes a function of
locale (e.g. `getNetworkBrands(locale)`), or (b) each item gets parallel
`name`/`nameEs`, `description`/`descriptionEs` fields. Option (b) is
simpler, avoids a new per-file architecture, and keeps a single source of
truth per item (translations sit right next to the English original,
harder to drift out of sync) — this spec picks (b).

## Explicitly out of scope (Phase 2, future spec)

- All 21 real service descriptions/long-descriptions in `data/services.ts`.
- All 4 full blog articles (title, excerpt, every section) in
  `data/stories.ts`.
- The Services/Blog `[slug]` detail pages' data-driven body content (only
  their chrome is in Phase 1 scope, per above).

## Constraints

- No git repository in use — every task ends with manual verification, not
  a commit.
- No em dash ("—") in any new copy, English or Spanish.
- Translations must be natural, accurate Spanish (not literal word-for-word),
  matching the quality bar already set in Plan A.
- Real proper nouns (partner names, location names, insurance category
  abbreviations like HMO/PPO, brand names) stay unchanged across languages
  unless there's a genuine, real Spanish equivalent already in use elsewhere
  in this project (e.g. `TEXT_PHONE_ES` uses the real Spanish-language text
  line already on the real ktdoctor.com site).
- Mobile responsive throughout, matching the existing design system.

## Next steps

1. Write an implementation plan (writing-plans skill) breaking this into
   tasks — likely one task per page/section given the volume, following the
   TDD pattern established in Plan A (renderWithIntl tests asserting
   Spanish text renders when locale is "es").
2. Execute via subagent-driven-development, same as the Services detail
   pages work.
