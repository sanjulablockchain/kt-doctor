# Careers Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stub `/careers` page with a rich, bilingual careers page (hero with image, perks strip, benefits, filterable open positions, culture band, and an in-page application form with CV upload emailed via the existing SMTP setup).

**Architecture:** Follows the established page pattern: a server `page.tsx` renders a `"use client"` content component that reads copy from `next-intl` messages and structured data from `data/`. The application form mirrors the existing contact form (server action + shared zod validation + honeypot + `useActionState`), adding a CV file upload that the server action attaches to the outgoing mail via `nodemailer`. Positions are static typed data; the department filter runs client-side.

**Tech Stack:** Next.js 16.2.10 (App Router, Server Actions), React 19, next-intl 4, Tailwind CSS v4, zod 4, nodemailer 9, vitest 4 + Testing Library.

## Global Constraints

- **No em dash (—)** anywhere in copy, code, comments, or data. Use "to", commas, or parentheses. (User preference; `data/*.test.ts` assert this.)
- **Bilingual EN/ES:** every user-facing string exists in both `messages/en.json` and `messages/es.json`; position titles/summaries carry `*Es` fields in `data/careers.ts`.
- **This is a modified Next.js.** Before writing server-action or file-upload code, read `node_modules/next/dist/docs/01-app/02-guides/server-actions.md`. The 1 MB default action body limit is confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md`.
- **Design tokens only** (from `app/globals.css`): colors `ivory`, `ivory-deep`, `surface`, `ink`, `ink-soft`, `navy`, `teal`, `teal-dark`, `teal-tint`, `gold`, `gold-tint`, `border`; fonts `font-display`, `font-body`; helpers `shadow-soft`, `shadow-card`. Buttons are `rounded-full`.
- **Applications route to a new `CAREERS_TO` env var** over the existing `SMTP_*` transport, `from` = `CONTACT_FROM` (M365 requires `from` to be the authenticated mailbox), applicant address in `replyTo`. For testing, `CAREERS_TO = Sanjula.Rajapaksha@ktdoctor.com`. `sendContactMail` keeps reading `CONTACT_TO` unchanged.
- **Displayed careers email is a label, not the delivery mailbox.** `lib/constants.ts` gets `CAREERS_EMAIL = "Amanda.Desilva@ktdoctor.com"`, shown on the page as a "prefer to email us directly" link. It is never read by the mailer.
- **Tests + build must pass:** `npm run test` and `npm run build` green before the plan is complete. Match existing test style (vitest, `renderWithIntl` from `@/lib/test-utils`).

---

## File Structure

**Create:**
- `lib/escapeHtml.ts` — shared HTML-escape helper (extracted from the contact action).
- `lib/careersSchema.ts` — zod schema + `validateApplication` + `validateCvFile` for the application form.
- `lib/careersSchema.test.ts`
- `app/[locale]/careers/actions.ts` — `sendJobApplication` server action.
- `app/[locale]/careers/actions.test.ts`
- `components/JobApplicationForm.tsx` — the application form (client).
- `components/JobApplicationForm.test.tsx`
- `public/careers/SOURCES.md` — image provenance.
- `public/careers/hero.jpg`, `public/careers/benefits.jpg`, `public/careers/culture.jpg` — self-hosted images.

**Modify:**
- `lib/escapeHtml.ts` consumers: `app/[locale]/contact/actions.ts` (use the shared helper).
- `lib/mailer.ts` — add `sendApplicationMail` (attachments, reads `CAREERS_TO`) via shared transport helper; `sendContactMail` behavior unchanged.
- `lib/constants.ts` — add `CAREERS_EMAIL` display constant.
- `.env.local` and `.env.local.example` — add `CAREERS_TO`.
- `data/careers.ts` — replace the mailto export with typed `positions` + `DEPARTMENTS`.
- `data/careers.test.ts` — assert data shape + no em dash.
- `next.config.ts` — raise `experimental.serverActions.bodySizeLimit` to `"6mb"`.
- `messages/en.json`, `messages/es.json` — expand the `Careers` namespace.
- `components/CareersPageContent.tsx` — full rewrite.
- `components/CareersPageContent.test.tsx` — rewrite for the new content.

`app/[locale]/careers/page.tsx` and `page.test.tsx` are unchanged (the page still just renders `<CareersPageContent />`; the existing "renders without crashing" test keeps passing).

---

## Task 1: Positions data model

**Files:**
- Modify: `data/careers.ts` (currently exports `CAREERS_APPLY_MAILTO`)
- Test: `data/careers.test.ts`

**Interfaces:**
- Produces: `type Department`, `type EmploymentType`, `type Position`, `const positions: Position[]`, `const DEPARTMENTS: Department[]`.

- [ ] **Step 1: Write the failing test**

Replace the contents of `data/careers.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { positions, DEPARTMENTS, type Position } from "./careers";

