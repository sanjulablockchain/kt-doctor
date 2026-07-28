# Contact Email Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain-text contact-form notification email with a branded HTML template matching the existing careers-application email's visual style, sharing the markup between both via a new `lib/emailTemplate.ts`.

**Architecture:** Extract the careers email's header/card/footer/row/badge/message-block markup out of `app/[locale]/careers/actions.ts` into standalone functions in `lib/emailTemplate.ts`. `app/[locale]/contact/actions.ts` builds its HTML from those same functions. Both action files keep doing their own HTML-escaping before calling the template functions (unchanged contract).

**Tech Stack:** Plain TypeScript, inline-styled HTML strings (no JSX, no `<style>` blocks — required for email client compatibility, especially Outlook). Vitest for tests.

## Global Constraints

- All dynamic values passed into `lib/emailTemplate.ts` functions must already be HTML-escaped by the caller (via `lib/escapeHtml.ts`); the template functions do no escaping themselves, only layout.
- No `<style>` blocks or CSS classes in email HTML — inline `style="..."` attributes only, table-based layout, `Arial,Helvetica,sans-serif` font stack.
- Colors/spacing must match the existing careers email exactly: header `#0e8fa0`, page background `#f4f7fa`, borders `#dde3ea`, muted text `#56606e`, body text `#12181f`, badge background `#e4f5f6`, badge text `#0b6e7c`, card `border-radius:16px`.
- Eyebrow text in the header uses the `SITE_NAME` constant from `lib/constants.ts` (`Kids & Teens Medical Group`), HTML-escaped, not a hardcoded string.
- No i18n changes (this HTML is an internal staff notification, not site UI copy).
- No changes to `lib/constants.ts` values or env vars.
- Do not run a dev server or browser check to verify this (project testing policy: code review + typecheck/lint/unit tests only).

---

### Task 1: `lib/emailTemplate.ts` shared email building blocks

**Files:**
- Create: `lib/emailTemplate.ts`
- Test: `lib/emailTemplate.test.ts`

**Interfaces:**
- Consumes: `escapeHtml` from `lib/escapeHtml.ts` (only for escaping `SITE_NAME` internally), `SITE_NAME` from `lib/constants.ts`.
- Produces (used by Tasks 2 and 3):
  - `export type EmailRow = { label: string; valueHtml: string }`
  - `export function emailShell(options: { title: string; bodyHtml: string; footerText: string }): string`
  - `export function emailRowTable(rows: EmailRow[]): string`
  - `export function emailBadge(label: string, valueHtml: string): string`
  - `export function emailMessageBlock(label: string, html: string): string`
  - `export function mailtoLink(escapedEmail: string): string`
  - `export function telLink(escapedPhone: string): string`

- [ ] **Step 1: Write the failing tests**

Create `lib/emailTemplate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  emailShell,
  emailRowTable,
  emailBadge,
  emailMessageBlock,
  mailtoLink,
  telLink,
} from "./emailTemplate";

describe("emailShell", () => {
  it("includes the SITE_NAME eyebrow, title, body, and footer", () => {
    const html = emailShell({
      title: "New Website Contact Message",
      bodyHtml: "<p>BODY_MARKER</p>",
      footerText: "FOOTER_MARKER",
    });
    expect(html).toContain("Kids &amp; Teens Medical Group");
    expect(html).toContain("New Website Contact Message");
    expect(html).toContain("BODY_MARKER");
    expect(html).toContain("FOOTER_MARKER");
  });
});

describe("emailRowTable", () => {
  it("renders each row's label and value", () => {
    const html = emailRowTable([
      { label: "Name", valueHtml: "Jane Doe" },
      { label: "Email", valueHtml: "jane@example.com" },
    ]);
    expect(html).toContain("Name");
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Email");
    expect(html).toContain("jane@example.com");
  });

  it("renders an empty table body for an empty row list", () => {
    expect(() => emailRowTable([])).not.toThrow();
  });
});

describe("emailBadge", () => {
  it("renders the label and pill value", () => {
    const html = emailBadge("Applying for", "Pediatrician (MD/DO)");
    expect(html).toContain("Applying for");
    expect(html).toContain("Pediatrician (MD/DO)");
  });
});

describe("emailMessageBlock", () => {
  it("renders the label and message html", () => {
    const html = emailMessageBlock("Message", "Hello<br>world");
    expect(html).toContain("Message");
    expect(html).toContain("Hello<br>world");
  });
});

describe("mailtoLink", () => {
  it("wraps the escaped email in a mailto: link", () => {
    const html = mailtoLink("jane@example.com");
    expect(html).toContain('href="mailto:jane@example.com"');
    expect(html).toContain(">jane@example.com<");
  });
});

describe("telLink", () => {
  it("wraps the escaped phone display text in a tel: link with digits-only href", () => {
    const html = telLink("(555) 123-4567");
    expect(html).toContain('href="tel:5551234567"');
    expect(html).toContain(">(555) 123-4567<");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/emailTemplate.test.ts`
