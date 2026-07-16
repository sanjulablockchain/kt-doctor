# EN/ES Language Toggle — Design Spec

Date: 2026-07-15
Status: Approved (Phase 2, part 4 / final piece of the KTMG website rebuild)

## Background

The real ktdoctor.com site has separate English/Spanish text-in phone lines
((626) 298-7121 English, (818) 423-5637 Spanish), confirming a real bilingual
patient base. This spec adds a real EN/ES toggle across the whole site.

## Goals

- Add Spanish as a fully routed locale (`/es/...`), not just a client-side
  string swap, for SEO and shareable links.
- Translate all UI chrome and page prose into Spanish.
- Leave facts (names, credentials, addresses, phone numbers, real URLs)
  unchanged in both locales — they don't translate.
- Restore the real Spanish text line found on the current site.

## Architecture

- **next-intl** — static JSON message dictionaries, no server/database
  required, consistent with the rest of the app's hardcoded-data approach.
- Routes move under `app/[locale]/...`. English is the default locale with no
  URL prefix (`/doctors`); Spanish is prefixed (`/es/doctors`).
- `middleware.ts` matches all routes except static assets and routes them
  through next-intl's locale routing.
- `messages/en.json` and `messages/es.json` hold all translatable UI strings,
  organized by page/component (e.g., `header.doctors`, `home.hero.heading`,
  `foundation.programs.freeClinicDays.description`).
- A language switcher (EN / ES) is added to the Header, in both the desktop
  nav and the mobile menu, linking to the equivalent page in the other
  locale.

## What translates vs. what doesn't

**Translates:** Header/Footer labels, all page headings and body copy,
Network brand taglines/descriptions, Foundation mission and program
descriptions, Careers/Insurance/Resources page copy.

**Does not translate** (stays identical in both locales): doctor names and
credentials (`data/doctors.ts`), clinic addresses/phone/email
(`data/locations.ts`), real external URLs (Healow, Serendib, sgmdoctor.com,
laipt.org, kidsandteensfoundation.org), and specialty labels (currently just
"Pediatrics" — could translate later if more specialties are added, but out
of scope now since it's a single fixed value).

## Real reference data

- English text line: `(626) 298-7121` (existing `TEXT_PHONE`)
- Spanish text line (real, from the current live site): `(818) 423-5637` —
  new constant `TEXT_PHONE_ES`, used only in the Spanish locale's
  header/footer.

## Translation quality

Translations in this spec are written to be fluent and accurate, but not
verified by a certified native speaker. Recommended as a follow-up before
real launch, especially for insurance and care-instruction copy — not a
blocker for shipping this feature.

## Execution split

Two implementation plans, same incremental pattern as the rest of Phase 2:

- **Plan A** (this one): i18n infrastructure (next-intl, middleware,
  `[locale]` routing, language switcher) + Header, Footer, Home, Doctors,
  Locations fully translated and working end-to-end.
- **Plan B** (next): Network, Foundation, Careers, Insurance, Resources
  translated using the infrastructure Plan A establishes.

## Explicitly out of scope

- No CMS/translation-management tool — translations are hardcoded JSON,
  same philosophy as the rest of the app's data.
- No auto-detection/redirect based on browser language in this pass (could
  be added later) — the toggle is a manual, explicit choice.

## Next steps

1. Write the Plan A implementation plan (writing-plans skill).
2. Execute Plan A.
3. Spec and plan Plan B (Network/Foundation/Careers/Insurance/Resources
   translations) once Plan A ships.
