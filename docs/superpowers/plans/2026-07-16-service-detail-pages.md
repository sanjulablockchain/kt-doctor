# Service Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each of the 21 service cards on `/services` link through to its own detail page (`/services/[slug]`), showing a real, paraphrased description of that service plus a Book an Appointment CTA.

**Architecture:** Add a `longDescription` field to the existing `Service` type in `data/services.ts` (real content, paraphrased from `ktdoctor.com/services/*`, already researched and finalized in the spec addendum). Turn `ServiceCard` into a link (matching the existing `NetworkCard` pattern). Add a new dynamic route `app/[locale]/services/[slug]/page.tsx` using `generateStaticParams()`.

**Tech Stack:** Next.js (App Router) under `app/[locale]/`, TypeScript, Tailwind CSS, Vitest + React Testing Library — same as the rest of the app.

## Global Constraints

- No git repository is in use — do not run `git init` or commit. Every task ends with a manual verification step instead of a commit step.
- No database, no CMS — hardcoded TypeScript data.
- The 21 `longDescription` values are already finalized (real, paraphrased content from `ktdoctor.com/services/*`) in `docs/superpowers/specs/2026-07-15-services-showcase-design.md` under "Addendum (2026-07-16): Service detail pages" — copy them verbatim into the data file, do not rewrite or re-paraphrase them.
- Do NOT reproduce exact clinical protocols, named medical tests, dosing specifics, or external medical resource links from the real pages — this was a deliberate scope decision in the spec addendum.
- This detail-page content stays plain English (no `useTranslations`) — same as the rest of the Services feature, per the existing spec's translation deferral.
- Mobile responsive throughout, matching the existing design system in `app/globals.css` (colors: `bg-ivory`, `text-ink`, `text-ink-soft`, `bg-teal`, `text-teal-dark`, `border-border`, `bg-white`, `shadow-card`; fonts: `font-display`, default body).
- Do not use the em dash ("—") in any user-facing copy.
- Routes live under `app/[locale]/` — do not create a top-level `app/services/` directory.
- Page-level route components in this codebase use Next.js's async `params: Promise<{...}>` convention (see `app/[locale]/layout.tsx`) — the new detail page follows the same convention.

---

### Task 1: Add real long descriptions to the services data

**Files:**
- Modify: `data/services.ts`
- Modify: `data/services.test.ts`

**Interfaces:**
- Consumes: nothing new
- Produces: `Service.longDescription: string` field, consumed by Task 3.

- [ ] **Step 1: Write the failing test**

Modify `data/services.test.ts` — add this test inside the existing `describe("services data", ...)` block:

```ts
  it("every service has a non-empty longDescription with no em dash", () => {
    const allServices = serviceCategories.flatMap((c) => c.services);
    for (const service of allServices) {
      expect(service.longDescription.length).toBeGreaterThan(20);
      expect(service.longDescription).not.toContain("—");
    }
  });
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- data/services.test.ts
```

Expected: FAIL — `service.longDescription` is `undefined`, `.length` throws or the values don't exist yet.

- [ ] **Step 3: Add the `longDescription` field and real content**

Modify `data/services.ts`. First, update the `Service` type:

```ts
export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
};
```

Then add a `longDescription` field to every one of the 21 service objects, using these exact real values (copied from the spec addendum, do not alter):

