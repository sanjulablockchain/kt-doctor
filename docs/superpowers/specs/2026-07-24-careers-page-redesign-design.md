# Careers Page Redesign — Design Spec

Date: 2026-07-24
Status: Proposed (pending user spec review)

## Background

The current `/careers` page ([`components/CareersPageContent.tsx`](../../../components/CareersPageContent.tsx))
is a deliberate minimal stub from the original Phase 2 build
([2026-07-15 spec](2026-07-15-careers-insurance-resources-design.md)): an eyebrow,
heading, description, a single "Email us your resume" mailto button, and the
"official postings only on social media / our sites / Indeed" anti-scam notice.
That build intentionally avoided fabricated listings and any form backend.

The client (Sanjula, `@ktdoctor.com`) now wants the page brought up to a richer
design, using two references:

- **Live site** `https://www.ktdoctor.com/careers/` — content-rich: hero, culture
  narrative, a benefits section (401k/profit-sharing, health & dependent-care
  coverage, generous PTO, continuing education), real roles, an application form
  with CV upload, and clinic/staff photography.
- **Mockup** `https://ktmghealth-74jvgnj5.manus.space/careers` — the visual target:
  a dark hero ("Build Your Career at Kids & Teens"), a 4-item perks strip, and an
  **"Open Positions (8)"** section with a department filter and per-role cards each
  with an "Apply" button. The mockup contains **no photography** (icons only).

### Decisions from brainstorming

1. **Listings are real openings.** The prior "no fabricated listings" stance is
   lifted. The page ships a full positions layout with a department filter. The 8
   roles from the mockup are the **seed list; the client will confirm/edit** exact
   titles, locations, employment types, and descriptions before launch.
2. **Apply = in-page application form with CV upload**, emailed via the existing
   `nodemailer` setup. One shared form; each role's "Apply" button deep-links to it
   (pre-selects the position and scrolls). No modals, no ATS, no database.
3. **Images:** curated royalty-free Unsplash photos, **downloaded and self-hosted**
   under `public/careers/` (same method as the service pages), reusing fitting
   existing repo photos. A contact-sheet artifact is published for one-pass approval
   before finalizing.
4. **Sections:** full — hero (with image), perks strip, benefits section, filterable
   positions, culture/"why work here" band, application form, and the retained
   anti-scam notice.
5. **Applications route to a new `CAREERS_TO` mailbox** over the same SMTP transport
   (`from` stays `CONTACT_FROM`, the authenticated M365 mailbox; applicant address in
   `replyTo`). For testing, `CAREERS_TO = Sanjula.Rajapaksha@ktdoctor.com`. Separately,
   the page **displays** a careers contact address
   `CAREERS_EMAIL = Amanda.Desilva@ktdoctor.com` (a "prefer to email us directly" UI
   label), independent of the actual delivery mailbox.

## Goals

- Replace the stub with a rich, on-brand, bilingual (EN/ES) careers page matching the
  mockup's structure plus the live site's benefits/culture content and imagery.
- A working application path (name, email, phone, position, message, CV upload) that
  emails the application with the CV attached, needing no database.
- Honest content: real (client-confirmed) roles only; retain the anti-scam notice.

## Page structure

`app/[locale]/careers/page.tsx` keeps its current metadata shape and renders a
rewritten `CareersPageContent`. Sections, top to bottom:

1. **Hero** — `navy` band, white headline "Build Your Career at Kids & Teens" and the
   18+ years / 25+ clinics subhead. Adds a hero image (warm care-team/clinic photo)
   with an overlay for headline legibility. Primary CTA scrolls to the application
   form; secondary link to `/locations`.
2. **Perks strip** — 4 icon cards: Competitive salary & benefits · Flexible
   scheduling · 25+ locations across LA · Supportive team culture.
3. **Benefits** — 401(k) with profit sharing, health & dependent-care coverage,
   generous PTO, continuing-education support. Icon + short copy per item, one
   supporting image.
4. **Open Positions** — heading with a live count (`Open Positions (N)`), a department
   filter `<select>`, and one card per role: title, location(s), employment type,
   department chip, one-line summary, and an **Apply** button. Client-side filtering.
5. **Culture band** — short values narrative (compassion, teamwork, innovation,
   personalized care) with a photo.
6. **Application form** — see below.
7. **Anti-scam notice** — retained verbatim from current copy.

Uses existing primitives: `Reveal` for scroll-in, `ParallaxImage`/`next/image` for
imagery, and the established token classes (`teal`, `teal-dark`, `teal-tint`, `gold`,
`ink`, `ink-soft`, `border`, `surface`, `shadow-soft`, `shadow-card`, `font-display`,
rounded-full buttons).

## Data model — `data/careers.ts`

Replace the current `CAREERS_APPLY_MAILTO` export with typed data:

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
  id: string;             // stable slug, used as the Apply deep-link value
  title: string;
  titleEs: string;
  department: Department;
  locations: string;      // e.g. "Multiple Locations", "Hollywood, Tarzana", "Remote"
  employmentType: EmploymentType;
  summary: string;
  summaryEs: string;
};

