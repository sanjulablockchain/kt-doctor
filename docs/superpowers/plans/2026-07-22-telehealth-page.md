# Telehealth Page + Site-Wide Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the existing `/services/telehealth` page with an image, a benefits grid, a "How it works" explainer, and a "How to schedule" contact block, and surface Telehealth in the homepage teaser, header "More" dropdown, and footer.

**Architecture:** The site renders all service pages from one shared server-component template driven by `data/services.ts`. Enrichment is **data-driven**: new optional fields on the `Service` type are populated only for `telehealth`, and the template renders each block only when its data is present, so every other service page is unchanged. Header/Footer/Homepage are client components using `next-intl` `useTranslations`; the service detail page is a server component that localizes with inline `locale === "es" ? …` ternaries (no `useTranslations`).

**Tech Stack:** Next.js 16.2.10 (App Router, `[locale]` segment), React 19, next-intl ^4.13.2, Tailwind CSS v4, Vitest 4 + Testing Library + jsdom.

## Global Constraints

- **Read the bundled Next.js docs before writing `Image` / next-intl code** — per `AGENTS.md` this repo's Next.js diverges from stock. Docs live in `node_modules/next/dist/docs/`. Mirror the already-working `Image` usage in `app/[locale]/services/[slug]/page.tsx` and `app/[locale]/page.tsx`.
- **No em dashes (`—`) anywhere in copy.** `data/services.test.ts` fails the build if service copy contains one. Use commas or periods. Applies to all new EN and ES strings.
- **`messages/en.json` and `messages/es.json` must stay key-aligned.** Header, Footer, and Home tests render in both `en` and `es`; a key present in only one locale throws at render. Every new key goes in BOTH files.
- **Phone numbers come only from `lib/constants.ts`** (`MAIN_PHONE` `(818) 361-5437`, `TEXT_PHONE` `(626) 298-7121`, `TEXT_PHONE_ES` `(818) 423-5637`). Never hardcode digits.
- **Keep the telehealth `description` and `longDescription` (EN + ES) verbatim.** Existing service-detail tests assert exact/substring matches on them (`"Remote medical consultations from wherever your family is."`, `/board-certified pediatrician remotely/`, `"Consultas médicas remotas desde donde se encuentre su familia."`, `/pediatra certificado de forma remota/`). Add richness via the new structured blocks, not by rewriting these.
- **Link the service route, not a new route.** All links point to `/services/telehealth`. No `/telehealth` route is created.
- Test command: `npm test` (`vitest run`). Build command: `npm run build`. Both must pass at the end.

---

### Task 1: Download the Telehealth image asset

**Files:**
- Create: `public/services/telehealth.jpg`

**Interfaces:**
- Produces: a local image served at `/services/telehealth.jpg`, consumed by Task 2 (data `imageSrc`), Task 3 (service page), and Task 6 (homepage teaser).

- [ ] **Step 1: Download a suitable royalty-free telehealth image**

Use a licensed/royalty-free source (Unsplash). Download a portrait-ish photo of a parent/child on a video visit or a clinician on a video call. Candidate command (Git Bash):

```bash
curl -L -o public/services/telehealth.jpg \
  "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=80"
```

If that URL does not depict a plausible telehealth/medical scene, pick another Unsplash photo and download its `images.unsplash.com/photo-…?auto=format&fit=crop&w=1000&q=80` URL to the same path.

- [ ] **Step 2: Verify the file is a valid, non-trivial JPEG**

Run (Git Bash):

```bash
test -f public/services/telehealth.jpg && \
  echo "size=$(wc -c < public/services/telehealth.jpg)" && \
  head -c 3 public/services/telehealth.jpg | od -An -tx1
```

Expected: `size=` well above `10000`, and the magic bytes line reads ` ff d8 ff` (JPEG). If size is tiny or bytes are not `ff d8 ff`, the download failed — repeat Step 1 with a different URL.

- [ ] **Step 3: Commit**

```bash
git add public/services/telehealth.jpg
git commit -m "feat: add telehealth service image asset"
```

---

### Task 2: Data model + enriched telehealth content

**Files:**
- Modify: `data/services.ts` (add `Benefit` type + optional `Service` fields; enrich the `telehealth` entry)
- Test: `data/services.test.ts` (append assertions)
- Test: `app/[locale]/services/[slug]/page.test.tsx` (repoint the "no image" test; add telehealth image tests)

