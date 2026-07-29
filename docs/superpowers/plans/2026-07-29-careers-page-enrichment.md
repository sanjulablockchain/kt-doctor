# Careers Page Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the existing `/careers` page with a company story (including the real,
verified founder-adjacent facts), a "Why Choose Us" section, an expanded values section, an
LA network map, a "Find Where You Belong" role browser, a 4-category benefits deep-dive, and
a Candidate FAQ, per [the approved design spec](../specs/2026-07-29-careers-page-enrichment-design.md).

**Architecture:** Extend the existing `components/CareersPageContent.tsx` in place. New,
self-contained sections become their own components (`CareersStory`, `CareersRoleBrowser`,
`CareersFaq`) following the existing precedent (`JobApplicationForm`, `PositionDetailsModal`,
`FilterDropdown`). Sections that don't need standalone state (Why Choose Us, Values, Benefits)
stay inline in `CareersPageContent.tsx`, matching how Benefits/Culture already work today. The
LA Network section reuses the existing `LocationsMap` component and `data/locations.ts`
unmodified. All new copy goes through `next-intl` (`messages/en.json` / `messages/es.json`),
matching the existing `Careers` namespace pattern.

**Tech Stack:** Next.js 16 (App Router), React 19, next-intl, Tailwind CSS v4, Vitest +
Testing Library, TypeScript.

## Global Constraints

- Do not create git commits during this work (explicit user instruction this session).
  Each task ends with tests passing, not a commit. Staging/committing is a separate,
  later decision for the user.