export const positions: Position[] = [ /* seed = 8 roles below */ ];
export const departments: Department[] = [ /* derived / fixed order */ ];
```

### Seed roles (client to confirm/edit)

| id | Title | Department | Locations | Type |
|----|-------|-----------|-----------|------|
| pediatrician | Pediatrician (MD/DO) | Clinical | Multiple Locations | Full-time |
| pediatric-np | Pediatric Nurse Practitioner | Clinical | Hollywood, Tarzana | Full-time |
| medical-assistant | Medical Assistant | Clinical Support | Pasadena, Glendale, Arcadia | Full-time |
| front-office-coordinator | Front Office Coordinator | Administration | Northridge, Van Nuys | Full-time |
| telehealth-coordinator | Telehealth Coordinator | Operations | Remote | Full-time |
| speech-language-pathologist | Speech Language Pathologist | Therapy | West LA (LAIPT) | Full-time / Part-time |
| occupational-therapist | Occupational Therapist | Therapy | West LA (LAIPT) | Part-time |
| billing-specialist | Billing Specialist | Finance | Pasadena (HQ) | Full-time |

Summaries seed from the mockup's one-liners. All Spanish fields translated to match
the existing `messages/es.json` tone. No em dash anywhere (enforced by the data test).

## Application form + backend

### Client (`CareersPageContent` + a form subcomponent)

Mirrors `ContactForm`: `useActionState`, client-side validation mirroring the server
schema, inline i18n field errors, honeypot `company` field, success state with
auto-reset. Fields:

- `name` (required), `email` (required), `phone` (optional)
- `position` — `<select>` populated from `positions` (value = `id`), plus a
  "General / other" option. The Apply buttons set this value and scroll to the form.
- `message` (optional short cover note)
- `cv` — `<input type="file">`, accept `.pdf,.doc,.docx`, required.

### Validation — `lib/careersSchema.ts`

New zod schema following `lib/contactSchema.ts` exactly (shared client/server, one
error code per field, codes are i18n sub-keys under `Careers.errors`). Text fields
validated by the schema. The CV file is validated in the server action:

- required; MIME/extension in {pdf, doc, docx}; size <= 5 MB → error codes
  `cvRequired`, `cvType`, `cvTooLarge`.

### Server action — `app/[locale]/careers/actions.ts`

`"use server"` action `sendJobApplication(prev, formData)` following the contact
action: honeypot short-circuit, `validateApplication`, file validation, then send.
Returns `{ status, errorCode?, fieldErrors?, values? }`. HTML/text body lists the
applicant fields (escaped) and the chosen position; the CV is attached.

### Mailer — extend `lib/mailer.ts`

Refactor the transport creation into a small helper and add
`sendApplicationMail({ replyTo, subject, text, html, attachments })`, passing
`attachments` (nodemailer `{ filename, content: Buffer, contentType }`) through to
`transport.sendMail`. Existing `sendContactMail` behavior unchanged (still reads
`CONTACT_TO`). Applications go to a new `CAREERS_TO` env var from `CONTACT_FROM`,
applicant address in `replyTo`, subject `[Careers] Application: <position title>`.
Add `CAREERS_TO` to `.env.local` and `.env.local.example`. A separate display-only
constant `CAREERS_EMAIL = "Amanda.Desilva@ktdoctor.com"` is added to `lib/constants.ts`
and shown on the page as a "prefer to email us directly" link; it is not used by the
mailer.

### Config — `next.config.ts`

Add `experimental.serverActions.bodySizeLimit: "6mb"` (default 1 MB blocks any CV;
6 MB covers a 5 MB file plus multipart overhead). Confirmed against
`node_modules/next/dist/docs/.../serverActions.md`. Keep the existing
`turbopackFileSystemCacheForDev` and images config.

## Images

Self-hosted under `public/careers/`:

- `hero.jpg` — warm care-team / clinic environment (landscape, overlay-friendly).
- `benefits.jpg` and `culture.jpg` — supportive imagery for those bands.
- Reuse `public/doctors/care-team.jpg` where it fits (may cover one slot).

Sourcing = Unsplash direct `images.unsplash.com/photo-<id>` URLs, downloaded via
PowerShell `Invoke-WebRequest` to local files, consistent crop params. Provenance in
`public/careers/SOURCES.md`. Alt text is bilingual and contains no em dash. A
contact-sheet **artifact** is published for approval before finalizing; images are
easily swapped by overwriting the file.

## Internationalization

New/expanded `Careers` namespace in `messages/en.json` and `messages/es.json`:
hero copy, perks labels, benefits items, positions section heading + filter labels +
department names, culture copy, all form labels/placeholders/buttons/success text,
`errors.*` codes, and the retained notice. `Seo.careers` stays as-is. Position
titles/summaries live in `data/careers.ts` (bilingual fields), not messages,
consistent with other data-driven content.

## Testing

- `data/careers.test.ts` — positions well-formed; departments cover all used values;
  no em dash in any string.
- `lib/careersSchema.test.ts` — valid/invalid text fields, one-error-per-field.
- `app/[locale]/careers/actions.test.ts` — honeypot drop; file type/size rejection;
  success path calls the mailer with an attachment (mailer mocked).
- `components/CareersPageContent.test.tsx` — renders all sections; department filter
  narrows the list; Apply pre-selects the position; form validation surfaces errors.
- Mailer attachment shape covered via the action test (transport mocked).
- `npm run test` and `npm run build` green before completion.

## Out of scope

- No ATS, database, or applicant tracking; applications are email-only.
- No per-role job-detail sub-pages.
- No authentication or file storage (CV is emailed, not persisted).
- No changes to other pages beyond adding/confirming the header nav "Careers" link
  (already present from the original build; verify only).

## Risks

- **Server-action file uploads in this Next fork (16.2.10):** AGENTS.md warns of
  breaking changes. Mitigation — read the bundled `server-actions.md` and
  `serverActions.md` guides before implementing; the `bodySizeLimit` behavior is
  already confirmed there.
- **Stock-photo relevance:** photos are on-theme, not the actual clinics. Mitigated by
  the contact-sheet review and easy per-file swap; client can later supply real
  photos.
- **Listing accuracy:** roles are the client's responsibility to confirm before
  launch; the seed list is explicitly provisional.
- **Spam:** honeypot only (matching the contact form). No captcha in scope.

## Next step

Write the implementation plan (writing-plans skill) after the client approves this
spec.
