# Service Page Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one suitable, self-hosted Unsplash photo to each of the 19 service detail pages that currently lack an image.

**Architecture:** Pure data + assets change. The detail page (`app/[locale]/services/[slug]/page.tsx`) already renders a two-column image layout when a service has `imageSrc`, so no component changes are needed. Download 19 topical Unsplash JPGs into `public/services/`, then add `imageSrc` + bilingual alt text to each service in `data/services.ts`.

**Tech Stack:** Next.js 16.2.10, next-intl, TypeScript, Vitest, Tailwind v4. Images downloaded via PowerShell `Invoke-WebRequest`.

## Global Constraints

- Images are **self-hosted** in `public/services/`, named exactly `<service-id>.jpg`.
- Aspect ratio **4:5 portrait**; Unsplash URL params: `?w=800&h=1000&fit=crop&q=80&auto=format`.
- **No em dash (—)** anywhere, including alt text (enforced by `data/services.test.ts` style).
- Every new image gets both `imageAlt` (English) and `imageAltEs` (Spanish).
- Leave `telehealth` and `same-day-appointments` **untouched** (they already have images).
- Do **not** use `imageAspectClass` (default `aspect-[4/5]` is correct).
- **Version control:** per the user's minimal-VC preference, do **not** commit. Verify each task with `npm run test` and `npm run build` instead; the working tree may stay dirty.
- Unsplash license permits free commercial use without attribution; still record every source URL in `public/services/SOURCES.md`.

---

## File Structure

- **Create:** `public/services/<service-id>.jpg` × 19 (binary assets)
- **Create:** `public/services/SOURCES.md` (provenance manifest)
- **Modify:** `data/services.ts` — add `imageSrc` / `imageAlt` / `imageAltEs` to 19 service objects
- **Modify:** `data/services.test.ts` — add a test asserting every service has an image whose file exists, with bilingual alt text and no em dash

The 19 service ids (all except `telehealth`, `same-day-appointments`):

```
well-child-exam, physicals, free-vaccines, covid-19-vaccine, nutrition,
newborn-care, expectant-parents, circumcisions,
sick-visits, walk-ins, pediatric-infectious-disease, sports-injuries,
adhd-behavioral-issues, autism-developmental-disorders, childhood-obesity-weight-management,
asthma-allergy-center, allergies, adolescent-medicine, teenage-gynecology-menstrual-disorders
```

---

## Task 1: Curate and download the 19 service images + provenance manifest

**Files:**
- Create: `public/services/<service-id>.jpg` × 19
- Create: `public/services/SOURCES.md`

**Interfaces:**
- Produces: 19 JPEG files at `public/services/<service-id>.jpg` that Task 3 references as `imageSrc`, and a `SOURCES.md` manifest.

- [ ] **Step 1: Curate one Unsplash direct URL per service**

For each service, web-search the topic (e.g. "unsplash pediatrician child checkup") and capture the direct image URL of the form `https://images.unsplash.com/photo-<id>`. Target subject per service (sensitive topics = tasteful, non-graphic only):

| service-id | Photo subject |
|---|---|
| `well-child-exam` | Pediatrician checking a healthy young child at a routine checkup |
| `physicals` | Doctor listening to a child's heartbeat with a stethoscope |
| `free-vaccines` | Nurse placing a bandage on a child's arm after a shot |
| `covid-19-vaccine` | Healthcare worker preparing a vaccine syringe |
| `nutrition` | Fresh fruits and vegetables / healthy eating |
| `newborn-care` | Newborn gently held in caregiver's hands |
| `expectant-parents` | Pregnant person resting hands on belly |
| `circumcisions` | Swaddled newborn resting in a parent's arms (non-graphic) |
| `sick-visits` | Caring pediatrician comforting a child (not distressing) |
| `walk-ins` | Friendly clinic receptionist welcoming a family |
| `pediatric-infectious-disease` | Doctor examining a child, discussing care with a parent |
| `sports-injuries` | Young athlete with a bandaged knee on a sports field |
| `adhd-behavioral-issues` | Child concentrating on a learning activity |
| `autism-developmental-disorders` | Child in play-based developmental activity with blocks |
| `childhood-obesity-weight-management` | Family being active together outdoors |
| `asthma-allergy-center` | Child using an asthma inhaler with a spacer |
| `allergies` | Doctor reviewing allergy results with a young patient |
| `adolescent-medicine` | Teenager talking with a doctor in a consultation |
| `teenage-gynecology-menstrual-disorders` | Teen girl in a comfortable consultation with a female doctor |

- [ ] **Step 2: Download each image via PowerShell**

For each service, run (substituting the curated `<photo-id>` and `<service-id>`):

