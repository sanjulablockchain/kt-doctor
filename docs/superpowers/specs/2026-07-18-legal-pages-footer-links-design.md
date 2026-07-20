# Privacy Policy & Terms Pages + Footer Links — Design

**Date:** 2026-07-18
**Status:** Approved (design), pending implementation

## Goal

Three related additions:

1. A **Privacy Policy** page, content from https://www.ktdoctor.com/privacy-policy-2/, linked from the footer.
2. A **Terms and Conditions** page, content from https://www.ktdoctor.com/terms_and_conditions-2/, linked from the footer.
3. A **Same-Day Appointments** link in the footer (target already exists internally).

The site is fully bilingual (`next-intl`, locales `en`/`es`, `localePrefix: "as-needed"`). Both new pages ship with full Spanish translations to match the rest of the site.

> **Note on legal text:** the Spanish legal wording is translated by Claude for parity with the rest of the site. KT Doctor should have counsel confirm the wording before relying on it. The scrubbed `[email protected]` in the source is replaced with the real `GENERAL_EMAIL`.

## Decisions

- **Spanish:** full translation of both documents.
- **Footer placement:** Privacy Policy + Terms & Conditions in the **Quick Links** column; Same-Day Appointments in the **For Patients** column (it is a patient/appointment link, matching the live site's grouping).
- **Same-Day target:** internal `/services/same-day-appointments` — the service already exists in `data/services.ts` and renders at that route. No new page or external link needed.
- **Metadata:** static English `metadata` objects on each page, matching the existing `CareersPage` convention (not `generateMetadata`).

## Routes

Following the existing `app/[locale]/<route>/page.tsx` pattern:

- `app/[locale]/privacy-policy/page.tsx` → `/privacy-policy`, `/es/privacy-policy`
- `app/[locale]/terms-and-conditions/page.tsx` → `/terms-and-conditions`, `/es/terms-and-conditions`

Each page is a thin server component: a static `metadata` export plus a render of the shared content component (`<LegalPageContent doc="privacy" />` / `doc="terms"`).

## Content storage — `data/legal.ts`

Typed, structured content mirroring the EN/ES convention in `data/services.ts`. The body is transcribed **verbatim** from the reference URLs; Spanish fields are added alongside.

```ts
type ListItem = { label?: string; labelEs?: string; text: string; textEs: string };

type LegalBlock =
  | { type: "paragraph"; text: string; textEs: string }
  | { type: "list"; items: ListItem[] };

type LegalSection = { heading: string; headingEs: string; blocks: LegalBlock[] };

type LegalDocument = {
  effectiveDate: string;   // ISO, e.g. "2026-07-18"
  intro: { text: string; textEs: string };
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument;
export const termsAndConditions: LegalDocument;
```

- `label`/`labelEs` render as a bold lead-in on list items (e.g. **Personal Information:** …), matching the source formatting.
- Contact details inside the prose reference `lib/constants.ts` (`MAIN_PHONE`, `GENERAL_EMAIL`) where they appear, so they don't drift. The mailing address (`504 S Sierra Madre Blvd, Pasadena, CA 91107`) is inline.

### Privacy Policy sections (from reference, verbatim)

Intro paragraph, then: 1. Information We Collect · 2. How We Use Your Information · 3. How We Protect Your Information · 4. Disclosure of Your Information · 5. SMS Text Policy · 6. Your Rights and Choices · 7. Contact Us for Privacy-Related Inquiries · 8. Changes to the Privacy Policy · 9. Governing Law.

### Terms and Conditions sections (from reference, verbatim)

Intro paragraph, then: 1. Use of the Website · 2. Medical Information Disclaimer · 3. User Accounts and Security · 4. Intellectual Property · 5. Third-Party Links · 6. Limitation of Liability · 7. Privacy Policy · 8. SMS Text Policy · 9. Customer Support · 10. Changes to the Terms · 11. Governing Law.

## Shared renderer — `components/LegalPageContent.tsx`

`"use client"`, following the `CareersPageContent` pattern.

- Props: `{ doc: "privacy" | "terms" }`.
- `useLocale()` selects EN vs ES fields from the imported document; `useTranslations("Legal")` supplies chrome.
- Layout mirrors other content pages: `<main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">`, eyebrow (`Legal`), `h1` title, an effective-date line, a "Back to Home" `Link`, then the intro and numbered sections. Paragraphs render as `<p>`; lists render as `<ul>` with optional bold `label`.
- Uses `Link` from `@/i18n/navigation` for internal links so locale prefixing is handled.

## i18n additions

New `Legal` namespace in `messages/en.json` and `messages/es.json`:

| key | en | es |
|---|---|---|
| `eyebrow` | Legal | Legal |
| `privacyTitle` | Privacy Policy | Política de Privacidad |
| `termsTitle` | Terms and Conditions | Términos y Condiciones |
| `effectiveLabel` | Effective Date | Fecha de Vigencia |
| `backToHome` | Back to Home | Volver al Inicio |

New keys appended to the existing `Footer` namespace:

| key | en | es |
|---|---|---|
| `privacyPolicy` | Privacy Policy | Política de Privacidad |
| `termsAndConditions` | Terms & Conditions | Términos y Condiciones |
| `sameDayAppointments` | Same-Day Appointments | Citas el Mismo Día |

## Footer changes — `components/Footer.tsx`

- Append to `quickLinks`: `{ href: "/privacy-policy", label: t("privacyPolicy") }`, `{ href: "/terms-and-conditions", label: t("termsAndConditions") }`.
- Prepend to `patientLinks`: `{ href: "/services/same-day-appointments", label: t("sameDayAppointments") }`.

No structural/markup changes — the existing `.map()` renders the new entries.

## Testing

- **`data/legal.test.ts`** — for both documents: sections is non-empty; every section has `heading` and `headingEs`; every paragraph has `text` + `textEs`; every list item has `text` + `textEs` (and `label`⇔`labelEs` are either both present or both absent). Guards against missing translations.
- **`components/LegalPageContent.test.tsx`** — renders `doc="privacy"` and `doc="terms"`: asserts the localized title heading, a representative section heading, and the "Back to Home" link. Re-render under `es` and assert Spanish title/section text appears.
- **`components/Footer.test.tsx`** — extend existing "renders links to every page" expectations: Privacy Policy → `/privacy-policy`, Terms & Conditions → `/terms-and-conditions`, Same-Day Appointments → `/services/same-day-appointments`.
- **`app/[locale]/privacy-policy/page.test.tsx`** and **`app/[locale]/terms-and-conditions/page.test.tsx`** — light smoke test (renders, title heading present), matching the per-page test convention.

## Out of scope

- No changes to the header/main nav.
- No cookie-consent banner or analytics changes.
- No `generateMetadata`/localized `<title>` beyond the existing static-metadata convention.