- `well-child-exam`: `"Well child exams are routine visits from infancy through the teen years that track your child's growth, development, and overall health. Each visit covers physical growth, developmental milestones, vaccinations, nutrition, and behavioral health, with guidance tailored to your child's age. These regular checkups help our pediatricians catch potential concerns early, before they become bigger problems."`
- `physicals`: `"Following American Academy of Pediatrics guidelines, we recommend regular physical exams from infancy through age 21 to track immunizations, growth, and development. These visits give you a chance to discuss any health concerns while your pediatrician confirms your child is on a healthy path. Physicals can be scheduled online or by phone, whether for a routine checkup or a specific concern like a sports or school physical."`
- `free-vaccines`: `"Through the state's Child Health and Disability Prevention program, we provide free vaccinations for eligible children and teens. Our board-certified pediatricians administer all CDC-recommended vaccines to help protect your child and the community from preventable diseases. Ask your pediatrician about the recommended immunization schedule at your next visit."`
- `covid-19-vaccine`: `"We offer COVID-19 vaccinations, including initial doses and boosters, for patients across our clinics. Vaccines undergo rigorous testing and have proven highly effective at preventing severe illness and hospitalization. Getting vaccinated helps protect your family and contributes to community immunity for those most vulnerable."`
- `nutrition`: `"Proper nutrition is the foundation of a healthy childhood, and our pediatric team offers dietary assessments and personalized nutrition guidance at every stage. From feeding guidance for infants to healthy eating education for school-age children and teens, we tailor our approach to your child's developmental needs. We also support families working on weight management with practical, judgment-free guidance."`
- `newborn-care`: `"Our board-certified pediatricians provide comprehensive care for newborns, from monitoring growth and development to guiding feeding and nutrition. Visits include age-appropriate vaccinations, developmental milestone tracking, and guidance on sleep, diapering, and other early parenting questions. We also offer free meet-and-greet consultations so you can get to know your pediatrician before your baby arrives."`
- `expectant-parents`: `"We offer free meet-and-greet consultations for expectant parents, giving you the chance to meet and choose a pediatrician before your baby is born. Once your baby arrives, we coordinate care at partner hospitals and schedule a follow-up visit within 24 to 48 hours of discharge. Our team can also help guide you through insurance enrollment and what to expect at your baby's first pediatric visits."`
- `circumcisions`: `"We offer circumcision procedures for newborns and children performed by qualified physicians, with anesthesia used to minimize discomfort. Circumcision is a personal decision for every family, and our team is happy to discuss the potential benefits and considerations so you can make the choice that's right for your child. Clear post-procedure care instructions are provided to support healing."`
- `sick-visits`: `"When your child isn't feeling well, our same-day sick visits give you fast access to a pediatrician who can diagnose and treat acute illnesses and minor injuries. Appointments can be scheduled online or by phone, and telehealth options are available for added convenience. Beyond sick visits, our locations also offer vaccinations, sports injury care, and other pediatric services your family may need."`
- `same-day-appointments`: `"We know that when your child is sick or hurt, timely care matters, which is why we offer same-day appointments at our clinics across Greater LA. You can schedule by phone, online, or through after-hours telehealth, so care is available when you need it most. Same-day scheduling means less time worrying and more time getting your child the attention they need."`
- `walk-ins`: `"Walk-in visits are welcome at our clinics for common illnesses, minor injuries, infections, allergies, and other unexpected health concerns. Our pediatricians provide prompt, experienced care without requiring an appointment ahead of time. It's a convenient option for families who need pediatric care right away."`
- `telehealth`: `"Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home. Pediatricians can evaluate concerns, offer medical advice, and provide treatment recommendations with the same care and attention as an in-person visit. It's a flexible option for busy families or when getting to a clinic isn't easy."`
- `pediatric-infectious-disease`: `"Our pediatricians diagnose and treat a range of infectious diseases in children and teens, working closely with families to build a treatment plan suited to their child's needs. Care spans prevention, diagnosis, and treatment, paired with clear education so families understand their child's condition. Compassionate, collaborative care is at the center of how we approach every case."`
- `sports-injuries`: `"Active kids sometimes get hurt, and our board-certified pediatricians offer prompt evaluation and treatment for pediatric sports injuries. With urgent care available seven days a week, in person, online, or via after-hours telehealth, your young athlete can get back in the game safely. Multiple locations across Greater LA make it easy to find care close to home."`
- `adhd-behavioral-issues`: `"We provide comprehensive evaluation, diagnosis, and ongoing management of ADHD and related behavioral concerns in children and teens. Our pediatricians monitor patients regularly, adjusting care as needed, and refer more complex cases to behavioral therapy or psychiatric specialists. Both in-person and telehealth visits are available across our Southern California locations."`
- `autism-developmental-disorders`: `"Our pediatricians offer specialized evaluation and ongoing management for children with autism and other developmental or behavioral disorders. We coordinate with specialists and schools, reviewing educational documents to help guide families toward the right interventions and support services. Monitoring is tailored to each child's needs, from more frequent visits to periodic check-ins."`
- `childhood-obesity-weight-management`: `"Developed in partnership with Children's Hospital Los Angeles, our weight management program supports children and families addressing childhood obesity. The program includes monthly monitoring visits (in-person or via telehealth), periodic lab work based on individual risk factors, and weekly educational classes. It's a comprehensive, judgment-free approach to building healthier habits as a family."`
- `asthma-allergy-center`: `"Our Asthma & Allergy Center offers ongoing monitoring and personalized care for children living with asthma or allergies. Depending on your child's needs, we may recommend regular check-ins, medication review, a customized asthma action plan, and asthma education to help manage symptoms day to day. If your child is wheezing, coughing, or has chest tightness, our team can help identify triggers and build a treatment plan that works for your family."`
- `allergies`: `"Childhood allergies can show up in many ways, from persistent cold-like symptoms to skin reactions and digestive issues. Our board-certified pediatricians offer testing, allergen avoidance guidance, medication management, and immunotherapy options tailored to your child's needs. With multiple locations across Greater LA, expert allergy care is never far away."`
- `adolescent-medicine`: `"Adolescence brings its own physical, emotional, and social changes, and our adolescent medicine services are designed specifically for teens and young adults. Care includes physical exams, behavioral health support, preventive care and vaccinations, nutrition guidance, and reproductive health education. Our providers are trained to address the unique needs of this age group across multiple Greater LA locations."`
- `teenage-gynecology-menstrual-disorders`: `"We offer gynecological care designed specifically for teenagers, including education about puberty and menstruation, routine exams, and treatment for menstrual irregularities. Early, informed care can help young women make confident, educated choices about their health. Appointments are available online, by phone, or via telehealth, in a setting designed to be comfortable and confidential."`

