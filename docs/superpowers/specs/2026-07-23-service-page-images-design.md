# Service Page Images — Design

**Date:** 2026-07-23
**Status:** Approved (pending spec review)

## Problem

The service detail page (`app/[locale]/services/[slug]/page.tsx`) already renders a
two-column image layout when a service has an `imageSrc`, and a plain single-column
layout when it does not. Only 2 of 21 services currently have images
(`telehealth`, `same-day-appointments`). The remaining **19 service pages render
without an image** and look bare next to the two enriched pages.

## Goal

Give each of the 19 image-less service pages one suitable, on-theme photo, so every
service detail page renders in the richer two-column layout consistent with
`telehealth` and `same-day-appointments`.

## Decisions (from brainstorming)

- **Source:** Royalty-free stock from **Unsplash** (already whitelisted in
  `next.config.ts`), **downloaded and self-hosted** — not hotlinked.
- **Granularity:** One **unique** image per service (19 total).
- **Aspect:** **4:5 portrait**, matching the layout's default `aspect-[4/5]`, so all
  category pages look uniform. No per-service `imageAspectClass`.
- **Review:** Curate + download all 19, then publish a single visual **contact sheet**
  (Artifact) mapping each image to its service for one-pass approval before finalizing.

## Approach

This is a **data + assets** change. **No component changes** — the existing render
path in `services/[slug]/page.tsx` (lines 178–213) already handles `imageSrc`.

### 1. Source & download

For each of the 19 services, find one warm, professional, on-theme pediatric/clinical
Unsplash photo and capture its direct `https://images.unsplash.com/photo-<id>` URL
(via web search of the topic). Download each with PowerShell `Invoke-WebRequest` to:

```
public/services/<service-id>.jpg
```

matching the existing naming (`telehealth.jpg`, `same-day-appointments.jpg`). Use
consistent URL params for a cohesive crop and size:

```
?w=800&h=1000&fit=crop&q=80&auto=format
```

(4:5 portrait, ~800×1000, quality 80). Download mechanism verified working — produces
valid JPEG (`FF D8 FF E0`).

### 2. Wire into data

For each service object in `data/services.ts`, add:

- `imageSrc: "/services/<service-id>.jpg"`
- `imageAlt`: descriptive English alt text (accessibility + it is a medical site)
- `imageAltEs`: Spanish equivalent, following the existing alt-text style

Alt text must contain **no em dash (—)**, consistent with the codebase convention
enforced by `data/services.test.ts`.

### 3. Provenance

Record each image's source Unsplash URL in `public/services/SOURCES.md`. Unsplash's
license permits free commercial use without attribution; the manifest is kept for
good hygiene since this is a real business site.

## Image plan (19 services)

Sensitive topics get **tasteful, non-graphic, reassuring** imagery only — never
distressing or clinically explicit.

| # | Service id | Category | Image concept |
|---|-----------|----------|---------------|
| 1 | `well-child-exam` | Preventive & Wellness | Pediatrician checking a healthy child at a routine checkup |
| 2 | `physicals` | Preventive & Wellness | Doctor examining a child with a stethoscope (school/sports physical) |
| 3 | `free-vaccines` | Preventive & Wellness | Friendly nurse giving a child a bandage after a shot |
| 4 | `covid-19-vaccine` | Preventive & Wellness | Vaccine vial/syringe prep, or child receiving a shot |
| 5 | `nutrition` | Preventive & Wellness | Fresh healthy foods / child with fruits & vegetables |
| 6 | `newborn-care` | Newborn & Family | Newborn held tenderly by parent or pediatrician |
| 7 | `expectant-parents` | Newborn & Family | Expectant parent(s) in a consultation |
| 8 | `circumcisions` | Newborn & Family | Newborn swaddled/held by parent (non-graphic) |
| 9 | `sick-visits` | Sick & Urgent | Caring pediatrician reassuring a child (not distressing) |
| 10 | `walk-ins` | Sick & Urgent | Welcoming clinic reception / doctor greeting a family |
| 11 | `pediatric-infectious-disease` | Sick & Urgent | Doctor consulting with child; lab vials (tasteful) |
| 12 | `sports-injuries` | Sick & Urgent | Young athlete, or doctor examining a child's injury |
| 13 | `adhd-behavioral-issues` | Behavioral & Developmental | Child focused on an activity / supportive session |
| 14 | `autism-developmental-disorders` | Behavioral & Developmental | Child engaged in developmental play, warm |
| 15 | `childhood-obesity-weight-management` | Behavioral & Developmental | Active kids / healthy family lifestyle |
| 16 | `asthma-allergy-center` | Specialty & Adolescent | Child with an inhaler / breathing care |
| 17 | `allergies` | Specialty & Adolescent | Allergy care (non-distressing) |
| 18 | `adolescent-medicine` | Specialty & Adolescent | Teen in a consultation with a doctor |
| 19 | `teenage-gynecology-menstrual-disorders` | Specialty & Adolescent | Teen with a female doctor in a comfortable, confidential setting (non-graphic) |

The 2 existing images (`telehealth`, `same-day-appointments`) are left untouched.

## Out of scope

- The services **list** page / cards (`ServicesPageContent`).
- Any other pages.
- Component/layout changes to the detail page.

## Verification

- Each downloaded file is a valid, non-zero JPEG.
- `npm run test` passes (no test counts image-less services; the `telehealth`
  assertion is unaffected).
- `npm run build` succeeds.
- Spot-check a few rendered service pages (dev server / Playwright).
- Publish the contact-sheet Artifact for user approval before final sign-off.

## Risks

- **Relevance variance:** stock photos are on-theme, not the actual clinic. Mitigated
  by the contact-sheet review pass and easy per-file swap (overwrite the JPG).
- **Unsplash URL stability:** avoided by self-hosting the downloaded files.