**Interfaces:**
- Produces:
  - `export type Benefit = { title: string; titleEs: string; description: string; descriptionEs: string }`
  - `Service` gains optional: `benefits?: Benefit[]`, `howItWorks?: string`, `howItWorksEs?: string`, `showSchedule?: boolean` (the type already has `imageSrc?`, `imageAlt?`, `imageAltEs?`).
  - The `telehealth` service object populates all of the above.
- Consumes: `/services/telehealth.jpg` from Task 1.

- [ ] **Step 1: Write the failing data tests**

Append to `data/services.test.ts` (inside the `describe("services data", …)` block):

```ts
  it("enriches the telehealth service with an image, benefits, how-it-works, and schedule", () => {
    const telehealth = serviceCategories
      .flatMap((c) => c.services)
      .find((s) => s.id === "telehealth");
    expect(telehealth).toBeDefined();
    expect(telehealth!.imageSrc).toBe("/services/telehealth.jpg");
    expect(telehealth!.benefits).toHaveLength(5);
    expect(telehealth!.showSchedule).toBe(true);
    expect((telehealth!.howItWorks ?? "").length).toBeGreaterThan(20);
    expect((telehealth!.howItWorksEs ?? "").length).toBeGreaterThan(20);
  });

  it("gives every telehealth benefit bilingual text with no em dash", () => {
    const telehealth = serviceCategories
      .flatMap((c) => c.services)
      .find((s) => s.id === "telehealth")!;
    for (const b of telehealth.benefits ?? []) {
      expect(b.title.length).toBeGreaterThan(0);
      expect(b.titleEs.length).toBeGreaterThan(0);
      expect(b.description.length).toBeGreaterThan(10);
      expect(b.descriptionEs.length).toBeGreaterThan(10);
      for (const s of [b.title, b.titleEs, b.description, b.descriptionEs]) {
        expect(s).not.toContain("—");
      }
    }
    expect(telehealth.howItWorks).not.toContain("—");
    expect(telehealth.howItWorksEs).not.toContain("—");
  });
```

- [ ] **Step 2: Run the data tests to verify they fail**

Run: `npm test -- data/services.test.ts`
Expected: FAIL — `imageSrc` is undefined / `benefits` is undefined.

- [ ] **Step 3: Extend the `Service` type and add `Benefit`**

In `data/services.ts`, add the `Benefit` type above `Service` and the four optional fields to `Service` (keep the existing `imageSrc?`/`imageAlt?`/`imageAltEs?`):

```ts
export type Benefit = {
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
};

export type Service = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  longDescription: string;
  longDescriptionEs: string;
  imageSrc?: string;
  imageAlt?: string;
  imageAltEs?: string;
  benefits?: Benefit[];
  howItWorks?: string;
  howItWorksEs?: string;
  showSchedule?: boolean;
};
```

- [ ] **Step 4: Enrich the `telehealth` service object**

In `data/services.ts`, find the `telehealth` entry (in the `sick-urgent` category). **Leave `id`, `name`, `nameEs`, `description`, `descriptionEs`, `longDescription`, `longDescriptionEs` exactly as they are.** Add these fields to the same object (after `longDescriptionEs`):

```ts
        imageSrc: "/services/telehealth.jpg",
        imageAlt: "A parent and child on a video telehealth visit with a pediatrician on a tablet",
        imageAltEs: "Un padre y su hijo en una visita de telesalud por video con un pediatra en una tableta",
        benefits: [
          {
            title: "Convenience",
            titleEs: "Comodidad",
            description: "Connect with your pediatrician from home, with no commute or waiting room.",
            descriptionEs: "Conéctese con su pediatra desde casa, sin traslados ni sala de espera.",
          },
          {
            title: "Quick Access",
            titleEs: "Acceso Rápido",
            description: "Reach a board-certified pediatrician quickly when your family needs care.",
            descriptionEs: "Comuníquese rápidamente con un pediatra certificado cuando su familia necesite atención.",
          },
          {
            title: "Flexible Scheduling",
            titleEs: "Horarios Flexibles",
            description: "Book visits that fit around school, work, and a busy family day.",
            descriptionEs: "Programe visitas que se ajusten a la escuela, el trabajo y el día ocupado de la familia.",
          },
          {
            title: "Continuity of Care",
            titleEs: "Continuidad en la Atención",
            description: "Stay with the same trusted team that already knows your child's history.",
            descriptionEs: "Continúe con el mismo equipo de confianza que ya conoce el historial de su hijo.",
          },
          {
            title: "Privacy and Comfort",
            titleEs: "Privacidad y Comodidad",
            description: "Talk with your pediatrician from a secure, familiar setting for your child.",
            descriptionEs: "Hable con su pediatra desde un entorno seguro y familiar para su hijo.",
          },
        ],
        howItWorks:
          "Once your visit is scheduled, you will receive instructions to join a secure, user-friendly virtual platform. During the consultation, your pediatrician will listen to your concerns, provide medical advice, offer treatment recommendations, and answer any questions you may have.",
        howItWorksEs:
          "Una vez programada su visita, recibirá instrucciones para unirse a una plataforma virtual segura y fácil de usar. Durante la consulta, su pediatra escuchará sus inquietudes, le dará consejos médicos, ofrecerá recomendaciones de tratamiento y responderá cualquier pregunta que tenga.",
        showSchedule: true,
```