Add each value as a `longDescription` property on its matching service object (matched by `id`) in `data/services.ts`. For example, the first one becomes:

```ts
      {
        id: "well-child-exam",
        name: "Well Child Exam",
        description: "Routine preventive wellness checkups tracking growth and development at every age.",
        longDescription:
          "Well child exams are routine visits from infancy through the teen years that track your child's growth, development, and overall health. Each visit covers physical growth, developmental milestones, vaccinations, nutrition, and behavioral health, with guidance tailored to your child's age. These regular checkups help our pediatricians catch potential concerns early, before they become bigger problems.",
      },
```

Apply the same pattern to all 21 services using the values listed above, matched by `id`.

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- data/services.test.ts
```

Expected: PASS, 5 tests (the 4 existing plus the new one).

- [ ] **Step 5: Verify manually**

No manual verification needed — this data isn't rendered until Task 3.

---

### Task 2: Turn ServiceCard into a link

**Files:**
- Modify: `components/ServiceCard.tsx`
- Modify: `components/ServiceCard.test.tsx`

**Interfaces:**
- Consumes: `Service` type (now including `longDescription`) from `data/services.ts` (Task 1)
- Produces: `<ServiceCard service={service} />` now renders as a link to `/services/{service.id}`, consumed by the existing `/services` page (`app/[locale]/services/page.tsx`, unchanged) and verified against the new detail route in Task 3.

- [ ] **Step 1: Write the failing test**

Modify `components/ServiceCard.test.tsx` — replace the existing test's `render` call target and add a link assertion. Replace the whole file with:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import { ServiceCard } from "./ServiceCard";

const sampleService = {
  id: "telehealth",
  name: "Telehealth",
  description: "Remote medical consultations from wherever your family is.",
  longDescription:
    "Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home.",
};

describe("ServiceCard", () => {
  it("renders the service name and description", () => {
    render(<ServiceCard service={sampleService} />);

    expect(screen.getByText("Telehealth")).toBeInTheDocument();
    expect(
      screen.getByText("Remote medical consultations from wherever your family is.")
    ).toBeInTheDocument();
  });

  it("links to the service's detail page", () => {
    renderWithIntl(<ServiceCard service={sampleService} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/services/telehealth");
  });
});
```

Note: `renderWithIntl` (from `@/lib/test-utils`, already used across the codebase) is needed because `ServiceCard` will use next-intl's `Link` from `@/i18n/navigation`, which requires an intl context even though `ServiceCard` itself renders no translated text.

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- components/ServiceCard.test.tsx
```

Expected: FAIL — no link exists yet (`ServiceCard` currently renders a plain `<div>`).

- [ ] **Step 3: Rewrite ServiceCard to link to its detail page**

Replace `components/ServiceCard.tsx` entirely, following the same internal-link pattern already used in `components/NetworkCard.tsx`:

```tsx
import { Link } from "@/i18n/navigation";
import type { Service } from "@/data/services";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="block rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <p className="font-display text-base font-bold text-ink">{service.name}</p>
      <p className="mt-2 text-sm text-ink-soft">{service.description}</p>
    </Link>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- components/ServiceCard.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Run the existing /services page test to confirm nothing broke**

```bash
npm test -- "app/[locale]/services/page.test.tsx"
```

