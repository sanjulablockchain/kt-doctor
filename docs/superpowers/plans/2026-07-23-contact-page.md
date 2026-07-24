# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a localized `/contact` page with a message form that emails submissions to a configurable inbox via the practice's Microsoft 365 mailbox over SMTP.

**Architecture:** Thin `page.tsx` (metadata) renders a client `ContactPageContent` (hero + info rail + form). The form is a `"use client"` island using React 19 `useActionState`; on submit it calls a `"use server"` action that validates with zod, then sends via a Nodemailer SMTP helper. All email routing is env-driven; no database.

**Tech Stack:** Next.js 16.2.10 (App Router, Server Actions), React 19, next-intl 4, Tailwind 4, Nodemailer (SMTP), zod (validation), Vitest + Testing Library.

## Global Constraints

- **Read before code:** per `AGENTS.md`, this Next.js differs from training data — the Server Action + `useActionState` pattern in this plan is taken from `node_modules/next/dist/docs/01-app/02-guides/forms.md`. Do not substitute a Route Handler + `fetch`.
- **Node/deps:** package manager is **npm** (package-lock.json). New deps: `nodemailer`, `zod`, dev `@types/nodemailer`.
- **i18n:** every user-facing string comes from `messages/en.json` + `messages/es.json` under a new `Contact` namespace (plus `Seo.contact`). Both locales must stay key-for-key identical. Locales: `en` (default, no prefix), `es`.
- **Brand tokens only:** use existing Tailwind tokens (`teal`, `teal-dark`, `teal-tint`, `ink`, `ink-soft`, `ivory`, `ivory-deep`, `surface`, `border`, `navy`, `gold`, `gold-tint`), `font-display`, and the `Reveal` component — no new colors.
- **Contact data:** reuse `MAIN_PHONE`, `TEXT_PHONE`, `TEXT_PHONE_ES`, `GENERAL_EMAIL` from `lib/constants.ts`. Never hardcode phone/email.
- **Secrets:** real SMTP values live only in `.env.local` (gitignored by `.env*`). `.env.local.example` carries documented placeholders only.
- **Email routing is env-driven:** sender (`SMTP_USER`/`CONTACT_FROM`) and receiver (`CONTACT_TO`) are changeable later with no code edit. On Microsoft 365 the `From` must equal the authenticated mailbox; the visitor's address goes in `Reply-To`.
- **Commits optional:** the user prefers build+test without committing on a dirty tree. Commit steps below are marked optional — batch or skip at the user's discretion. Never commit `.env.local`.
- **Test command:** `npm test` (runs `vitest run`). Type check: `npx tsc --noEmit`. Lint: `npm run lint`.

---

## File Structure

| File | Responsibility |
|---|---|
| `.env.local.example` (modify) | Document SMTP + contact env keys. |
| `lib/mailer.ts` (create) | `sendContactMail()` — builds Nodemailer SMTP transport from env, sends the message to the configured inbox. |
| `lib/mailer.test.ts` (create) | Unit tests for the mailer (nodemailer mocked). |
| `app/[locale]/contact/actions.ts` (create) | `"use server"` `sendContactMessage()` — honeypot, zod validation, compose + send. Exports `ContactFormState` type. |
| `app/[locale]/contact/actions.test.ts` (create) | Unit tests for the action (mailer mocked). |
| `components/ContactForm.tsx` (create) | `"use client"` form island with `useActionState`; pending/success/error UI; honeypot. |
| `components/ContactForm.test.tsx` (create) | Component tests (action mocked). |
| `components/ContactPageContent.tsx` (create) | `"use client"` layout: hero, info rail (call/text/email cards, hours, emergency notice), form slot. |
| `components/ContactPageContent.test.tsx` (create) | Renders hero, cards, hours, emergency; constants shown. |
| `app/[locale]/contact/page.tsx` (create) | `generateMetadata` + renders `<ContactPageContent />`. |
| `app/[locale]/contact/page.test.tsx` (create) | Renders without crashing. |
| `messages/en.json`, `messages/es.json` (modify) | Add `Contact` namespace, `Seo.contact`, `Header.contact`, `Footer.contact`. |
| `components/Header.tsx` (modify) | Add "Contact" link in the "More" dropdown. |
| `components/Footer.tsx` (modify) | Add "Contact" to `quickLinks`. |
| `app/sitemap.ts` (modify) | Add `/contact` to `STATIC_PATHS`. |

---

## Task 1: Add dependencies and env template

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.local.example`

**Interfaces:**
- Produces: the `nodemailer` and `zod` runtime modules and `@types/nodemailer` types used by all later tasks; the documented env-var names.

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install nodemailer zod
npm install -D @types/nodemailer
```
Expected: `package.json` gains `nodemailer` + `zod` under dependencies and `@types/nodemailer` under devDependencies; no install errors.

- [ ] **Step 2: Append SMTP + contact keys to `.env.local.example`**

Append these lines to the existing `.env.local.example` (keep the current Google Maps block above):