- [ ] **Step 5: Run the data tests to verify they pass**

Run: `npm test -- data/services.test.ts`
Expected: PASS (all, including the existing em-dash and Spanish-parity tests).

- [ ] **Step 6: Fix the service-detail page tests that assumed telehealth has no image**

Adding `imageSrc` makes telehealth render through the existing image-layout branch, so the current `"renders no image for services without one"` test (which uses `telehealth`) will break. In `app/[locale]/services/[slug]/page.test.tsx`:

Replace the existing `"renders no image for services without one"` test body's slug with a service that has no image:

```ts
  it("renders no image for services without one", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "well-child-exam" }),
    });
    render(ui);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
```

Then add two new tests for the telehealth image:

```ts
  it("renders the telehealth image with English alt text", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);
    expect(screen.getByRole("img", { name: /video telehealth visit/i })).toBeInTheDocument();
  });

  it("renders the telehealth image with Spanish alt text when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("img", { name: /visita de telesalud por video/i })).toBeInTheDocument();
  });
```

- [ ] **Step 7: Run the full service-detail suite to verify it passes**

Run: `npm test -- app/\[locale\]/services/\[slug\]/page.test.tsx`
Expected: PASS. (The telehealth tests now exercise the image-layout branch; description/longDescription/back-link/booking/More-Services tests still pass because that copy is unchanged.)

- [ ] **Step 8: Commit**

```bash
git add data/services.ts data/services.test.ts "app/[locale]/services/[slug]/page.test.tsx"
git commit -m "feat: enrich telehealth service data with image, benefits, how-it-works, and schedule"
```

---

### Task 3: Render Benefits / How it works / How to schedule on the service page

**Files:**
- Modify: `app/[locale]/services/[slug]/page.tsx`
- Test: `app/[locale]/services/[slug]/page.test.tsx` (append)

**Interfaces:**
- Consumes: `service.benefits`, `service.howItWorks` / `service.howItWorksEs`, `service.showSchedule` from Task 2; `MAIN_PHONE`, `TEXT_PHONE`, `TEXT_PHONE_ES` from `lib/constants.ts`.
- Produces: three optional sections rendered in BOTH layout branches when their data is present.

- [ ] **Step 1: Write the failing tests**

Append to `app/[locale]/services/[slug]/page.test.tsx`:

```ts
  it("renders the telehealth benefits, how-it-works, and schedule sections", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);
    expect(screen.getByRole("heading", { name: "Benefits" })).toBeInTheDocument();
    expect(screen.getByText("Convenience")).toBeInTheDocument();
    expect(screen.getByText("Privacy and Comfort")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How It Works" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to Schedule" })).toBeInTheDocument();
  });

  it("renders the telehealth schedule contact links from constants", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);
    expect(screen.getByRole("link", { name: /818\) 361-5437/ })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
    expect(screen.getByRole("link", { name: /626\) 298-7121/ })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
    expect(screen.getByRole("link", { name: /818\) 423-5637/ })).toHaveAttribute(
      "href",
      "sms:+18184235637"
    );
  });

  it("renders no benefits or schedule sections for a plain service", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "well-child-exam" }) });
    render(ui);
    expect(screen.queryByRole("heading", { name: "Benefits" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "How to Schedule" })).not.toBeInTheDocument();
  });

  it("renders the telehealth sections in Spanish when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("heading", { name: "Beneficios" })).toBeInTheDocument();
    expect(screen.getByText("Comodidad")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cómo Agendar" })).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- app/\[locale\]/services/\[slug\]/page.test.tsx`
Expected: FAIL — headings "Benefits"/"How It Works"/"How to Schedule" not found.

- [ ] **Step 3: Add the phone constants import and a `toE164` helper**