- Every new user-facing string must be added to both `messages/en.json` and
  `messages/es.json` with matching key structure (this repo's i18n rule).
- No em dash (`—`) in any generated copy, UI text, or code (this repo's Style rule);
  enforced by a test assertion in every new/extended data-file test.
- All new UI must be fully responsive (mobile/tablet/desktop) and correct in both dark
  and light mode; use only the existing token classes already used throughout
  `CareersPageContent.tsx` (`teal`, `teal-dark`, `teal-tint`, `ink`, `ink-soft`, `border`,
  `surface`, `ivory-deep`, `shadow-card`, `shadow-soft`, `font-display`), which are already
  theme-aware.
- Images need meaningful, bilingual, non-decorative `alt` text (this repo's Accessibility
  rule). Custom interactive elements need keyboard/focus support (native elements are
  preferred over `div` click handlers).
- Do not run end-to-end/browser verification (Playwright, dev server, screenshots) as part
  of implementing these tasks; verify with code review, `npm run test`, and `npm run build`
  only (this repo's Testing policy). Playwright was already used during design research to
  confirm real content on the live site; it is not part of implementation.
- Do not change `lib/constants.ts` values or email-routing env vars (protected business
  data).
- The founder-story copy in Task 2 states only the two verifiable facts established during
  design research (the practice's legal organization under Dr. Janesri De Silva, and the
  Foundation's "Janesri and Sunil De Silva Scholarship"). Do not add any further
  biographical claims not present in this plan's drafted copy.

---

## Task 1: Download and document the real media assets

**Files:**
- Create: `public/careers/story-video.mp4`
- Create: `public/careers/story-video-poster.jpg`
- Create: `public/careers/team-tent.jpg`
- Create: `public/careers/team-photo.jpg`
- Modify: `public/careers/SOURCES.md`

**Interfaces:**
- Produces: four files at the paths above, used by Task 2 (`story-video.mp4`,
  `story-video-poster.jpg`), Task 3 (`team-tent.jpg`), and Task 4 (`team-photo.jpg`).

- [ ] **Step 1: Download the four assets from the live ktdoctor.com site**

Run (PowerShell, from the repo root):

```powershell
Invoke-WebRequest -Uri "https://www.ktdoctor.com/wp-content/uploads/2024/09/48-Kt-2Min-Video-V6-1.mp4" -OutFile "public/careers/story-video.mp4"
Invoke-WebRequest -Uri "https://www.ktdoctor.com/wp-content/uploads/2024/10/Screenshot-58.png.webp" -OutFile "public/careers/story-video-poster.jpg"
Invoke-WebRequest -Uri "https://www.ktdoctor.com/wp-content/uploads/2024/10/ktmgnewupdated-1536x989.png.webp" -OutFile "public/careers/team-tent.jpg"
Invoke-WebRequest -Uri "https://www.ktdoctor.com/wp-content/uploads/2024/09/KidsTeensMedicalGroup-0033-1.jpg" -OutFile "public/careers/team-photo.jpg"
```

Note: the poster and team-tent source files are served as `.webp`-encoded bytes with a
misleading `.png.webp` name; downloading them straight to a `.jpg` filename only renames
the file, it does not transcode it. If `next/image` (used for `team-tent.jpg`) or the
`<video poster>` attribute (used for `story-video-poster.jpg`) fails to decode the file
after downloading, re-run the download appending `?format=jpg` is not supported by this
WordPress host, so instead open the file once in any image viewer to confirm it renders; if
it does not, this is the one step in this plan where converting the format (e.g. with a
local image tool) is necessary before continuing, since Next's built-in image optimizer
needs a real image format, not just a matching extension.

- [ ] **Step 2: Verify all four files exist and are non-trivial in size**

Run: `Get-ChildItem public/careers/story-video.mp4, public/careers/story-video-poster.jpg, public/careers/team-tent.jpg, public/careers/team-photo.jpg | Select-Object Name, Length`

Expected: all four listed, `story-video.mp4` around 26 MB, the three images each at least
50 KB (none are 0-byte or a tiny error-page HTML file saved with an image extension).

- [ ] **Step 3: Extend the provenance manifest**

Modify `public/careers/SOURCES.md`. Read the current file first (it documents `hero.jpg`,
`benefits.jpg`, `culture.jpg`). Replace its whole body with:

```markdown
# Careers image sources

Unsplash photos are royalty-free, downloaded and self-hosted (not hotlinked). Unsplash's
license permits free commercial use without attribution; this manifest is kept for
provenance. Crop params: `?w=<W>&h=<H>&fit=crop&q=80&auto=format`.

| File | Unsplash photo | Description |
|------|----------------|-------------|
| hero.jpg | https://images.unsplash.com/photo-1758691463331-2ac00e6f676f | Pediatrician consulting with a young patient and parent in a bright clinic office (1600x1000). |
| benefits.jpg | https://images.unsplash.com/photo-1708687045030-26702e62fc65 | Smiling clinician high-fiving a child on an exam table (1200x900). |
| culture.jpg | https://images.unsplash.com/photo-1691139601099-932c01ec198b | Two clinicians in scrubs, one supporting the other, showing teamwork (1200x900); reused on the Find Where You Belong role-browser section. |

The four files below are the client's own real production assets, downloaded directly from
`ktdoctor.com` (not third-party stock, so no licensing concern):

| File | Source | Description |
|------|--------|-------------|
| story-video.mp4 | https://www.ktdoctor.com/wp-content/uploads/2024/09/48-Kt-2Min-Video-V6-1.mp4 | 2-minute promo video used in the Our Story section (26 MB). |
| story-video-poster.jpg | https://www.ktdoctor.com/wp-content/uploads/2024/10/Screenshot-58.png.webp | Poster frame for the promo video. |
| team-tent.jpg | https://www.ktdoctor.com/wp-content/uploads/2024/10/ktmgnewupdated-1536x989.png.webp | Team photo under a branded event tent, used in the Why Choose Us section. |
| team-photo.jpg | https://www.ktdoctor.com/wp-content/uploads/2024/09/KidsTeensMedicalGroup-0033-1.jpg | Professional team photo, used in the Values Behind Our Care section. |

To swap any image, overwrite the file (keep the same filename and aspect) and update this row.
```

No test for this task (asset download and documentation, not code); the verification is
Step 2's file check.

---

## Task 2: Add the "Our Story" section

**Files:**
- Create: `components/CareersStory.tsx`
- Create: `components/CareersStory.test.tsx`
- Modify: `components/CareersPageContent.tsx:1-17` (imports), `components/CareersPageContent.tsx:119-154` (insert after Hero)
- Modify: `messages/en.json:272` (insert after `"heroCtaApply"`)
- Modify: `messages/es.json:272` (insert after `"heroCtaApply"`)

**Interfaces:**
- Produces: `CareersStory` component (no props), rendered by `CareersPageContent`.

- [ ] **Step 1: Add the `en.json` story keys**

In `messages/en.json`, find this exact block inside the `"Careers"` namespace:

```json
    "heroCtaApply": "Apply Now",
    "perk1": "Competitive salary & benefits",
```

Replace it with:

```json
    "heroCtaApply": "Apply Now",
    "storyEyebrow": "Our Story",
    "storyHeading": "Built on Trust, Grown by Our Team",
    "storyBody1": "Kids & Teens Medical Group began with a simple commitment: give every child in Greater Los Angeles access to compassionate, board-certified pediatric care. More than 18 years later, we have grown into the largest pediatric group in Los Angeles, with 25 clinics and a team that shows up for families every single day.",
    "storyBody2": "The practice is organized under Dr. Janesri De Silva's medical corporation. Beyond the clinic walls, Dr. De Silva and Sunil De Silva established the Kids and Teens Foundation, home of the Janesri and Sunil De Silva Scholarship, supporting students pursuing careers in medicine.",
    "storyVideoCaptionNote": "This video does not currently have captions or a transcript available.",
    "perk1": "Competitive salary & benefits",
```

- [ ] **Step 2: Add the matching `es.json` story keys**

In `messages/es.json`, find:

```json
    "heroCtaApply": "Postúlese ahora",
    "perk1": "Salario y beneficios competitivos",
```

Replace it with:

```json
    "heroCtaApply": "Postúlese ahora",
    "storyEyebrow": "Nuestra Historia",
    "storyHeading": "Construido con Confianza, Impulsado por Nuestro Equipo",
    "storyBody1": "Kids & Teens Medical Group comenzó con un compromiso simple: brindar a cada niño del área de Los Ángeles acceso a atención pediátrica compasiva y certificada. Más de 18 años después, nos hemos convertido en el grupo pediátrico más grande de Los Ángeles, con 25 clínicas y un equipo que se presenta para las familias todos los días.",
    "storyBody2": "La práctica está organizada bajo la corporación médica de la Dra. Janesri De Silva. Más allá de las clínicas, la Dra. De Silva y Sunil De Silva fundaron la Fundación Kids and Teens, sede de la Beca Janesri y Sunil De Silva, que apoya a estudiantes que siguen una carrera en medicina.",
    "storyVideoCaptionNote": "Este video no cuenta actualmente con subtítulos ni transcripción disponible.",
    "perk1": "Salario y beneficios competitivos",
```

- [ ] **Step 3: Write the failing test for `CareersStory`**

Create `components/CareersStory.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersStory } from "./CareersStory";

describe("CareersStory", () => {
  it("renders the story heading and both body paragraphs", () => {
    render(<CareersStory />);
    expect(
      screen.getByRole("heading", { name: "Built on Trust, Grown by Our Team" })
    ).toBeInTheDocument();
    expect(screen.getByText(/largest pediatric group in Los Angeles/i)).toBeInTheDocument();
    expect(screen.getByText(/Janesri and Sunil De Silva Scholarship/i)).toBeInTheDocument();
  });

  it("embeds the story video with a poster and a no-captions note", () => {
    render(<CareersStory />);
    const source = document.querySelector("video source");
    expect(source).toHaveAttribute("src", "/careers/story-video.mp4");
    expect(screen.getByText(/does not currently have captions/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- components/CareersStory.test.tsx`
Expected: FAIL, `Cannot find module './CareersStory'` (the component does not exist yet).

- [ ] **Step 5: Implement `CareersStory`**

Create `components/CareersStory.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

export function CareersStory() {
  const t = useTranslations("Careers");

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <Reveal>
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("storyEyebrow")}
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t("storyHeading")}
        </h2>
        <p className="mt-4 text-ink-soft">{t("storyBody1")}</p>
        <p className="mt-3 text-ink-soft">{t("storyBody2")}</p>
      </Reveal>
      <Reveal delayMs={100}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-card">
          <video
            controls
            preload="none"
            poster="/careers/story-video-poster.jpg"
            width={1280}
            height={720}
            className="aspect-video w-full bg-black"
          >
            <source src="/careers/story-video.mp4" type="video/mp4" />
          </video>
        </div>
        <p className="mt-2 text-xs text-ink-soft">{t("storyVideoCaptionNote")}</p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test -- components/CareersStory.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 7: Wire `CareersStory` into `CareersPageContent`**

In `components/CareersPageContent.tsx`, add the import next to the other component imports:

```tsx
import { CareersStory } from "@/components/CareersStory";
```

Then find this exact text (the end of the Hero section, right before the Perks strip):

```tsx
        </div>
      </section>

      {/* Perks strip */}
```

Replace it with:

```tsx
        </div>
      </section>

      <CareersStory />

      {/* Perks strip */}
```

- [ ] **Step 8: Run the full careers page test suite**

Run: `npm run test -- components/CareersPageContent.test.tsx components/CareersStory.test.tsx`
Expected: PASS. The existing `CareersPageContent` tests still pass unchanged (Hero heading,
positions list, filter, apply-prefill, anti-scam notice, careers emails are untouched by
this insertion).

---

## Task 3: Split the Culture band into "Why Choose Us" and "Values Behind Our Care"

**Files:**
- Modify: `components/CareersPageContent.tsx:93` (constants), `components/CareersPageContent.tsx:275-308` (JSX)
- Modify: `components/CareersPageContent.test.tsx`
- Modify: `messages/en.json` (Careers namespace)
- Modify: `messages/es.json` (Careers namespace)

**Interfaces:**
- Consumes: none new.
- Produces: no new exports; this is a same-file content/JSX replacement.

- [ ] **Step 1: Replace the `en.json` culture keys with Why-Choose-Us and Values keys**

In `messages/en.json`, find this exact block:

```json
    "cultureHeading": "More than a workplace",
    "cultureBody": "For 18+ years we have grown a team built on compassion, teamwork, innovation, and personalized care. When you join Kids & Teens, you join people who show up for each other and for every family we serve.",
    "cultureValue1": "Flexible scheduling options",
    "cultureValue2": "Administrative support so you can focus on patients",
    "cultureValue3": "Streamlined clinical processes",
    "cultureValue4": "Established community partnerships",
```

Replace it with:

```json
    "whyChooseUsHeading": "Why Choose Us",
    "whyChooseUsIntro": "When you choose Kids & Teens, you are not just making a difference in your patients' lives. You are joining a team that values, supports, and empowers you.",
    "whyChooseUs1": "Flexible scheduling options",
    "whyChooseUs2": "Administrative support so you can focus on patients",
    "whyChooseUs3": "Streamlined clinical processes",
    "whyChooseUs4": "Established community partnerships",
    "whyChooseUsImageAlt": "Kids & Teens team members gathered together at a company event",
    "valuesHeading": "More than a Workplace",
    "valuesIntro": "For 18+ years, we have grown a team built on four core values. When you join Kids & Teens, you join people who show up for each other and for every family we serve.",
    "value1Title": "Compassion",
    "value1Body": "We treat every child and family with warmth and empathy, the same way we would want our own families treated.",
    "value2Title": "Teamwork",
    "value2Body": "Clinical and administrative teams work side by side so every patient gets coordinated, well-supported care.",
    "value3Title": "Innovation",
    "value3Body": "We invest in telehealth, streamlined charting, and new ways of working so our team can focus on patients, not paperwork.",
    "value4Title": "Personalized Care",
    "value4Body": "Every family's plan of care is built around their child, not a one-size-fits-all checklist.",
    "valuesImageAlt": "A Kids & Teens clinician caring for a young patient",
```

Also find and delete this now-unused line entirely (it is superseded by
`whyChooseUsImageAlt` and `valuesImageAlt` added above):

```json
    "cultureImageAlt": "Members of the Kids & Teens team collaborating",
```

- [ ] **Step 2: Replace the `es.json` culture keys with Why-Choose-Us and Values keys**

In `messages/es.json`, find this exact block:

```json
    "cultureHeading": "Más que un lugar de trabajo",
    "cultureBody": "Durante más de 18 años hemos formado un equipo basado en la compasión, el trabajo en equipo, la innovación y la atención personalizada. Al unirse a Kids & Teens, se une a personas que se apoyan mutuamente y a cada familia que atendemos.",
    "cultureValue1": "Opciones de horario flexible",
    "cultureValue2": "Apoyo administrativo para que usted se enfoque en los pacientes",
    "cultureValue3": "Procesos clínicos optimizados",
    "cultureValue4": "Alianzas comunitarias establecidas",
```

Replace it with:

```json
    "whyChooseUsHeading": "Por Qué Elegirnos",
    "whyChooseUsIntro": "Cuando elige Kids & Teens, no solo marca una diferencia en la vida de sus pacientes. Se une a un equipo que lo valora, lo apoya y lo empodera.",
    "whyChooseUs1": "Opciones de horario flexible",
    "whyChooseUs2": "Apoyo administrativo para que usted se enfoque en los pacientes",
    "whyChooseUs3": "Procesos clínicos optimizados",
    "whyChooseUs4": "Alianzas comunitarias establecidas",
    "whyChooseUsImageAlt": "Miembros del equipo de Kids & Teens reunidos en un evento de la empresa",
    "valuesHeading": "Más que un Lugar de Trabajo",
    "valuesIntro": "Durante más de 18 años, hemos formado un equipo basado en cuatro valores fundamentales. Al unirse a Kids & Teens, se une a personas que se apoyan mutuamente y a cada familia que atendemos.",
    "value1Title": "Compasión",
    "value1Body": "Tratamos a cada niño y familia con calidez y empatía, de la misma manera en que nos gustaría que trataran a nuestras propias familias.",
    "value2Title": "Trabajo en Equipo",
    "value2Body": "Los equipos clínicos y administrativos trabajan codo a codo para que cada paciente reciba una atención coordinada y bien respaldada.",
    "value3Title": "Innovación",
    "value3Body": "Invertimos en telesalud, documentación clínica simplificada y nuevas formas de trabajar para que nuestro equipo se enfoque en los pacientes, no en el papeleo.",
    "value4Title": "Atención Personalizada",
    "value4Body": "El plan de atención de cada familia se construye en torno a su hijo, no según una lista genérica única para todos.",
    "valuesImageAlt": "Una clínica de Kids & Teens atendiendo a una paciente joven",
```

Also delete the single `"cultureImageAlt": "Miembros del equipo de Kids & Teens colaborando",`
line, same as in `en.json`.

- [ ] **Step 3: Write the failing test assertions**

In `components/CareersPageContent.test.tsx`, add this test right after the existing
`"keeps the anti-scam postings notice"` test:

```tsx
  it("renders Why Choose Us and Values as separate sections", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { name: "Why Choose Us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "More than a Workplace" })).toBeInTheDocument();
    expect(screen.getByText("Compassion")).toBeInTheDocument();
    expect(
      screen.getByText(/every family's plan of care is built around their child/i)
    ).toBeInTheDocument();
  });
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: FAIL, the "Why Choose Us" heading is not found (the old single "More than a
workplace" Culture section is still in place with the old copy).

- [ ] **Step 5: Replace the constants**

In `components/CareersPageContent.tsx`, find:

```tsx
const CULTURE_VALUES = ["cultureValue1", "cultureValue2", "cultureValue3", "cultureValue4"] as const;
```

Replace it with:

```tsx
const WHY_CHOOSE_US = ["whyChooseUs1", "whyChooseUs2", "whyChooseUs3", "whyChooseUs4"] as const;
const VALUES = [
  ["value1Title", "value1Body"],
  ["value2Title", "value2Body"],
  ["value3Title", "value3Body"],
  ["value4Title", "value4Body"],
] as const;
```

- [ ] **Step 6: Replace the Culture section JSX**

Find this exact block:

```tsx
      {/* Culture */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/careers/culture.jpg"
                alt={t("cultureImageAlt")}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {t("cultureHeading")}
            </h2>
            <p className="mt-3 text-ink-soft">{t("cultureBody")}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {CULTURE_VALUES.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3 w-3">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
```

Replace it with:

```tsx
      {/* Why choose us */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/careers/team-tent.jpg"
                alt={t("whyChooseUsImageAlt")}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {t("whyChooseUsHeading")}
            </h2>
            <p className="mt-3 text-ink-soft">{t("whyChooseUsIntro")}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {WHY_CHOOSE_US.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3 w-3">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Values behind our care */}
      <section className="bg-ivory-deep">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {t("valuesHeading")}
              </h2>
              <p className="mt-3 text-ink-soft">{t("valuesIntro")}</p>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
                <Image
                  src="/careers/team-photo.jpg"
                  alt={t("valuesImageAlt")}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([title, body], i) => (
              <Reveal key={title} delayMs={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-ink">{t(title)}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{t(body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: PASS, including the new Why-Choose-Us/Values test.

---

## Task 4: Add the "LA Network" section

**Files:**
- Modify: `components/CareersPageContent.tsx` (imports, JSX after the Values section)
- Modify: `components/CareersPageContent.test.tsx`
- Modify: `messages/en.json`, `messages/es.json`

**Interfaces:**
- Consumes: `locations` from `data/locations.ts` (`Location[]`, already has 25 real
  entries), `doctors` from `data/doctors.ts` (`Doctor[]`, already has 61 real entries),
  `LocationsMap` from `components/LocationsMap.tsx` (props: `{ locations: Location[] }`).

- [ ] **Step 1: Add the `en.json` LA Network keys**

Find (this is now right after `"valuesImageAlt"` from Task 3):

```json
    "valuesImageAlt": "A Kids & Teens clinician caring for a young patient",
```

Replace it with:

```json
    "valuesImageAlt": "A Kids & Teens clinician caring for a young patient",
    "laNetworkHeading": "Join the Largest Pediatric Network in LA",
    "laNetworkIntro": "Our {clinicCount} clinics and {providerCount}+ providers span Greater Los Angeles, so wherever you live, there is a place for you on our team.",
    "laNetworkStatClinics": "Clinics across Greater LA",
    "laNetworkStatProviders": "Providers across our network",
    "laNetworkStatYears": "Years of pediatric care in LA",
```

- [ ] **Step 2: Add the matching `es.json` keys**

Find:

```json
    "valuesImageAlt": "Una clínica de Kids & Teens atendiendo a una paciente joven",
```

Replace it with:

```json
    "valuesImageAlt": "Una clínica de Kids & Teens atendiendo a una paciente joven",
    "laNetworkHeading": "Únase a la Red Pediátrica Más Grande de LA",
    "laNetworkIntro": "Nuestras {clinicCount} clínicas y más de {providerCount} proveedores abarcan el área de Los Ángeles, así que sin importar dónde viva, hay un lugar para usted en nuestro equipo.",
    "laNetworkStatClinics": "Clínicas en el área de Los Ángeles",
    "laNetworkStatProviders": "Proveedores en nuestra red",
    "laNetworkStatYears": "Años de atención pediátrica en LA",
```

- [ ] **Step 3: Write the failing test**

In `components/CareersPageContent.test.tsx`, add near the top of the file, right after the
existing imports, a mock for the Leaflet map (rendering real Leaflet in jsdom is not
supported, and this mirrors the exact approach already used in
`components/LocationsMap.test.tsx`):

```tsx
vi.mock("@/components/LocationsMapLeaflet", () => ({
  LocationsMapLeaflet: ({ locations }: { locations: Array<{ id: string }> }) => (
    <div data-testid="leaflet-map">
      {locations.map((loc) => (
        <span key={loc.id}>{loc.id}</span>
      ))}
    </div>
  ),
}));
```

Then add this test after the Why-Choose-Us/Values test from Task 3:

```tsx
  it("renders the LA Network section with real, non-hardcoded stats", () => {
    render(<CareersPageContent />);
    expect(
      screen.getByRole("heading", { name: "Join the Largest Pediatric Network in LA" })
    ).toBeInTheDocument();
    expect(screen.getByText(String(locations.length))).toBeInTheDocument();
    expect(screen.getByText(`${doctors.length}+`)).toBeInTheDocument();
  });
```

Add the two new imports at the top of the test file alongside the existing `positions`
import:

```tsx
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: FAIL, the "Join the Largest Pediatric Network in LA" heading does not exist yet.

- [ ] **Step 5: Add the imports to `CareersPageContent.tsx`**

Add alongside the existing data imports:

```tsx
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { LocationsMap } from "@/components/LocationsMap";
```

- [ ] **Step 6: Add the LA Network section JSX**

Find the end of the Values section added in Task 3 (the closing `</section>` of "Values
behind our care"), right before the Application form section's `{/* Application form */}`
comment (at this point in the sequence, Task 3 replaced Culture in place, so Values still
sits in that original spot, directly before the Application form and after Open Positions),
and insert this new section between them:

```tsx
      {/* LA network */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("laNetworkHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            {t("laNetworkIntro", { clinicCount: locations.length, providerCount: doctors.length })}
          </p>
        </Reveal>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-card">
            <p className="font-display text-3xl font-extrabold text-teal-dark">{locations.length}</p>
            <p className="mt-1 text-sm text-ink-soft">{t("laNetworkStatClinics")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-card">
            <p className="font-display text-3xl font-extrabold text-teal-dark">{doctors.length}+</p>
            <p className="mt-1 text-sm text-ink-soft">{t("laNetworkStatProviders")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-card">
            <p className="font-display text-3xl font-extrabold text-teal-dark">18+</p>
            <p className="mt-1 text-sm text-ink-soft">{t("laNetworkStatYears")}</p>
          </div>
        </div>
        <Reveal delayMs={100}>
          <div className="mt-8">
            <LocationsMap locations={locations} />
          </div>
        </Reveal>
      </section>
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: PASS.

- [ ] **Step 8: Run the full test suite and build to close out Batch 1**

Run: `npm run test`
Expected: all tests PASS.

Run: `npm run build`
Expected: build succeeds with no type errors.

---

## Task 5: Reorder sections to match the approved page structure

**Files:**
- Modify: `components/CareersPageContent.tsx` (JSX reordering only, no new content)
- Modify: `components/CareersPageContent.test.tsx`

**Interfaces:** none new; pure reordering of existing JSX blocks within the same `return`.

Tasks 2 to 4 each inserted their new content in place without reordering anything else, so
the current physical top-to-bottom order is: Hero, CareersStory, Perks strip, Benefits,
Open Positions, Why Choose Us, Values, LA Network, Application form, Anti-scam notice. (Task
3 replaced the old Culture section in its original spot, after Open Positions, so Why
Choose Us and Values both landed there too; Task 4 added LA Network directly after Values,
still before Application form.)

The approved spec order is: Hero, Our Story, Why Choose Us, Perks strip, Benefits, Values,
LA Network, (Find Where You Belong, added in Task 7), Open Positions, Application form,
(FAQ, added in Task 10), Anti-scam notice. Getting there from the current order takes two
cuts:

1. Move the "Why Choose Us" section (currently sitting right after Open Positions, before
   Values) to directly after `<CareersStory />` and before the `{/* Perks strip */}`
   comment.
2. After that first move, "Values behind our care" and "LA network" (kept adjacent, in that
   order) sit directly after Open Positions, before Application form. Move both of them to
   directly after the Benefits section's closing `</section>` and before the `{/* Open
   positions */}` comment.

After both moves, the physical top-to-bottom order must read: Hero, CareersStory, Why
Choose Us, Perks strip, Benefits, Values, LA Network, Open Positions, Application form,
Anti-scam notice. (Task 7 will later insert Find Where You Belong between LA Network and
Open Positions, and Task 10 will insert FAQ between Application form and Anti-scam notice,
without needing to move anything else.)

- [ ] **Step 1: Write a failing order-assertion test**

In `components/CareersPageContent.test.tsx`, add this test:

```tsx
  it("renders sections in the approved order", () => {
    render(<CareersPageContent />);
    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent);
    const indexOf = (text: string) => headings.findIndex((h) => h === text);

    expect(indexOf("Why Choose Us")).toBeGreaterThanOrEqual(0);
    expect(indexOf("Why Choose Us")).toBeLessThan(indexOf("Benefits that support your life"));
    expect(indexOf("More than a Workplace")).toBeGreaterThan(indexOf("Benefits that support your life"));
    expect(indexOf("Join the Largest Pediatric Network in LA")).toBeGreaterThan(
      indexOf("More than a Workplace")
    );
    expect(indexOf("Open Positions (8)")).toBeGreaterThan(
      indexOf("Join the Largest Pediatric Network in LA")
    );
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: FAIL, because today Why Choose Us comes after Benefits (and after Open
Positions), not before Benefits.

- [ ] **Step 3: Perform the two moves described above**

In `components/CareersPageContent.tsx`:

First, cut the entire "Why Choose Us" section block (from its `{/* Why choose us */}`
comment through its closing `</section>`) from its current position (immediately after
Open Positions' closing `</section>`, before `{/* Values behind our care */}`), and paste
it immediately after the `<CareersStory />` line and before the `{/* Perks strip */}`
comment.

Second, cut the "Values behind our care" and "LA network" section blocks together (from
`{/* Values behind our care */}` through the LA Network section's closing `</section>`,
preserving their relative order) from their current position (now immediately after Open
Positions, since Why Choose Us was just removed from between them) and paste them
immediately after the Benefits section's closing `</section>` and before the `{/* Open
positions */}` comment.

Verify the result by reading the file afterward: the section comments, top to bottom, must
read `{/* Hero */}` (implicit, no comment currently), `<CareersStory />`, `{/* Why choose
us */}`, `{/* Perks strip */}`, `{/* Benefits */}`, `{/* Values behind our care */}`, `{/*
LA network */}`, `{/* Open positions */}`, `{/* Application form */}`, `{/* Anti-scam
notice ... */}`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: PASS, including the new order test.

- [ ] **Step 5: Run the full test suite**

Run: `npm run test`
Expected: all tests PASS (this step is a pure reorder, so no other test should be affected).

---

## Task 6: Add the `roleCategories` data model

**Files:**
- Modify: `data/careers.ts`
- Modify: `data/careers.test.ts`

**Interfaces:**
- Produces: `export type RoleCategoryId`, `export type RoleCategory`, `export const
  roleCategories: RoleCategory[]` from `data/careers.ts`. Consumed by Task 7's
  `CareersRoleBrowser`.

- [ ] **Step 1: Write the failing test**

In `data/careers.test.ts`, add the following import and test block:

```ts
import { positions, DEPARTMENTS, roleCategories, type Position } from "./careers";
```

(replacing the existing `import { positions, DEPARTMENTS, type Position } from "./careers";`
line at the top of the file)

```ts
describe("careers role categories", () => {
  it("has exactly 8 categories with unique ids", () => {
    expect(roleCategories.length).toBe(8);
    const ids = roleCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every category is well-formed and only references real departments", () => {
    for (const c of roleCategories) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.titleEs.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
      expect(c.descriptionEs.length).toBeGreaterThan(0);
      for (const dept of c.departments) {
        expect(DEPARTMENTS).toContain(dept);
      }
    }
  });

  it("covers every department with at least one category", () => {
    const covered = new Set(roleCategories.flatMap((c) => c.departments));
    for (const dept of DEPARTMENTS) {
      expect(covered.has(dept)).toBe(true);
    }
  });

  it("contains no em dash in any string", () => {
    const strings = roleCategories.flatMap((c) => [c.title, c.titleEs, c.description, c.descriptionEs]);
    for (const s of strings) expect(s).not.toContain("—");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- data/careers.test.ts`
Expected: FAIL, `roleCategories` is not exported from `./careers`.

- [ ] **Step 3: Add the `RoleCategory` type and data**

In `data/careers.ts`, add after the existing `export const DEPARTMENTS: Department[] = [...]`
block:

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
  // Which existing Department values this category's "Explore roles" maps to. Two
  // categories may point at the same department (e.g. Physicians and Advanced Practice
  // Providers both map to "Clinical", since this app's Department taxonomy is coarser
  // than the 8 role-browser labels) so their open-role counts and filtered results can
  // legitimately overlap. Every one of the 6 Department values is covered by at least
  // one category (enforced by a data test); "Therapy" is covered via
  // nursingClinicalSupport rather than a dedicated category, since the reference design
  // only defines these 8 labels.
  departments: Department[];
};

// Seed from the reference role-browser design. Every entry's description is drafted
// except "physicians", which matches the one real example shown in that design. Client
// to confirm/edit before launch, same as the seed position list above.
export const roleCategories: RoleCategory[] = [
  {
    id: "physicians",
    title: "Physicians",
    titleEs: "Médicos",
    description:
      "Deliver comprehensive pediatric care while working with experienced clinical and administrative teams.",
    descriptionEs:
      "Brinde atención pediátrica integral mientras trabaja junto a equipos clínicos y administrativos con experiencia.",
    departments: ["Clinical"],
  },
  {
    id: "advancedPractice",
    title: "Advanced Practice Providers",
    titleEs: "Proveedores de Práctica Avanzada",
    description:
      "Provide well-child visits, sick visits, and telehealth care alongside our physicians and clinical teams.",
    descriptionEs:
      "Brinde visitas de niño sano, visitas por enfermedad y atención de telesalud junto a nuestros médicos y equipos clínicos.",
    departments: ["Clinical"],
  },
  {
    id: "nursingClinicalSupport",
    title: "Nursing and Clinical Support",
    titleEs: "Enfermería y Apoyo Clínico",
    description:
      "Support patient care from intake through treatment, including therapy services, keeping every visit safe and on schedule.",
    descriptionEs:
      "Apoye la atención del paciente desde la admisión hasta el tratamiento, incluidos los servicios de terapia, manteniendo cada visita segura y a tiempo.",
    departments: ["Clinical Support", "Therapy"],
  },
  {
    id: "medicalAssistants",
    title: "Medical Assistants",
    titleEs: "Asistentes Médicos",
    description:
      "Prepare patients for their visits and assist providers with exams, vaccines, and procedures.",
    descriptionEs:
      "Prepare a los pacientes para sus visitas y ayude a los proveedores con exámenes, vacunas y procedimientos.",
    departments: ["Clinical Support"],
  },
  {
    id: "frontOffice",
    title: "Front Office and Patient Services",
    titleEs: "Recepción y Servicios al Paciente",
    description:
      "Be the first friendly face our families see, from scheduling to check-in to insurance questions.",
    descriptionEs:
      "Sea el primer rostro amable que ven nuestras familias, desde la programación hasta el registro y las preguntas de seguro.",
    departments: ["Administration"],
  },
  {
    id: "clinicOperations",
    title: "Clinic Operations and Leadership",
    titleEs: "Operaciones y Liderazgo Clínico",
    description:
      "Keep our clinics running smoothly, leading teams and processes that let clinicians focus on patients.",
    descriptionEs:
      "Mantenga nuestras clínicas funcionando sin problemas, liderando equipos y procesos que permiten a los clínicos enfocarse en los pacientes.",
    departments: ["Operations"],
  },
  {
    id: "corporateAdmin",
    title: "Corporate and Administrative Services",
    titleEs: "Servicios Corporativos y Administrativos",
    description:
      "Support the business behind the care, from billing and finance to human resources and administration.",
    descriptionEs:
      "Apoye el negocio detrás de la atención, desde facturación y finanzas hasta recursos humanos y administración.",
    departments: ["Finance"],
  },
  {
    id: "studentsEarlyCareers",
    title: "Students and Early Careers",
    titleEs: "Estudiantes y Carreras Iniciales",
    description:
      "Start your healthcare career with us through internships and entry-level opportunities.",
    descriptionEs:
      "Comience su carrera en el cuidado de la salud con nosotros a través de pasantías y oportunidades de nivel inicial.",
    departments: [],
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- data/careers.test.ts`
Expected: PASS, all 4 new tests.

---

## Task 7: Build the "Find Where You Belong" role browser and wire it in

**Files:**
- Create: `components/CareersRoleBrowser.tsx`
- Create: `components/CareersRoleBrowser.test.tsx`
- Modify: `components/CareersPageContent.tsx`
- Modify: `components/CareersPageContent.test.tsx`
- Modify: `messages/en.json`, `messages/es.json`

**Interfaces:**
- Consumes: `roleCategories`, `positions`, `type Department` from `data/careers.ts`
  (Task 6).
- Produces: `CareersRoleBrowser` component with props `{ onExplore: (departments:
  Department[]) => void }`, consumed by `CareersPageContent`.

- [ ] **Step 1: Add the `en.json` role-browser keys**

Find (added at the end of Task 4's LA Network keys):

```json
    "laNetworkStatYears": "Years of pediatric care in LA",
```

Replace it with:

```json
    "laNetworkStatYears": "Years of pediatric care in LA",
    "roleBrowserHeading": "Find Where You Belong",
    "roleBrowserIntro": "Select an area to preview it. Whether you deliver care directly or support the people who do, your work shapes a healthier future.",
    "roleBrowserExplore": "Explore roles",
    "roleBrowserOpenRoles": "{count} open roles",
    "roleBrowserImageAlt": "Kids & Teens team members collaborating across roles",
```

- [ ] **Step 2: Add the matching `es.json` keys**

Find:

```json
    "laNetworkStatYears": "Años de atención pediátrica en LA",
```

Replace it with:

```json
    "laNetworkStatYears": "Años de atención pediátrica en LA",
    "roleBrowserHeading": "Encuentre Dónde Encaja",
    "roleBrowserIntro": "Seleccione un área para conocerla. Ya sea que brinde atención directamente o apoye a quienes lo hacen, su trabajo da forma a un futuro más saludable.",
    "roleBrowserExplore": "Explorar puestos",
    "roleBrowserOpenRoles": "{count} puestos disponibles",
    "roleBrowserImageAlt": "Miembros del equipo de Kids & Teens colaborando en distintos puestos",
```

- [ ] **Step 3: Write the failing test for `CareersRoleBrowser`**

Create `components/CareersRoleBrowser.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersRoleBrowser } from "./CareersRoleBrowser";

describe("CareersRoleBrowser", () => {
  it("renders all 8 role categories with an open-role count", () => {
    render(<CareersRoleBrowser onExplore={() => {}} />);
    expect(screen.getByRole("heading", { name: "Physicians" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Students and Early Careers" })).toBeInTheDocument();
    const physiciansCard = screen.getByRole("heading", { name: "Physicians" }).closest("div")!;
    expect(within(physiciansCard).getByText(/2 open roles/)).toBeInTheDocument();
  });

  it("calls onExplore with the category's departments when Explore is clicked", async () => {
    const user = userEvent.setup();
    const onExplore = vi.fn();
    render(<CareersRoleBrowser onExplore={onExplore} />);
    const card = screen.getByRole("heading", { name: "Physicians" }).closest("div")!;
    await user.click(within(card).getByRole("button", { name: "Explore roles" }));
    expect(onExplore).toHaveBeenCalledWith(["Clinical"]);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- components/CareersRoleBrowser.test.tsx`
Expected: FAIL, `Cannot find module './CareersRoleBrowser'`.

- [ ] **Step 5: Implement `CareersRoleBrowser`**

Create `components/CareersRoleBrowser.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { roleCategories, positions, type Department } from "@/data/careers";

type Props = {
  onExplore: (departments: Department[]) => void;
};

export function CareersRoleBrowser({ onExplore }: Props) {
  const t = useTranslations("Careers");
  const locale = useLocale();

  return (
    <section className="bg-ivory-deep">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("roleBrowserHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{t("roleBrowserIntro")}</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roleCategories.map((category, i) => {
            const title = locale === "es" ? category.titleEs : category.title;
            const description = locale === "es" ? category.descriptionEs : category.description;
            const count = positions.filter((p) => category.departments.includes(p.department)).length;
            return (
              <Reveal key={category.id} delayMs={Math.min(i, 6) * 40}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1 flex-1 text-sm text-ink-soft">{description}</p>
                  <p className="mt-3 text-xs font-semibold text-teal-dark">
                    {t("roleBrowserOpenRoles", { count })}
                  </p>
                  <button
                    type="button"
                    onClick={() => onExplore(category.departments)}
                    className="mt-4 self-start rounded-full border border-border bg-surface px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
                  >
                    {t("roleBrowserExplore")}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delayMs={200}>
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl shadow-card">
            <Image
              src="/careers/culture.jpg"
              alt={t("roleBrowserImageAlt")}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test -- components/CareersRoleBrowser.test.tsx`
Expected: PASS.

- [ ] **Step 7: Wire `CareersRoleBrowser` into `CareersPageContent`**

Add the import:

```tsx
import { CareersRoleBrowser } from "@/components/CareersRoleBrowser";
```

Add this handler function inside the `CareersPageContent` component, next to the existing
`applyTo` function:

```tsx
  function exploreRoleCategory(categoryDepartments: Department[]) {
    setDepartment(categoryDepartments.length === 1 ? categoryDepartments[0] : "all");
    if (typeof document !== "undefined") {
      document.getElementById("positions")?.scrollIntoView({ behavior: "smooth" });
    }
  }
```

Find the end of the LA Network section (its closing `</section>`) followed by the
`{/* Open positions */}` comment (this is now their exact adjacency after Task 5's
reordering), and insert the role browser between them:

```tsx
      </section>

      <CareersRoleBrowser onExplore={exploreRoleCategory} />

      {/* Open positions */}
```

- [ ] **Step 8: Write the failing integration test**

In `components/CareersPageContent.test.tsx`, add:

```tsx
  it("narrows Open Positions when a role-browser category is explored", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const card = screen.getByRole("heading", { name: "Corporate and Administrative Services" }).closest("div")!;
    await user.click(within(card).getByRole("button", { name: "Explore roles" }));
    expect(screen.getByRole("heading", { name: "Billing Specialist" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pediatrician (MD/DO)" })).not.toBeInTheDocument();
  });
```

- [ ] **Step 9: Run the test to verify it fails, then passes**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: first FAIL (role browser not wired in yet, if Step 7 was not yet applied), then
after Step 7, PASS.

---

## Task 8: Restructure Benefits into the 4-category deep-dive

**Files:**
- Modify: `components/CareersPageContent.tsx`
- Modify: `components/CareersPageContent.test.tsx`
- Modify: `messages/en.json`, `messages/es.json`

**Interfaces:** none new; same-file content/JSX replacement.

- [ ] **Step 1: Replace the `en.json` benefit keys**

Find this exact block:

```json
    "benefit1Title": "401(k) with profit sharing",
    "benefit1Body": "Plan for the future with a retirement match and profit sharing.",
    "benefit2Title": "Health & dependent care",
    "benefit2Body": "Medical, dental, and vision coverage for you and your dependents.",
    "benefit3Title": "Generous paid time off",
    "benefit3Body": "Recharge with generous PTO and paid holidays.",
    "benefit4Title": "Continuing education",
    "benefit4Body": "Grow with support for licensure, CME, and professional development.",
```

Replace it with:

```json
    "benefitCategory1Title": "Health & Wellbeing",
    "benefitCategory1Item1": "Medical, dental, and vision coverage for you and your dependents",
    "benefitCategory1Item2": "Dependent care coverage so your family is covered too",
    "benefitCategory2Title": "Financial Benefits",
    "benefitCategory2Item1": "401(k) retirement plan with profit sharing",
    "benefitCategory2Item2": "A restricted bonus program designed to ease student loans and support your retirement goals",
    "benefitCategory3Title": "Work-Life Support",
    "benefitCategory3Item1": "Generous paid time off, holidays, and sick leave",
    "benefitCategory3Item2": "Flexible scheduling so you can manage your hours and patient relationships",
    "benefitCategory4Title": "Professional Development",
    "benefitCategory4Item1": "Tuition discounts for continuing education",
    "benefitCategory4Item2": "Support for licensure, CME, and career growth",
```

- [ ] **Step 2: Replace the `es.json` benefit keys**

Find:

```json
    "benefit1Title": "401(k) con participación en las ganancias",
    "benefit1Body": "Planifique su futuro con aportes de jubilación y participación en las ganancias.",
    "benefit2Title": "Salud y cuidado de dependientes",
    "benefit2Body": "Cobertura médica, dental y de visión para usted y sus dependientes.",
    "benefit3Title": "Tiempo libre pagado generoso",
    "benefit3Body": "Recárguese con generoso tiempo libre pagado y días festivos.",
    "benefit4Title": "Educación continua",
    "benefit4Body": "Crezca con apoyo para licencias, CME y desarrollo profesional.",
```

Replace it with:

```json
    "benefitCategory1Title": "Salud y Bienestar",
    "benefitCategory1Item1": "Cobertura médica, dental y de visión para usted y sus dependientes",
    "benefitCategory1Item2": "Cobertura de cuidado de dependientes para que su familia también esté cubierta",
    "benefitCategory2Title": "Beneficios Financieros",
    "benefitCategory2Item1": "Plan de jubilación 401(k) con participación en las ganancias",
    "benefitCategory2Item2": "Un programa de bonos restringidos diseñado para aliviar los préstamos estudiantiles y apoyar sus metas de jubilación",
    "benefitCategory3Title": "Apoyo para el Equilibrio Laboral",
    "benefitCategory3Item1": "Generoso tiempo libre pagado, días festivos y licencia por enfermedad",
    "benefitCategory3Item2": "Horario flexible para que pueda gestionar sus horas y sus relaciones con los pacientes",
    "benefitCategory4Title": "Desarrollo Profesional",
    "benefitCategory4Item1": "Descuentos de matrícula para educación continua",
    "benefitCategory4Item2": "Apoyo para licencias, CME y crecimiento profesional",
```

- [ ] **Step 3: Write the failing test**

Replace the assumption in any existing test that checks old benefit copy (there is none
currently asserting benefit titles directly) and add:

```tsx
  it("renders the 4 benefits categories with their items", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { name: "Health & Wellbeing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Professional Development" })).toBeInTheDocument();
    expect(
      screen.getByText("A restricted bonus program designed to ease student loans and support your retirement goals")
    ).toBeInTheDocument();
  });
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: FAIL, "Health & Wellbeing" heading not found (old benefit copy still renders).

- [ ] **Step 5: Replace the `BENEFITS` constant**

Find:

```tsx
const BENEFITS = [
  ["benefit1Title", "benefit1Body"],
  ["benefit2Title", "benefit2Body"],
  ["benefit3Title", "benefit3Body"],
  ["benefit4Title", "benefit4Body"],
] as const;
```

Replace it with:

```tsx
const BENEFIT_CATEGORIES = [
  ["benefitCategory1Title", ["benefitCategory1Item1", "benefitCategory1Item2"]],
  ["benefitCategory2Title", ["benefitCategory2Item1", "benefitCategory2Item2"]],
  ["benefitCategory3Title", ["benefitCategory3Item1", "benefitCategory3Item2"]],
  ["benefitCategory4Title", ["benefitCategory4Item1", "benefitCategory4Item2"]],
] as const;
```

- [ ] **Step 6: Replace the Benefits section's card-mapping JSX**

Find:

```tsx
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(([title, body], i) => (
              <Reveal key={title} delayMs={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-teal/30 hover:shadow-soft">
                  <h3 className="font-display text-base font-bold text-ink">{t(title)}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{t(body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
```

Replace it with:

```tsx
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFIT_CATEGORIES.map(([title, items], i) => (
              <Reveal key={title} delayMs={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-teal/30 hover:shadow-soft">
                  <h3 className="font-display text-base font-bold text-ink">{t(title)}</h3>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-ink-soft">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: PASS.

---

## Task 9: Add the `careersFaq` data model

**Files:**
- Create: `data/careersFaq.ts`
- Create: `data/careersFaq.test.ts`

**Interfaces:**
- Produces: `export type FaqItem`, `export const careersFaq: FaqItem[]` from
  `data/careersFaq.ts`. Consumed by Task 10's `CareersFaq`.

- [ ] **Step 1: Write the failing test**

Create `data/careersFaq.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { careersFaq } from "./careersFaq";

describe("careers FAQ data", () => {
  it("has exactly 7 items with unique ids", () => {
    expect(careersFaq.length).toBe(7);
    const ids = careersFaq.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has a question and answer in both languages", () => {
    for (const item of careersFaq) {
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.questionEs.length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThan(0);
      expect(item.answerEs.length).toBeGreaterThan(0);
    }
  });

  it("contains no em dash in any string", () => {
    const strings = careersFaq.flatMap((f) => [f.question, f.questionEs, f.answer, f.answerEs]);
    for (const s of strings) expect(s).not.toContain("—");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- data/careersFaq.test.ts`
Expected: FAIL, `Cannot find module './careersFaq'`.

- [ ] **Step 3: Implement `data/careersFaq.ts`**

Create `data/careersFaq.ts`:

```ts
export type FaqItem = {
  id: string;
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
};

// Drafted from facts already established elsewhere in this codebase (the seed positions,
// the anti-scam notice). The live ktdoctor.com site has no FAQ section to source this
// from; client to confirm/edit before launch, same as the seed position list.
export const careersFaq: FaqItem[] = [
  {
    id: "multiple-positions",
    question: "Can I apply for more than one position?",
    questionEs: "¿Puedo postularme a más de un puesto?",
    answer:
      "Yes. You are welcome to apply to as many open positions as you are qualified for and interested in. Use the position dropdown in the application form to select the role you would like to apply for first, and mention any other roles of interest in your message.",
    answerEs:
      "Sí. Puede postularse a tantos puestos disponibles como esté calificado e interesado. Use el menú desplegable de puesto en el formulario de postulación para seleccionar el puesto al que desea postularse primero, y mencione cualquier otro puesto de su interés en su mensaje.",
  },
  {
    id: "full-part-time",
    question: "Are full-time and part-time opportunities available?",
    questionEs: "¿Hay oportunidades de tiempo completo y medio tiempo disponibles?",
    answer:
      "Yes. Employment type varies by role and is listed on each open position. Check the Open Positions section for the specific schedule of each opening.",
    answerEs:
      "Sí. El tipo de empleo varía según el puesto y se indica en cada vacante. Consulte la sección de Puestos Disponibles para conocer el horario específico de cada vacante.",
  },
  {
    id: "preferred-location",
    question: "Can I select a preferred clinic location?",
    questionEs: "¿Puedo seleccionar una ubicación de clínica preferida?",
    answer:
      "Yes. Many of our openings list specific clinic locations, and our application form lets you note your location preference in your message. We will do our best to match you with a clinic that works for you.",
    answerEs:
      "Sí. Muchas de nuestras vacantes indican ubicaciones de clínica específicas, y nuestro formulario de postulación le permite indicar su ubicación preferida en su mensaje. Haremos todo lo posible para ubicarlo en una clínica que le convenga.",
  },
  {
    id: "referrals",
    question: "Can I refer someone for an opportunity?",
    questionEs: "¿Puedo referir a alguien para una oportunidad?",
    answer:
      "Yes, we welcome referrals. Have the person you are referring apply directly through this page, or email us their information at the address below.",
    answerEs:
      "Sí, con gusto aceptamos referencias. Pida a la persona que refiere que se postule directamente a través de esta página, o envíenos su información por correo electrónico a la dirección indicada abajo.",
  },
  {
    id: "professional-development",
    question: "Does KTMG provide professional development support?",
    questionEs: "¿KTMG ofrece apoyo para el desarrollo profesional?",
    answer:
      "Yes. We support continuing education, licensure, and CME as part of our benefits package. See the Benefits section above for details.",
    answerEs:
      "Sí. Apoyamos la educación continua, las licencias y la CME como parte de nuestro paquete de beneficios. Consulte la sección de Beneficios arriba para más detalles.",
  },
  {
    id: "genuine-postings",
    question: "How will I know whether a job advertisement is genuine?",
    questionEs: "¿Cómo sabré si un anuncio de empleo es genuino?",
    answer:
      "Our official job postings are only shared on our social media pages, our own company websites, and Indeed. If you see a posting anywhere else claiming to represent Kids & Teens Medical Group, treat it as suspicious and contact us directly to confirm.",
    answerEs:
      "Nuestras ofertas de empleo oficiales solo se comparten en nuestras redes sociales, nuestros propios sitios web y en Indeed. Si ve una publicación en cualquier otro lugar que afirme representar a Kids & Teens Medical Group, considérela sospechosa y contáctenos directamente para confirmar.",
  },
  {
    id: "accommodation",
    question: "Can I request an accommodation during recruitment?",
    questionEs: "¿Puedo solicitar una adaptación durante el proceso de reclutamiento?",
    answer:
      "Yes. If you need an accommodation at any point in the application or interview process, let us know in your application message or by emailing us directly, and we will work with you.",
    answerEs:
      "Sí. Si necesita una adaptación en cualquier momento del proceso de postulación o entrevista, avísenos en su mensaje de postulación o escribiéndonos directamente por correo, y trabajaremos con usted.",
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- data/careersFaq.test.ts`
Expected: PASS.

---

## Task 10: Build the Candidate FAQ accordion and wire it in

**Files:**
- Create: `components/CareersFaq.tsx`
- Create: `components/CareersFaq.test.tsx`
- Modify: `components/CareersPageContent.tsx`
- Modify: `components/CareersPageContent.test.tsx`
- Modify: `messages/en.json`, `messages/es.json`

**Interfaces:**
- Consumes: `careersFaq` from `data/careersFaq.ts` (Task 9).
- Produces: `CareersFaq` component (no props), consumed by `CareersPageContent`.

- [ ] **Step 1: Add the `en.json` FAQ heading key**

Find:

```json
    "postingsNotice": "Our official job postings are only shared on our social media pages, our own company websites, and Indeed. Be cautious of postings claiming to represent Kids & Teens Medical Group anywhere else.",
```

Replace it with:

```json
    "postingsNotice": "Our official job postings are only shared on our social media pages, our own company websites, and Indeed. Be cautious of postings claiming to represent Kids & Teens Medical Group anywhere else.",
    "faqHeading": "Candidate FAQ",
```

- [ ] **Step 2: Add the matching `es.json` key**

Find:

```json
    "postingsNotice": "Nuestras ofertas de empleo oficiales solo se comparten en nuestras redes sociales, nuestros propios sitios web y en Indeed. Tenga cuidado con las publicaciones que afirmen representar a Kids & Teens Medical Group en cualquier otro lugar.",
```

Replace it with:

```json
    "postingsNotice": "Nuestras ofertas de empleo oficiales solo se comparten en nuestras redes sociales, nuestros propios sitios web y en Indeed. Tenga cuidado con las publicaciones que afirmen representar a Kids & Teens Medical Group en cualquier otro lugar.",
    "faqHeading": "Preguntas Frecuentes de Candidatos",
```

- [ ] **Step 3: Write the failing test for `CareersFaq`**

Create `components/CareersFaq.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersFaq } from "./CareersFaq";
import { careersFaq } from "@/data/careersFaq";

describe("CareersFaq", () => {
  it("renders every FAQ question", () => {
    render(<CareersFaq />);
    for (const item of careersFaq) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  it("expands when a question is clicked", async () => {
    const user = userEvent.setup();
    render(<CareersFaq />);
    const first = careersFaq[0];
    const summary = screen.getByText(first.question);
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    await user.click(summary);
    expect(details).toHaveAttribute("open");
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- components/CareersFaq.test.tsx`
Expected: FAIL, `Cannot find module './CareersFaq'`.

- [ ] **Step 5: Implement `CareersFaq`**

Create `components/CareersFaq.tsx`:

```tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { careersFaq } from "@/data/careersFaq";

export function CareersFaq() {
  const t = useTranslations("Careers");
  const locale = useLocale();

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <Reveal>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t("faqHeading")}
        </h2>
      </Reveal>
      <div className="mt-8 flex flex-col gap-3">
        {careersFaq.map((item, i) => {
          const question = locale === "es" ? item.questionEs : item.question;
          const answer = locale === "es" ? item.answerEs : item.answer;
          return (
            <Reveal key={item.id} delayMs={Math.min(i, 6) * 40}>
              <details className="group rounded-2xl border border-border bg-surface p-5 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {question}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-teal-dark transition-transform group-open:rotate-180"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-ink-soft">{answer}</p>
              </details>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test -- components/CareersFaq.test.tsx`
Expected: PASS.

- [ ] **Step 7: Wire `CareersFaq` into `CareersPageContent`**

Add the import:

```tsx
import { CareersFaq } from "@/components/CareersFaq";
```

Find the end of the Application form section (its closing `</section>`) followed by this
existing two-line comment (verbatim, it already contains an em dash in the source code
comment itself; that pre-existing comment is not new generated copy, so it is exempt from
the no-em-dash rule, which applies to user-facing text):

```tsx
      </section>

      {/* Anti-scam notice — small bottom padding only; the footer's mt-16
          already provides the gap before it (avoids doubling up the band). */}
```

Insert the FAQ section between the closing `</section>` and that comment:

```tsx
      </section>

      <CareersFaq />

      {/* Anti-scam notice — small bottom padding only; the footer's mt-16
          already provides the gap before it (avoids doubling up the band). */}
```

- [ ] **Step 8: Add the page-level integration test**

In `components/CareersPageContent.test.tsx`, add:

```tsx
  it("renders the Candidate FAQ section", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { name: "Candidate FAQ" })).toBeInTheDocument();
    expect(
      screen.getByText("Can I apply for more than one position?")
    ).toBeInTheDocument();
  });
```

- [ ] **Step 9: Run the full test suite and build to close out Batch 2**

Run: `npm run test`
Expected: all tests PASS.

Run: `npm run build`
Expected: build succeeds with no type errors.

---

## Final verification checklist

- [ ] **Step 1: Confirm i18n key parity between `en.json` and `es.json`**

Run this Node one-liner (adjust for PowerShell quoting) to diff the two files' `Careers`
namespace keys:

```powershell
node -e "const en=require('./messages/en.json').Careers; const es=require('./messages/es.json').Careers; const ek=Object.keys(en).sort(); const sk=Object.keys(es).sort(); const missing=ek.filter(k=>!sk.includes(k)); const extra=sk.filter(k=>!ek.includes(k)); console.log('missing in es:', missing); console.log('extra in es:', extra);"
```

Expected: both arrays empty.

- [ ] **Step 2: Run the full test suite one more time**

Run: `npm run test`
Expected: all tests PASS, with no console errors about missing translation keys.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: no errors.

Do not commit. Report completion to the user and let them decide on staging/committing and
on reviewing the drafted founder-story, FAQ, and role-category copy before launch.