```dotenv

# ─────────────────────────────────────────────────────────────────────────────
# Contact form email delivery (Microsoft 365 SMTP via Nodemailer).
# Copy this file to `.env.local` and fill in SMTP_PASS. `.env.local` is gitignored.
#
# On Microsoft 365, CONTACT_FROM/SMTP_USER must be the SAME authenticated mailbox;
# the visitor's address is used as Reply-To. Change CONTACT_TO / the mailbox later
# with no code change. If sends fail with an auth error, your tenant likely has
# "Authenticated SMTP" disabled — enable it for the mailbox (M365 admin center →
# Users → mailbox → Mail → Manage email apps → Authenticated SMTP), and use an
# App Password if 2FA is on the account.
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=Sanjula.Rajapaksha@ktdoctor.com
SMTP_PASS=
CONTACT_TO=Sanjula.Rajapaksha@ktdoctor.com
CONTACT_FROM=Sanjula.Rajapaksha@ktdoctor.com
```

- [ ] **Step 3: Verify deps resolve**

Run:
```bash
node -e "require('nodemailer'); require('zod'); console.log('ok')"
```
Expected: prints `ok`.

- [ ] **Step 4 (optional): Commit**

```bash
git add package.json package-lock.json .env.local.example
git commit -m "chore: add nodemailer + zod and contact env template"
```

---

## Task 2: SMTP mailer helper (`lib/mailer.ts`)

**Files:**
- Create: `lib/mailer.ts`
- Test: `lib/mailer.test.ts`

**Interfaces:**
- Consumes: `nodemailer` from Task 1.
- Produces:
  - `type ContactMail = { replyTo: string; subject: string; text: string; html: string }`
  - `async function sendContactMail(mail: ContactMail): Promise<void>` — reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM` from `process.env`; throws `Error("Missing required env var: <NAME>")` if any required one is empty; otherwise calls `transport.sendMail`.

- [ ] **Step 1: Write the failing test**

Create `lib/mailer.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));

vi.mock("nodemailer", () => ({
  default: { createTransport: createTransportMock },
}));

const ENV = {
  SMTP_HOST: "smtp.office365.com",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "box@ktdoctor.com",
  SMTP_PASS: "secret",
  CONTACT_TO: "to@ktdoctor.com",
  CONTACT_FROM: "from@ktdoctor.com",
};

beforeEach(() => {
  sendMailMock.mockReset();
  createTransportMock.mockClear();
  for (const [k, v] of Object.entries(ENV)) process.env[k] = v;
});

afterEach(() => {
  for (const k of Object.keys(ENV)) delete process.env[k];
});