describe("careers positions data", () => {
  it("has at least one position", () => {
    expect(positions.length).toBeGreaterThan(0);
  });

  it("every position is well-formed", () => {
    for (const p of positions) {
      expect(p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.titleEs.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(0);
      expect(p.summaryEs.length).toBeGreaterThan(0);
      expect(p.locations.length).toBeGreaterThan(0);
      expect(DEPARTMENTS).toContain(p.department);
    }
  });

  it("has unique ids", () => {
    const ids = positions.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains no em dash in any string", () => {
    const strings: string[] = positions.flatMap((p: Position) => [
      p.title, p.titleEs, p.summary, p.summaryEs, p.locations, p.employmentType, p.department,
    ]);
    for (const s of strings) expect(s).not.toContain("—");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- data/careers.test.ts`
Expected: FAIL (`positions`/`DEPARTMENTS` not exported).

- [ ] **Step 3: Write minimal implementation**

Replace the contents of `data/careers.ts`:

```ts
export type Department =
  | "Clinical"
  | "Clinical Support"
  | "Administration"
  | "Operations"
  | "Therapy"
  | "Finance";

export type EmploymentType = "Full-time" | "Part-time" | "Full-time / Part-time";

export type Position = {
  id: string;
  title: string;
  titleEs: string;
  department: Department;
  locations: string;
  employmentType: EmploymentType;
  summary: string;
  summaryEs: string;
};

// Fixed display order for the department filter.
export const DEPARTMENTS: Department[] = [
  "Clinical",
  "Clinical Support",
  "Administration",
  "Operations",
  "Therapy",
  "Finance",
];

// Seed list from the approved mockup. The client confirms/edits the exact roles
// before launch; ids are stable slugs used as the Apply deep-link value.
export const positions: Position[] = [
  {
    id: "pediatrician",
    title: "Pediatrician (MD/DO)",
    titleEs: "Pediatra (MD/DO)",
    department: "Clinical",
    locations: "Multiple Locations",
    employmentType: "Full-time",
    summary:
      "Board-certified pediatrician to provide primary care for patients ages 0 to 21. FAAP preferred.",
    summaryEs:
      "Pediatra certificado para brindar atención primaria a pacientes de 0 a 21 años. Se prefiere FAAP.",
  },
  {
    id: "pediatric-np",
    title: "Pediatric Nurse Practitioner",
    titleEs: "Enfermera Practicante Pediátrica",
    department: "Clinical",
    locations: "Hollywood, Tarzana",
    employmentType: "Full-time",
    summary: "PNP to provide well-child visits, sick visits, and telehealth consultations.",
    summaryEs:
      "Enfermera practicante pediátrica para visitas de niño sano, visitas por enfermedad y consultas de telesalud.",
  },
  {
    id: "medical-assistant",
    title: "Medical Assistant",
    titleEs: "Asistente Médico",
    department: "Clinical Support",
    locations: "Pasadena, Glendale, Arcadia",
    employmentType: "Full-time",
    summary: "Bilingual (English/Spanish) MA to assist with patient intake, vitals, and procedures.",
    summaryEs:
      "Asistente médico bilingüe (inglés/español) para apoyar la admisión de pacientes, signos vitales y procedimientos.",
  },
  {
    id: "front-office-coordinator",
    title: "Front Office Coordinator",
    titleEs: "Coordinador de Recepción",
    department: "Administration",
    locations: "Northridge, Van Nuys",
    employmentType: "Full-time",
    summary: "Manage patient scheduling, insurance verification, and front desk operations.",
    summaryEs:
      "Gestionar la programación de pacientes, la verificación de seguros y las operaciones de recepción.",
  },
  {
    id: "telehealth-coordinator",
    title: "Telehealth Coordinator",
    titleEs: "Coordinador de Telesalud",
    department: "Operations",
    locations: "Remote",
    employmentType: "Full-time",
    summary: "Coordinate virtual visits, manage the telehealth platform, and support patients with technology.",
    summaryEs:
      "Coordinar visitas virtuales, administrar la plataforma de telesalud y ayudar a los pacientes con la tecnología.",
  },
  {
    id: "speech-language-pathologist",
    title: "Speech Language Pathologist",
    titleEs: "Patólogo del Habla y Lenguaje",
    department: "Therapy",
    locations: "West LA (LAIPT)",
    employmentType: "Full-time / Part-time",
    summary: "Pediatric SLP for children under 10. In-person and teletherapy sessions.",
    summaryEs:
      "Patólogo del habla pediátrico para niños menores de 10 años. Sesiones presenciales y de teleterapia.",
  },
  {
    id: "occupational-therapist",
    title: "Occupational Therapist",
    titleEs: "Terapeuta Ocupacional",
    department: "Therapy",
    locations: "West LA (LAIPT)",
    employmentType: "Part-time",
    summary: "Pediatric OT specializing in sensory processing and fine motor development.",
    summaryEs:
      "Terapeuta ocupacional pediátrico especializado en procesamiento sensorial y desarrollo motor fino.",
  },
  {
    id: "billing-specialist",
    title: "Billing Specialist",
    titleEs: "Especialista en Facturación",
    department: "Finance",
    locations: "Pasadena (HQ)",
    employmentType: "Full-time",
    summary: "Medical billing and coding specialist with pediatric experience. CPC certification preferred.",
    summaryEs:
      "Especialista en facturación y codificación médica con experiencia pediátrica. Se prefiere certificación CPC.",
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- data/careers.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/careers.ts data/careers.test.ts
git commit -m "feat(careers): add positions data model"
```

---

## Task 2: Application validation schema

**Files:**
- Create: `lib/careersSchema.ts`
- Test: `lib/careersSchema.test.ts`

**Interfaces:**
- Consumes: `EMAIL_RE` from `lib/contactSchema.ts`.
- Produces:
  - `type ApplicationValues = { name; email; phone; position; message }` (all `string`).
  - `type ApplicationFieldErrors = Partial<Record<"name"|"email"|"phone"|"position"|"message"|"cv", string>>`.
  - `validateApplication(raw: ApplicationValues): { success: true; data } | { success: false; fieldErrors: ApplicationFieldErrors }`.
  - `validateCvFile(file: { name: string; size: number; type: string } | null): string | null`.
  - `const CV_MAX_BYTES: number`, `const CV_ACCEPT = ".pdf,.doc,.docx"`, `const CV_ALLOWED_EXT: string[]`.

- [ ] **Step 1: Write the failing test**

Create `lib/careersSchema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  validateApplication,
  validateCvFile,
  CV_MAX_BYTES,
  type ApplicationValues,
} from "./careersSchema";

const VALID: ApplicationValues = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  position: "pediatrician",
  message: "I would love to join the team.",
};

describe("validateApplication", () => {
  it("accepts valid input and trims", () => {
    const result = validateApplication({ ...VALID, name: "  Jane Doe  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Jane Doe");
  });

  it("requires name and email but not phone/position/message", () => {
    const result = validateApplication({ name: "", email: "", phone: "", position: "", message: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors).toMatchObject({ name: "nameRequired", email: "emailRequired" });
      expect(result.fieldErrors.phone).toBeUndefined();
      expect(result.fieldErrors.position).toBeUndefined();
      expect(result.fieldErrors.message).toBeUndefined();
    }
  });

  it("flags an invalid email", () => {
    const result = validateApplication({ ...VALID, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.email).toBe("emailInvalid");
  });
});

describe("validateCvFile", () => {
  it("requires a file", () => {
    expect(validateCvFile(null)).toBe("cvRequired");
    expect(validateCvFile({ name: "cv.pdf", size: 0, type: "application/pdf" })).toBe("cvRequired");
  });

  it("rejects files over the size limit", () => {
    expect(validateCvFile({ name: "cv.pdf", size: CV_MAX_BYTES + 1, type: "application/pdf" })).toBe(
      "cvTooLarge"
    );
  });

  it("rejects disallowed extensions", () => {
    expect(validateCvFile({ name: "cv.exe", size: 100, type: "application/octet-stream" })).toBe("cvType");
    expect(validateCvFile({ name: "photo.png", size: 100, type: "image/png" })).toBe("cvType");
  });

  it("accepts pdf/doc/docx within the limit", () => {
    expect(validateCvFile({ name: "cv.pdf", size: 100, type: "application/pdf" })).toBeNull();
    expect(validateCvFile({ name: "cv.doc", size: 100, type: "application/msword" })).toBeNull();
    expect(validateCvFile({ name: "resume.DOCX", size: 100, type: "" })).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/careersSchema.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

Create `lib/careersSchema.ts`:

```ts
import { z } from "zod";
import { EMAIL_RE } from "./contactSchema";

// Application-form validation shared by the client form (instant feedback) and
// the server action (authoritative). Error strings are i18n sub-keys under
// `Careers.errors`; the UI renders them with t(`errors.${code}`). Keep in sync
// with messages/*.json.
export type ApplicationFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "position" | "message" | "cv", string>
>;

export type ApplicationValues = {
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
};

export const applicationSchema = z.object({
  name: z.string().trim().min(1, { message: "nameRequired" }).max(100, { message: "tooLong" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "emailRequired" })
    .max(200, { message: "tooLong" })
    .regex(EMAIL_RE, { message: "emailInvalid" }),
  phone: z.string().trim().max(40, { message: "tooLong" }),
  position: z.string().trim().max(100, { message: "tooLong" }),
  message: z.string().trim().max(2000, { message: "tooLong" }),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export function validateApplication(
  raw: ApplicationValues
):
  | { success: true; data: ApplicationData }
  | { success: false; fieldErrors: ApplicationFieldErrors } {
  const parsed = applicationSchema.safeParse(raw);
  if (parsed.success) return { success: true, data: parsed.data };
  const fieldErrors: ApplicationFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof ApplicationFieldErrors | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors };
}

export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const CV_ACCEPT = ".pdf,.doc,.docx";
export const CV_ALLOWED_EXT = ["pdf", "doc", "docx"];

// Validates the uploaded CV by size and extension. Typed to the minimal shape it
// reads so both the browser `File` and tests satisfy it. MIME is not trusted
// (often empty or spoofed); the extension is the gate.
export function validateCvFile(
  file: { name: string; size: number; type: string } | null
): string | null {
  if (!file || file.size === 0) return "cvRequired";
  if (file.size > CV_MAX_BYTES) return "cvTooLarge";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!CV_ALLOWED_EXT.includes(ext)) return "cvType";
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/careersSchema.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/careersSchema.ts lib/careersSchema.test.ts
git commit -m "feat(careers): add application validation schema"
```

---

## Task 3: Shared escapeHtml helper

**Files:**
- Create: `lib/escapeHtml.ts`
- Modify: `app/[locale]/contact/actions.ts` (remove local copy, import shared)

**Interfaces:**
- Produces: `escapeHtml(value: string): string`.

- [ ] **Step 1: Create the helper**

Create `lib/escapeHtml.ts`:

```ts
// Escapes the five HTML-significant characters so user-supplied text is safe to
// embed in an HTML email body. Shared by the contact and careers server actions.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

- [ ] **Step 2: Refactor the contact action to use it**

In `app/[locale]/contact/actions.ts`, delete the local `function escapeHtml(...)` (lines 17-24) and add an import near the top:

```ts
import { escapeHtml } from "@/lib/escapeHtml";
```

- [ ] **Step 3: Run the contact action test to verify no regression**

Run: `npm run test -- app/[locale]/contact/actions.test.ts`
Expected: PASS (the "escapes HTML in the message body" test still passes).

- [ ] **Step 4: Commit**

```bash
git add lib/escapeHtml.ts "app/[locale]/contact/actions.ts"
git commit -m "refactor: extract shared escapeHtml helper"
```

---

## Task 4: Mailer attachment support + careers recipient

**Files:**
- Modify: `lib/mailer.ts`
- Test: `lib/mailer.test.ts` (add a case; keep the existing two green)
- Modify: `.env.local`, `.env.local.example` (add `CAREERS_TO`)

**Interfaces:**
- Produces:
  - `type MailAttachment = { filename: string; content: Buffer; contentType?: string }`.
  - `type ApplicationMail = { replyTo; subject; text; html; attachments?: MailAttachment[] }`.
  - `sendApplicationMail(mail: ApplicationMail): Promise<void>` — sends to `CAREERS_TO`.
- `sendContactMail` signature and `sendMail` call shape are unchanged (still `CONTACT_TO`).

- [ ] **Step 1: Add `CAREERS_TO` to the test env map**

In `lib/mailer.test.ts`, add one line to the `ENV` object (near the top, after `CONTACT_FROM`) so the new test has a recipient distinct from `CONTACT_TO`, proving the application path reads the right var:

```ts
  CAREERS_TO: "careers-inbox@ktdoctor.com",
```

- [ ] **Step 2: Write the failing test**

Append to `lib/mailer.test.ts` (inside the file, after the existing `describe`):

```ts
describe("sendApplicationMail", () => {
  it("sends to CAREERS_TO with attachments passed through", async () => {
    const { sendApplicationMail } = await import("./mailer");
    const content = Buffer.from("PDF-BYTES");
    await sendApplicationMail({
      replyTo: "applicant@example.com",
      subject: "[Careers] Application: Pediatrician (MD/DO)",
      text: "application",
      html: "<p>application</p>",
      attachments: [{ filename: "cv.pdf", content, contentType: "application/pdf" }],
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: "from@ktdoctor.com",
      to: "careers-inbox@ktdoctor.com",
      replyTo: "applicant@example.com",
      subject: "[Careers] Application: Pediatrician (MD/DO)",
      text: "application",
      html: "<p>application</p>",
      attachments: [{ filename: "cv.pdf", content, contentType: "application/pdf" }],
    });
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- lib/mailer.test.ts`
Expected: FAIL (`sendApplicationMail` not exported).

- [ ] **Step 4: Write minimal implementation**

Replace the contents of `lib/mailer.ts`:

```ts
import nodemailer from "nodemailer";

export type ContactMail = {
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type ApplicationMail = ContactMail & {
  attachments?: MailAttachment[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Builds the SMTP transport and resolves the `from` sender. All routing is
// env-driven so the mailbox can change with no code edit. On Microsoft 365 `from`
// must be the authenticated mailbox, so the visitor/applicant address is carried
// in `replyTo` instead. Each send function reads its own recipient env var
// (`CONTACT_TO` vs `CAREERS_TO`) so contact and careers can land in different
// inboxes over the same transport.
function buildTransport(): { transport: nodemailer.Transporter; from: string } {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const from = requireEnv("CONTACT_FROM");
  const secure = process.env.SMTP_SECURE === "true";

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return { transport, from };
}

export async function sendContactMail(mail: ContactMail): Promise<void> {
  const { transport, from } = buildTransport();
  const to = requireEnv("CONTACT_TO");
  await transport.sendMail({
    from,
    to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}

// Sends a job application to the careers mailbox, attaching the applicant's CV.
export async function sendApplicationMail(mail: ApplicationMail): Promise<void> {
  const { transport, from } = buildTransport();
  const to = requireEnv("CAREERS_TO");
  await transport.sendMail({
    from,
    to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: mail.attachments,
  });
}
```

Note: `sendContactMail` still reads `CONTACT_TO` and omits `attachments`, so the existing test's exact-match assertion stays valid.

- [ ] **Step 5: Run the full mailer test**

Run: `npm run test -- lib/mailer.test.ts`
Expected: PASS (all three cases, including the new `CAREERS_TO` assertion).

- [ ] **Step 6: Add `CAREERS_TO` to the env files**

Append to `.env.local` (gitignored; the real value for local testing):

```
CAREERS_TO=Sanjula.Rajapaksha@ktdoctor.com
```

Append to `.env.local.example` (committed; document the var, no secret), under the contact block:

```
# Careers application delivery. Same SMTP transport as the contact form; only the
# recipient differs. Set to the recruiting inbox in production.
CAREERS_TO=Sanjula.Rajapaksha@ktdoctor.com
```

- [ ] **Step 7: Commit**

```bash
git add lib/mailer.ts lib/mailer.test.ts .env.local.example
git commit -m "feat(mailer): add sendApplicationMail routed to CAREERS_TO"
```

---

## Task 5: Application server action + body-size config

**Files:**
- Create: `app/[locale]/careers/actions.ts`
- Test: `app/[locale]/careers/actions.test.ts`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: `sendApplicationMail`/`MailAttachment` (Task 4), `validateApplication`/`validateCvFile`/`ApplicationFieldErrors`/`ApplicationValues` (Task 2), `positions` (Task 1), `escapeHtml` (Task 3).
- Produces:
  - `type ApplicationFormState = { status: "idle"|"success"|"error"; errorCode?: string; fieldErrors?: ApplicationFieldErrors; values?: ApplicationValues }`.
  - `sendJobApplication(prev: ApplicationFormState, formData: FormData): Promise<ApplicationFormState>`.

- [ ] **Step 1: Read the Next server-actions guide**

Run: open `node_modules/next/dist/docs/01-app/02-guides/server-actions.md` and skim the FormData / file-handling section. Confirm files arrive as `File` via `formData.get(...)`.

- [ ] **Step 2: Write the failing test**

Create `app/[locale]/careers/actions.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendApplicationMailMock = vi.fn();
vi.mock("@/lib/mailer", () => ({
  sendApplicationMail: (...args: unknown[]) => sendApplicationMailMock(...args),
}));

import { sendJobApplication, type ApplicationFormState } from "./actions";

const IDLE: ApplicationFormState = { status: "idle" };

function pdf(name = "cv.pdf", bytes = "PDF-BYTES"): File {
  return new File([bytes], name, { type: "application/pdf" });
}

function fd(fields: Record<string, string>, file: File | null = pdf()): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  if (file) form.append("cv", file);
  return form;
}

const VALID = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  position: "pediatrician",
  message: "Excited to apply.",
  company: "", // honeypot empty
};

beforeEach(() => sendApplicationMailMock.mockReset());

describe("sendJobApplication", () => {
  it("drops spam silently when the honeypot is filled", async () => {
    const state = await sendJobApplication(IDLE, fd({ ...VALID, company: "bot" }));
    expect(state.status).toBe("success");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("returns field errors and does not send when required fields are missing", async () => {
    const state = await sendJobApplication(
      IDLE,
      fd({ name: "", email: "", phone: "", position: "", message: "", company: "" })
    );
    expect(state.status).toBe("error");
    expect(state.fieldErrors).toMatchObject({ name: "nameRequired", email: "emailRequired" });
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("flags an invalid email", async () => {
    const state = await sendJobApplication(IDLE, fd({ ...VALID, email: "nope" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBe("emailInvalid");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("requires a CV", async () => {
    const state = await sendJobApplication(IDLE, fd(VALID, null));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.cv).toBe("cvRequired");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("rejects a CV that is too large", async () => {
    const big = pdf();
    Object.defineProperty(big, "size", { value: 6 * 1024 * 1024 });
    const state = await sendJobApplication(IDLE, fd(VALID, big));
    expect(state.fieldErrors?.cv).toBe("cvTooLarge");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("rejects a non-document file type", async () => {
    const png = new File(["x"], "photo.png", { type: "image/png" });
    const state = await sendJobApplication(IDLE, fd(VALID, png));
    expect(state.fieldErrors?.cv).toBe("cvType");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("sends a well-formed mail with the CV attached on valid input", async () => {
    sendApplicationMailMock.mockResolvedValueOnce(undefined);
    const state = await sendJobApplication(IDLE, fd(VALID));
    expect(state.status).toBe("success");
    const arg = sendApplicationMailMock.mock.calls[0][0];
    expect(arg.replyTo).toBe("jane@example.com");
    expect(arg.subject).toBe("[Careers] Application: Pediatrician (MD/DO)");
    expect(arg.text).toContain("Jane Doe");
    expect(arg.attachments[0].filename).toBe("cv.pdf");
    expect(Buffer.isBuffer(arg.attachments[0].content)).toBe(true);
  });

  it("escapes HTML in the applicant fields", async () => {
    sendApplicationMailMock.mockResolvedValueOnce(undefined);
    await sendJobApplication(IDLE, fd({ ...VALID, name: "<script>alert(1)</script>" }));
    const arg = sendApplicationMailMock.mock.calls[0][0];
    expect(arg.html).not.toContain("<script>");
    expect(arg.html).toContain("&lt;script&gt;");
  });

  it("returns sendFailed and preserves values when the mailer throws", async () => {
    sendApplicationMailMock.mockRejectedValueOnce(new Error("smtp down"));
    const state = await sendJobApplication(IDLE, fd(VALID));
    expect(state.status).toBe("error");
    expect(state.errorCode).toBe("sendFailed");
    expect(state.values?.name).toBe("Jane Doe");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- "app/[locale]/careers/actions.test.ts"`
Expected: FAIL (module not found).

- [ ] **Step 4: Write minimal implementation**

Create `app/[locale]/careers/actions.ts`:

```ts
"use server";

import { sendApplicationMail } from "@/lib/mailer";
import { escapeHtml } from "@/lib/escapeHtml";
import {
  validateApplication,
  validateCvFile,
  type ApplicationFieldErrors,
  type ApplicationValues,
} from "@/lib/careersSchema";
import { positions } from "@/data/careers";

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  errorCode?: string;
  fieldErrors?: ApplicationFieldErrors;
  values?: ApplicationValues;
};

export async function sendJobApplication(
  _prev: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const raw: ApplicationValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    position: String(formData.get("position") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real users never fill the hidden `company` field. Drop silently
  // so bots get a success and don't retry.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const cv = formData.get("cv");
  const cvFile = cv instanceof File ? cv : null;

  const result = validateApplication(raw);
  const fieldErrors: ApplicationFieldErrors = result.success ? {} : { ...result.fieldErrors };
  const cvError = validateCvFile(cvFile);
  if (cvError) fieldErrors.cv = cvError;

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values: raw };
  }

  const d = (result as { success: true; data: ApplicationValues }).data;
  const phone = d.phone || "Not provided";
  const positionTitle = positions.find((p) => p.id === d.position)?.title || "General / other";
  const message = d.message || "Not provided";

  try {
    const buffer = Buffer.from(await (cvFile as File).arrayBuffer());
    await sendApplicationMail({
      replyTo: d.email,
      subject: `[Careers] Application: ${positionTitle}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nPosition: ${positionTitle}\n\n${message}`,
      html: `<h2>New job application</h2>
<p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(d.email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
<p><strong>Position:</strong> ${escapeHtml(positionTitle)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      attachments: [
        {
          filename: (cvFile as File).name,
          content: buffer,
          contentType: (cvFile as File).type || undefined,
        },
      ],
    });
    return { status: "success" };
  } catch (error) {
    // Log server-side only; never leak transport details to the client.
    console.error("Careers application send failed:", error);
    return { status: "error", errorCode: "sendFailed", values: raw };
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- "app/[locale]/careers/actions.test.ts"`
Expected: PASS.

- [ ] **Step 6: Raise the server-action body-size limit**

Edit `next.config.ts` to add `experimental.serverActions.bodySizeLimit` (keep the existing `turbopackFileSystemCacheForDev` and `images` config):

```ts
  experimental: {
    turbopackFileSystemCacheForDev: false,
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
```

- [ ] **Step 7: Verify the build accepts the config**

Run: `npm run build`
Expected: build completes (no config validation error). If time-constrained, defer to Task 10's build.

- [ ] **Step 8: Commit**

```bash
git add "app/[locale]/careers/actions.ts" "app/[locale]/careers/actions.test.ts" next.config.ts
git commit -m "feat(careers): add job application server action + 6mb upload limit"
```

---

## Task 6: Careers i18n messages

**Files:**
- Modify: `messages/en.json` (`Careers` namespace)
- Modify: `messages/es.json` (`Careers` namespace)

No dedicated unit test; correctness is verified by the component tests in Tasks 8-9, which read these keys. `Seo.careers` is left unchanged.

- [ ] **Step 1: Replace the `Careers` block in `messages/en.json`**

```json
  "Careers": {
    "eyebrow": "Careers",
    "heroHeading": "Build Your Career at Kids & Teens",
    "heroSubhead": "Join LA's largest pediatric network. 18+ years of excellence, 25+ clinics, and a team that puts families first.",
    "heroCtaPositions": "View Open Positions",
    "heroCtaApply": "Apply Now",
    "perk1": "Competitive salary & benefits",
    "perk2": "Flexible scheduling",
    "perk3": "25+ locations across LA",
    "perk4": "Supportive team culture",
    "benefitsHeading": "Benefits that support your life",
    "benefitsIntro": "We invest in the people who care for our families.",
    "benefit1Title": "401(k) with profit sharing",
    "benefit1Body": "Plan for the future with a retirement match and profit sharing.",
    "benefit2Title": "Health & dependent care",
    "benefit2Body": "Medical, dental, and vision coverage for you and your dependents.",
    "benefit3Title": "Generous paid time off",
    "benefit3Body": "Recharge with generous PTO and paid holidays.",
    "benefit4Title": "Continuing education",
    "benefit4Body": "Grow with support for licensure, CME, and professional development.",
    "positionsHeading": "Open Positions ({count})",
    "filterLabel": "Filter by department",
    "deptAll": "All Departments",
    "deptClinical": "Clinical",
    "deptClinicalSupport": "Clinical Support",
    "deptAdministration": "Administration",
    "deptOperations": "Operations",
    "deptTherapy": "Therapy",
    "deptFinance": "Finance",
    "typeFullTime": "Full-time",
    "typePartTime": "Part-time",
    "typeFullPartTime": "Full-time / Part-time",
    "applyLabel": "Apply",
    "noOpenings": "No openings in this department right now. Check back soon.",
    "cultureHeading": "More than a workplace",
    "cultureBody": "For 18+ years we have grown a team built on compassion, teamwork, innovation, and personalized care. When you join Kids & Teens, you join people who show up for each other and for every family we serve.",
    "formEyebrow": "Apply",
    "formHeading": "Apply to join our team",
    "formIntro": "Tell us a bit about you and attach your CV. We'll be in touch if there's a fit.",
    "emailDirect": "Prefer to email us directly?",
    "requiredNote": "Fields marked * are required.",
    "nameLabel": "Full name",
    "namePlaceholder": "Jane Doe",
    "emailLabel": "Email",
    "emailPlaceholder": "you@email.com",
    "phoneLabel": "Phone",
    "phonePlaceholder": "(555) 123-4567",
    "positionLabel": "Position",
    "positionDefault": "General / other",
    "messageLabel": "Message",
    "messagePlaceholder": "Tell us why you'd be a great fit…",
    "cvLabel": "Upload your CV",
    "cvHint": "PDF, DOC, or DOCX. Max 5 MB.",
    "submit": "Submit application",
    "submitting": "Submitting…",
    "successTitle": "Application received!",
    "successBody": "Thanks for applying. We'll review your CV and reach out if there's a fit.",
    "sendAnother": "Submit another application",
    "privacyNote": "By submitting, you agree to be contacted about your application. Please don't include sensitive medical details.",
    "heroImageAlt": "Kids & Teens care team members smiling together in a clinic",
    "benefitsImageAlt": "A pediatric clinician talking with a colleague",
    "cultureImageAlt": "Members of the Kids & Teens team collaborating",
    "postingsNotice": "Our official job postings are only shared on our social media pages, our own company websites, and Indeed. Be cautious of postings claiming to represent Kids & Teens Medical Group anywhere else.",
    "errors": {
      "nameRequired": "Please enter your name.",
      "emailRequired": "Please enter your email.",
      "emailInvalid": "Please enter a valid email address.",
      "tooLong": "This value is too long.",
      "cvRequired": "Please attach your CV.",
      "cvType": "Please upload a PDF, DOC, or DOCX file.",
      "cvTooLarge": "Your file is too large. Please keep it under 5 MB.",
      "sendFailed": "We couldn't submit your application right now. Please email your CV to us directly."
    }
  }
```

- [ ] **Step 2: Replace the `Careers` block in `messages/es.json`**

```json
  "Careers": {
    "eyebrow": "Empleo",
    "heroHeading": "Desarrolle su carrera en Kids & Teens",
    "heroSubhead": "Únase a la red pediátrica más grande de LA. Más de 18 años de excelencia, más de 25 clínicas y un equipo que prioriza a las familias.",
    "heroCtaPositions": "Ver puestos disponibles",
    "heroCtaApply": "Postúlese ahora",
    "perk1": "Salario y beneficios competitivos",
    "perk2": "Horario flexible",
    "perk3": "Más de 25 ubicaciones en LA",
    "perk4": "Cultura de equipo solidaria",
    "benefitsHeading": "Beneficios que apoyan su vida",
    "benefitsIntro": "Invertimos en las personas que cuidan a nuestras familias.",
    "benefit1Title": "401(k) con participación en las ganancias",
    "benefit1Body": "Planifique su futuro con aportes de jubilación y participación en las ganancias.",
    "benefit2Title": "Salud y cuidado de dependientes",
    "benefit2Body": "Cobertura médica, dental y de visión para usted y sus dependientes.",
    "benefit3Title": "Tiempo libre pagado generoso",
    "benefit3Body": "Recárguese con generoso tiempo libre pagado y días festivos.",
    "benefit4Title": "Educación continua",
    "benefit4Body": "Crezca con apoyo para licencias, CME y desarrollo profesional.",
    "positionsHeading": "Puestos disponibles ({count})",
    "filterLabel": "Filtrar por departamento",
    "deptAll": "Todos los departamentos",
    "deptClinical": "Clínico",
    "deptClinicalSupport": "Apoyo clínico",
    "deptAdministration": "Administración",
    "deptOperations": "Operaciones",
    "deptTherapy": "Terapia",
    "deptFinance": "Finanzas",
    "typeFullTime": "Tiempo completo",
    "typePartTime": "Medio tiempo",
    "typeFullPartTime": "Tiempo completo / Medio tiempo",
    "applyLabel": "Postularse",
    "noOpenings": "No hay vacantes en este departamento por ahora. Vuelva pronto.",
    "cultureHeading": "Más que un lugar de trabajo",
    "cultureBody": "Durante más de 18 años hemos formado un equipo basado en la compasión, el trabajo en equipo, la innovación y la atención personalizada. Al unirse a Kids & Teens, se une a personas que se apoyan mutuamente y a cada familia que atendemos.",
    "formEyebrow": "Postúlese",
    "formHeading": "Postúlese para unirse a nuestro equipo",
    "formIntro": "Cuéntenos un poco sobre usted y adjunte su currículum. Nos pondremos en contacto si hay una buena opción.",
    "emailDirect": "¿Prefiere enviarnos un correo directamente?",
    "requiredNote": "Los campos marcados con * son obligatorios.",
    "nameLabel": "Nombre completo",
    "namePlaceholder": "Juana Pérez",
    "emailLabel": "Correo electrónico",
    "emailPlaceholder": "usted@correo.com",
    "phoneLabel": "Teléfono",
    "phonePlaceholder": "(555) 123-4567",
    "positionLabel": "Puesto",
    "positionDefault": "General / otro",
    "messageLabel": "Mensaje",
    "messagePlaceholder": "Cuéntenos por qué sería una buena opción…",
    "cvLabel": "Suba su currículum",
    "cvHint": "PDF, DOC o DOCX. Máximo 5 MB.",
    "submit": "Enviar postulación",
    "submitting": "Enviando…",
    "successTitle": "¡Postulación recibida!",
    "successBody": "Gracias por postularse. Revisaremos su currículum y nos comunicaremos si hay una buena opción.",
    "sendAnother": "Enviar otra postulación",
    "privacyNote": "Al enviar, acepta que lo contactemos sobre su postulación. Por favor no incluya datos médicos sensibles.",
    "heroImageAlt": "Miembros del equipo de Kids & Teens sonriendo juntos en una clínica",
    "benefitsImageAlt": "Una clínica pediátrica conversando con un colega",
    "cultureImageAlt": "Miembros del equipo de Kids & Teens colaborando",
    "postingsNotice": "Nuestras ofertas de empleo oficiales solo se comparten en nuestras redes sociales, nuestros propios sitios web y en Indeed. Tenga cuidado con las publicaciones que afirmen representar a Kids & Teens Medical Group en cualquier otro lugar.",
    "errors": {
      "nameRequired": "Por favor ingrese su nombre.",
      "emailRequired": "Por favor ingrese su correo electrónico.",
      "emailInvalid": "Por favor ingrese un correo electrónico válido.",
      "tooLong": "Este valor es demasiado largo.",
      "cvRequired": "Por favor adjunte su currículum.",
      "cvType": "Por favor suba un archivo PDF, DOC o DOCX.",
      "cvTooLarge": "Su archivo es demasiado grande. Por favor manténgalo por debajo de 5 MB.",
      "sendFailed": "No pudimos enviar su postulación en este momento. Por favor envíenos su currículum directamente por correo."
    }
  }
```

- [ ] **Step 3: Verify both files still parse as JSON**

Run: `node -e "require('./messages/en.json'); require('./messages/es.json'); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/es.json
git commit -m "feat(careers): add careers i18n copy (en + es)"
```

---

## Task 7: Careers images (self-hosted)

**Files:**
- Create: `public/careers/hero.jpg`, `public/careers/benefits.jpg`, `public/careers/culture.jpg`
- Create: `public/careers/SOURCES.md`

No unit test; verification is valid-JPEG + the contact-sheet review.

- [ ] **Step 1: Pick photos**

For each image, web-search Unsplash for a warm, professional, on-theme concept and capture its direct `https://images.unsplash.com/photo-<id>` URL:
- `hero` — a diverse pediatric care team / clinicians smiling together.
- `benefits` — a clinician in a bright, friendly clinic setting.
- `culture` — team members collaborating warmly.

Prefer horizontal photos (these render in wide/landscape frames).

- [ ] **Step 2: Download to `public/careers/`**

For each, run (PowerShell), substituting the chosen photo id:

```powershell
New-Item -ItemType Directory -Force public/careers | Out-Null
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-<HERO_ID>?w=1600&h=1000&fit=crop&q=80&auto=format" -OutFile "public/careers/hero.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-<BENEFITS_ID>?w=1200&h=900&fit=crop&q=80&auto=format" -OutFile "public/careers/benefits.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-<CULTURE_ID>?w=1200&h=900&fit=crop&q=80&auto=format" -OutFile "public/careers/culture.jpg"
```

- [ ] **Step 3: Verify each file is a valid non-empty JPEG**

Run (Git Bash):

```bash
for f in public/careers/hero.jpg public/careers/benefits.jpg public/careers/culture.jpg; do
  printf '%s ' "$f"; head -c 3 "$f" | od -An -tx1
done
```

Expected: each prints `ff d8 ff` (JPEG magic) and files are non-zero.

- [ ] **Step 4: Record provenance**

Create `public/careers/SOURCES.md` listing each file and its source Unsplash URL/photographer. (Unsplash's license permits free commercial use without attribution; the manifest is hygiene for a real business site.)

- [ ] **Step 5: Publish a contact-sheet artifact for approval**

Build a small self-contained HTML page embedding the three images with labels (hero / benefits / culture), publish it with the Artifact tool, and ask the user to approve or request swaps. Swapping is just overwriting the file. Do not proceed to final sign-off until approved; the build is not blocked in the meantime.

- [ ] **Step 6: Commit**

```bash
git add public/careers
git commit -m "feat(careers): add self-hosted careers imagery"
```

---

## Task 8: Job application form component

**Files:**
- Create: `components/JobApplicationForm.tsx`
- Test: `components/JobApplicationForm.test.tsx`

**Interfaces:**
- Consumes: `sendJobApplication`/`ApplicationFormState` (Task 5); `validateApplication`/`validateCvFile`/`CV_ACCEPT`/`ApplicationFieldErrors`/`ApplicationValues` (Task 2); `positions` (Task 1); `Careers` messages (Task 6).
- Produces: `function JobApplicationForm(props: { positionId: string; onPositionChange: (id: string) => void }): JSX.Element`. Renders a `<form>` with fields `name`, `email`, `phone`, `position` (controlled `<select>`, value=`positionId`), `message`, `cv` (file), a hidden honeypot `company`, and a submit button. The `position` select's first option is `positionDefault` with value `""`.

- [ ] **Step 1: Write the failing test**

Create `components/JobApplicationForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import type { ApplicationFormState } from "@/app/[locale]/careers/actions";

const actionMock =
  vi.fn<(prev: ApplicationFormState, formData: FormData) => Promise<ApplicationFormState>>();

vi.mock("@/app/[locale]/careers/actions", () => ({
  sendJobApplication: (prev: ApplicationFormState, formData: FormData) => actionMock(prev, formData),
}));

import { JobApplicationForm } from "./JobApplicationForm";

function Harness() {
  return <JobApplicationForm positionId="" onPositionChange={() => {}} />;
}

beforeEach(() => actionMock.mockReset());
afterEach(() => vi.useRealTimers());

describe("JobApplicationForm", () => {
  it("renders name, email, position, and CV fields", () => {
    render(<Harness />);
    expect(screen.getByRole("textbox", { name: /full name/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeRequired();
    expect(screen.getByRole("combobox", { name: /position/i })).toBeInTheDocument();
    // File input has no textbox role; find by label text.
    expect(screen.getByLabelText(/upload your cv/i)).toBeInTheDocument();
  });

  it("includes a hidden honeypot field", () => {
    const { container } = render(<Harness />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).not.toBeVisible();
  });

  it("blocks submit and shows an error when the CV is missing", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /submit application/i }));
    expect(await screen.findByText(/please attach your cv/i)).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("blocks submit on an invalid email", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "bad");
    await user.upload(
      screen.getByLabelText(/upload your cv/i),
      new File(["x"], "cv.pdf", { type: "application/pdf" })
    );
    await user.click(screen.getByRole("button", { name: /submit application/i }));
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("shows the success panel after a successful submission", async () => {
    actionMock.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.upload(
      screen.getByLabelText(/upload your cv/i),
      new File(["x"], "cv.pdf", { type: "application/pdf" })
    );
    await user.click(screen.getByRole("button", { name: /submit application/i }));
    expect(await screen.findByText(/application received/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- components/JobApplicationForm.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

Create `components/JobApplicationForm.tsx`:

```tsx
"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  sendJobApplication,
  type ApplicationFormState,
} from "@/app/[locale]/careers/actions";
import {
  validateApplication,
  validateCvFile,
  CV_ACCEPT,
  type ApplicationFieldErrors,
  type ApplicationValues,
} from "@/lib/careersSchema";
import { positions } from "@/data/careers";

const INITIAL_STATE: ApplicationFormState = { status: "idle" };
const SUCCESS_RESET_MS = 6000;

type FieldName = keyof ApplicationFieldErrors;

const fieldClass =
  "w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200";
const labelClass = "block font-display text-xs font-semibold text-ink";
const errorClass = "mt-1 text-xs font-medium text-red-600";

type Props = {
  positionId: string;
  onPositionChange: (id: string) => void;
};

export function JobApplicationForm({ positionId, onPositionChange }: Props) {
  const t = useTranslations("Careers");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendJobApplication, INITIAL_STATE);
  const [dismissedState, setDismissedState] = useState<ApplicationFormState | null>(null);
  const [clientErrors, setClientErrors] = useState<ApplicationFieldErrors>({});

  const showSuccess = state.status === "success" && dismissedState !== state;

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setDismissedState(state), SUCCESS_RESET_MS);
    return () => clearTimeout(timer);
  }, [showSuccess, state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const raw: ApplicationValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      position: String(data.get("position") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const textResult = validateApplication(raw);
    const errs: ApplicationFieldErrors = textResult.success ? {} : { ...textResult.fieldErrors };
    const cvValue = data.get("cv");
    const cvError = validateCvFile(cvValue instanceof File ? cvValue : null);
    if (cvError) errs.cv = cvError;
    if (Object.keys(errs).length > 0) {
      event.preventDefault();
      setClientErrors(errs);
    } else {
      setClientErrors({});
    }
  }

  function clearFieldError(field: FieldName) {
    setClientErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  if (showSuccess) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-2xl border border-teal/30 bg-teal-tint/40 p-10 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-ink">{t("successTitle")}</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setDismissedState(state)}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-teal px-6 py-3 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const values = state.values;
  const fieldErrors: ApplicationFieldErrors = { ...state.fieldErrors, ...clientErrors };

  function errorFor(field: FieldName) {
    const code = fieldErrors[field];
    if (!code) return null;
    return (
      <p id={`careers-${field}-error`} className={errorClass}>
        {t(`errors.${code}`)}
      </p>
    );
  }

  function ariaProps(field: FieldName) {
    return fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `careers-${field}-error` }
      : {};
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-xs text-ink-soft">{t("requiredNote")}</p>

      <div aria-hidden style={{ display: "none" }} className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="careers-name" className={labelClass}>
          {t("nameLabel")} *
        </label>
        <input
          id="careers-name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={values?.name}
          placeholder={t("namePlaceholder")}
          onChange={() => clearFieldError("name")}
          className={`${fieldClass} mt-1`}
          {...ariaProps("name")}
        />
        {errorFor("name")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="careers-email" className={labelClass}>
            {t("emailLabel")} *
          </label>
          <input
            id="careers-email"
            name="email"
            type="email"
            required
            maxLength={200}
            defaultValue={values?.email}
            placeholder={t("emailPlaceholder")}
            onChange={() => clearFieldError("email")}
            className={`${fieldClass} mt-1`}
            {...ariaProps("email")}
          />
          {errorFor("email")}
        </div>
        <div>
          <label htmlFor="careers-phone" className={labelClass}>
            {t("phoneLabel")}
          </label>
          <input
            id="careers-phone"
            name="phone"
            type="tel"
            maxLength={40}
            defaultValue={values?.phone}
            placeholder={t("phonePlaceholder")}
            onChange={() => clearFieldError("phone")}
            className={`${fieldClass} mt-1`}
            {...ariaProps("phone")}
          />
          {errorFor("phone")}
        </div>
      </div>

      <div>
        <label htmlFor="careers-position" className={labelClass}>
          {t("positionLabel")}
        </label>
        <select
          id="careers-position"
          name="position"
          value={positionId}
          onChange={(e) => onPositionChange(e.target.value)}
          className={`${fieldClass} mt-1`}
        >
          <option value="">{t("positionDefault")}</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {locale === "es" ? p.titleEs : p.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="careers-message" className={labelClass}>
          {t("messageLabel")}
        </label>
        <textarea
          id="careers-message"
          name="message"
          maxLength={2000}
          rows={4}
          defaultValue={values?.message}
          placeholder={t("messagePlaceholder")}
          onChange={() => clearFieldError("message")}
          className={`${fieldClass} mt-1 resize-y`}
          {...ariaProps("message")}
        />
        {errorFor("message")}
      </div>

      <div>
        <label htmlFor="careers-cv" className={labelClass}>
          {t("cvLabel")} *
        </label>
        <input
          id="careers-cv"
          name="cv"
          type="file"
          required
          accept={CV_ACCEPT}
          onChange={() => clearFieldError("cv")}
          className={`${fieldClass} mt-1 file:mr-3 file:rounded-full file:border-0 file:bg-teal-tint file:px-4 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-teal-dark`}
          {...ariaProps("cv")}
        />
        <p className="mt-1 text-xs text-ink-soft/80">{t("cvHint")}</p>
        {errorFor("cv")}
      </div>

      {state.status === "error" && state.errorCode && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t(`errors.${state.errorCode}`)}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? t("submitting") : t("submit")}
      </button>

      <p className="text-xs text-ink-soft/80">{t("privacyNote")}</p>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- components/JobApplicationForm.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/JobApplicationForm.tsx components/JobApplicationForm.test.tsx
git commit -m "feat(careers): add job application form component"
```

---

## Task 9: Rewrite CareersPageContent

**Files:**
- Modify: `lib/constants.ts` (add `CAREERS_EMAIL`)
- Modify: `components/CareersPageContent.tsx` (full rewrite)
- Test: `components/CareersPageContent.test.tsx` (full rewrite)

**Interfaces:**
- Consumes: `positions`/`DEPARTMENTS`/`Department`/`EmploymentType` (Task 1); `JobApplicationForm` (Task 8); `Careers` messages (Task 6); `CAREERS_EMAIL` from `@/lib/constants`; `Reveal` from `@/components/Reveal`; `next/image`.
- Produces: `function CareersPageContent(): JSX.Element` (default page body). No props. Adds `export const CAREERS_EMAIL = "Amanda.Desilva@ktdoctor.com"` to `lib/constants.ts`.

- [ ] **Step 1: Add the display-email constant**

Append to `lib/constants.ts`:

```ts
// Display-only careers contact address shown on the careers page. This is a UI
// label; actual application delivery is controlled by the CAREERS_TO env var
// (see lib/mailer.ts) and may differ.
export const CAREERS_EMAIL = "Amanda.Desilva@ktdoctor.com";
```

- [ ] **Step 2: Write the failing test**

Replace the contents of `components/CareersPageContent.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersPageContent } from "./CareersPageContent";
import { positions } from "@/data/careers";

describe("CareersPageContent", () => {
  it("renders the English hero heading", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Build Your Career at Kids & Teens"
    );
  });

  it("renders the Spanish hero heading when locale is es", () => {
    render(<CareersPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Desarrolle su carrera en Kids & Teens"
    );
  });

  it("lists every open position by default", () => {
    render(<CareersPageContent />);
    for (const p of positions) {
      expect(screen.getByRole("heading", { name: p.title })).toBeInTheDocument();
    }
  });

  it("filters positions by department", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    await user.selectOptions(screen.getByRole("combobox", { name: /filter by department/i }), "Finance");
    // Billing Specialist is Finance; Pediatrician is Clinical.
    expect(screen.getByRole("heading", { name: "Billing Specialist" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pediatrician (MD/DO)" })).not.toBeInTheDocument();
  });

  it("pre-selects the position in the form when a role's Apply is clicked", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const card = screen.getByRole("heading", { name: "Pediatrician (MD/DO)" }).closest("article")!;
    await user.click(within(card).getByRole("button", { name: /apply/i }));
    expect(screen.getByRole("combobox", { name: /position/i })).toHaveValue("pediatrician");
  });

  it("keeps the anti-scam postings notice", () => {
    render(<CareersPageContent />);
    expect(screen.getByText(/official job postings are only shared/i)).toBeInTheDocument();
  });

  it("shows the displayed careers email as a mailto link", () => {
    render(<CareersPageContent />);
    const link = screen.getByRole("link", { name: /amanda\.desilva@ktdoctor\.com/i });
    expect(link).toHaveAttribute("href", "mailto:Amanda.Desilva@ktdoctor.com");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: FAIL (old component renders old copy; new assertions fail).

- [ ] **Step 4: Write minimal implementation**

Replace the contents of `components/CareersPageContent.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { CAREERS_EMAIL } from "@/lib/constants";
import {
  positions,
  DEPARTMENTS,
  type Department,
  type EmploymentType,
} from "@/data/careers";

const DEPT_KEY: Record<Department, string> = {
  Clinical: "deptClinical",
  "Clinical Support": "deptClinicalSupport",
  Administration: "deptAdministration",
  Operations: "deptOperations",
  Therapy: "deptTherapy",
  Finance: "deptFinance",
};

const TYPE_KEY: Record<EmploymentType, string> = {
  "Full-time": "typeFullTime",
  "Part-time": "typePartTime",
  "Full-time / Part-time": "typeFullPartTime",
};

const PERKS = ["perk1", "perk2", "perk3", "perk4"] as const;
const BENEFITS = [
  ["benefit1Title", "benefit1Body"],
  ["benefit2Title", "benefit2Body"],
  ["benefit3Title", "benefit3Body"],
  ["benefit4Title", "benefit4Body"],
] as const;

export function CareersPageContent() {
  const t = useTranslations("Careers");
  const locale = useLocale();
  const [department, setDepartment] = useState<"all" | Department>("all");
  const [selectedPositionId, setSelectedPositionId] = useState("");

  const shown = positions.filter((p) => department === "all" || p.department === department);

  function applyTo(id: string) {
    setSelectedPositionId(id);
    if (typeof document !== "undefined") {
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Image
          src="/careers/hero.jpg"
          alt={t("heroImageAlt")}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-tint">
            {t("eyebrow")}
          </span>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("heroHeading")}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{t("heroSubhead")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#positions"
              className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              {t("heroCtaPositions")}
            </a>
            <a
              href="#apply"
              className="rounded-full border border-white/40 px-7 py-3.5 text-center font-display font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("heroCtaApply")}
            </a>
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="bg-ivory-deep">
        <div className="mx-auto grid max-w-5xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {PERKS.map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
                  <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-display text-sm font-semibold text-ink">{t(key)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("benefitsHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{t("benefitsIntro")}</p>
        </Reveal>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(([title, body], i) => (
              <Reveal key={title} delayMs={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-ink">{t(title)}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{t(body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delayMs={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/careers/benefits.jpg"
                alt={t("benefitsImageAlt")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Open positions */}
      <section id="positions" className="bg-ivory-deep">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {t("positionsHeading", { count: positions.length })}
            </h2>
            <label className="flex items-center gap-2">
              <span className="sr-only">{t("filterLabel")}</span>
              <select
                aria-label={t("filterLabel")}
                value={department}
                onChange={(e) => setDepartment(e.target.value as "all" | Department)}
                className="rounded-full border border-border bg-surface px-4 py-2 font-display text-sm font-semibold text-ink shadow-card focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint"
              >
                <option value="all">{t("deptAll")}</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {t(DEPT_KEY[d])}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {shown.length === 0 && <p className="text-ink-soft">{t("noOpenings")}</p>}
            {shown.map((p, i) => (
              <Reveal key={p.id} delayMs={Math.min(i, 6) * 40}>
                <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {locale === "es" ? p.titleEs : p.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                      <span>{p.locations}</span>
                      <span aria-hidden>·</span>
                      <span>{t(TYPE_KEY[p.employmentType])}</span>
                      <span className="rounded-full bg-teal-tint px-2.5 py-0.5 font-display font-semibold text-teal-dark">
                        {t(DEPT_KEY[p.department])}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-ink-soft">
                      {locale === "es" ? p.summaryEs : p.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyTo(p.id)}
                    className="shrink-0 rounded-full bg-teal px-6 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
                  >
                    {t("applyLabel")}
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
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
          </Reveal>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-ivory-deep">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("formEyebrow")}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("formHeading")}
          </h2>
          <p className="mt-2 text-ink-soft">{t("formIntro")}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {t("emailDirect")}{" "}
            <a
              href={`mailto:${CAREERS_EMAIL}`}
              className="font-display font-semibold text-teal-dark underline underline-offset-2"
            >
              {CAREERS_EMAIL}
            </a>
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-card">
            <JobApplicationForm
              positionId={selectedPositionId}
              onPositionChange={setSelectedPositionId}
            />
          </div>
        </div>
      </section>

      {/* Anti-scam notice */}
      <section className="mx-auto max-w-4xl px-5 pb-14 sm:px-8">
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm text-ink-soft shadow-card">
          {t("postingsNotice")}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- components/CareersPageContent.test.tsx`
Expected: PASS.

- [ ] **Step 6: Verify the existing page test still passes**

Run: `npm run test -- "app/[locale]/careers/page.test.tsx"`
Expected: PASS ("renders without crashing").

- [ ] **Step 7: Commit**

```bash
git add lib/constants.ts components/CareersPageContent.tsx components/CareersPageContent.test.tsx
git commit -m "feat(careers): rewrite careers page with positions, filter, culture, and apply form"
```

---

## Task 10: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass (new careers tests + all existing tests, including contact and mailer).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds, `/careers` compiles, no type errors, no server-action config error.

- [ ] **Step 4: Manual smoke check (dev server)**

Run: `npm run dev`, open `/en/careers` and `/es/careers`. Confirm: hero image + copy render; perks strip; benefits; positions list with working department filter; clicking a role's Apply scrolls to the form and pre-selects that position; the file input accepts a PDF; submitting with SMTP env set delivers an email with the CV attached (or shows the friendly error if SMTP is not configured locally). Confirm the anti-scam notice is present.

- [ ] **Step 5: Final commit (if any lint/format fixups were needed)**

```bash
git add -A
git commit -m "chore(careers): final verification fixups"
```

---

## Self-Review

**Spec coverage:**
- Hero with image → Task 6 (copy/alt), Task 7 (image), Task 9 (render). ✓
- Perks strip → Tasks 6, 9. ✓
- Benefits section → Tasks 6, 9. ✓
- Filterable positions + department filter → Tasks 1, 6, 9. ✓
- Culture band with image → Tasks 6, 7, 9. ✓
- Application form + CV upload → Tasks 2 (schema/file validation), 5 (action), 8 (form), 9 (mount). ✓
- CV emailed as attachment via nodemailer to `CAREERS_TO` (testing = Sanjula) → Tasks 4, 5. ✓
- Displayed careers email (`CAREERS_EMAIL` = Amanda.Desilva) as a mailto link, separate from delivery → Tasks 6, 9. ✓
- bodySizeLimit raised → Task 5. ✓
- Anti-scam notice retained → Tasks 6, 9. ✓
- Bilingual EN/ES → Task 6 messages + `*Es` data fields (Task 1). ✓
- Images self-hosted + SOURCES.md + contact-sheet approval → Task 7. ✓
- No em dash → Task 1 test enforces for data; copy authored without em dash. ✓
- Tests + build green → Task 10. ✓

**Placeholder scan:** Image photo ids in Task 7 are intentionally chosen at implementation time via Unsplash search (real procedure, not a code placeholder); every code step contains complete code.

**Type consistency:** `ApplicationValues`/`ApplicationFieldErrors` (Task 2) are used identically in Tasks 5, 8. `sendJobApplication`/`ApplicationFormState` (Task 5) consumed in Task 8. `positions`/`DEPARTMENTS`/`Department`/`EmploymentType` (Task 1) consumed in Tasks 5, 8, 9. `sendApplicationMail`/`MailAttachment` (Task 4) consumed in Task 5. `escapeHtml` (Task 3) consumed in Task 5. `validateCvFile` shape matches `File` in both Task 5 (server) and Task 8 (client). Message keys authored in Task 6 match every `t("...")` call in Tasks 8-9 (perks `perk1..4`, benefits `benefit{1..4}{Title,Body}`, dept/type keys via `DEPT_KEY`/`TYPE_KEY`, form keys, `postingsNotice`, `errors.*`). ✓