In `app/[locale]/services/[slug]/page.tsx`, extend the constants import and add the helper (mirrors `components/Footer.tsx`). Change:

```ts
import { BOOKING_URL } from "@/lib/constants";
```

to:

```ts
import { BOOKING_URL, MAIN_PHONE, TEXT_PHONE, TEXT_PHONE_ES } from "@/lib/constants";
```

Add near the top of the file (after imports, before `findService`):

```ts
// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437" — matches components/Footer.tsx.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}
```

- [ ] **Step 4: Build the localized labels and the shared `detailSections` fragment**

Inside `ServiceDetailPage`, after the existing `const actions = (…)` block, add:

```tsx
  const benefits = service.benefits ?? [];
  const howItWorks = locale === "es" ? service.howItWorksEs : service.howItWorks;
  const benefitsHeading = locale === "es" ? "Beneficios" : "Benefits";
  const howItWorksHeading = locale === "es" ? "Cómo Funciona" : "How It Works";
  const scheduleHeading = locale === "es" ? "Cómo Agendar" : "How to Schedule";
  const callLabel = locale === "es" ? "Llamar" : "Call";
  const textEnLabel = locale === "es" ? "Texto (Inglés)" : "Text (English)";
  const textEsLabel = locale === "es" ? "Texto (Español)" : "Text (Spanish)";

  const scheduleRows = [
    { label: callLabel, value: MAIN_PHONE, href: `tel:${toE164(MAIN_PHONE)}` },
    { label: textEnLabel, value: TEXT_PHONE, href: `sms:${toE164(TEXT_PHONE)}` },
    { label: textEsLabel, value: TEXT_PHONE_ES, href: `sms:${toE164(TEXT_PHONE_ES)}` },
  ];

  const detailSections = (
    <>
      {benefits.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {benefitsHeading}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const title = locale === "es" ? benefit.titleEs : benefit.title;
              const description = locale === "es" ? benefit.descriptionEs : benefit.description;
              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-card"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {howItWorks && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {howItWorksHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-ink-soft">{howItWorks}</p>
        </section>
      )}

      {service.showSchedule && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {scheduleHeading}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {scheduleRows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-teal"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    {row.label}
                  </span>
                  <span className="font-display text-sm font-bold text-ink">{row.value}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
```

- [ ] **Step 5: Render `{detailSections}` in both layout branches**

In the **image branch** `return` (the `service.imageSrc` block), add `{detailSections}` immediately before the closing `</main>`, after the intro `grid` `</div>`:

```tsx
        </div>

        {detailSections}
      </main>
    );
  }
```

In the **no-image branch** `return`, add `{detailSections}` immediately before the closing `</main>`, after `{actions}`:

```tsx
      {actions}

      {detailSections}
    </main>
  );
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- app/\[locale\]/services/\[slug\]/page.test.tsx`
Expected: PASS (all old + new tests).

- [ ] **Step 7: Commit**

```bash
git add "app/[locale]/services/[slug]/page.tsx" "app/[locale]/services/[slug]/page.test.tsx"
git commit -m "feat: render telehealth benefits, how-it-works, and schedule sections"
```

---

### Task 4: Add Telehealth to the header "More" dropdown

**Files:**
- Modify: `components/Header.tsx`
- Modify: `messages/en.json`, `messages/es.json` (add `Header.telehealth`)
- Test: `components/Header.test.tsx` (append)

**Interfaces:**
- Consumes: `t("telehealth")` from the `Header` namespace.
- Produces: a dropdown link with accessible name "Telehealth" (en) / "Telesalud" (es) → `/services/telehealth`.

- [ ] **Step 1: Write the failing test**

Append to `components/Header.test.tsx` (inside `describe("Header", …)`):

```ts
  it("renders a Telehealth link in the More menu to /services/telehealth", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Telehealth" })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Header.test.tsx`
Expected: FAIL — no link named "Telehealth" (and `t("telehealth")` would be missing).

- [ ] **Step 3: Add the `Header.telehealth` message key in both locales**

In `messages/en.json`, inside the `"Header"` object, add:

```json
    "telehealth": "Telehealth",
```

In `messages/es.json`, inside the `"Header"` object, add:

```json
    "telehealth": "Telesalud",
```

- [ ] **Step 4: Add the link to the dropdown**

In `components/Header.tsx`, inside the "More" dropdown `<div>` (the one containing the `secondaryLinkClass` links), add as the **first** entry, before the `/about` link:

