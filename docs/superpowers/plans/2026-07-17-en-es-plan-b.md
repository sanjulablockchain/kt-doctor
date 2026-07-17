# EN/ES Plan B (Remaining Translations, Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship full, natural Spanish translation for Network, Foundation (including its Sri Lanka section), Careers, Insurance, Resources, About, Testimonials, the FAQ data, and the remaining homepage sections (Services pill-cloud chrome, Featured Stories chrome, Resources section chrome), plus chrome-only translation for the Services and Blog index/detail pages.

**Architecture:** Each static page becomes a thin Server Component `page.tsx` (keeps `export const metadata`) wrapping a new `"use client"` `XPageContent` component that calls `useTranslations`, exactly matching the existing `DoctorsPageContent`/`LocationsPageContent` pattern. Small, fixed-size data files (`data/network.ts`, `data/foundation.ts`, `data/resources.ts`, `data/faq.ts`) get parallel `*Es` fields added directly to each item (e.g. `descriptionEs`) rather than a locale-parameterized function, keeping translations next to their English source. Components that render this data (`NetworkCard`, `ProgramCard`, `SriLankaTimeline`, `ResourceCard`, `FaqAccordion`) read the current locale via `useLocale()` and pick the right field.

**Tech Stack:** Next.js (App Router) under `app/[locale]/`, TypeScript, Tailwind CSS, Vitest + React Testing Library, next-intl — same as the rest of the app.

## Global Constraints