```powershell
$base = "https://images.unsplash.com/photo-<photo-id>"
$params = "?w=800&h=1000&fit=crop&q=80&auto=format"
Invoke-WebRequest -Uri ($base + $params) -OutFile "public/services/<service-id>.jpg" -UseBasicParsing -ErrorAction Stop
```

- [ ] **Step 3: Verify all 19 files are valid, non-zero JPEGs**

Run:

```powershell
$ids = "well-child-exam","physicals","free-vaccines","covid-19-vaccine","nutrition","newborn-care","expectant-parents","circumcisions","sick-visits","walk-ins","pediatric-infectious-disease","sports-injuries","adhd-behavioral-issues","autism-developmental-disorders","childhood-obesity-weight-management","asthma-allergy-center","allergies","adolescent-medicine","teenage-gynecology-menstrual-disorders"
foreach ($id in $ids) {
  $p = "public/services/$id.jpg"
  if (-not (Test-Path $p)) { Write-Output "MISSING $id"; continue }
  $b = [System.IO.File]::ReadAllBytes($p)
  $ok = ($b.Length -gt 5000) -and ($b[0] -eq 255) -and ($b[1] -eq 216)
  Write-Output ("{0} {1} {2}bytes" -f $(if($ok){"OK"}else{"BAD"}), $id, $b.Length)
}
```

Expected: 19 lines, all starting `OK`. Re-source any `BAD`/`MISSING` before continuing.

- [ ] **Step 4: Write the provenance manifest**

Create `public/services/SOURCES.md` listing every image and its Unsplash source URL:

```markdown
# Service image sources

All images from Unsplash (https://unsplash.com), free for commercial use, no attribution required.
Downloaded with params `?w=800&h=1000&fit=crop&q=80&auto=format` (4:5 portrait).

| File | Source |
|------|--------|
| same-day-appointments.jpg | (pre-existing) |
| telehealth.jpg | (pre-existing) |
| well-child-exam.jpg | https://unsplash.com/photos/<...> |
| ... one row per downloaded image ... |
```

- [ ] **Step 5: Verify (no commit)**

Run: `npm run test`
Expected: PASS (no data changes yet; this just confirms the tree is still green after adding assets).

---

## Task 2: Add the failing image-coverage test

**Files:**
- Modify: `data/services.test.ts`

**Interfaces:**
- Consumes: the 19 JPEG files created in Task 1.
- Produces: a test that fails until Task 3 wires `imageSrc` into every service.

- [ ] **Step 1: Add the test**

Append to the `describe("services data", ...)` block in `data/services.test.ts`, and add these imports at the top of the file:

```typescript
import { existsSync } from "fs";
import { join } from "path";
```

Test:

```typescript
it("gives every service an image whose file exists, with bilingual alt and no em dash", () => {
  const allServices = serviceCategories.flatMap((c) => c.services);
  for (const s of allServices) {
    expect(s.imageSrc, `${s.id} missing imageSrc`).toBeTruthy();
    expect(s.imageSrc!.startsWith("/services/")).toBe(true);
    const filePath = join(process.cwd(), "public", s.imageSrc!.replace(/^\//, ""));
    expect(existsSync(filePath), `${s.id} image file missing: ${s.imageSrc}`).toBe(true);
    expect((s.imageAlt ?? "").length, `${s.id} missing imageAlt`).toBeGreaterThan(10);
    expect((s.imageAltEs ?? "").length, `${s.id} missing imageAltEs`).toBeGreaterThan(10);
    expect(s.imageAlt).not.toContain("—");
    expect(s.imageAltEs).not.toContain("—");
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- data/services.test.ts`
Expected: FAIL — the new test reports services missing `imageSrc` (only `telehealth` and `same-day-appointments` currently have one). All other tests still PASS.

---

## Task 3: Wire imageSrc + bilingual alt text into data/services.ts

**Files:**
- Modify: `data/services.ts`

**Interfaces:**
- Consumes: the 19 JPEGs (Task 1) and the coverage test (Task 2).
- Produces: 19 service objects each with `imageSrc`, `imageAlt`, `imageAltEs`.

- [ ] **Step 1: Add image fields to each of the 19 services**

For each service object, add the three fields (use the exact alt text below). Example for `well-child-exam`:

```typescript
imageSrc: "/services/well-child-exam.jpg",
imageAlt: "A pediatrician measuring a healthy young child during a routine checkup",
imageAltEs: "Una pediatra midiendo a un niño pequeño y sano durante un chequeo de rutina",
```

Exact alt text for all 19:

