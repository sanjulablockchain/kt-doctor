# Telehealth page + site-wide promotion — Design

**Date:** 2026-07-22
**Page:** `/services/telehealth` (enriched); teaser on `/`; links in nav + footer
**Source content:** https://www.ktdoctor.com/services/telemedicine-for-children/

## Goal

Promote the existing but bare-bones Telehealth service into a proper featured
page and surface it across the site:

1. Enrich `/services/telehealth` with an image, richer intro copy, and three
   structured blocks — **Benefits**, **How it works**, and **How to schedule** —
   drawn from the source page.
2. Add a homepage **teaser** section linking to the page.
3. Add a **Telehealth** link to the header "More" dropdown and to the footer
   "For Patients" column.
4. Fully bilingual (en/es); reuse existing theme tokens and dark-mode behavior —
   no new visual language.

Telehealth already exists as a service (`id: "telehealth"`, "Sick & Urgent
Care" category) rendered by the shared template
`app/[locale]/services/[slug]/page.tsx`. All service pages share that template,
so enrichment must be **data-driven** (gated on optional fields), never
slug-special-cased. This mirrors the Same-Day Appointments precedent
(`2026-07-21-same-day-appointments-improvements-design.md`), which added optional
`imageSrc` fields the same way.

## Approach

**Data-driven optional fields.** Extend the `Service` type with optional
structured fields; only `telehealth` populates them today. The template renders
each block **only when its data is present**, so every other service page is
byte-for-byte unchanged. Rejected alternative: an `if (slug === "telehealth")`
branch — brittle and non-extensible.

**Content vs. labels split (matches existing i18n convention).** Human copy that
varies per service (benefit titles/descriptions, the how-it-works paragraph)
lives bilingually in `data/services.ts`, exactly like `name`/`description`.
Reusable *section labels* ("Benefits", "How it works", "How to schedule", the
call/text micro-labels) go in the `Services` message namespace. Phone/text
numbers are **not** duplicated into data — they come from `lib/constants.ts`.

## Changes

### 1. `data/services.ts`

Add a `Benefit` type and four optional fields to `Service`:

```ts
export type Benefit = {
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
};

// added to Service (all optional):
imageSrc?: string;        // already exists on the type
imageAlt?: string;        // already exists
imageAltEs?: string;      // already exists
benefits?: Benefit[];
howItWorks?: string;
howItWorksEs?: string;
showSchedule?: boolean;
```

Enrich the existing `telehealth` entry only:

- `imageSrc: "/services/telehealth.jpg"`, plus `imageAlt` / `imageAltEs`.
- Keep/expand the current lead `description` and `longDescription` (intro
  paragraph) in both languages.
- `benefits`: the five from the source page, each with a one-line supporting
  description (authored EN + ES):
  1. Convenience — care from home, no commute or waiting room.
  2. Quick Access — connect with a board-certified pediatrician fast.
  3. Flexible Scheduling — visits that fit a busy family's day.
  4. Continuity of Care — same trusted team that knows your child.
  5. Privacy & Comfort — a secure, familiar setting for your child.
- `howItWorks` / `howItWorksEs`: short explainer — families receive instructions
  for a secure, user-friendly virtual platform; during the visit the
  pediatrician listens to concerns, gives medical advice, offers treatment
  recommendations, and answers questions.
- `showSchedule: true`.

### 2. `app/[locale]/services/[slug]/page.tsx`

Server component; keep the existing inline `locale === "es" ? …` style. The
current image-variant 2-column intro (image + lead + `longDescription` +
Book / More Services buttons) is unchanged. **Append up to three sections after
the intro grid, each gated on data presence**, wrapped so they sit full-width
under the intro (still inside `max-w-5xl`):

- **Benefits** (`service.benefits?.length`): section heading
  (`t("benefitsHeading")`) + a responsive grid
  (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`) of cards. Each card:
  a teal check/spark icon chip, `title`, and `description` (locale-aware),
  reusing existing card classes (`rounded-2xl border border-border bg-surface
  p-5 shadow-card`) and `ink` / `ink-soft` / `teal-dark` tokens.
- **How it works** (`service.howItWorks`): heading (`t("howItWorksHeading")`) +
  the paragraph (`text-ink-soft`).
- **How to schedule** (`service.showSchedule`): heading
  (`t("scheduleHeading")`) + three contact rows built from
  `lib/constants.ts` — Call `MAIN_PHONE` (`tel:`), Text English `TEXT_PHONE`
  (`sms:`), Text Spanish `TEXT_PHONE_ES` (`sms:`) — each with a micro-label
  (`t("callLabel")` / `t("textEnLabel")` / `t("textEsLabel")`) and the icon-chip
  treatment used in the footer. Reuse the `toE164` helper pattern (E.164 for
  `tel:`/`sms:`). The Book button already appears in the intro; no duplicate.

Because the template currently pulls localized strings via inline ternaries (no
`useTranslations`), the new **section labels** need translations. The file has
no `useTranslations` today. Use `getTranslations("Services")` from
`next-intl/server` (server component) to read the label keys — confirm the exact
server API against `node_modules/next-intl` docs before coding.

### 3. Homepage teaser — `app/[locale]/page.tsx`

Add a new `<section>` **immediately after the "Why families choose us"
section** (which already name-checks telehealth). Two-column on desktop
(`lg:grid-cols-2`), stacked on mobile, wrapped in `Reveal` like neighboring
sections:

- **Left:** the telehealth image (reuse `ParallaxImage` or `Image`,
  `rounded-[2rem] shadow-card`, matching the "Why choose us" image treatment).
- **Right:** eyebrow (`t("telehealthEyebrow")`), heading
  (`t("telehealthHeading")`), body (`t("telehealthBody")`), a row of 3 benefit
  chips (pill style from the services cloud), and a
  `Link href="/services/telehealth"` CTA (`t("telehealthCta")` → arrow).

All new copy via the `Home` namespace. The teaser links to the existing service
route (no new route).

### 4. Header — `components/Header.tsx`

Add a **Telehealth** entry to the "More" dropdown list (the `<div>` of
`secondaryLinkClass` links), placed first or next to "Services":

```tsx
<Link href="/services/telehealth" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
  {t("telehealth")}
</Link>
```

The dropdown is a `grid grid-cols-2` on mobile / flex column on desktop and
already scales to N items — no layout change needed. New key: `Header.telehealth`.

### 5. Footer — `components/Footer.tsx`

Add to the `patientLinks` array (next to Same-Day Appointments):

```ts
{ href: "/services/telehealth", label: t("telehealth") },
```

New key: `Footer.telehealth`.

### 6. i18n — `messages/en.json` + `messages/es.json`

Add, in both files (English shown; Spanish translated):

- `Header.telehealth`: "Telehealth" / "Telesalud"
- `Footer.telehealth`: "Telehealth" / "Telesalud"
- `Services.benefitsHeading`: "Benefits" / "Beneficios"
- `Services.howItWorksHeading`: "How it works" / "Cómo funciona"
- `Services.scheduleHeading`: "How to schedule" / "Cómo agendar"
- `Services.callLabel`: "Call" / "Llamar"
- `Services.textEnLabel`: "Text (English)" / "Texto (Inglés)"
- `Services.textEsLabel`: "Text (Spanish)" / "Texto (Español)"
- `Home.telehealthEyebrow`, `Home.telehealthHeading`, `Home.telehealthBody`,
  `Home.telehealthCta` (teaser copy, EN + ES).

Keep both locale files key-aligned (the repo's i18n tests/build assume parity).

### 7. Image asset

- Referenced as `/services/telehealth.jpg` → file at
  `public/services/telehealth.jpg`.
- **Implementation downloads a suitable royalty-free image** (e.g. Unsplash —
  a parent/child on a video visit or a clinician on a tablet), saves it to
  `public/services/telehealth.jpg`, and verifies it loads. Prefer a portrait
  crop (~800×1000) to match the service-detail image aspect (`aspect-[4/5]`).

## Theme / responsive / dark mode

No new tokens. All classes reuse existing tokens (`teal`, `teal-dark`, `ink`,
`ink-soft`, `border`, `surface`, `shadow-card`, `shadow-soft`, `font-display`)
that already handle light/dark. Responsive via existing `sm:` / `lg:`
breakpoints. Icon chips reuse the footer/`iconChipClass` recipe.

## Constraints / notes

- Per `AGENTS.md`, this repo's Next.js differs from stock — read
  `node_modules/next/dist/docs/` before writing `Image` / server-component
  translation code. Mirror the already-working blog/service `Image` usage and
  confirm the `getTranslations` server API.
- The service template is currently a server component with **no**
  `useTranslations`; adding section labels means introducing
  `getTranslations("Services")` there. Verify this doesn't force a client
  boundary (it should not — it's the server API).
- Numbers come from `lib/constants.ts`; do not hardcode. The source page also
  lists a (626) 795-8811 line — out of scope; the site standard is `MAIN_PHONE`.

## Verification

- `npm run build` succeeds; `npm test` passes.
- Extend Vitest suites:
  - `app/[locale]/services/[slug]/page.test.tsx` — telehealth renders Benefits /
    How it works / How to schedule; a service **without** the fields renders
    none of them.
  - `components/Header.test.tsx` — Telehealth link present in "More" pointing to
    `/services/telehealth`.
  - `components/Footer.test.tsx` — Telehealth link present in "For Patients".
  - `app/[locale]/page.test.tsx` — homepage teaser present with CTA to
    `/services/telehealth`.
- Manual: desktop 2-column / mobile stacked; `/es` shows Spanish throughout;
  `tel:`/`sms:` links well-formed; dark mode legible; image loads.

## Out of scope

- A separate top-level `/telehealth` route (decided: keep under `/services`).
- Adding structured blocks to any other service.
- Changing booking/phone infrastructure or the (626) 795-8811 number.
- Redesigning the shared template beyond the appended, data-gated sections.