```tsx
              <Link href="/services/telehealth" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("telehealth")}
              </Link>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Header.test.tsx`
Expected: PASS (all Header tests, including the existing dropdown-toggle and es language-switcher tests).

- [ ] **Step 6: Commit**

```bash
git add components/Header.tsx components/Header.test.tsx messages/en.json messages/es.json
git commit -m "feat: add Telehealth link to header More menu"
```

---

### Task 5: Add Telehealth to the footer "For Patients" column

**Files:**
- Modify: `components/Footer.tsx`
- Modify: `messages/en.json`, `messages/es.json` (add `Footer.telehealth`)
- Test: `components/Footer.test.tsx` (append)

**Interfaces:**
- Consumes: `t("telehealth")` from the `Footer` namespace.
- Produces: a footer link named "Telehealth" (en) / "Telesalud" (es) → `/services/telehealth`.

- [ ] **Step 1: Write the failing test**

Append to `components/Footer.test.tsx` (inside `describe("Footer", …)`):

```ts
  it("renders a Telehealth link in the For Patients column", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Telehealth" })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Footer.test.tsx`
Expected: FAIL — no link named "Telehealth".

- [ ] **Step 3: Add the `Footer.telehealth` message key in both locales**

In `messages/en.json`, inside the `"Footer"` object, add:

```json
    "telehealth": "Telehealth",
```

In `messages/es.json`, inside the `"Footer"` object, add:

```json
    "telehealth": "Telesalud",
```

- [ ] **Step 4: Add the link to `patientLinks`**

In `components/Footer.tsx`, add to the `patientLinks` array, right after the `same-day-appointments` entry:

```ts
    { href: "/services/telehealth", label: t("telehealth") },
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Footer.tsx components/Footer.test.tsx messages/en.json messages/es.json
git commit -m "feat: add Telehealth link to footer For Patients column"
```

---

### Task 6: Add the homepage Telehealth teaser

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `messages/en.json`, `messages/es.json` (add `Home.telehealth*` keys)
- Test: `app/[locale]/page.test.tsx` (append)

**Interfaces:**
- Consumes: `t(...)` from the `Home` namespace; `serviceCategories` (already imported) for benefit chips; the `Image`, `Link`, `Reveal` already imported in the file.
- Produces: a teaser `<section>` with an image, 3 benefit chips, and a CTA link (accessible name "Learn about Telehealth" / "Conozca la Telesalud") → `/services/telehealth`.

- [ ] **Step 1: Write the failing tests**

Append to `app/[locale]/page.test.tsx` (inside `describe("Home page", …)`):

```ts
  it("renders a telehealth teaser linking to /services/telehealth", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /learn about telehealth/i })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });

  it("renders the telehealth teaser CTA in Spanish when locale is es", () => {
    render(<Home />, "es");
    expect(screen.getByRole("link", { name: /conozca la telesalud/i })).toHaveAttribute(
      "href",
      "/es/services/telehealth"
    );
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- app/\[locale\]/page.test.tsx`
Expected: FAIL — no "Learn about Telehealth" link (and the `Home.telehealth*` keys are missing).

- [ ] **Step 3: Add the `Home` message keys in both locales**

In `messages/en.json`, inside the `"Home"` object, add:

```json
    "telehealthEyebrow": "Virtual Care",
    "telehealthHeading": "Telehealth visits from home",
    "telehealthBody": "Connect with a board-certified pediatrician through a secure video visit, with the same care and attention as an in-person appointment.",
    "telehealthCta": "Learn about Telehealth",
    "telehealthImageAlt": "A parent and child on a video telehealth visit with a pediatrician",
```

In `messages/es.json`, inside the `"Home"` object, add:

```json
    "telehealthEyebrow": "Atención Virtual",
    "telehealthHeading": "Consultas de telesalud desde casa",
    "telehealthBody": "Conéctese con un pediatra certificado a través de una videoconsulta segura, con el mismo cuidado y atención que una visita en persona.",
    "telehealthCta": "Conozca la Telesalud",
    "telehealthImageAlt": "Un padre y su hijo en una visita de telesalud por video con un pediatra",
```

- [ ] **Step 4: Compute the benefit chips near the top of `Home`**

In `app/[locale]/page.tsx`, inside `Home`, after the existing `const allServices = …` line, add:

```tsx
  const telehealthService = serviceCategories
    .flatMap((category) => category.services)
    .find((service) => service.id === "telehealth");
  const telehealthChips = (telehealthService?.benefits ?? []).slice(0, 3);
```