| service-id | imageAlt (EN) | imageAltEs (ES) |
|---|---|---|
| `well-child-exam` | A pediatrician measuring a healthy young child during a routine checkup | Una pediatra midiendo a un niño pequeño y sano durante un chequeo de rutina |
| `physicals` | A doctor listening to a child's heartbeat with a stethoscope during a physical exam | Un médico escuchando el latido del corazón de un niño con un estetoscopio durante un examen físico |
| `free-vaccines` | A nurse placing a bandage on a child's arm after a vaccination | Una enfermera colocando una venda en el brazo de un niño después de una vacuna |
| `covid-19-vaccine` | A healthcare worker preparing a vaccine syringe | Un trabajador de salud preparando una jeringa con la vacuna |
| `nutrition` | A colorful arrangement of fresh fruits and vegetables for healthy eating | Una colorida variedad de frutas y verduras frescas para una alimentación saludable |
| `newborn-care` | A newborn baby being gently held in a caregiver's hands | Un bebé recién nacido sostenido con delicadeza en las manos de un cuidador |
| `expectant-parents` | A pregnant person resting their hands on their belly | Una persona embarazada con las manos apoyadas sobre su vientre |
| `circumcisions` | A swaddled newborn resting peacefully in a parent's arms | Un recién nacido envuelto descansando tranquilamente en brazos de uno de sus padres |
| `sick-visits` | A caring pediatrician comforting a child during a checkup | Una pediatra atenta reconfortando a un niño durante una consulta |
| `walk-ins` | A friendly clinic receptionist welcoming a family at the front desk | Una recepcionista amable dando la bienvenida a una familia en la recepción de la clínica |
| `pediatric-infectious-disease` | A doctor examining a child while discussing care with a parent | Un médico examinando a un niño mientras conversa sobre su atención con uno de sus padres |
| `sports-injuries` | A young athlete with a bandaged knee on a sports field | Un joven atleta con la rodilla vendada en un campo deportivo |
| `adhd-behavioral-issues` | A child concentrating on a learning activity at a table | Un niño concentrado en una actividad de aprendizaje en una mesa |
| `autism-developmental-disorders` | A child engaged in play-based developmental activities with colorful blocks | Un niño participando en actividades de desarrollo mediante el juego con bloques de colores |
| `childhood-obesity-weight-management` | A family being active together outdoors | Una familia haciendo actividad física juntos al aire libre |
| `asthma-allergy-center` | A child using an asthma inhaler with a spacer | Un niño usando un inhalador para el asma con una cámara espaciadora |
| `allergies` | A doctor reviewing allergy test results with a young patient | Un médico revisando los resultados de una prueba de alergias con un paciente joven |
| `adolescent-medicine` | A teenager talking with a doctor during a consultation | Un adolescente conversando con un médico durante una consulta |
| `teenage-gynecology-menstrual-disorders` | A teenage girl in a comfortable consultation with a female doctor | Una adolescente en una consulta cómoda con una médica |

- [ ] **Step 2: Run the coverage test to verify it passes**

Run: `npm run test -- data/services.test.ts`
Expected: PASS (all services now have an image whose file exists, with bilingual alt).

- [ ] **Step 3: Run the full test suite**

Run: `npm run test`
Expected: PASS (all suites green).

---

## Task 4: Contact-sheet review + final verification

**Files:**
- Create: scratchpad HTML contact sheet (temporary, for the review Artifact)

**Interfaces:**
- Consumes: everything from Tasks 1–3.

- [ ] **Step 1: Build a contact-sheet Artifact**

Create an HTML gallery showing all 19 images (embedded from `public/services/`) each captioned with its service name + id, so the user can approve or flag swaps in one pass. Publish via the Artifact tool.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: Build succeeds with no errors; the 21 service pages are generated by `generateStaticParams`.

- [ ] **Step 3: Spot-check rendered pages**

Start `npm run dev` and open 3–4 service pages (e.g. `/en/services/well-child-exam`, `/es/services/nutrition`, `/en/services/teenage-gynecology-menstrual-disorders`). Confirm each shows the two-column image layout with the correct photo and readable text. Optionally use Playwright to screenshot.

- [ ] **Step 4: Present results to the user for approval**

Share the contact-sheet Artifact link and the build/test results. Await approval or swap requests. (No commit — per the minimal-VC preference.)

---

## Self-Review

- **Spec coverage:** Source+download (Task 1) ✔, unique per service ✔, 4:5 portrait ✔, self-hosted ✔, bilingual alt ✔, provenance manifest (Task 1 Step 4) ✔, contact-sheet review (Task 4) ✔, verification (Tasks 3–4) ✔, sensitive-topic handling (Task 1 subject table) ✔. All 19 services enumerated.
- **Placeholders:** none — every image concept, alt string, and command is concrete.
- **Type consistency:** uses existing `Service` fields `imageSrc` / `imageAlt` / `imageAltEs` from `data/services.ts`; test uses `existsSync` / `join` imports declared in Task 2.