Expected: FAIL with "Cannot find module './emailTemplate'" (or similar — the file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `lib/emailTemplate.ts`:

```ts
import { escapeHtml } from "@/lib/escapeHtml";
import { SITE_NAME } from "@/lib/constants";

const FONT = "Arial,Helvetica,sans-serif";
const COLOR_TEAL = "#0e8fa0";
const COLOR_TEAL_DARK = "#0b6e7c";
const COLOR_TEAL_LIGHT = "#e4f5f6";
const COLOR_BG = "#f4f7fa";
const COLOR_BORDER = "#dde3ea";
const COLOR_TEXT_MUTED = "#56606e";
const COLOR_TEXT = "#12181f";

export type EmailRow = { label: string; valueHtml: string };

// Wraps an already-escaped value in a mailto:/tel: link. Callers must pass
// values through lib/escapeHtml.ts first; these functions only lay out markup.
export function mailtoLink(escapedEmail: string): string {
  return `<a href="mailto:${escapedEmail}" style="color:${COLOR_TEAL_DARK};text-decoration:none;">${escapedEmail}</a>`;
}

export function telLink(escapedPhone: string): string {
  const digits = escapedPhone.replace(/[^+\d]/g, "");
  return `<a href="tel:${digits}" style="color:${COLOR_TEAL_DARK};text-decoration:none;">${escapedPhone}</a>`;
}

function emailRow(label: string, valueHtml: string): string {
  return `
            <tr>
              <td style="padding:10px 0 0;width:90px;font-size:13px;color:${COLOR_TEXT_MUTED};vertical-align:top;font-family:${FONT};">${label}</td>
              <td style="padding:10px 0 0;font-size:14px;color:${COLOR_TEXT};font-family:${FONT};">${valueHtml}</td>
            </tr>`;
}

export function emailRowTable(rows: EmailRow[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid ${COLOR_BORDER};">${rows
    .map((r) => emailRow(r.label, r.valueHtml))
    .join("")}</table>`;
}

export function emailBadge(label: string, valueHtml: string): string {
  return `<p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${COLOR_TEXT_MUTED};font-family:${FONT};">${label}</p>
<p style="margin:6px 0 0;display:inline-block;background-color:${COLOR_TEAL_LIGHT};color:${COLOR_TEAL_DARK};font-size:14px;font-weight:700;padding:6px 14px;border-radius:999px;font-family:${FONT};">${valueHtml}</p>`;
}

export function emailMessageBlock(label: string, html: string): string {
  return `<div style="margin-top:20px;padding:16px 18px;background-color:${COLOR_BG};border-left:3px solid ${COLOR_TEAL};border-radius:0 10px 10px 0;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${COLOR_TEXT_MUTED};font-family:${FONT};">${label}</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:${COLOR_TEXT};font-family:${FONT};">${html}</p>
        </div>`;
}