- [ ] **Step 5: Add the teaser section after "Why families choose us"**

In `app/[locale]/page.tsx`, insert this section immediately after the closing `</section>` of the `{/* Why families choose us */}` block and before `{/* Doctors preview */}`:

```tsx
      {/* Telehealth teaser */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <Reveal>
          <div className="grid items-center gap-8 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8 lg:grid-cols-2 lg:gap-12">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/services/telehealth.jpg"
                alt={t("telehealthImageAlt")}
                width={800}
                height={600}
                unoptimized
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                {t("telehealthEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("telehealthHeading")}
              </h2>
              <p className="mt-3 max-w-md text-ink-soft">{t("telehealthBody")}</p>
              {telehealthChips.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {telehealthChips.map((chip) => (
                    <span
                      key={chip.title}
                      className="rounded-full border border-border bg-ivory px-4 py-2 text-sm font-semibold text-ink"
                    >
                      {locale === "es" ? chip.titleEs : chip.title}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href="/services/telehealth"
                className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
              >
                {t("telehealthCta")} →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- app/\[locale\]/page.test.tsx`
Expected: PASS. In particular the existing `getByRole("link", { name: "Telehealth" })` pill-cloud test still finds exactly one link (the teaser CTA's accessible name is "Learn about Telehealth →", not "Telehealth"), and the es pill test's `"Telesalud"` link is likewise unique (teaser CTA is "Conozca la Telesalud").

- [ ] **Step 7: Commit**

```bash
git add "app/[locale]/page.tsx" "app/[locale]/page.test.tsx" messages/en.json messages/es.json
git commit -m "feat: add telehealth teaser to homepage"
```

---

### Task 7: Full-suite + build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the entire test suite**

Run: `npm test`
Expected: PASS — all suites green (data, service detail, Header, Footer, Home, and every pre-existing suite).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds; `/services/telehealth` is included in `generateStaticParams` output; no type errors from the new `Service` fields or the `page.tsx` changes.

- [ ] **Step 3: Manual smoke check (optional but recommended)**

Run `npm run dev`, then verify:
- `/services/telehealth` shows the image, benefits grid, "How It Works", and "How to Schedule" with working `tel:`/`sms:` links.
- `/es/services/telehealth` shows the Spanish equivalents.
- Homepage teaser appears after "Why families choose us" and links through.
- Header "More" menu and footer "For Patients" both list Telehealth.
- Dark mode is legible on all new UI.

- [ ] **Step 4: Final commit (only if the smoke check required tweaks)**

```bash
git add -A
git commit -m "chore: telehealth page verification tweaks"
```

---

## Self-Review

**Spec coverage:**
- Enrich `/services/telehealth` (image + intro + 3 blocks) → Tasks 2 (data), 3 (render), 1 (image). ✓
- Benefits / How it works / How to schedule blocks → Task 3. ✓
- Homepage teaser → Task 6. ✓
- Header "More" dropdown link → Task 4 (dropdown per approved decision). ✓
- Footer "For Patients" link → Task 5. ✓
- Bilingual (en/es) everywhere → data fields (Task 2), inline ternaries (Task 3), message keys in both files (Tasks 4-6). ✓
- Phone/text from constants → Task 3 uses `MAIN_PHONE`/`TEXT_PHONE`/`TEXT_PHONE_ES`. ✓
- Image downloaded locally → Task 1. ✓
- Tests for each surface → Tasks 2-6 each add tests; Task 7 runs the full suite + build. ✓

**Deviation from spec (intentional):** The spec suggested `getTranslations("Services")` for the service-page section labels. The plan instead uses inline `locale === "es" ? …` ternaries, because the file is a server component with **no** existing `useTranslations`/`getTranslations` and already localizes every other string that way (`bookLabel`, `moreServicesLabel`). This is lower-risk, consistent with the file, and needs no new `Services` message keys. Bilingual output is unchanged.

**Placeholder scan:** No TBD/TODO; every code and test step contains complete content. ✓

**Type consistency:** `Benefit` fields (`title`/`titleEs`/`description`/`descriptionEs`) are used identically in `data/services.ts`, the service page (`benefit.titleEs` etc.), and the homepage chips (`chip.titleEs`). `showSchedule`, `howItWorks`/`howItWorksEs`, `imageSrc` names match across data, page, and tests. `toE164` matches the Footer helper's behavior, producing `+18183615437` / `+16262987121` / `+18184235637` as asserted. ✓