describe("sendContactMail", () => {
  it("builds an SMTP transport from env and sends with configured to/from", async () => {
    const { sendContactMail } = await import("./mailer");
    await sendContactMail({
      replyTo: "visitor@example.com",
      subject: "[Website Contact] Hi",
      text: "hello",
      html: "<p>hello</p>",
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: { user: "box@ktdoctor.com", pass: "secret" },
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: "from@ktdoctor.com",
      to: "to@ktdoctor.com",
      replyTo: "visitor@example.com",
      subject: "[Website Contact] Hi",
      text: "hello",
      html: "<p>hello</p>",
    });
  });

  it("throws a clear error when a required env var is missing", async () => {
    delete process.env.SMTP_PASS;
    const { sendContactMail } = await import("./mailer");
    await expect(
      sendContactMail({ replyTo: "v@e.com", subject: "s", text: "t", html: "<p>t</p>" })
    ).rejects.toThrow("Missing required env var: SMTP_PASS");
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/mailer.test.ts`
Expected: FAIL — cannot resolve `./mailer` (module not created yet).

- [ ] **Step 3: Write the implementation**

Create `lib/mailer.ts`:
```ts
import nodemailer from "nodemailer";

export type ContactMail = {
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Sends a contact-form message to the configured inbox over SMTP. All routing
// is env-driven so the sending mailbox and recipient can change with no code
// edit. On Microsoft 365 `from` must be the authenticated mailbox, so the
// visitor's address is carried in `replyTo` instead.
export async function sendContactMail(mail: ContactMail): Promise<void> {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const to = requireEnv("CONTACT_TO");
  const from = requireEnv("CONTACT_FROM");
  const secure = process.env.SMTP_SECURE === "true";

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transport.sendMail({
    from,
    to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/mailer.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5 (optional): Commit**

```bash
git add lib/mailer.ts lib/mailer.test.ts
git commit -m "feat: add SMTP contact mailer helper"
```

---

## Task 3: Contact server action (`app/[locale]/contact/actions.ts`)

**Files:**
- Create: `app/[locale]/contact/actions.ts`
- Test: `app/[locale]/contact/actions.test.ts`

**Interfaces:**
- Consumes: `sendContactMail` + `ContactMail` from `@/lib/mailer` (Task 2); `zod`.
- Produces:
  - `type ContactFieldErrors = Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>`
  - `type ContactFormState = { status: "idle" | "success" | "error"; errorCode?: string; fieldErrors?: ContactFieldErrors; values?: { name: string; email: string; phone: string; subject: string; message: string } }`
  - `async function sendContactMessage(prev: ContactFormState, formData: FormData): Promise<ContactFormState>`
  - Field-error message strings are i18n **sub-keys** under `Contact.errors`: `nameRequired`, `emailRequired`, `emailInvalid`, `subjectRequired`, `messageRequired`, `tooLong`. Send failure uses `errorCode: "sendFailed"`. The client renders these via `t(\`errors.\${code}\`)`.
  - Honeypot field name is `company`; when non-empty the action returns `{ status: "success" }` **without** sending.

- [ ] **Step 1: Write the failing test**

Create `app/[locale]/contact/actions.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendContactMailMock = vi.fn();
vi.mock("@/lib/mailer", () => ({
  sendContactMail: (...args: unknown[]) => sendContactMailMock(...args),
}));

import { sendContactMessage, type ContactFormState } from "./actions";

const IDLE: ContactFormState = { status: "idle" };

function fd(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  return form;
}

const VALID = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  subject: "Appointment inquiry",
  message: "Hello, I'd like to book a visit.",
  company: "", // honeypot empty
};

beforeEach(() => sendContactMailMock.mockReset());

describe("sendContactMessage", () => {
  it("drops spam silently when the honeypot is filled", async () => {
    const state = await sendContactMessage(IDLE, fd({ ...VALID, company: "bot" }));
    expect(state.status).toBe("success");
    expect(sendContactMailMock).not.toHaveBeenCalled();
  });

  it("returns field errors and does not send when required fields are missing", async () => {
    const state = await sendContactMessage(
      IDLE,
      fd({ name: "", email: "", phone: "", subject: "", message: "", company: "" })
    );
    expect(state.status).toBe("error");
    expect(state.fieldErrors).toMatchObject({
      name: "nameRequired",
      email: "emailRequired",
      subject: "subjectRequired",
      message: "messageRequired",
    });
    expect(sendContactMailMock).not.toHaveBeenCalled();
  });

  it("flags an invalid email address", async () => {
    const state = await sendContactMessage(IDLE, fd({ ...VALID, email: "not-an-email" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBe("emailInvalid");
    expect(sendContactMailMock).not.toHaveBeenCalled();
  });

  it("sends a well-formed mail on valid input and reports success", async () => {
    sendContactMailMock.mockResolvedValueOnce(undefined);
    const state = await sendContactMessage(IDLE, fd(VALID));
    expect(state.status).toBe("success");
    expect(sendContactMailMock).toHaveBeenCalledTimes(1);
    const arg = sendContactMailMock.mock.calls[0][0];
    expect(arg.replyTo).toBe("jane@example.com");
    expect(arg.subject).toBe("[Website Contact] Appointment inquiry");
    expect(arg.text).toContain("Jane Doe");
    expect(arg.text).toContain("Hello, I'd like to book a visit.");
    expect(arg.html).toContain("Jane Doe");
  });

  it("escapes HTML in the message body", async () => {
    sendContactMailMock.mockResolvedValueOnce(undefined);
    await sendContactMessage(IDLE, fd({ ...VALID, message: "<script>alert(1)</script>" }));
    const arg = sendContactMailMock.mock.calls[0][0];
    expect(arg.html).not.toContain("<script>");
    expect(arg.html).toContain("&lt;script&gt;");
  });

  it("returns a sendFailed error and preserves values when the mailer throws", async () => {
    sendContactMailMock.mockRejectedValueOnce(new Error("smtp down"));
    const state = await sendContactMessage(IDLE, fd(VALID));
    expect(state.status).toBe("error");
    expect(state.errorCode).toBe("sendFailed");
    expect(state.values?.name).toBe("Jane Doe");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/[locale]/contact/actions.test.ts`
Expected: FAIL — cannot resolve `./actions`.

- [ ] **Step 3: Write the implementation**

Create `app/[locale]/contact/actions.ts`:
```ts
"use server";

import { z } from "zod";
import { sendContactMail } from "@/lib/mailer";

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "subject" | "message", string>
>;

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errorCode?: string;
  fieldErrors?: ContactFieldErrors;
  values?: ContactValues;
};

// Error strings are i18n sub-keys under `Contact.errors`; the client renders
// them with t(`errors.${code}`). Keep them in sync with messages/*.json.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const schema = z.object({
  name: z.string().trim().min(1, { message: "nameRequired" }).max(100, { message: "tooLong" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "emailRequired" })
    .max(200, { message: "tooLong" })
    .regex(EMAIL_RE, { message: "emailInvalid" }),
  phone: z.string().trim().max(40, { message: "tooLong" }),
  subject: z.string().trim().min(1, { message: "subjectRequired" }).max(150, { message: "tooLong" }),
  message: z.string().trim().min(1, { message: "messageRequired" }).max(5000, { message: "tooLong" }),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real users never fill the hidden `company` field. Drop silently
  // so bots get a success and don't retry.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFieldErrors | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors, values: raw };
  }

  const d = parsed.data;
  const phone = d.phone || "—";
  try {
    await sendContactMail({
      replyTo: d.email,
      subject: `[Website Contact] ${d.subject}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nSubject: ${d.subject}\n\n${d.message}`,
      html: `<h2>New website contact message</h2>
<p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(d.email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
<p><strong>Subject:</strong> ${escapeHtml(d.subject)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(d.message).replace(/\n/g, "<br>")}</p>`,
    });
    return { status: "success" };
  } catch (error) {
    // Log server-side only; never leak transport details to the client.
    console.error("Contact form send failed:", error);
    return { status: "error", errorCode: "sendFailed", values: raw };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/[locale]/contact/actions.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5 (optional): Commit**

```bash
git add "app/[locale]/contact/actions.ts" "app/[locale]/contact/actions.test.ts"
git commit -m "feat: add contact form server action with validation"
```

---

## Task 4: i18n messages

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`

**Interfaces:**
- Produces: `Contact` namespace (used by Tasks 5–6), `Seo.contact` (Task 7), `Header.contact` (Task 8), `Footer.contact` (Task 8). Keys must be identical across both locale files.

- [ ] **Step 1: Add the `Contact` namespace to `messages/en.json`**

Add this top-level key (place it just before the `"Seo"` object):
```json
  "Contact": {
    "eyebrow": "We reply within one business day",
    "heading": "We're here for your family — how can we help?",
    "intro": "Questions about appointments, insurance, records, or billing? Reach out and a member of our care team will get back to you. For a same-day visit, calling is fastest.",
    "callTitle": "Call the front desk",
    "callHelper": "Fastest for same-day & urgent needs",
    "textTitle": "Text us",
    "textHelper": "Quick questions & reminders",
    "emailTitle": "Email",
    "emailHelper": "Non-urgent inquiries",
    "hoursTitle": "Office Hours",
    "hoursWeekdays": "Mon – Fri",
    "hoursWeekdaysTime": "8:00 AM – 6:00 PM",
    "hoursSaturday": "Saturday",
    "hoursSaturdayTime": "9:00 AM – 2:00 PM",
    "hoursSunday": "Sunday",
    "hoursSundayTime": "Telehealth only",
    "hoursNote": "Hours vary by clinic across our {count} Greater LA locations.",
    "hoursLink": "Find your clinic",
    "emergencyTitle": "Medical emergency?",
    "emergencyBody": "Call 911 or go to your nearest emergency room. This form is not monitored for urgent care.",
    "formTitle": "Send us a message",
    "requiredNote": "Fields marked * are required.",
    "nameLabel": "Full name",
    "namePlaceholder": "Jane Doe",
    "emailLabel": "Email",
    "emailPlaceholder": "you@email.com",
    "phoneLabel": "Phone",
    "phonePlaceholder": "(555) 123-4567",
    "subjectLabel": "Subject",
    "subjectPlaceholder": "Appointment inquiry",
    "messageLabel": "Message",
    "messagePlaceholder": "Tell us how we can help your family…",
    "submit": "Send message",
    "submitting": "Sending…",
    "successTitle": "Thank you!",
    "successBody": "Your message has been sent — we'll reply within one business day.",
    "privacyNote": "By submitting, you agree to be contacted about your inquiry. Please don't include sensitive medical details.",
    "errors": {
      "nameRequired": "Please enter your name.",
      "emailRequired": "Please enter your email.",
      "emailInvalid": "Please enter a valid email address.",
      "subjectRequired": "Please enter a subject.",
      "messageRequired": "Please enter a message.",
      "tooLong": "This value is too long.",
      "sendFailed": "We couldn't send your message right now. Please call or email us directly."
    }
  },
```

- [ ] **Step 2: Add the `Contact` namespace to `messages/es.json`**

Add the matching Spanish block (same position, before `"Seo"`):
```json
  "Contact": {
    "eyebrow": "Respondemos en un día hábil",
    "heading": "Estamos aquí para su familia: ¿cómo podemos ayudar?",
    "intro": "¿Preguntas sobre citas, seguros, expedientes o facturación? Comuníquese con nosotros y un miembro de nuestro equipo de atención le responderá. Para una visita el mismo día, lo más rápido es llamar.",
    "callTitle": "Llame a recepción",
    "callHelper": "Lo más rápido para el mismo día y urgencias",
    "textTitle": "Envíenos un mensaje de texto",
    "textHelper": "Preguntas rápidas y recordatorios",
    "emailTitle": "Correo electrónico",
    "emailHelper": "Consultas no urgentes",
    "hoursTitle": "Horario de atención",
    "hoursWeekdays": "Lun – Vie",
    "hoursWeekdaysTime": "8:00 AM – 6:00 PM",
    "hoursSaturday": "Sábado",
    "hoursSaturdayTime": "9:00 AM – 2:00 PM",
    "hoursSunday": "Domingo",
    "hoursSundayTime": "Solo telesalud",
    "hoursNote": "El horario varía según la clínica en nuestras {count} ubicaciones del área de Los Ángeles.",
    "hoursLink": "Encuentre su clínica",
    "emergencyTitle": "¿Emergencia médica?",
    "emergencyBody": "Llame al 911 o acuda a la sala de emergencias más cercana. Este formulario no se supervisa para atención urgente.",
    "formTitle": "Envíenos un mensaje",
    "requiredNote": "Los campos marcados con * son obligatorios.",
    "nameLabel": "Nombre completo",
    "namePlaceholder": "Juana Pérez",
    "emailLabel": "Correo electrónico",
    "emailPlaceholder": "usted@correo.com",
    "phoneLabel": "Teléfono",
    "phonePlaceholder": "(555) 123-4567",
    "subjectLabel": "Asunto",
    "subjectPlaceholder": "Consulta sobre citas",
    "messageLabel": "Mensaje",
    "messagePlaceholder": "Cuéntenos cómo podemos ayudar a su familia…",
    "submit": "Enviar mensaje",
    "submitting": "Enviando…",
    "successTitle": "¡Gracias!",
    "successBody": "Su mensaje ha sido enviado; le responderemos en un día hábil.",
    "privacyNote": "Al enviar, acepta ser contactado sobre su consulta. Por favor no incluya información médica confidencial.",
    "errors": {
      "nameRequired": "Por favor ingrese su nombre.",
      "emailRequired": "Por favor ingrese su correo electrónico.",
      "emailInvalid": "Por favor ingrese un correo electrónico válido.",
      "subjectRequired": "Por favor ingrese un asunto.",
      "messageRequired": "Por favor ingrese un mensaje.",
      "tooLong": "Este valor es demasiado largo.",
      "sendFailed": "No pudimos enviar su mensaje en este momento. Por favor llámenos o escríbanos directamente."
    }
  },
```

- [ ] **Step 3: Add `Seo.contact` to both files**

In `messages/en.json`, inside the `"Seo"` object, add:
```json
    "contact": {
      "title": "Contact Us",
      "description": "Get in touch with Kids & Teens Medical Group. Call, text, or send us a message about appointments, insurance, records, or billing across our Greater LA clinics."
    },
```
In `messages/es.json`, inside `"Seo"`, add:
```json
    "contact": {
      "title": "Contáctenos",
      "description": "Comuníquese con Kids & Teens Medical Group. Llame, envíe un mensaje o escríbanos sobre citas, seguros, expedientes o facturación en nuestras clínicas del área de Los Ángeles."
    },
```

- [ ] **Step 4: Add `Header.contact` and `Footer.contact` to both files**

`messages/en.json` → `Header`: add `"contact": "Contact"`. `Footer`: add `"contact": "Contact"`.
`messages/es.json` → `Header`: add `"contact": "Contacto"`. `Footer`: add `"contact": "Contacto"`.

- [ ] **Step 5: Verify both files are valid JSON with matching keys**

Run:
```bash
node -e "const en=require('./messages/en.json'),es=require('./messages/es.json');const ek=Object.keys(en.Contact).sort(),sk=Object.keys(es.Contact).sort();if(JSON.stringify(ek)!==JSON.stringify(sk))throw new Error('Contact keys differ');if(!en.Seo.contact||!es.Seo.contact)throw new Error('Seo.contact missing');if(!en.Header.contact||!en.Footer.contact)throw new Error('Header/Footer contact missing');console.log('i18n ok')"
```
Expected: prints `i18n ok`.

- [ ] **Step 6: Run the full test suite (no regression)**

Run: `npm test`
Expected: all existing tests still PASS.

- [ ] **Step 7 (optional): Commit**

```bash
git add messages/en.json messages/es.json
git commit -m "feat: add Contact + Seo.contact i18n messages"
```

---

## Task 5: Contact form island (`components/ContactForm.tsx`)

**Files:**
- Create: `components/ContactForm.tsx`
- Test: `components/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `sendContactMessage`, `ContactFormState` from `@/app/[locale]/contact/actions` (Task 3); `Contact` messages (Task 4); React `useActionState`; `next-intl` `useTranslations`.
- Produces: `function ContactForm()` — default-exported? No: named export `ContactForm`, rendered by `ContactPageContent` (Task 6).

- [ ] **Step 1: Write the failing test**

Create `components/ContactForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import type { ContactFormState } from "@/app/[locale]/contact/actions";

const actionMock =
  vi.fn<(prev: ContactFormState, formData: FormData) => Promise<ContactFormState>>();

vi.mock("@/app/[locale]/contact/actions", () => ({
  sendContactMessage: (prev: ContactFormState, formData: FormData) => actionMock(prev, formData),
}));

import { ContactForm } from "./ContactForm";

beforeEach(() => actionMock.mockReset());

describe("ContactForm", () => {
  it("renders all required fields", () => {
    render(<ContactForm />);
    expect(screen.getByRole("textbox", { name: /full name/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /subject/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeRequired();
    // Phone is optional
    expect(screen.getByRole("textbox", { name: /phone/i })).not.toBeRequired();
  });

  it("includes a hidden honeypot field that is not visible to users", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).not.toBeVisible();
  });

  it("shows the success panel after a successful submission", async () => {
    actionMock.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/your message has been sent/i)).toBeInTheDocument();
  });

  it("shows a send error message and keeps the form when the action fails", async () => {
    actionMock.mockResolvedValueOnce({ status: "error", errorCode: "sendFailed" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/couldn't send your message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders a field error returned by the action", async () => {
    actionMock.mockResolvedValueOnce({
      status: "error",
      fieldErrors: { email: "emailInvalid" },
      values: { name: "Jane", email: "bad", phone: "", subject: "Hi", message: "Hello there" },
    });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "bad");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ContactForm.test.tsx`
Expected: FAIL — cannot resolve `./ContactForm`.

- [ ] **Step 3: Write the implementation**

Create `components/ContactForm.tsx`:
```tsx
"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  sendContactMessage,
  type ContactFormState,
} from "@/app/[locale]/contact/actions";

const INITIAL_STATE: ContactFormState = { status: "idle" };

const fieldClass =
  "w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint";
const labelClass = "block font-display text-xs font-semibold text-ink";
const errorClass = "mt-1 text-xs font-medium text-red-600";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_STATE);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center rounded-2xl border border-teal/30 bg-teal-tint/40 p-10 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-ink">{t("successTitle")}</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">{t("successBody")}</p>
      </div>
    );
  }

  const values = state.values;
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold text-ink">{t("formTitle")}</h2>
      <p className="text-xs text-ink-soft">{t("requiredNote")}</p>

      {/* Honeypot: hidden from humans; bots that fill it are dropped server-side. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" >
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t("nameLabel")} *
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={values?.name}
          placeholder={t("namePlaceholder")}
          className={`${fieldClass} mt-1`}
        />
        {fieldErrors.name && <p className={errorClass}>{t(`errors.${fieldErrors.name}`)}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t("emailLabel")} *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            defaultValue={values?.email}
            placeholder={t("emailPlaceholder")}
            className={`${fieldClass} mt-1`}
          />
          {fieldErrors.email && <p className={errorClass}>{t(`errors.${fieldErrors.email}`)}</p>}
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {t("phoneLabel")}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={40}
            defaultValue={values?.phone}
            placeholder={t("phonePlaceholder")}
            className={`${fieldClass} mt-1`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          {t("subjectLabel")} *
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={150}
          defaultValue={values?.subject}
          placeholder={t("subjectPlaceholder")}
          className={`${fieldClass} mt-1`}
        />
        {fieldErrors.subject && <p className={errorClass}>{t(`errors.${fieldErrors.subject}`)}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t("messageLabel")} *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          defaultValue={values?.message}
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} mt-1 resize-y`}
        />
        {fieldErrors.message && <p className={errorClass}>{t(`errors.${fieldErrors.message}`)}</p>}
      </div>

      {state.status === "error" && state.errorCode && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t(`errors.${state.errorCode}`)}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? t("submitting") : t("submit")}
      </button>

      <p className="text-xs text-ink-soft/80">{t("privacyNote")}</p>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/ContactForm.test.tsx`
Expected: PASS (5 tests). If the success/error submit tests are flaky under jsdom's form-action dispatch, confirm the button is `type="submit"` inside the `<form action={formAction}>` — that is what drives `useActionState`.

- [ ] **Step 5 (optional): Commit**

```bash
git add components/ContactForm.tsx components/ContactForm.test.tsx
git commit -m "feat: add contact form island with useActionState"
```

---

## Task 6: Contact page content (`components/ContactPageContent.tsx`)

**Files:**
- Create: `components/ContactPageContent.tsx`
- Test: `components/ContactPageContent.test.tsx`

**Interfaces:**
- Consumes: `ContactForm` (Task 5); `Contact` messages (Task 4); `MAIN_PHONE`, `TEXT_PHONE`, `GENERAL_EMAIL` from `@/lib/constants`; `locations` from `@/data/locations` (for the `{count}` in `hoursNote`); `Link` from `@/i18n/navigation`; `Reveal`.
- Produces: `function ContactPageContent()` (named export), rendered by the page (Task 7). Renders a single `<main>`.

- [ ] **Step 1: Write the failing test**

Create `components/ContactPageContent.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ContactPageContent } from "./ContactPageContent";
import { MAIN_PHONE, TEXT_PHONE, GENERAL_EMAIL } from "@/lib/constants";

describe("ContactPageContent", () => {
  it("renders the hero heading", () => {
    render(<ContactPageContent />);
    expect(
      screen.getByRole("heading", { level: 1, name: /how can we help/i })
    ).toBeInTheDocument();
  });

  it("shows the practice contact channels from constants", () => {
    render(<ContactPageContent />);
    expect(screen.getByText(MAIN_PHONE)).toBeInTheDocument();
    expect(screen.getByText(TEXT_PHONE)).toBeInTheDocument();
    expect(screen.getByText(GENERAL_EMAIL)).toBeInTheDocument();
  });

  it("renders office hours and the emergency notice", () => {
    render(<ContactPageContent />);
    expect(screen.getByText(/office hours/i)).toBeInTheDocument();
    expect(screen.getByText(/telehealth only/i)).toBeInTheDocument();
    expect(screen.getByText(/medical emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/911/)).toBeInTheDocument();
  });

  it("renders the message form", () => {
    render(<ContactPageContent />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ContactPageContent.test.tsx`
Expected: FAIL — cannot resolve `./ContactPageContent`.

- [ ] **Step 3: Write the implementation**

Create `components/ContactPageContent.tsx`:
```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { locations } from "@/data/locations";
import { MAIN_PHONE, TEXT_PHONE, GENERAL_EMAIL } from "@/lib/constants";

function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

const cardClass =
  "flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-teal/40";
const chipClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark";

export function ContactPageContent() {
  const t = useTranslations("Contact");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-tint px-3 py-1 font-display text-xs font-semibold text-teal-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          {t("eyebrow")}
        </span>
        <h1 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="mt-3 max-w-2xl text-ink-soft">{t("intro")}</p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Left rail: channels, hours, emergency */}
        <Reveal className="flex flex-col gap-4">
          <a href={`tel:${toE164(MAIN_PHONE)}`} className={cardClass}>
            <span aria-hidden className={chipClass}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t("callTitle")}
              </span>
              <span className="block font-display text-lg font-bold text-ink">{MAIN_PHONE}</span>
              <span className="block text-xs text-ink-soft">{t("callHelper")}</span>
            </span>
          </a>

          <a href={`sms:${toE164(TEXT_PHONE)}`} className={cardClass}>
            <span aria-hidden className={chipClass}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4.06A2.5 2.5 0 0 1 4 13.5v-8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t("textTitle")}
              </span>
              <span className="block font-display text-lg font-bold text-ink">{TEXT_PHONE}</span>
              <span className="block text-xs text-ink-soft">{t("textHelper")}</span>
            </span>
          </a>

          <a href={`mailto:${GENERAL_EMAIL}`} className={cardClass}>
            <span aria-hidden className={chipClass}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m4.5 6.5 7.5 6 7.5-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t("emailTitle")}
              </span>
              <span className="block break-all font-display text-base font-bold text-ink">
                {GENERAL_EMAIL}
              </span>
              <span className="block text-xs text-ink-soft">{t("emailHelper")}</span>
            </span>
          </a>

          {/* Office hours */}
          <div className="rounded-2xl bg-navy p-5 text-ivory">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-teal-tint">
              {t("hoursTitle")}
            </h2>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ivory/80">{t("hoursWeekdays")}</dt>
                <dd className="font-semibold">{t("hoursWeekdaysTime")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ivory/80">{t("hoursSaturday")}</dt>
                <dd className="font-semibold">{t("hoursSaturdayTime")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ivory/80">{t("hoursSunday")}</dt>
                <dd className="font-semibold">{t("hoursSundayTime")}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs text-ivory/70">
              {t("hoursNote", { count: locations.length })}{" "}
              <Link href="/locations" className="font-semibold text-teal-tint hover:underline">
                {t("hoursLink")} →
              </Link>
            </p>
          </div>

          {/* Emergency notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <span aria-hidden className="mt-0.5 text-red-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-sm text-red-800">
              <strong className="font-semibold">{t("emergencyTitle")}</strong> {t("emergencyBody")}
            </p>
          </div>
        </Reveal>

        {/* Right: form */}
        <Reveal className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <ContactForm />
        </Reveal>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/ContactPageContent.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5 (optional): Commit**

```bash
git add components/ContactPageContent.tsx components/ContactPageContent.test.tsx
git commit -m "feat: add contact page content layout"
```

---

## Task 7: Contact route (`app/[locale]/contact/page.tsx`)

**Files:**
- Create: `app/[locale]/contact/page.tsx`
- Test: `app/[locale]/contact/page.test.tsx`

**Interfaces:**
- Consumes: `buildMetadata` from `@/lib/seo`; `getTranslations` from `next-intl/server`; `ContactPageContent` (Task 6); `Seo.contact` messages (Task 4).
- Produces: default-exported `ContactPage` component + `generateMetadata`.

- [ ] **Step 1: Write the failing test**

Create `app/[locale]/contact/page.test.tsx`:
```tsx
import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import ContactPage from "./page";

describe("ContactPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<ContactPage />);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/[locale]/contact/page.test.tsx`
Expected: FAIL — cannot resolve `./page`.

- [ ] **Step 3: Write the implementation**

Create `app/[locale]/contact/page.tsx` (mirrors `app/[locale]/about/page.tsx`):
```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ContactPageContent } from "@/components/ContactPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("contact.title"),
    description: t("contact.description"),
  });
}

export default function ContactPage() {
  return <ContactPageContent />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/[locale]/contact/page.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5 (optional): Commit**

```bash
git add "app/[locale]/contact/page.tsx" "app/[locale]/contact/page.test.tsx"
git commit -m "feat: add /contact route with metadata"
```

---

## Task 8: Navigation + sitemap integration

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `app/sitemap.ts`
- Test: `components/Header.test.tsx`, `components/Footer.test.tsx`, `app/sitemap.test.ts` (add assertions)

**Interfaces:**
- Consumes: `Header.contact` / `Footer.contact` messages (Task 4).

- [ ] **Step 1: Add a failing assertion to `app/sitemap.test.ts`**

Add inside the existing describe block:
```ts
  it("includes the /contact route", () => {
    const entries = sitemap();
    expect(entries.some((e) => e.url.endsWith("/contact"))).toBe(true);
  });
```
(If `sitemap` isn't imported in the test file yet, add `import sitemap from "./sitemap";` and `import { expect, it } from "vitest";` consistent with the file's existing imports.)

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- app/sitemap.test.ts`
Expected: FAIL — no entry ends with `/contact`.

- [ ] **Step 3: Add `/contact` to `app/sitemap.ts`**

In `STATIC_PATHS`, add `"/contact",` (keep alphabetical-ish order, e.g. after `"/careers"`):
```ts
const STATIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/doctors",
  "/foundation",
  "/insurance",
  "/locations",
  "/network",
  "/privacy-policy",
  "/resources",
  "/services",
  "/terms-and-conditions",
  "/testimonials",
];
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test -- app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the Contact link to the Header "More" dropdown**

In `components/Header.tsx`, inside the "More" dropdown grid (the `<div className={...grid grid-cols-2...}>` that holds the secondary `<Link>`s), add a Contact link alongside the others:
```tsx
              <Link href="/contact" onClick={() => setMoreOpen(false)} className={secondaryLinkClass}>
                {t("contact")}
              </Link>
```
Place it after the `testimonials` link. (`t` here is `useTranslations("Header")`, already in scope.)

- [ ] **Step 6: Add the Contact link to the Footer quick links**

In `components/Footer.tsx`, add to the `quickLinks` array (after `careers` / before `blog`):
```tsx
    { href: "/contact", label: t("contact") },
```
(`t` is `useTranslations("Footer")`, already in scope.)

- [ ] **Step 7: Add assertions to Header and Footer tests**

In `components/Header.test.tsx`, add a test that the Contact link is present. Follow the file's existing render/query conventions; example:
```tsx
  it("renders a Contact link", () => {
    render(<Header />);
    expect(screen.getAllByRole("link", { name: "Contact" }).length).toBeGreaterThan(0);
  });
```
In `components/Footer.test.tsx`, add:
```tsx
  it("renders a Contact quick link to /contact", () => {
    render(<Footer />);
    const link = screen.getAllByRole("link", { name: "Contact" })[0];
    expect(link).toHaveAttribute("href", "/contact");
  });
```
(Match the existing import style in each test file — `renderWithIntl`, `screen`. Adjust the query if the Header renders the label more than once across mobile/desktop markup; `getAllByRole(...)[0]` is safe.)

- [ ] **Step 8: Run the affected tests**

Run: `npm test -- components/Header.test.tsx components/Footer.test.tsx app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 9 (optional): Commit**

```bash
git add components/Header.tsx components/Footer.tsx app/sitemap.ts components/Header.test.tsx components/Footer.test.tsx app/sitemap.test.ts
git commit -m "feat: link /contact from header, footer, and sitemap"
```

---

## Task 9: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable only if pre-existing).

- [ ] **Step 3: Full test suite**

Run: `npm test`
Expected: all tests PASS, including the new contact tests.

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds; `/[locale]/contact` appears in the route output.

- [ ] **Step 5: Manual smoke test (requires real `.env.local`)**

1. Copy `.env.local.example` → `.env.local`, fill `SMTP_PASS` (and an App Password if 2FA is on).
2. Run `npm run dev`, open `http://localhost:3000/contact`.
3. Submit the form; confirm the success panel appears and an email arrives at `CONTACT_TO`.
4. If it fails with an auth error, enable Authenticated SMTP for the mailbox (see `.env.local.example` note).

- [ ] **Step 6 (optional): Final commit**

```bash
git commit -am "test: verify contact page build and suite"
```

---

## Self-Review

**Spec coverage:**
- Route + file layout → Tasks 6, 7. ✅
- Server Action + `useActionState` → Tasks 3, 5. ✅
- Nodemailer M365 SMTP, env-driven From/To/Reply-To → Tasks 1, 2. ✅
- Honeypot + zod validation → Task 3 (+ client `required`/`type=email` in Task 5). ✅
- Success/error/pending UX → Task 5. ✅
- en + es localization, `Seo.contact` → Task 4. ✅
- Header/Footer/sitemap wiring → Task 8. ✅
- Hero/cards/hours/emergency content → Tasks 4 (copy) + 6 (layout). ✅
- SMTP-AUTH caveat handled gracefully → Task 2 (`requireEnv` throws) + Task 3 (`catch` → `sendFailed`) + `.env.local.example` note (Task 1). ✅
- Test coverage matching repo convention → every task ships tests. ✅
- Non-goals (no DB, no CAPTCHA, no attachments, no auto-reply) → honored; none introduced. ✅

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✅

**Type consistency:** `ContactFormState`, `ContactFieldErrors`, `ContactValues`, `ContactMail`, `sendContactMessage`, `sendContactMail` names are used identically across Tasks 2/3/5. Error sub-keys (`nameRequired`, `emailRequired`, `emailInvalid`, `subjectRequired`, `messageRequired`, `tooLong`, `sendFailed`) match between the zod schema (Task 3), the messages (Task 4), and the client `t(\`errors.${code}\`)` calls (Task 5). Honeypot field name `company` matches between Task 3 and Task 5. ✅

**Note on ContactPageContent:** implemented as a `"use client"` component (matching `AboutPageContent` and the repo's other content components) rather than the spec's "server component" wording — a deliberate refinement for consistency and to keep the client form boundary simple. No functional impact; SEO metadata still comes from the server `page.tsx`.