export function emailShell(options: { title: string; bodyHtml: string; footerText: string }): string {
  const { title, bodyHtml, footerText } = options;
  return `<div style="background-color:${COLOR_BG};padding:32px 16px;font-family:${FONT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:16px;border:1px solid ${COLOR_BORDER};">
    <tr>
      <td style="background-color:${COLOR_TEAL};padding:24px 28px;border-radius:16px 16px 0 0;">
        <p style="margin:0;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;font-family:${FONT};">${escapeHtml(SITE_NAME)}</p>
        <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:700;font-family:${FONT};">${title}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        ${bodyHtml}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background-color:${COLOR_BG};border-top:1px solid ${COLOR_BORDER};border-radius:0 0 16px 16px;">
        <p style="margin:0;font-size:12px;color:${COLOR_TEXT_MUTED};font-family:${FONT};">${footerText}</p>
      </td>
    </tr>
  </table>
</div>`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/emailTemplate.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add lib/emailTemplate.ts lib/emailTemplate.test.ts
git commit -m "feat: add shared email template helpers for notification emails"
```

---

### Task 2: Redesign the contact notification email

**Files:**
- Modify: `app/[locale]/contact/actions.ts:1-62`
- Modify: `app/[locale]/contact/actions.test.ts` (add one assertion)

**Interfaces:**
- Consumes from Task 1: `emailShell`, `emailRowTable`, `emailMessageBlock`, `mailtoLink`, `telLink` (all from `@/lib/emailTemplate`).
- Produces: no exported change — `sendContactMessage`'s signature and `ContactFormState` type are unchanged; only the `html` body passed to `sendContactMail` changes.

- [ ] **Step 1: Write the failing test**

In `app/[locale]/contact/actions.test.ts`, extend the existing "sends a well-formed mail on valid input" test (around line 58-69) with a new assertion, and add a new test right after it:

```ts
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
    expect(arg.html).toContain('href="mailto:jane@example.com"');
  });

  it("renders the phone as a tel: link when provided, plain text when absent", async () => {
    sendContactMailMock.mockResolvedValueOnce(undefined);
    await sendContactMessage(IDLE, fd(VALID));
    const withPhone = sendContactMailMock.mock.calls[0][0];
    expect(withPhone.html).toContain('href="tel:5551234567"');

    sendContactMailMock.mockResolvedValueOnce(undefined);
    await sendContactMessage(IDLE, fd({ ...VALID, phone: "" }));
    const withoutPhone = sendContactMailMock.mock.calls[1][0];
    expect(withoutPhone.html).not.toContain("href=\"tel:");
    expect(withoutPhone.html).toContain("Not provided");
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/\[locale\]/contact/actions.test.ts`
Expected: FAIL on the new `mailto:`/`tel:` assertions (current HTML has no links).

- [ ] **Step 3: Write the implementation**

Replace the body of `app/[locale]/contact/actions.ts` (full file):

```ts
"use server";

import { sendContactMail } from "@/lib/mailer";
import {
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contactSchema";
import { escapeHtml } from "@/lib/escapeHtml";
import {
  emailShell,
  emailRowTable,
  emailMessageBlock,
  mailtoLink,
  telLink,
} from "@/lib/emailTemplate";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errorCode?: string;
  fieldErrors?: ContactFieldErrors;
  values?: ContactValues;
};

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

  const result = validateContact(raw);
  if (!result.success) {
    return { status: "error", fieldErrors: result.fieldErrors, values: raw };
  }

  const d = result.data;
  const phoneProvided = Boolean(d.phone);
  const phone = d.phone || "Not provided";
  const escapedPhone = escapeHtml(phone);

  try {
    await sendContactMail({
      replyTo: d.email,
      subject: `[Website Contact] ${d.subject}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nSubject: ${d.subject}\n\n${d.message}`,
      html: emailShell({
        title: "New Website Contact Message",
        bodyHtml:
          emailRowTable([
            {
              label: "Name",
              valueHtml: `<span style="font-weight:600;">${escapeHtml(d.name)}</span>`,
            },
            { label: "Email", valueHtml: mailtoLink(escapeHtml(d.email)) },
            {
              label: "Phone",
              valueHtml: phoneProvided ? telLink(escapedPhone) : escapedPhone,
            },
            { label: "Subject", valueHtml: escapeHtml(d.subject) },
          ]) +
          emailMessageBlock("Message", escapeHtml(d.message).replace(/\n/g, "<br>")),
        footerText: "Submitted via the Contact page at ktdoctor.com.",
      }),
    });
    return { status: "success" };
  } catch (error) {
    // Log server-side only; never leak transport details to the client.
    console.error("Contact form send failed:", error);
    return { status: "error", errorCode: "sendFailed", values: raw };
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/\[locale\]/contact/actions.test.ts`
Expected: PASS (all tests green, including the two new/modified assertions).

- [ ] **Step 5: Commit**

```bash
git add app/\[locale\]/contact/actions.ts app/\[locale\]/contact/actions.test.ts
git commit -m "feat: redesign contact notification email with branded HTML template"
```

---

### Task 3: Refactor the careers email onto the shared template

**Files:**
- Modify: `app/[locale]/careers/actions.ts:1-71` (the `buildApplicationEmailHtml` function and its call site)

**Interfaces:**
- Consumes from Task 1: `emailShell`, `emailRowTable`, `emailBadge`, `emailMessageBlock`, `mailtoLink`, `telLink` (all from `@/lib/emailTemplate`).
- Produces: `buildApplicationEmailHtml` keeps its exact current signature — `(fields: { name: string; email: string; phone: string; positionTitle: string; messageHtml: string }) => string` — plus one new required field `phoneProvided: boolean`, so the call site in `sendJobApplication` must be updated too. No exported symbols from this file change.

- [ ] **Step 1: Confirm there is no existing test to update**

Run: `git ls-files "app/[locale]/careers/*.test.ts"`
Expected: no output (no test file exists for this action today, so there is nothing to update before refactoring; Task 1's `lib/emailTemplate.test.ts` is what covers the shared building blocks this task reuses).

- [ ] **Step 2: Replace `buildApplicationEmailHtml` and its call site**

In `app/[locale]/careers/actions.ts`, replace lines 1-71 (everything up to and including the `buildApplicationEmailHtml` function) with:

```ts
"use server";

import { sendApplicationMail } from "@/lib/mailer";
import { escapeHtml } from "@/lib/escapeHtml";
import {
  emailShell,
  emailRowTable,
  emailBadge,
  emailMessageBlock,
  mailtoLink,
  telLink,
} from "@/lib/emailTemplate";
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

// Builds the HTML body for the application notification email from the shared
// lib/emailTemplate.ts building blocks. Every field here must already be
// HTML-escaped by the caller.
function buildApplicationEmailHtml(fields: {
  name: string;
  email: string;
  phone: string;
  phoneProvided: boolean;
  positionTitle: string;
  messageHtml: string;
}): string {
  const { name, email, phone, phoneProvided, positionTitle, messageHtml } = fields;

  return emailShell({
    title: "New Job Application",
    bodyHtml:
      emailBadge("Applying for", positionTitle) +
      emailRowTable([
        { label: "Name", valueHtml: `<span style="font-weight:600;">${name}</span>` },
        { label: "Email", valueHtml: mailtoLink(email) },
        { label: "Phone", valueHtml: phoneProvided ? telLink(phone) : phone },
      ]) +
      emailMessageBlock("Message", messageHtml),
    footerText:
      "Submitted via the Careers page at ktdoctor.com. The applicant's CV is attached to this email.",
  });
}
```

Then update the call site inside `sendJobApplication` (originally around lines 103-120) so `phone`/`phoneProvided` are computed and passed:

```ts
  const d = (result as { success: true; data: ApplicationValues }).data;
  const phoneProvided = Boolean(d.phone);
  const phone = d.phone || "Not provided";
  const positionTitle = positions.find((p) => p.id === d.position)?.title || "General / other";
  const message = d.message || "Not provided";

  try {
    const buffer = Buffer.from(await (cvFile as File).arrayBuffer());
    await sendApplicationMail({
      replyTo: d.email,
      subject: `[Careers] Application: ${positionTitle}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nPosition: ${positionTitle}\n\n${message}`,
      html: buildApplicationEmailHtml({
        name: escapeHtml(d.name),
        email: escapeHtml(d.email),
        phone: escapeHtml(phone),
        phoneProvided,
        positionTitle: escapeHtml(positionTitle),
        messageHtml: escapeHtml(message).replace(/\n/g, "<br>"),
      }),
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
```

Leave the rest of `sendJobApplication` (validation, honeypot, field-error handling above this block) untouched.

- [ ] **Step 3: Run the full test suite and typecheck**

Run: `npm test`
Expected: PASS — all existing suites (`lib/mailer.test.ts`, `app/[locale]/contact/actions.test.ts`, `lib/emailTemplate.test.ts`, and every other existing test) stay green. No test currently asserts on careers' HTML content directly, so none should fail from this refactor.

Run: `npx tsc --noEmit`
Expected: no type errors (confirms `buildApplicationEmailHtml`'s new `phoneProvided` field is threaded through correctly and every import resolves).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/\[locale\]/careers/actions.ts
git commit -m "refactor: share careers application email markup with lib/emailTemplate"
```

---

## Final Verification

- [ ] Run `npm test` once more from the repo root and confirm every suite passes.
- [ ] Run `npx tsc --noEmit` once more and confirm no type errors.
- [ ] Read through the final `lib/emailTemplate.ts`, `app/[locale]/contact/actions.ts`, and `app/[locale]/careers/actions.ts` end to end to confirm no leftover unused imports (e.g. `escapeHtml` is still used directly in both action files, `emailBadge` is only imported in careers, not contact).