Expected: PASS, 2 tests (unchanged from before — `ServicesPage` itself doesn't need `renderWithIntl` since the page test uses plain `render`; if this now fails because `ServiceCard`'s `Link` needs intl context even inside `ServicesPage`, modify `app/[locale]/services/page.test.tsx` to import and use `renderWithIntl` from `@/lib/test-utils` in place of the plain `render`, matching the fix already applied elsewhere in this codebase for the same reason (see `app/[locale]/network/page.test.tsx`).)

- [ ] **Step 6: Verify manually**

No standalone manual verification needed yet — wired into the page in Task 3.

---

### Task 3: Service detail page (`/services/[slug]`)

**Files:**
- Create: `app/[locale]/services/[slug]/page.tsx`
- Test: `app/[locale]/services/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `serviceCategories` (Task 1, now including `longDescription`), `Link` from `@/i18n/navigation`, `BOOKING_URL` from `@/lib/constants`
- Produces: the `/services/{id}` route for all 21 real services, linked to by `ServiceCard` (Task 2). Final task of this plan.

- [ ] **Step 1: Write the failing test**

Create `app/[locale]/services/[slug]/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceDetailPage, { generateStaticParams } from "./page";

describe("ServiceDetailPage", () => {
  it("generates static params for all 21 real services", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(21);
    expect(params).toContainEqual({ slug: "telehealth" });
    expect(params).toContainEqual({ slug: "well-child-exam" });
  });

  it("renders the service name, category, description, and long description", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Telehealth");
    expect(screen.getByText("Sick & Urgent Care")).toBeInTheDocument();
    expect(
      screen.getByText("Remote medical consultations from wherever your family is.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/board-certified pediatrician remotely/i)
    ).toBeInTheDocument();
  });

  it("renders a Book an Appointment link to the real booking URL", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    const bookingLink = screen.getByRole("link", { name: /book an appointment/i });
    expect(bookingLink).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });

  it("renders a back link to /services", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    expect(screen.getByRole("link", { name: /back to services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test -- "app/[locale]/services/[slug]/page.test.tsx"
```

Expected: FAIL — `Cannot find module './page'`.

- [ ] **Step 3: Write the service detail page**

Create `app/[locale]/services/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceCategories } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";

function findService(slug: string) {
  for (const category of serviceCategories) {
    const service = category.services.find((s) => s.id === slug);
    if (service) return { service, category };
  }
  return null;
}

export function generateStaticParams() {
  return serviceCategories.flatMap((category) =>
    category.services.map((service) => ({ slug: service.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) return {};

  return {
    title: `${found.service.name} | Kids & Teens Medical Group`,
    description: found.service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) {
    notFound();
  }
  const { service, category } = found;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/services"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← Back to Services
      </Link>

      <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {category.name}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {service.name}
      </h1>
      <p className="mt-2 text-lg font-semibold text-ink-soft">{service.description}</p>
      <p className="mt-6 text-ink-soft">{service.longDescription}</p>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Book an Appointment
      </a>
    </main>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- "app/[locale]/services/[slug]/page.test.tsx"
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes.

- [ ] **Step 6: Verify manually end-to-end**

```bash
npm run dev
```

1. Open `http://localhost:3000/services` — confirm every service card is clickable.
2. Click a few cards from different categories (e.g. Telehealth, Well Child Exam, Asthma & Allergy Center) — confirm each navigates to its own `/services/{slug}` page showing the category eyebrow, service name, short description, the new long description, and a working "Book an Appointment" link (opens the real Healow URL in a new tab).
3. Click "← Back to Services" — confirm it returns to `/services`.
4. Try a direct URL for a service in each of the 5 categories to confirm routing works for all of them, not just the first.
5. Resize to mobile width (375px) and confirm the detail page layout stacks cleanly with no horizontal overflow.

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** real `longDescription` content for all 21 services (Task 1), `ServiceCard` linking to detail pages (Task 2), the `/services/[slug]` detail route with metadata, back link, and booking CTA (Task 3) — all covered.
- **Content fidelity guardrail:** Task 1's values are copied directly from the spec's already-researched, already-paraphrased addendum — implementers are told explicitly not to re-paraphrase, avoiding drift from the reviewed content.
- **Type consistency check:** `Service.longDescription` (Task 1) is read by both `ServiceCard` (Task 2, indirectly via the existing `description` display) and `ServiceDetailPage` (Task 3, directly) using the same field name throughout.
- **No git:** every task ends in a manual verification step, not a commit.
- **No em dash:** covered by Task 1's data-level test; the rest of the plan's new copy was written without one.