- No git repository is in use — do not run `git init` or commit. Every task ends with a manual verification step instead of a commit step.
- `data/services.ts` and `data/stories.ts` are explicitly OUT OF SCOPE for this plan — do not add any `*Es` fields to them, do not translate service or blog post names/descriptions/content. Only the page chrome (headings, eyebrows, intro paragraphs, back-links) around them gets translated.
- Do not use the em dash ("—") in any new copy, English or Spanish.
- Translations must be natural, accurate Spanish, not literal word-for-word — matching the quality already used in `messages/es.json`'s existing `Home`/`Doctors`/`Locations` keys.
- Real proper nouns stay unchanged across languages: company/brand names (Kids & Teens Medical Group, St. Gianna Medical Group, LA Intensive Pediatric Therapy, St. Joseph Hospital Negombo, Serendib Healthways), school names (St. Peter's College, etc.), place names (Negombo), insurance category abbreviations (HMO, PPO, Medi-Cal).
- Every new `"use client"` content component needs `renderWithIntl` (from `@/lib/test-utils`) in its tests, not plain `render` from `@testing-library/react` — this project's next-intl `Link` throws "No intl context found" under plain `render`.
- Mobile responsive throughout, matching the existing design system (`bg-ivory`, `text-ink`, `text-ink-soft`, `bg-teal`, `text-teal-dark`, `bg-teal-tint`, `bg-gold-tint`, `text-gold`, `border-border`, `bg-white`, `shadow-card`, `font-display`).

---

### Task 1: Network data, NetworkCard, and /network page

**Files:**
- Modify: `data/network.ts`, `components/NetworkCard.tsx`, `messages/en.json`, `messages/es.json`
- Create: `components/NetworkPageContent.tsx`, `components/NetworkCard.test.tsx` (update), `components/NetworkPageContent.test.tsx`
- Modify: `app/[locale]/network/page.tsx`, delete `app/[locale]/network/page.test.tsx` content in favor of testing `NetworkPageContent` (keep the file, but it now just smoke-tests `NetworkPage` renders `NetworkPageContent`)

**Interfaces:**
- Consumes: `useTranslations`, `useLocale` (next-intl), `renderWithIntl` (`@/lib/test-utils`)
- Produces: `NetworkPageContent` component, consumed by `app/[locale]/network/page.tsx`. `NetworkBrand` type gains `taglineEs`, `descriptionEs`, `servicesEs` fields, consumed by `NetworkCard` (this task) and the Home page's network-teaser section (Task 9, which uses `NetworkCard` with `compact`).

- [ ] **Step 1: Add Network translation keys**

Modify `messages/en.json` — add this as a new top-level key, sibling to `Locations`:

```json
"Network": {
    "eyebrow": "One Network",
    "heading": "More ways to care for your family.",
    "description": "Kids & Teens Medical Group works alongside three sister companies to cover family practice, pediatric therapy, and hospital care in Sri Lanka, all under one trusted network.",
    "browseDoctors": "Browse doctors",
    "visitSite": "Visit site"
  }
```

Modify `messages/es.json` the same way:

```json
"Network": {
    "eyebrow": "Una red",
    "heading": "Más formas de cuidar a su familia.",
    "description": "Kids & Teens Medical Group trabaja junto a tres empresas hermanas para cubrir medicina familiar, terapia pediátrica y atención hospitalaria en Sri Lanka, todo bajo una red de confianza.",
    "browseDoctors": "Ver doctores",
    "visitSite": "Visitar sitio"
  }
```

- [ ] **Step 2: Write the failing test for translated NetworkCard**

Replace `components/NetworkCard.test.tsx` entirely:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { NetworkCard } from "./NetworkCard";

const sampleBrand = {
  id: "ktmg",
  name: "Kids & Teens Medical Group",
  tagline: "The flagship pediatric network.",
  taglineEs: "La red pediátrica insignia.",
  description: "Board-certified pediatric care across 24 clinics in Greater LA, for ages 0 to 21.",
  descriptionEs:
    "Atención pediátrica certificada en 24 clínicas del área de Los Ángeles, para edades de 0 a 21 años.",
  services: ["Primary Care", "Urgent Care"],
  servicesEs: ["Atención Primaria", "Atención de Urgencia"],
  logoSrc: "/clinic-logo.svg",
  internalHref: "/doctors",
};

describe("NetworkCard", () => {
  it("renders English content by default", () => {
    render(<NetworkCard brand={sampleBrand} />);
    expect(screen.getByText("The flagship pediatric network.")).toBeInTheDocument();
    expect(screen.getByText(/board-certified pediatric care/i)).toBeInTheDocument();
    expect(screen.getByText("Primary Care")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse doctors/i })).toBeInTheDocument();
  });

  it("renders Spanish content when locale is es", () => {
    render(<NetworkCard brand={sampleBrand} />, "es");
    expect(screen.getByText("La red pediátrica insignia.")).toBeInTheDocument();
    expect(screen.getByText(/atención pediátrica certificada/i)).toBeInTheDocument();
    expect(screen.getByText("Atención Primaria")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver doctores/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/NetworkCard.test.tsx
```

Expected: FAIL — `NetworkCard` doesn't accept locale-based fields or use translations yet.

- [ ] **Step 4: Add `*Es` fields to network data**

Modify `data/network.ts` — update the type and add the field to every brand:

```ts
export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  taglineEs: string;
  description: string;
  descriptionEs: string;
  services: string[];
  servicesEs: string[];
  logoSrc: string;
  externalUrl?: string;
  internalHref?: string;
  partnerCredit?: { label: string; url: string };
};

export const networkBrands: NetworkBrand[] = [
  {
    id: "ktmg",
    name: "Kids & Teens Medical Group",
    tagline: "The flagship pediatric network.",
    taglineEs: "La red pediátrica insignia.",
    description:
      "Board-certified pediatric care across 24 clinics in Greater LA, for ages 0 to 21.",
    descriptionEs:
      "Atención pediátrica certificada en 24 clínicas del área de Los Ángeles, para edades de 0 a 21 años.",
    services: ["Primary Care", "Urgent Care", "Telehealth", "Newborn Care"],
    servicesEs: ["Atención Primaria", "Atención de Urgencia", "Telesalud", "Cuidado del Recién Nacido"],
    logoSrc: "/clinic-logo.svg",
    internalHref: "/doctors",
  },
  {
    id: "st-gianna",
    name: "St. Gianna Medical Group",
    tagline: "Family practice for all ages.",
    taglineEs: "Medicina familiar para todas las edades.",
    description:
      "Comprehensive healthcare for adults and children, with same-day appointments and 24/7 booking. Partners with KTMG to extend care beyond pediatrics.",
    descriptionEs:
      "Atención médica integral para adultos y niños, con citas el mismo día y reservas las 24 horas. Trabaja junto a KTMG para extender la atención más allá de la pediatría.",
    services: ["Same-Day Appointments", "24/7 Booking", "Telehealth", "Advanced Wound Care"],
    servicesEs: ["Citas el Mismo Día", "Reservas 24/7", "Telesalud", "Cuidado Avanzado de Heridas"],
    logoSrc: "/sgm-logo.png",
    externalUrl: "https://www.sgmdoctor.com",
  },
  {
    id: "laipt",
    name: "LA Intensive Pediatric Therapy",
    tagline: "Expert pediatric therapy since 2010.",
    taglineEs: "Terapia pediátrica experta desde 2010.",
    description:
      "Individual and center-based speech, occupational, and developmental therapy for children.",
    descriptionEs:
      "Terapia individual y en centro de habla, ocupacional y de desarrollo para niños.",
    services: ["Speech Therapy", "Occupational Therapy", "Sensory Integration"],
    servicesEs: ["Terapia del Habla", "Terapia Ocupacional", "Integración Sensorial"],
    logoSrc: "/laipt-logo.png",
    externalUrl: "https://www.laipt.org",
  },
  {
    id: "st-joseph-hospital",
    name: "St. Joseph Hospital Negombo",
    tagline: "US-standard care in Negombo, Sri Lanka.",
    taglineEs: "Atención con estándares de EE. UU. en Negombo, Sri Lanka.",
    description:
      "A hospital in Negombo, Sri Lanka, managed and operated by Kids & Teens Pediatric Medical Group, USA, bringing American healthcare standards to affordable, accessible care.",
    descriptionEs:
      "Un hospital en Negombo, Sri Lanka, administrado y operado por Kids & Teens Pediatric Medical Group, EE. UU., que trae los estándares de salud estadounidenses a una atención accesible y asequible.",
    services: [
      "Emergency & Outpatient Care",
      "Inpatient Care",
      "Telemedicine",
      "Pharmacy & Diagnostics",
    ],
    servicesEs: [
      "Emergencias y Consulta Externa",
      "Atención Hospitalaria",
      "Telemedicina",
      "Farmacia y Diagnóstico",
    ],
    logoSrc: "/sjh-logo.png",
    externalUrl: "https://www.sjhospital.lk",
    partnerCredit: {
      label: "Insurance coordination via Asiacorp Insurance Brokers",
      url: "https://acig.lk",
    },
  },
];
```

- [ ] **Step 5: Update NetworkCard to use locale-aware fields and translations**

Replace `components/NetworkCard.tsx` entirely:

```tsx
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NetworkBrand } from "@/data/network";

type NetworkCardProps = {
  brand: NetworkBrand;
  compact?: boolean;
};

export function NetworkCard({ brand, compact = false }: NetworkCardProps) {
  const t = useTranslations("Network");
  const locale = useLocale();
  const tagline = locale === "es" ? brand.taglineEs : brand.tagline;
  const description = locale === "es" ? brand.descriptionEs : brand.description;
  const services = locale === "es" ? brand.servicesEs : brand.services;

  return (
    <div className="flex h-full flex-col items-center rounded-3xl border border-border bg-white p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <div className="flex h-14 items-center justify-center">
        <Image
          src={brand.logoSrc}
          alt={`${brand.name} logo`}
          width={140}
          height={44}
          unoptimized
          className="h-full w-auto object-contain"
        />
      </div>

      <p className="mt-4 font-display text-lg font-bold text-ink">{brand.name}</p>

      {!compact && <p className="mt-1 text-sm font-semibold text-teal-dark">{tagline}</p>}

      <p className="mt-2 text-sm text-ink-soft">{description}</p>

      {!compact && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-teal-tint px-3 py-1 text-xs font-semibold text-teal-dark"
            >
              {service}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-5">
        {brand.internalHref ? (
          <Link
            href={brand.internalHref}
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("browseDoctors")} →
          </Link>
        ) : (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("visitSite")} →
          </a>
        )}

        {brand.partnerCredit && (
          <a
            href={brand.partnerCredit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs text-ink-soft underline-offset-2 hover:text-teal-dark hover:underline"
          >
            {brand.partnerCredit.label}
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run the NetworkCard test to verify it passes**

```bash
npm test -- components/NetworkCard.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 7: Write the failing test for NetworkPageContent**

Create `components/NetworkPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { NetworkPageContent } from "./NetworkPageContent";

describe("NetworkPageContent", () => {
  it("renders the English heading and all 4 real brands", () => {
    render(<NetworkPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "More ways to care for your family."
    );
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<NetworkPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Más formas de cuidar a su familia."
    );
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

```bash
npm test -- components/NetworkPageContent.test.tsx
```

Expected: FAIL — `Cannot find module './NetworkPageContent'`.

- [ ] **Step 9: Create NetworkPageContent and update the page wrapper**

Create `components/NetworkPageContent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { networkBrands } from "@/data/network";
import { NetworkCard } from "@/components/NetworkCard";

export function NetworkPageContent() {
  const t = useTranslations("Network");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {networkBrands.map((brand) => (
          <NetworkCard key={brand.id} brand={brand} />
        ))}
      </div>
    </main>
  );
}
```

Replace `app/[locale]/network/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { NetworkPageContent } from "@/components/NetworkPageContent";

export const metadata: Metadata = {
  title: "Our Network | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group, St. Gianna Medical Group, LA Intensive Pediatric Therapy, and St. Joseph Hospital Negombo: one trusted network covering pediatrics, family practice, pediatric therapy, and hospital care in Sri Lanka.",
};

export default function NetworkPage() {
  return <NetworkPageContent />;
}
```

Modify `app/[locale]/network/page.test.tsx` — replace its contents entirely, since the real assertions now live in `NetworkPageContent.test.tsx`:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import NetworkPage from "./page";

describe("NetworkPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<NetworkPage />);
  });
});
```

- [ ] **Step 10: Run both tests to verify they pass**

```bash
npm test -- components/NetworkPageContent.test.tsx "app/[locale]/network/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 11: Verify manually**

No standalone browser check needed yet — covered in Task 9's end-to-end verification alongside the other pages. Continue to Task 2.

---

### Task 2: Foundation data (+ Sri Lanka), ProgramCard, SriLankaTimeline, and /foundation page

**Files:**
- Modify: `data/foundation.ts`, `components/ProgramCard.tsx`, `components/SriLankaTimeline.tsx`, `messages/en.json`, `messages/es.json`
- Create: `components/FoundationPageContent.tsx`, `components/ProgramCard.test.tsx` (update), `components/SriLankaTimeline.test.tsx` (update), `components/FoundationPageContent.test.tsx`
- Modify: `app/[locale]/foundation/page.tsx`, `app/[locale]/foundation/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations`, `useLocale` (next-intl)
- Produces: `FoundationPageContent`, consumed by `app/[locale]/foundation/page.tsx`. `Foundation`, `FoundationProgram`, `SriLankaSchool` types gain `*Es` fields.

- [ ] **Step 1: Add Foundation translation keys**

Modify `messages/en.json` — add as a new top-level key:

```json
"Foundation": {
    "programsHeading": "Our programs",
    "donateNow": "Donate now",
    "visitFoundationSite": "Visit the Foundation site",
    "sriLankaEyebrow": "Sri Lanka Initiative",
    "preventiveScreeningsTitle": "Preventive Health Screenings",
    "preventiveScreeningsBody": "Early detection of health issues through regular screenings for vision, hearing, dental, and nutrition, reducing long-term healthcare costs.",
    "studentWellnessTitle": "Student Mental Wellness",
    "studentWellnessBody": "On-campus counseling and mental health support programs that improve academic performance, reduce absenteeism, and build resilience.",
    "internationalStandardsTitle": "International Healthcare Standards",
    "internationalStandardsBody": "Bringing US-trained pediatric expertise and evidence-based protocols to Sri Lanka, elevating the quality of school-based healthcare.",
    "communityImpactTitle": "Community Health Impact",
    "communityImpactBody": "Wellness centers serve not just students but entire families, creating a ripple effect of health literacy and preventive care across Negombo.",
    "seeLiveCampaign": "See live campaign progress & donate"
  }
```

Modify `messages/es.json` the same way:

```json
"Foundation": {
    "programsHeading": "Nuestros programas",
    "donateNow": "Donar ahora",
    "visitFoundationSite": "Visitar el sitio de la Fundación",
    "sriLankaEyebrow": "Iniciativa en Sri Lanka",
    "preventiveScreeningsTitle": "Exámenes Preventivos de Salud",
    "preventiveScreeningsBody": "Detección temprana de problemas de salud mediante exámenes regulares de visión, audición, salud dental y nutrición, reduciendo costos de salud a largo plazo.",
    "studentWellnessTitle": "Bienestar Mental Estudiantil",
    "studentWellnessBody": "Programas de asesoramiento y apoyo de salud mental en el campus que mejoran el rendimiento académico, reducen el ausentismo y fortalecen la resiliencia.",
    "internationalStandardsTitle": "Estándares Internacionales de Salud",
    "internationalStandardsBody": "Llevando experiencia pediátrica formada en EE. UU. y protocolos basados en evidencia a Sri Lanka, elevando la calidad de la atención de salud escolar.",
    "communityImpactTitle": "Impacto en la Salud Comunitaria",
    "communityImpactBody": "Los centros de bienestar sirven no solo a los estudiantes sino a familias enteras, creando un efecto positivo en la educación sanitaria y la atención preventiva en Negombo.",
    "seeLiveCampaign": "Ver el progreso de la campaña en vivo y donar"
  }
```

- [ ] **Step 2: Write the failing tests for ProgramCard and SriLankaTimeline**

Replace `components/ProgramCard.test.tsx` entirely:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ProgramCard } from "./ProgramCard";

const sampleProgram = {
  id: "scholarships",
  name: "Scholarships",
  nameEs: "Becas",
  description: "Home of the Janesri and Sunil De Silva Scholarship.",
  descriptionEs: "Sede de la Beca Janesri y Sunil De Silva.",
};

describe("ProgramCard", () => {
  it("renders English content by default", () => {
    render(<ProgramCard program={sampleProgram} />);
    expect(screen.getByText("Scholarships")).toBeInTheDocument();
    expect(screen.getByText("Home of the Janesri and Sunil De Silva Scholarship.")).toBeInTheDocument();
  });

  it("renders Spanish content when locale is es", () => {
    render(<ProgramCard program={sampleProgram} />, "es");
    expect(screen.getByText("Becas")).toBeInTheDocument();
    expect(screen.getByText("Sede de la Beca Janesri y Sunil De Silva.")).toBeInTheDocument();
  });
});
```

Replace `components/SriLankaTimeline.test.tsx` entirely (create it if it doesn't already exist under this name — check for an existing test file for this component first and replace whichever file tests it):

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { SriLankaTimeline } from "./SriLankaTimeline";

const sampleSchools = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    studentCountEs: "más de 1,200 estudiantes",
    programs: ["Vision Screening"],
    programsEs: ["Exámenes de Visión"],
  },
];

describe("SriLankaTimeline", () => {
  it("renders English student count and program labels by default", () => {
    render(<SriLankaTimeline schools={sampleSchools} />);
    expect(screen.getByText(/1,200\+ students/)).toBeInTheDocument();
    expect(screen.getByText("Vision Screening")).toBeInTheDocument();
  });

  it("renders Spanish student count and program labels when locale is es", () => {
    render(<SriLankaTimeline schools={sampleSchools} />, "es");
    expect(screen.getByText(/más de 1,200 estudiantes/)).toBeInTheDocument();
    expect(screen.getByText("Exámenes de Visión")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run both tests to verify they fail**

```bash
npm test -- components/ProgramCard.test.tsx components/SriLankaTimeline.test.tsx
```

Expected: FAIL — components don't read `*Es` fields or use locale yet.

- [ ] **Step 4: Add `*Es` fields to foundation data**

Replace `data/foundation.ts` entirely:

```ts
export type FoundationProgram = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
};

export type Foundation = {
  name: string;
  mission: string;
  missionEs: string;
  logoSrc: string;
  siteUrl: string;
  donateUrl: string;
  programs: FoundationProgram[];
};

export const foundation: Foundation = {
  name: "Kids and Teens Foundation",
  mission:
    "Providing critical medical care to those in need, opportunities to those who want to pursue medicine, and education so every family can act on conditions that are easily treated and prevented at home.",
  missionEs:
    "Brindando atención médica esencial a quienes la necesitan, oportunidades a quienes desean seguir una carrera en medicina, y educación para que cada familia pueda actuar ante condiciones fáciles de tratar y prevenir en casa.",
  logoSrc: "/foundation-logo.png",
  siteUrl: "https://kidsandteensfoundation.org",
  donateUrl: "https://kidsandteensfoundation.org/donate/",
  programs: [
    {
      id: "free-clinic-days",
      name: "Free Clinic Days & Continued Care",
      nameEs: "Días de Clínica Gratuita y Atención Continua",
      description:
        "Monthly free clinic days at KTMG's busiest locations for families with little or no medical coverage, plus continued low-cost follow-up care.",
      descriptionEs:
        "Días mensuales de clínica gratuita en las ubicaciones más concurridas de KTMG para familias con poca o ninguna cobertura médica, además de atención de seguimiento continua a bajo costo.",
    },
    {
      id: "medical-missions",
      name: "Medical Missions",
      nameEs: "Misiones Médicas",
      description:
        "A planned medical mission to Negombo, Sri Lanka, with partner Saint Joseph Hospital, bringing doctors to communities with limited access to care. Date to be announced.",
      descriptionEs:
        "Una misión médica planeada a Negombo, Sri Lanka, junto con el Hospital Saint Joseph, llevando médicos a comunidades con acceso limitado a la atención. Fecha por anunciar.",
    },
    {
      id: "internships",
      name: "Internship Opportunities",
      nameEs: "Oportunidades de Pasantías",
      description:
        "Internship and job opportunities for lower-income students transitioning from education into the workforce.",
      descriptionEs:
        "Oportunidades de pasantías y empleo para estudiantes de bajos ingresos que hacen la transición de la educación al mundo laboral.",
    },
    {
      id: "mentorship",
      name: "Mentorship",
      nameEs: "Mentoría",
      description:
        "A mentorship program pairing medical professionals with students ages 18 to 24 who are pursuing or considering a career in medicine.",
      descriptionEs:
        "Un programa de mentoría que conecta a profesionales médicos con estudiantes de 18 a 24 años que buscan o consideran una carrera en medicina.",
    },
    {
      id: "community-outreach",
      name: "Community & Educational Outreach",
      nameEs: "Alcance Comunitario y Educativo",
      description:
        "Working with local governments and organizations to improve school health education and community wellbeing.",
      descriptionEs:
        "Trabajando con gobiernos locales y organizaciones para mejorar la educación de salud escolar y el bienestar comunitario.",
    },
    {
      id: "scholarships",
      name: "Scholarships",
      nameEs: "Becas",
      description:
        "Home of the Janesri and Sunil De Silva Scholarship, awarded annually to students pursuing pre-med, biology, chemistry, or related fields.",
      descriptionEs:
        "Sede de la Beca Janesri y Sunil De Silva, otorgada anualmente a estudiantes que cursan pre-medicina, biología, química u otros campos relacionados.",
    },
  ],
};

export type SriLankaSchool = {
  id: string;
  name: string;
  location: string;
  studentCount: string;
  studentCountEs: string;
  programs: string[];
  programsEs: string[];
};

export type SriLankaProgram = {
  heading: string;
  headingEs: string;
  mission: string;
  missionEs: string;
};

export const sriLankaProgram: SriLankaProgram = {
  heading: "Transforming School Wellness in Sri Lanka",
  headingEs: "Transformando el Bienestar Escolar en Sri Lanka",
  mission:
    "Converting and managing wellness centers at leading Negombo schools, bringing world-class pediatric care to students who need it most.",
  missionEs:
    "Convirtiendo y gestionando centros de bienestar en las principales escuelas de Negombo, llevando atención pediátrica de clase mundial a los estudiantes que más la necesitan.",
};

export const sriLankaSchools: SriLankaSchool[] = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    studentCountEs: "más de 1,200 estudiantes",
    programs: ["Vision Screening", "Dental Check-ups", "Nutrition Programs", "Mental Health Counseling"],
    programsEs: [
      "Exámenes de Visión",
      "Revisiones Dentales",
      "Programas de Nutrición",
      "Asesoramiento de Salud Mental",
    ],
  },
  {
    id: "st-josephs-college",
    name: "St. Joseph's College",
    location: "Negombo",
    studentCount: "900+ students",
    studentCountEs: "más de 900 estudiantes",
    programs: ["Sports Physicals", "Immunization Drives", "First Aid Training", "Health Education"],
    programsEs: [
      "Exámenes Físicos Deportivos",
      "Jornadas de Vacunación",
      "Capacitación en Primeros Auxilios",
      "Educación en Salud",
    ],
  },
  {
    id: "loyola-college",
    name: "Loyola College",
    location: "Negombo",
    studentCount: "1,100+ students",
    studentCountEs: "más de 1,100 estudiantes",
    programs: ["Telehealth Access", "Chronic Disease Mgmt", "Hygiene Programs", "Parent Workshops"],
    programsEs: [
      "Acceso a Telesalud",
      "Manejo de Enfermedades Crónicas",
      "Programas de Higiene",
      "Talleres para Padres",
    ],
  },
  {
    id: "maristella-college",
    name: "Maristella College",
    location: "Negombo",
    studentCount: "800+ students",
    studentCountEs: "más de 800 estudiantes",
    programs: ["Speech Therapy", "Occupational Therapy", "Sensory Programs", "Growth Monitoring"],
    programsEs: [
      "Terapia del Habla",
      "Terapia Ocupacional",
      "Programas Sensoriales",
      "Monitoreo del Crecimiento",
    ],
  },
];
```

- [ ] **Step 5: Update ProgramCard and SriLankaTimeline to be locale-aware**

Replace `components/ProgramCard.tsx` entirely:

```tsx
import { useLocale } from "next-intl";
import type { FoundationProgram } from "@/data/foundation";

type ProgramCardProps = {
  program: FoundationProgram;
};

export function ProgramCard({ program }: ProgramCardProps) {
  const locale = useLocale();
  const name = locale === "es" ? program.nameEs : program.name;
  const description = locale === "es" ? program.descriptionEs : program.description;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <p className="font-display text-base font-bold text-ink">{name}</p>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
    </div>
  );
}
```

Replace `components/SriLankaTimeline.tsx` entirely:

```tsx
import { useLocale } from "next-intl";
import type { SriLankaSchool } from "@/data/foundation";

type SriLankaTimelineProps = {
  schools: SriLankaSchool[];
};

export function SriLankaTimeline({ schools }: SriLankaTimelineProps) {
  const locale = useLocale();

  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
      <div className="relative pl-6">
        <div
          className="absolute bottom-1 left-1.75 top-1 w-0.5 bg-teal-tint"
          aria-hidden="true"
          data-testid="sri-lanka-timeline-line"
        />
        <ul className="flex flex-col gap-4">
          {schools.map((school) => {
            const studentCount = locale === "es" ? school.studentCountEs : school.studentCount;
            const programs = locale === "es" ? school.programsEs : school.programs;

            return (
              <li key={school.id} className="relative">
                <span
                  className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-teal-tint bg-teal"
                  aria-hidden="true"
                />
                <p className="font-display text-base font-bold text-ink">{school.name}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {school.location} · {studentCount}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {programs.map((program) => (
                    <span
                      key={program}
                      className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run both tests to verify they pass**

```bash
npm test -- components/ProgramCard.test.tsx components/SriLankaTimeline.test.tsx
```

Expected: PASS, 4 tests total.

- [ ] **Step 7: Write the failing test for FoundationPageContent**

Create `components/FoundationPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { FoundationPageContent } from "./FoundationPageContent";

describe("FoundationPageContent", () => {
  it("renders English mission and programs heading by default", () => {
    render(<FoundationPageContent />);
    expect(screen.getByText(/providing critical medical care/i)).toBeInTheDocument();
    expect(screen.getByText("Our programs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /donate now/i })).toBeInTheDocument();
  });

  it("renders Spanish mission, programs heading, and Sri Lanka section when locale is es", () => {
    render(<FoundationPageContent />, "es");
    expect(screen.getByText(/brindando atención médica esencial/i)).toBeInTheDocument();
    expect(screen.getByText("Nuestros programas")).toBeInTheDocument();
    expect(screen.getByText("Transformando el Bienestar Escolar en Sri Lanka")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /donar ahora/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

```bash
npm test -- components/FoundationPageContent.test.tsx
```

Expected: FAIL — `Cannot find module './FoundationPageContent'`.

- [ ] **Step 9: Create FoundationPageContent and update the page wrapper**

Create `components/FoundationPageContent.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { foundation, sriLankaProgram, sriLankaSchools } from "@/data/foundation";
import { ProgramCard } from "@/components/ProgramCard";
import { SriLankaTimeline } from "@/components/SriLankaTimeline";

export function FoundationPageContent() {
  const t = useTranslations("Foundation");
  const locale = useLocale();
  const mission = locale === "es" ? foundation.missionEs : foundation.mission;
  const sriLankaHeading = locale === "es" ? sriLankaProgram.headingEs : sriLankaProgram.heading;
  const sriLankaMission = locale === "es" ? sriLankaProgram.missionEs : sriLankaProgram.mission;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
          <Image
            src={foundation.logoSrc}
            alt={`${foundation.name} logo`}
            width={160}
            height={53}
            unoptimized
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-ink">{foundation.name}</h1>
            <p className="mt-1 max-w-md text-sm text-ink-soft">{mission}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <a
            href={foundation.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-5 py-2.5 text-center font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            {t("donateNow")}
          </a>
          <a
            href={foundation.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-white px-5 py-2.5 text-center font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
          >
            {t("visitFoundationSite")} →
          </a>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {t("programsHeading")}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {foundation.programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <span className="mt-14 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("sriLankaEyebrow")}
      </span>
      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {sriLankaHeading}
      </h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{sriLankaMission}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("preventiveScreeningsTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("preventiveScreeningsBody")}</p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("studentWellnessTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("studentWellnessBody")}</p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("internationalStandardsTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("internationalStandardsBody")}</p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("communityImpactTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("communityImpactBody")}</p>
        </div>
      </div>

      <div className="mt-6">
        <SriLankaTimeline schools={sriLankaSchools} />
      </div>

      <a
        href={foundation.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
      >
        {t("seeLiveCampaign")} →
      </a>
    </main>
  );
}
```

Replace `app/[locale]/foundation/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { FoundationPageContent } from "@/components/FoundationPageContent";

export const metadata: Metadata = {
  title: "Kids and Teens Foundation | Kids & Teens Medical Group",
  description:
    "The Kids and Teens Foundation provides free clinic days, medical missions, mentorship, scholarships, community outreach, and a school wellness initiative in Negombo, Sri Lanka, alongside Kids & Teens Medical Group.",
};

export default function FoundationPage() {
  return <FoundationPageContent />;
}
```

Modify `app/[locale]/foundation/page.test.tsx` — replace its contents entirely:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import FoundationPage from "./page";

describe("FoundationPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<FoundationPage />);
  });
});
```

- [ ] **Step 10: Run both tests to verify they pass**

```bash
npm test -- components/FoundationPageContent.test.tsx "app/[locale]/foundation/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 11: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 3.

---

### Task 3: Careers page

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Create: `components/CareersPageContent.tsx`, `components/CareersPageContent.test.tsx`
- Modify: `app/[locale]/careers/page.tsx`, `app/[locale]/careers/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl), `CAREERS_APPLY_MAILTO` (`@/data/careers`)
- Produces: `CareersPageContent`, consumed by `app/[locale]/careers/page.tsx`.

- [ ] **Step 1: Add Careers translation keys**

Modify `messages/en.json` — add:

```json
"Careers": {
    "eyebrow": "Careers",
    "heading": "Build your career at Kids & Teens.",
    "description": "We're always glad to hear from clinicians and staff who want to join a pediatric network built around same-day care and long-term patient relationships. Email us your resume and we'll reach out if there's a fit.",
    "emailResume": "Email Us Your Resume",
    "postingsNotice": "Our official job postings are only shared on our social media pages, our own company websites, and Indeed. Be cautious of postings claiming to represent Kids & Teens Medical Group anywhere else."
  }
```

Modify `messages/es.json` — add:

```json
"Careers": {
    "eyebrow": "Empleo",
    "heading": "Construya su carrera en Kids & Teens.",
    "description": "Siempre nos alegra saber de médicos y personal que desean unirse a una red pediátrica enfocada en la atención el mismo día y relaciones duraderas con los pacientes. Envíenos su currículum por correo y nos pondremos en contacto si hay una buena opción.",
    "emailResume": "Envíenos su Currículum",
    "postingsNotice": "Nuestras vacantes oficiales solo se publican en nuestras redes sociales, nuestros propios sitios web y en Indeed. Tenga cuidado con publicaciones que afirmen representar a Kids & Teens Medical Group en cualquier otro lugar."
  }
```

- [ ] **Step 2: Write the failing test**

Create `components/CareersPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersPageContent } from "./CareersPageContent";

describe("CareersPageContent", () => {
  it("renders the English heading and resume link by default", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Build your career at Kids & Teens."
    );
    expect(screen.getByRole("link", { name: /email us your resume/i })).toBeInTheDocument();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<CareersPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Construya su carrera en Kids & Teens."
    );
    expect(screen.getByRole("link", { name: /envíenos su currículum/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/CareersPageContent.test.tsx
```

Expected: FAIL — `Cannot find module './CareersPageContent'`.

- [ ] **Step 4: Create CareersPageContent and update the page wrapper**

Create `components/CareersPageContent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { CAREERS_APPLY_MAILTO } from "@/data/careers";

export function CareersPageContent() {
  const t = useTranslations("Careers");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">{t("description")}</p>

      <a
        href={CAREERS_APPLY_MAILTO}
        className="mt-6 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        {t("emailResume")}
      </a>

      <div className="mt-10 rounded-2xl border border-border bg-white p-5 text-sm text-ink-soft shadow-card">
        {t("postingsNotice")}
      </div>
    </main>
  );
}
```

Replace `app/[locale]/careers/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { CareersPageContent } from "@/components/CareersPageContent";

export const metadata: Metadata = {
  title: "Careers | Kids & Teens Medical Group",
  description:
    "Join Kids & Teens Medical Group's pediatric network. Email your resume, and check our social media, company sites, or Indeed for current openings.",
};

export default function CareersPage() {
  return <CareersPageContent />;
}
```

Modify `app/[locale]/careers/page.test.tsx` — replace its contents entirely:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import CareersPage from "./page";

describe("CareersPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<CareersPage />);
  });
});
```

- [ ] **Step 5: Run both tests to verify they pass**

```bash
npm test -- components/CareersPageContent.test.tsx "app/[locale]/careers/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 6: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 4.

---

### Task 4: Insurance page

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Create: `components/InsurancePageContent.tsx`, `components/InsurancePageContent.test.tsx`
- Modify: `app/[locale]/insurance/page.tsx`, `app/[locale]/insurance/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl), `insuranceInfo` (`@/data/insurance`), `MAIN_PHONE` (`@/lib/constants`)
- Produces: `InsurancePageContent`, consumed by `app/[locale]/insurance/page.tsx`.

- [ ] **Step 1: Add Insurance translation keys**

Modify `messages/en.json` — add:

```json
"Insurance": {
    "eyebrow": "Insurance",
    "heading": "We accept all major insurance.",
    "description": "Coverage shouldn't be a barrier to care. We accept the plan categories below across our clinics, plus Serendib Healthways for families in an HMO/IPA.",
    "hmoRestrictionsTitle": "Stuck with your HMO plan restrictions?",
    "hmoRestrictionsBody": "Switch to Serendib Healthways HMO/IPA for access to our network with no referrals required.",
    "serendibLink": "Serendib Healthways",
    "callToVerify": "Call to Verify Your Plan"
  }
```

Modify `messages/es.json` — add:

```json
"Insurance": {
    "eyebrow": "Seguro",
    "heading": "Aceptamos todos los principales seguros.",
    "description": "La cobertura no debería ser una barrera para la atención. Aceptamos las categorías de planes a continuación en todas nuestras clínicas, además de Serendib Healthways para familias en un HMO/IPA.",
    "hmoRestrictionsTitle": "¿Atrapado con las restricciones de su plan HMO?",
    "hmoRestrictionsBody": "Cámbiese a Serendib Healthways HMO/IPA para acceder a nuestra red sin necesidad de referencias.",
    "serendibLink": "Serendib Healthways",
    "callToVerify": "Llame para Verificar su Plan"
  }
```

- [ ] **Step 2: Write the failing test**

Create `components/InsurancePageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { InsurancePageContent } from "./InsurancePageContent";

describe("InsurancePageContent", () => {
  it("renders the English heading and accepted categories by default", () => {
    render(<InsurancePageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "We accept all major insurance."
    );
    expect(screen.getByText("HMO")).toBeInTheDocument();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<InsurancePageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Aceptamos todos los principales seguros."
    );
    expect(screen.getByRole("link", { name: /llame para verificar su plan/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/InsurancePageContent.test.tsx
```

Expected: FAIL — `Cannot find module './InsurancePageContent'`.

- [ ] **Step 4: Create InsurancePageContent and update the page wrapper**

Create `components/InsurancePageContent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { insuranceInfo } from "@/data/insurance";
import { MAIN_PHONE } from "@/lib/constants";

function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

export function InsurancePageContent() {
  const t = useTranslations("Insurance");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-card">
        <p className="font-display text-lg font-bold text-ink">{t("hmoRestrictionsTitle")}</p>
        <p className="mt-2 text-ink-soft">{t("hmoRestrictionsBody")}</p>
        <a
          href={insuranceInfo.serendibUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
        >
          {t("serendibLink")} →
        </a>
      </div>

      <a
        href={`tel:${toE164(MAIN_PHONE)}`}
        className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        {t("callToVerify")}
      </a>
    </main>
  );
}
```

Replace `app/[locale]/insurance/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { InsurancePageContent } from "@/components/InsurancePageContent";

export const metadata: Metadata = {
  title: "Insurance | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group accepts HMO, PPO, and Medi-Cal plans, plus Serendib Healthways HMO/IPA. Call to verify your plan is accepted.",
};

export default function InsurancePage() {
  return <InsurancePageContent />;
}
```

Modify `app/[locale]/insurance/page.test.tsx` — replace its contents entirely:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import InsurancePage from "./page";

describe("InsurancePage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<InsurancePage />);
  });
});
```

- [ ] **Step 5: Run both tests to verify they pass**

```bash
npm test -- components/InsurancePageContent.test.tsx "app/[locale]/insurance/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 6: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 5.

---

### Task 5: Resources data, ResourceCard, and /resources page

**Files:**
- Modify: `data/resources.ts`, `components/ResourceCard.tsx`, `messages/en.json`, `messages/es.json`
- Create: `components/ResourcesPageContent.tsx`, `components/ResourceCard.test.tsx` (update), `components/ResourcesPageContent.test.tsx`
- Modify: `app/[locale]/resources/page.tsx`, `app/[locale]/resources/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations`, `useLocale` (next-intl)
- Produces: `ResourcesPageContent`, consumed by `app/[locale]/resources/page.tsx`. `ResourceCard` (this task) is also used directly by the Home page's Resources section (Task 9) — its locale-aware rendering must work the same way there.

- [ ] **Step 1: Add Resources translation keys**

Modify `messages/en.json` — add:

```json
"Resources": {
    "eyebrow": "Parent Resources",
    "heading": "Everything in one place.",
    "description": "Vaccine schedules, patient forms, and developmental guides for your family. Downloads are being added here soon. Contact your clinic in the meantime for a copy.",
    "contactForCopy": "Contact us for a copy"
  }
```

Modify `messages/es.json` — add:

```json
"Resources": {
    "eyebrow": "Recursos para Padres",
    "heading": "Todo en un solo lugar.",
    "description": "Calendarios de vacunas, formularios para pacientes y guías de desarrollo para su familia. Pronto agregaremos descargas aquí. Mientras tanto, contacte a su clínica para obtener una copia.",
    "contactForCopy": "Contáctenos para obtener una copia"
  }
```

- [ ] **Step 2: Write the failing test for ResourceCard**

Replace `components/ResourceCard.test.tsx` entirely:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ResourceCard } from "./ResourceCard";

describe("ResourceCard", () => {
  it("renders English name and description by default", () => {
    render(
      <ResourceCard
        resource={{
          id: "our-doctors",
          name: "Our Doctors",
          nameEs: "Nuestros Doctores",
          description: "Meet our board-certified pediatricians and find the right fit for your family.",
          descriptionEs: "Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.",
          available: true,
          href: "/doctors",
        }}
      />
    );
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
    expect(
      screen.getByText("Meet our board-certified pediatricians and find the right fit for your family.")
    ).toBeInTheDocument();
  });

  it("renders Spanish name and description when locale is es", () => {
    render(
      <ResourceCard
        resource={{
          id: "our-doctors",
          name: "Our Doctors",
          nameEs: "Nuestros Doctores",
          description: "Meet our board-certified pediatricians and find the right fit for your family.",
          descriptionEs: "Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.",
          available: true,
          href: "/doctors",
        }}
      />,
      "es"
    );
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
    expect(
      screen.getByText("Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.")
    ).toBeInTheDocument();
  });

  it("shows a translated 'contact us for a copy' state when not available", () => {
    render(
      <ResourceCard
        resource={{
          id: "developmental-milestones",
          name: "Developmental Milestone Guides",
          nameEs: "Guías de Hitos del Desarrollo",
          description: "What to expect at each stage of your child's development.",
          descriptionEs: "Qué esperar en cada etapa del desarrollo de su hijo.",
          available: false,
        }}
      />,
      "es"
    );
    expect(screen.getByText("Contáctenos para obtener una copia")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/ResourceCard.test.tsx
```

Expected: FAIL — `ResourceCard` doesn't read `*Es` fields or the `Resources` translation namespace yet.

- [ ] **Step 4: Add `*Es` fields to resources data**

Replace `data/resources.ts` entirely:

```ts
export type ParentResource = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  available: boolean;
  href?: string;
  external?: boolean;
};

export const parentResources: ParentResource[] = [
  {
    id: "our-doctors",
    name: "Our Doctors",
    nameEs: "Nuestros Doctores",
    description: "Meet our board-certified pediatricians and find the right fit for your family.",
    descriptionEs:
      "Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.",
    available: true,
    href: "/doctors",
  },
  {
    id: "vaccine-schedule",
    name: "Vaccine Schedule",
    nameEs: "Calendario de Vacunación",
    description: "The recommended immunization schedule for ages 0 to 21.",
    descriptionEs: "El calendario de vacunación recomendado para edades de 0 a 21 años.",
    available: true,
    href: "/vaccine-schedule.jpg",
    external: true,
  },
  {
    id: "patient-forms",
    name: "Patient Forms",
    nameEs: "Formularios para Pacientes",
    description: "New patient intake forms and sports physical paperwork.",
    descriptionEs:
      "Formularios de admisión para nuevos pacientes y documentación de exámenes físicos deportivos.",
    available: true,
    href: "https://healow.com/apps/jsp/webview/signIn.jsp",
    external: true,
  },
  {
    id: "developmental-milestones",
    name: "Developmental Milestone Guides",
    nameEs: "Guías de Hitos del Desarrollo",
    description: "What to expect at each stage of your child's development.",
    descriptionEs: "Qué esperar en cada etapa del desarrollo de su hijo.",
    available: false,
  },
  {
    id: "must-watch-videos",
    name: "Must Watch Videos",
    nameEs: "Videos Imperdibles",
    description: "Pediatric health tips and guidance from our team, straight from our YouTube channel.",
    descriptionEs:
      "Consejos y orientación de salud pediátrica de nuestro equipo, directamente de nuestro canal de YouTube.",
    available: true,
    href: "https://www.youtube.com/channel/UC5pMXGZ_F2OZUFdfy6YbIew",
    external: true,
  },
];
```

- [ ] **Step 5: Update ResourceCard to be locale-aware**

Replace `components/ResourceCard.tsx` entirely:

```tsx
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ParentResource } from "@/data/resources";

type ResourceCardProps = {
  resource: ParentResource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const t = useTranslations("Resources");
  const locale = useLocale();
  const name = locale === "es" ? resource.nameEs : resource.name;
  const description = locale === "es" ? resource.descriptionEs : resource.description;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <p className="font-display text-base font-bold text-ink">{name}</p>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
      {resource.available && resource.href ? (
        resource.external ? (
          <a
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {name} →
          </a>
        ) : (
          <Link
            href={resource.href}
            className="mt-3 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {name} →
          </Link>
        )
      ) : (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold">
          {t("contactForCopy")}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Run the ResourceCard test to verify it passes**

```bash
npm test -- components/ResourceCard.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 7: Write the failing test for ResourcesPageContent**

Create `components/ResourcesPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ResourcesPageContent } from "./ResourcesPageContent";

describe("ResourcesPageContent", () => {
  it("renders the English heading and all 5 real resources by default", () => {
    render(<ResourcesPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Everything in one place."
    );
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
  });

  it("renders the Spanish heading and resource names when locale is es", () => {
    render(<ResourcesPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Todo en un solo lugar.");
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

```bash
npm test -- components/ResourcesPageContent.test.tsx
```

Expected: FAIL — `Cannot find module './ResourcesPageContent'`.

- [ ] **Step 9: Create ResourcesPageContent and update the page wrapper**

Create `components/ResourcesPageContent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { parentResources } from "@/data/resources";
import { ResourceCard } from "@/components/ResourceCard";

export function ResourcesPageContent() {
  const t = useTranslations("Resources");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {parentResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </main>
  );
}
```

Replace `app/[locale]/resources/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { ResourcesPageContent } from "@/components/ResourcesPageContent";

export const metadata: Metadata = {
  title: "Parent Resources | Kids & Teens Medical Group",
  description:
    "Vaccine schedules, patient forms, and developmental milestone guides for Kids & Teens Medical Group families.",
};

export default function ResourcesPage() {
  return <ResourcesPageContent />;
}
```

Modify `app/[locale]/resources/page.test.tsx` — replace its contents entirely:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import ResourcesPage from "./page";

describe("ResourcesPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<ResourcesPage />);
  });
});
```

- [ ] **Step 10: Run both tests to verify they pass**

```bash
npm test -- components/ResourcesPageContent.test.tsx "app/[locale]/resources/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 11: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 6.

---

### Task 6: About page

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Create: `components/AboutPageContent.tsx`, `components/AboutPageContent.test.tsx`
- Modify: `app/[locale]/about/page.tsx`, `app/[locale]/about/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations`, `useLocale` (next-intl), `locations` (`@/data/locations`), `insuranceInfo` (`@/data/insurance`), `BOOKING_URL` (`@/lib/constants`)
- Produces: `AboutPageContent`, consumed by `app/[locale]/about/page.tsx`.

- [ ] **Step 1: Add About translation keys**

Modify `messages/en.json` — add:

```json
"About": {
    "eyebrow": "About Us",
    "heading": "Kids & Teens Pediatric Medical Group",
    "tagline": "Caring for the Future Generations in Greater Los Angeles",
    "intro": "Kids & Teens Medical Group is a pediatric practice dedicated to providing compassionate, comprehensive care for children and adolescents. Our team of board-certified pediatricians is committed to offering personalized care tailored to your child's unique needs. We offer a wide range of services, including:",
    "careaRoutineCheckups": "Routine check-ups",
    "careAreaAllergies": "Allergies",
    "careAreaAdhd": "ADHD",
    "careAreaUrgentCare": "Urgent care",
    "careAreaPrenatal": "Prenatal consultations",
    "careAreaAfterHours": "After-hours care",
    "locationsIntro": "With {count} locations throughout Los Angeles and beyond, we're here to serve your family's needs. We accept most major insurance plans, including any HMO/IPA:",
    "closing": "For those without insurance, we offer affordable payment options. Rest assured, your child's health is our top priority. Schedule an appointment today and let us help your family thrive.",
    "bookAppointment": "Book an Appointment",
    "findClinic": "Find a Clinic"
  }
```

Modify `messages/es.json` — add:

```json
"About": {
    "eyebrow": "Sobre Nosotros",
    "heading": "Kids & Teens Pediatric Medical Group",
    "tagline": "Cuidando a las futuras generaciones del área de Los Ángeles",
    "intro": "Kids & Teens Medical Group es una práctica pediátrica dedicada a brindar atención compasiva e integral a niños y adolescentes. Nuestro equipo de pediatras certificados se compromete a ofrecer atención personalizada adaptada a las necesidades únicas de su hijo. Ofrecemos una amplia gama de servicios, entre ellos:",
    "careaRoutineCheckups": "Chequeos de rutina",
    "careAreaAllergies": "Alergias",
    "careAreaAdhd": "TDAH",
    "careAreaUrgentCare": "Atención de urgencia",
    "careAreaPrenatal": "Consultas prenatales",
    "careAreaAfterHours": "Atención fuera de horario",
    "locationsIntro": "Con {count} ubicaciones en Los Ángeles y sus alrededores, estamos aquí para atender las necesidades de su familia. Aceptamos la mayoría de los principales planes de seguro, incluyendo cualquier HMO/IPA:",
    "closing": "Para quienes no tienen seguro, ofrecemos opciones de pago accesibles. Tenga la seguridad de que la salud de su hijo es nuestra máxima prioridad. Programe una cita hoy y permítanos ayudar a que su familia prospere.",
    "bookAppointment": "Reservar una Cita",
    "findClinic": "Buscar una Clínica"
  }
```

- [ ] **Step 2: Write the failing test**

Create `components/AboutPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { AboutPageContent } from "./AboutPageContent";

describe("AboutPageContent", () => {
  it("renders the English tagline and care areas by default", () => {
    render(<AboutPageContent />);
    expect(
      screen.getByText("Caring for the Future Generations in Greater Los Angeles")
    ).toBeInTheDocument();
    expect(screen.getByText("Routine check-ups")).toBeInTheDocument();
  });

  it("renders the Spanish tagline and care areas when locale is es", () => {
    render(<AboutPageContent />, "es");
    expect(
      screen.getByText("Cuidando a las futuras generaciones del área de Los Ángeles")
    ).toBeInTheDocument();
    expect(screen.getByText("Chequeos de rutina")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reservar una cita/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/AboutPageContent.test.tsx
```

Expected: FAIL — `Cannot find module './AboutPageContent'`.

- [ ] **Step 4: Create AboutPageContent and update the page wrapper**

Create `components/AboutPageContent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import { BOOKING_URL } from "@/lib/constants";

export function AboutPageContent() {
  const t = useTranslations("About");

  const careAreas = [
    t("careaRoutineCheckups"),
    t("careAreaAllergies"),
    t("careAreaAdhd"),
    t("careAreaUrgentCare"),
    t("careAreaPrenatal"),
    t("careAreaAfterHours"),
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl font-display text-lg font-semibold text-teal-dark">
        {t("tagline")}
      </p>

      <p className="mt-5 max-w-2xl text-ink-soft">{t("intro")}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {careAreas.map((area) => (
          <span
            key={area}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {area}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">
        {t("locationsIntro", { count: locations.length })}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-gold-tint px-4 py-2 font-display text-sm font-semibold text-gold"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">{t("closing")}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {t("bookAppointment")}
        </a>
        <Link
          href="/locations"
          className="rounded-full border border-border bg-white px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
        >
          {t("findClinic")}
        </Link>
      </div>
    </main>
  );
}
```

Replace `app/[locale]/about/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { AboutPageContent } from "@/components/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | Kids & Teens Medical Group",
  description:
    "Kids & Teens Pediatric Medical Group provides compassionate, comprehensive pediatric care across Greater Los Angeles, from routine check-ups to urgent care and after-hours visits.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
```

Modify `app/[locale]/about/page.test.tsx` — replace its contents entirely:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<AboutPage />);
  });
});
```

- [ ] **Step 5: Run both tests to verify they pass**

```bash
npm test -- components/AboutPageContent.test.tsx "app/[locale]/about/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 6: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 7.

---

### Task 7: Testimonials page

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Create: `components/TestimonialsPageContent.tsx`, `components/TestimonialsPageContent.test.tsx`
- Modify: `app/[locale]/testimonials/page.tsx`, `app/[locale]/testimonials/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl), `locations` (`@/data/locations`)
- Produces: `TestimonialsPageContent`, consumed by `app/[locale]/testimonials/page.tsx`.

- [ ] **Step 1: Add Testimonials translation keys**

Modify `messages/en.json` — add:

```json
"Testimonials": {
    "eyebrow": "Testimonials & Reviews",
    "heading": "Share Your Experience",
    "intro1": "Kids & Teens Medical Group is a general pediatrics practice that takes an integrated approach to care, with offices across Greater LA offering high-quality pediatric care and pediatric urgent care services.",
    "intro2": "We always appreciate feedback from our valued patients, and we're thrilled that so many parents have shared their positive experiences with us.",
    "googleReviewsHeading": "Google Reviews",
    "googleReviewsSubheading": "Select a clinic to read or leave a review on Google.",
    "closing": "Please read what others are saying about Kids & Teens Medical Group above, and as always, we would love to collect your feedback too."
  }
```

Modify `messages/es.json` — add:

```json
"Testimonials": {
    "eyebrow": "Testimonios y Reseñas",
    "heading": "Comparta su Experiencia",
    "intro1": "Kids & Teens Medical Group es una práctica de pediatría general que adopta un enfoque integrado de la atención, con consultorios en toda el área de Los Ángeles que ofrecen atención pediátrica de alta calidad y servicios de urgencia pediátrica.",
    "intro2": "Siempre apreciamos los comentarios de nuestros valiosos pacientes, y nos alegra que tantos padres hayan compartido sus experiencias positivas con nosotros.",
    "googleReviewsHeading": "Reseñas de Google",
    "googleReviewsSubheading": "Seleccione una clínica para leer o dejar una reseña en Google.",
    "closing": "Lea lo que otros dicen sobre Kids & Teens Medical Group arriba, y como siempre, nos encantaría recibir también sus comentarios."
  }
```

- [ ] **Step 2: Write the failing test**

Create `components/TestimonialsPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { TestimonialsPageContent } from "./TestimonialsPageContent";

describe("TestimonialsPageContent", () => {
  it("renders the English heading and location review links by default", () => {
    render(<TestimonialsPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Share Your Experience");
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<TestimonialsPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Comparta su Experiencia"
    );
    expect(screen.getByText("Reseñas de Google")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- components/TestimonialsPageContent.test.tsx
```

Expected: FAIL — `Cannot find module './TestimonialsPageContent'`.

- [ ] **Step 4: Create TestimonialsPageContent and update the page wrapper**

Create `components/TestimonialsPageContent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { locations } from "@/data/locations";
import type { Location } from "@/lib/types";

function googleReviewsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Kids & Teens Medical Group ${location.name} ${location.address}`
  )}`;
}

export function TestimonialsPageContent() {
  const t = useTranslations("Testimonials");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{t("intro1")}</p>
      <p className="mt-3 max-w-2xl text-ink-soft">{t("intro2")}</p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        {t("googleReviewsHeading")}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t("googleReviewsSubheading")}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {locations.map((location) => (
          <a
            key={location.id}
            href={googleReviewsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-center font-display text-sm font-semibold text-teal-dark shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            {location.name}
          </a>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-ink-soft">{t("closing")}</p>
    </main>
  );
}
```

Replace `app/[locale]/testimonials/page.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { TestimonialsPageContent } from "@/components/TestimonialsPageContent";

export const metadata: Metadata = {
  title: "Testimonials | Kids & Teens Medical Group",
  description:
    "Read what families are saying about Kids & Teens Medical Group, and share your own experience with our pediatric clinics across Greater LA.",
};

export default function TestimonialsPage() {
  return <TestimonialsPageContent />;
}
```

Modify `app/[locale]/testimonials/page.test.tsx` — replace its contents entirely:

```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import TestimonialsPage from "./page";

describe("TestimonialsPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<TestimonialsPage />);
  });
});
```

- [ ] **Step 5: Run both tests to verify they pass**

```bash
npm test -- components/TestimonialsPageContent.test.tsx "app/[locale]/testimonials/page.test.tsx"
```

Expected: PASS, 3 tests total.

- [ ] **Step 6: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 8.

---

### Task 8: FAQ data translation

**Files:**
- Modify: `data/faq.ts`, `components/FaqAccordion.tsx`
- Modify: `components/FaqAccordion.test.tsx`, `data/faq.test.ts`

**Interfaces:**
- Consumes: `useLocale` (next-intl)
- Produces: locale-aware `FaqAccordion`, consumed by the Home page's FAQ section (unchanged rendering call, already `<FaqAccordion items={faqs} />` — no change needed there since the component now reads locale itself).

- [ ] **Step 1: Write the failing test**

Modify `components/FaqAccordion.test.tsx` — read the existing file first, then add a new test alongside the existing ones (do not remove existing tests):

```tsx
  it("renders the Spanish question and answer when locale is es", () => {
    renderWithIntl(
      <FaqAccordion
        items={[
          {
            id: "first-visit",
            question: "What should I bring to my child's first visit?",
            questionEs: "¿Qué debo llevar a la primera visita de mi hijo?",
            answer: "Please bring your child's insurance card.",
            answerEs: "Por favor traiga la tarjeta de seguro de su hijo.",
          },
        ]}
      />,
      "es"
    );
    expect(screen.getByText("¿Qué debo llevar a la primera visita de mi hijo?")).toBeInTheDocument();
  });
```

If `components/FaqAccordion.test.tsx` currently uses plain `render` from `@testing-library/react` instead of `renderWithIntl`, add the import `import { renderWithIntl } from "@/lib/test-utils";` and switch every call in the file to `renderWithIntl` (the component will call `useLocale()` after this task's change, which requires intl context).

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/FaqAccordion.test.tsx
```

Expected: FAIL — `FaqItem` has no `questionEs`/`answerEs` fields yet, and the component doesn't read locale.

- [ ] **Step 3: Add `*Es` fields to FAQ data**

Replace `data/faq.ts` entirely:

```ts
export type FaqItem = {
  id: string;
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
};

export const faqs: FaqItem[] = [
  {
    id: "first-visit",
    question: "What should I bring to my child's first visit?",
    questionEs: "¿Qué debo llevar a la primera visita de mi hijo?",
    answer:
      "Please bring your child's insurance card, a valid photo ID, any previous medical records or immunization history, and a list of current medications. For newborns, bring the hospital discharge paperwork. Arriving 15 minutes early helps us get your paperwork completed smoothly.",
    answerEs:
      "Por favor traiga la tarjeta de seguro de su hijo, una identificación con foto válida, cualquier historial médico o de vacunación previo, y una lista de medicamentos actuales. Para recién nacidos, traiga los documentos de alta del hospital. Llegar 15 minutos antes nos ayuda a completar su papeleo sin contratiempos.",
  },
  {
    id: "walk-ins",
    question: "Do you accept walk-in patients?",
    questionEs: "¿Aceptan pacientes sin cita previa?",
    answer:
      "Yes! We welcome walk-in patients at all of our 24 clinic locations during regular business hours (Mon-Fri, 9AM-6PM). Same-day appointments are also available - you can book online in under a minute or call us directly. Wait times for walk-ins are typically under 30 minutes.",
    answerEs:
      "¡Sí! Recibimos pacientes sin cita previa en las 24 clínicas durante el horario regular (lunes a viernes, 9 a.m. a 6 p.m.). También hay citas disponibles el mismo día: puede reservar en línea en menos de un minuto o llamarnos directamente. El tiempo de espera para pacientes sin cita suele ser menor a 30 minutos.",
  },
  {
    id: "insurance-plans",
    question: "What insurance plans do you accept?",
    questionEs: "¿Qué planes de seguro aceptan?",
    answer:
      "We accept all major insurance plans including HMO, PPO, Medi-Cal, LA Care, Molina Healthcare, Blue Shield, Healthnet, Anthem, Optum, and Regal Medical Group. Coverage is never a barrier to care at our clinics. If you're unsure about your plan, call us and we'll verify your coverage.",
    answerEs:
      "Aceptamos todos los principales planes de seguro, incluyendo HMO, PPO, Medi-Cal, LA Care, Molina Healthcare, Blue Shield, Healthnet, Anthem, Optum y Regal Medical Group. La cobertura nunca es una barrera para la atención en nuestras clínicas. Si no está seguro de su plan, llámenos y verificaremos su cobertura.",
  },
  {
    id: "ages-treated",
    question: "What ages do you treat?",
    questionEs: "¿Qué edades atienden?",
    answer:
      "Kids & Teens Medical Group provides care for patients from birth through age 21. This includes newborns, infants, toddlers, school-age children, adolescents, and young adults. Our St. Gianna Medical Group locations also offer family practice for patients of all ages.",
    answerEs:
      "Kids & Teens Medical Group brinda atención a pacientes desde el nacimiento hasta los 21 años. Esto incluye recién nacidos, bebés, niños pequeños, niños en edad escolar, adolescentes y adultos jóvenes. Nuestras ubicaciones de St. Gianna Medical Group también ofrecen medicina familiar para pacientes de todas las edades.",
  },
  {
    id: "telehealth",
    question: "How does telehealth work?",
    questionEs: "¿Cómo funciona la telesalud?",
    answer:
      "Our telehealth service connects you with your trusted KTMG pediatrician via secure video call. Available Mon-Sat 9AM-9PM and Sundays 12PM-6PM. Simply book online, and you'll receive a link to join your video visit. Your doctor can diagnose, prescribe medications, and send prescriptions directly to your pharmacy - all from the comfort of home.",
    answerEs:
      "Nuestro servicio de telesalud lo conecta con su pediatra de confianza de KTMG mediante videollamada segura. Disponible de lunes a sábado de 9 a.m. a 9 p.m. y domingos de 12 p.m. a 6 p.m. Simplemente reserve en línea y recibirá un enlace para unirse a su visita por video. Su médico puede diagnosticar, recetar medicamentos y enviar las recetas directamente a su farmacia, todo desde la comodidad de su hogar.",
  },
  {
    id: "switch-doctor",
    question: "Can I switch my child's doctor within the network?",
    questionEs: "¿Puedo cambiar el médico de mi hijo dentro de la red?",
    answer:
      "Absolutely. With 89+ providers across 24 locations, you can switch pediatricians at any time. Your child's medical records are centralized and accessible from any KTMG clinic, so there's no paperwork or delays when transitioning to a new provider.",
    answerEs:
      "Por supuesto. Con más de 89 proveedores en 24 ubicaciones, puede cambiar de pediatra en cualquier momento. Los registros médicos de su hijo están centralizados y accesibles desde cualquier clínica de KTMG, por lo que no hay papeleo ni demoras al cambiar de proveedor.",
  },
  {
    id: "after-hours",
    question: "Do you offer after-hours and weekend care?",
    questionEs: "¿Ofrecen atención fuera de horario y los fines de semana?",
    answer:
      "Yes. Our Pediatric After Hours clinics provide evening and weekend urgent care staffed by board-certified pediatricians. Telehealth is also available 7 days a week, including evenings (until 9PM Mon-Sat) and Sundays (12PM-6PM). Your child can always be seen when they need care.",
    answerEs:
      "Sí. Nuestras clínicas Pediatric After Hours brindan atención de urgencia por las tardes y los fines de semana, atendidas por pediatras certificados. La telesalud también está disponible los 7 días de la semana, incluyendo tardes (hasta las 9 p.m. de lunes a sábado) y domingos (12 p.m. a 6 p.m.). Su hijo siempre puede ser atendido cuando lo necesite.",
  },
  {
    id: "transfer-hmo",
    question: "How do I transfer from another HMO/IPA?",
    questionEs: "¿Cómo transfiero desde otro HMO/IPA?",
    answer:
      "Through our Serendib Healthways HMO/IPA, transferring is hassle-free. Our transfer team handles all the paperwork for you. Simply call (626) 655-4041 or visit serendibhealthways.com to schedule a call with our transfer team. The switch can happen immediately in most cases.",
    answerEs:
      "A través de nuestro HMO/IPA Serendib Healthways, la transferencia es sencilla. Nuestro equipo de transferencias se encarga de todo el papeleo por usted. Simplemente llame al (626) 655-4041 o visite serendibhealthways.com para programar una llamada con nuestro equipo de transferencias. El cambio puede ocurrir de inmediato en la mayoría de los casos.",
  },
];
```

Modify `data/faq.test.ts` — read the existing file first, then add a test alongside the existing ones confirming every FAQ has both English and Spanish text and no em dash in either:

```ts
  it("every FAQ has a Spanish question and answer with no em dash", () => {
    for (const faq of faqs) {
      expect(faq.questionEs.length).toBeGreaterThan(0);
      expect(faq.answerEs.length).toBeGreaterThan(20);
      expect(faq.questionEs).not.toContain("—");
      expect(faq.answerEs).not.toContain("—");
    }
  });
```

- [ ] **Step 4: Update FaqAccordion to be locale-aware**

Replace `components/FaqAccordion.tsx` entirely:

```tsx
"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import type { FaqItem } from "@/data/faq";

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const locale = useLocale();

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = item.id === openId;
        const buttonId = `faq-button-${item.id}`;
        const panelId = `faq-panel-${item.id}`;
        const question = locale === "es" ? item.questionEs : item.question;
        const answer = locale === "es" ? item.answerEs : item.answer;

        return (
          <div key={item.id} className="rounded-2xl bg-white shadow-card">
            <h3 className="contents">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-display font-bold text-ink transition-colors hover:text-teal-dark sm:py-5"
              >
                <span>{question}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-4 w-4 shrink-0 text-teal-dark transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-sm text-ink-soft sm:text-base"
            >
              {answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Run both tests to verify they pass**

```bash
npm test -- components/FaqAccordion.test.tsx data/faq.test.ts
```

Expected: PASS, all tests in both files.

- [ ] **Step 6: Verify manually**

No standalone browser check needed yet — covered in Task 9. Continue to Task 9.

---

### Task 9: Remaining homepage sections (Services pill-cloud, Featured Stories, Resources) + Home page test updates

**Files:**
- Modify: `messages/en.json`, `messages/es.json`, `app/[locale]/page.tsx`, `app/[locale]/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl, already used throughout this file), `ResourceCard` (Task 5, already locale-aware)
- Produces: nothing new — integrates translations into the existing Home page.

- [ ] **Step 1: Add the remaining Home.* translation keys**

Modify `messages/en.json` — inside the existing `"Home"` object, add these keys as siblings of the existing ones (keep everything else in `Home` exactly as-is):

```json
    "servicesEyebrow": "{count} Specialties",
    "servicesHeading": "Comprehensive Pediatric Services",
    "viewAllServices": "View all services",
    "storiesEyebrow": "From Our Blog",
    "storiesHeading": "Featured Stories",
    "readFullStory": "Read the full story",
    "resourcesSectionHeading": "Everything your family needs, in one place.",
    "browseAllResourcesTitle": "Browse all resources",
    "browseAllResourcesBody": "See every guide, form, and video we have for your family in one place.",
    "viewAllResources": "View all resources"
```

Modify `messages/es.json` — the same keys, as siblings inside the existing `"Home"` object:

```json
    "servicesEyebrow": "{count} Especialidades",
    "servicesHeading": "Servicios Pediátricos Integrales",
    "viewAllServices": "Ver todos los servicios",
    "storiesEyebrow": "De Nuestro Blog",
    "storiesHeading": "Historias Destacadas",
    "readFullStory": "Leer la historia completa",
    "resourcesSectionHeading": "Todo lo que su familia necesita, en un solo lugar.",
    "browseAllResourcesTitle": "Ver todos los recursos",
    "browseAllResourcesBody": "Vea todas las guías, formularios y videos que tenemos para su familia en un solo lugar.",
    "viewAllResources": "Ver todos los recursos"
```

- [ ] **Step 2: Write the failing tests**

Modify `app/[locale]/page.test.tsx` — add these tests inside the existing `describe("Home page", ...)` block, alongside the existing ones:

```tsx
  it("renders the services pill-cloud eyebrow and heading in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByText("Servicios Pediátricos Integrales")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver todos los servicios/i })).toHaveAttribute(
      "href",
      "/es/services"
    );
  });

  it("renders the Featured Stories heading in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByText("Historias Destacadas")).toBeInTheDocument();
  });

  it("renders the Resources section heading in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(
      screen.getByText("Todo lo que su familia necesita, en un solo lugar.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver todos los recursos/i })).toHaveAttribute(
      "href",
      "/es/resources"
    );
  });
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
npm test -- "app/[locale]/page.test.tsx"
```

Expected: FAIL — the 3 new tests fail (the section chrome is still hardcoded English), the pre-existing tests still pass.

- [ ] **Step 4: Translate the three sections in the Home page**

Modify `app/[locale]/page.tsx`. In the Services pill-cloud section, replace the hardcoded eyebrow/heading/link:

```tsx
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("servicesEyebrow", { count: allServices.length })}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("servicesHeading")}
          </h2>
```

(replacing the previous `{allServices.length} Specialties` span and `Comprehensive Pediatric Services` heading), and further down in the same section:

```tsx
          <Link
            href="/services"
            className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("viewAllServices")} →
          </Link>
```

In the Featured Stories section, replace the hardcoded eyebrow/heading and the per-card "Read the full story" label:

```tsx
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("storiesEyebrow")}
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t("storiesHeading")}
        </h2>
```

and inside the `stories.map(...)` card:

```tsx
              <span className="mt-auto pt-4 font-display text-sm font-semibold text-teal-dark">
                {t("readFullStory")} →
              </span>
```

In the Resources section, replace the hardcoded heading and the "Browse all resources" tile's heading/body/link:

```tsx
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t("resourcesSectionHeading")}
        </h2>
```

and the tile:

```tsx
          <Link
            href="/resources"
            className="flex flex-col items-start justify-center rounded-2xl border border-border bg-teal-tint p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
          >
            <p className="font-display text-base font-bold text-teal-dark">
              {t("browseAllResourcesTitle")}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{t("browseAllResourcesBody")}</p>
            <span className="mt-3 font-display text-sm font-semibold text-teal-dark">
              {t("viewAllResources")} →
            </span>
          </Link>
```

Leave everything else in the file (service pill labels from `data/services.ts`, story titles/dates/excerpts from `data/stories.ts`, the `ResourceCard` list itself) exactly as it is — those stay English/data-driven per this plan's scope.

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- "app/[locale]/page.test.tsx"
```

Expected: PASS, every test in the file (pre-existing plus the 3 new ones).

- [ ] **Step 6: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes.

- [ ] **Step 7: Verify manually end-to-end for Tasks 1-9**

```bash
npm run dev
```

1. Visit `/network`, `/foundation`, `/careers`, `/insurance`, `/resources`, `/about`, `/testimonials` in English — confirm they render exactly as before (no visual regressions).
2. Visit `/es/network`, `/es/foundation`, `/es/careers`, `/es/insurance`, `/es/resources`, `/es/about`, `/es/testimonials` — confirm every page renders fully in Spanish (headings, body copy, button labels, and for Foundation specifically the Sri Lanka section and timeline).
3. Visit `/` and `/es` — confirm the FAQ section, Services pill-cloud eyebrow/heading, Featured Stories eyebrow/heading, and Resources section heading/tile are all in Spanish on `/es`, while the individual service pill names and blog story titles remain in English on both (expected, per this plan's scope).
4. Click the EN/ES switcher from a few of these pages (e.g. `/es/foundation`) — confirm it correctly toggles to `/foundation` and back, preserving the page.
5. Resize to mobile width (375px) and spot-check `/foundation` (longest page, has the timeline) and `/about` in both locales for layout issues.

Stop the server once confirmed.

---

### Task 10: Services and Blog index/detail page chrome

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Modify: `app/[locale]/services/page.tsx`, `app/[locale]/services/page.test.tsx`
- Modify: `app/[locale]/services/[slug]/page.tsx`, `app/[locale]/services/[slug]/page.test.tsx`
- Modify: `app/[locale]/blog/page.tsx`, `app/[locale]/blog/page.test.tsx`
- Modify: `app/[locale]/blog/[slug]/page.tsx`, `app/[locale]/blog/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl)
- Produces: nothing new — final task of this plan.

- [ ] **Step 1: Add Services and Blog chrome translation keys**

Modify `messages/en.json` — add two new top-level keys:

```json
"Services": {
    "eyebrow": "What We Offer",
    "heading": "Comprehensive Pediatric Care",
    "intro": "Kids & Teens Medical Group provides exceptional healthcare tailored to the needs of children and adolescents, from newborn checkups to teen medicine.",
    "backToServices": "Back to Services"
  },
  "Blog": {
    "eyebrow": "From Our Blog",
    "heading": "Parent Stories & Tips",
    "intro": "Seasonal health advice, safety tips, and guidance from our pediatric team to help your family stay informed.",
    "backToBlog": "Back to Blog"
  }
```

Modify `messages/es.json` — add:

```json
"Services": {
    "eyebrow": "Lo Que Ofrecemos",
    "heading": "Atención Pediátrica Integral",
    "intro": "Kids & Teens Medical Group brinda atención médica excepcional adaptada a las necesidades de niños y adolescentes, desde chequeos de recién nacidos hasta medicina para adolescentes.",
    "backToServices": "Volver a Servicios"
  },
  "Blog": {
    "eyebrow": "De Nuestro Blog",
    "heading": "Historias y Consejos para Padres",
    "intro": "Consejos de salud según la temporada, tips de seguridad y orientación de nuestro equipo pediátrico para mantener informada a su familia.",
    "backToBlog": "Volver al Blog"
  }
```

- [ ] **Step 2: Write the failing tests for /services and /services/[slug]**

Modify `app/[locale]/services/page.test.tsx` — add the import `import { renderWithIntl } from "@/lib/test-utils";`, replace every `render(<ServicesPage />)` with `renderWithIntl(<ServicesPage />)`, and add:

```tsx
  it("renders the eyebrow, heading, and intro in Spanish when locale is es", () => {
    renderWithIntl(<ServicesPage />, "es");
    expect(screen.getByText("Lo Que Ofrecemos")).toBeInTheDocument();
    expect(screen.getByText("Atención Pediátrica Integral")).toBeInTheDocument();
  });
```

Modify `app/[locale]/services/[slug]/page.test.tsx` — add the import `import { renderWithIntl } from "@/lib/test-utils";`, replace every `render(ui)` with `renderWithIntl(ui)`, and add:

```tsx
  it("renders the Spanish back link when locale is es", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    renderWithIntl(ui, "es");
    expect(screen.getByRole("link", { name: /volver a servicios/i })).toHaveAttribute(
      "href",
      "/es/services"
    );
  });
```

- [ ] **Step 3: Run both tests to verify they fail**

```bash
npm test -- "app/[locale]/services/page.test.tsx" "app/[locale]/services/[slug]/page.test.tsx"
```

Expected: FAIL — the new Spanish-specific tests fail, chrome is still hardcoded English.

- [ ] **Step 4: Translate /services and /services/[slug] chrome**

Modify `app/[locale]/services/page.tsx` — add `"use client";` at the top, add `import { useTranslations } from "next-intl";`, and inside the component body add `const t = useTranslations("Services");`, then replace the hardcoded strings:

```tsx
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("intro")}</p>
```

Note: this page currently exports `metadata` directly (a Server Component requirement) — since it must become `"use client"` to call `useTranslations`, move the `export const metadata` block out into a new thin wrapper the same way Task 1-7 did: rename the current file's default export to `ServicesPageContent` in a new `components/ServicesPageContent.tsx`, and make `app/[locale]/services/page.tsx` a Server Component that just re-exports `metadata` and renders `<ServicesPageContent />`, matching the established pattern exactly.

Modify `app/[locale]/services/[slug]/page.tsx` — this one keeps its Server Component shell (it needs `generateStaticParams`/`generateMetadata`/async `params`), but its returned JSX needs the back-link text translated, which requires a nested client boundary since the page itself can't call `useTranslations` as a Server Component. Extract just the back link into a tiny client component:

Create `components/BackLink.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type BackLinkProps = {
  href: string;
  messageKey: "backToServices" | "backToBlog";
  namespace: "Services" | "Blog";
};

export function BackLink({ href, messageKey, namespace }: BackLinkProps) {
  const t = useTranslations(namespace);
  return (
    <Link
      href={href}
      className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
    >
      ← {t(messageKey)}
    </Link>
  );
}
```

In `app/[locale]/services/[slug]/page.tsx`, replace the hardcoded back link:

```tsx
      <BackLink href="/services" messageKey="backToServices" namespace="Services" />
```

(remove the old `<Link href="/services">← Back to Services</Link>` and add `import { BackLink } from "@/components/BackLink";`).

- [ ] **Step 5: Run both tests to verify they pass**

```bash
npm test -- "app/[locale]/services/page.test.tsx" "app/[locale]/services/[slug]/page.test.tsx"
```

Expected: PASS, every test in both files.

- [ ] **Step 6: Write the failing tests for /blog and /blog/[slug]**

Modify `app/[locale]/blog/page.test.tsx` — its `render` is already `renderWithIntl as render` from the earlier Blog task, so just add:

```tsx
  it("renders the eyebrow and heading in Spanish when locale is es", () => {
    render(<BlogPage />, "es");
    expect(screen.getByText("De Nuestro Blog")).toBeInTheDocument();
    expect(screen.getByText("Historias y Consejos para Padres")).toBeInTheDocument();
  });
```

Modify `app/[locale]/blog/[slug]/page.test.tsx` — its `render` is already `renderWithIntl as render`, so add:

```tsx
  it("renders the Spanish back link when locale is es", async () => {
    const ui = await BlogPostPage({ params: Promise.resolve({ slug: "halloween-safety-tips" }) });
    render(ui, "es");
    expect(screen.getByRole("link", { name: /volver al blog/i })).toHaveAttribute("href", "/es/blog");
  });
```

- [ ] **Step 7: Run both tests to verify they fail**

```bash
npm test -- "app/[locale]/blog/page.test.tsx" "app/[locale]/blog/[slug]/page.test.tsx"
```

Expected: FAIL — the 2 new tests fail, chrome is still hardcoded English.

- [ ] **Step 8: Translate /blog and /blog/[slug] chrome**

Modify `app/[locale]/blog/page.tsx` — same restructuring as `/services`: extract the content into `components/BlogPageContent.tsx` (a `"use client"` component using `useTranslations("Blog")` for eyebrow/heading/intro), leaving `app/[locale]/blog/page.tsx` as a thin Server Component keeping `export const metadata` and rendering `<BlogPageContent />`.

Modify `app/[locale]/blog/[slug]/page.tsx` — replace its hardcoded back link the same way as the Services detail page:

```tsx
      <BackLink href="/blog" messageKey="backToBlog" namespace="Blog" />
```

(remove the old `<Link href="/blog">← Back to Blog</Link>` and add `import { BackLink } from "@/components/BackLink";`).

- [ ] **Step 9: Run both tests to verify they pass**

```bash
npm test -- "app/[locale]/blog/page.test.tsx" "app/[locale]/blog/[slug]/page.test.tsx"
```

Expected: PASS, every test in both files.

- [ ] **Step 10: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes.

- [ ] **Step 11: Verify manually end-to-end**

```bash
npm run dev
```

1. Visit `/services` and `/es/services` — confirm the eyebrow/heading/intro switch language, while category names and service names/descriptions stay English on both (expected).
2. Visit a service detail page in both locales (e.g. `/services/telehealth` and `/es/services/telehealth`) — confirm the "← Back to Services"/"← Volver a Servicios" link switches language while the service's own name/description/longDescription stay English on both (expected, Phase 2 scope).
3. Repeat for `/blog` and a `/blog/[slug]` page in both locales.
4. Resize to mobile width (375px) and spot-check one of each.

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** every page and homepage section listed in the spec's Scope section (Network, Foundation + Sri Lanka, Careers, Insurance, Resources, About, Testimonials, FAQ data, Services/Blog homepage chrome, Services/Blog index+detail chrome) has a task. The Phase 2 boundary (`data/services.ts`, `data/stories.ts` untouched) is called out explicitly in Global Constraints and reiterated in Tasks 9 and 10's manual verification steps, so it's verified as a fact, not just stated as intent.
- **Type/key consistency check:** every `*Es` field name introduced in Tasks 1, 2, 5, 8 (`taglineEs`, `descriptionEs`, `servicesEs`, `nameEs`, `studentCountEs`, `programsEs`, `headingEs`, `missionEs`, `questionEs`, `answerEs`) is used consistently between its data file and the component that reads it.
- **No git:** every task ends in a manual verification step, not a commit.
- **No em dash:** all new copy above was written without one, in both languages; Task 8 additionally encodes this as a data-level test assertion.
- **Consistent pattern reuse:** every static page task (1-7) follows the exact same `XPageContent` + thin `page.tsx` wrapper shape already established by `DoctorsPageContent`/`LocationsPageContent`, so there's no new architecture to review beyond what Plan A already validated.
