# Careers + Insurance + Parent Resources — Design Spec

Date: 2026-07-15
Status: Approved (Phase 2, part 3 of the KTMG website rebuild)

## Background

This sub-project was originally scoped as "Blog + Careers + Insurance,"
assumed to have real scraped data for all three. Checking the real
`ktdoctor.com` directly during brainstorming found:

- **Careers**: no real job listings exist. The real page is just an
  application form (name, contact, email, position, CV upload) plus a real
  footer disclaimer that official postings are only on social media, the
  company's own channels, and Indeed. The boss's mockup's "8 open positions"
  list is fabricated.
- **Insurance**: the real page's content is mostly broken (Elementor didn't
  render), so there is no confirmed list of specific accepted insurers. The
  one real, confirmed element is the "Switch to Serendib Healthways"
  cross-sell (a real affiliated HMO/IPA, `serendibhealthways.com`).
- **Blog**: doesn't exist as a real section (`/blog` 404s). The real
  equivalent is "Parent Resources," a page of downloadable PDFs (vaccine
  schedule, forms, developmental milestone guides), though that page's
  content is also partly broken on the live site.

Per client decision, all three ship using only real, honest content, without
a form backend (no database/CMS exists yet) and without inventing
specifics we can't confirm.

## Goals

- `/careers`: real tone, no fake listings, a working way to apply that needs
  no backend.
- `/insurance`: general, accurate acceptance messaging plus the real
  Serendib Healthways cross-sell.
- `/resources` (replacing "Blog" in navigation and scope): real resource
  categories, honestly marked as not-yet-available for download.

## Real reference data

- Careers real copy anchor: KTMG's own footer note, "All our official job
  postings are only posted on the following websites: Social media pages,
  Official company websites, Indeed."
- General contact email: `customerservice@ktdoctor.com` (already in
  `lib/constants.ts` as `GENERAL_EMAIL`).
- Serendib Healthways real URL: `https://www.serendibhealthways.com`.
- Real resource categories from the current site's Parent Resources page:
  Vaccine Schedule, patient forms, developmental milestone guides ("Your
  Child's Developmental Journey" series).

## Data model

New file `data/careers.ts`:

```ts
export const CAREERS_APPLY_MAILTO =
  "mailto:customerservice@ktdoctor.com?subject=Job%20Application";
```

New file `data/insurance.ts`:

```ts
export type InsuranceInfo = {
  acceptedCategories: string[]; // e.g. ["HMO", "PPO", "Medi-Cal"]
  serendibUrl: string;
};

export const insuranceInfo: InsuranceInfo = {
  acceptedCategories: ["HMO", "PPO", "Medi-Cal"],
  serendibUrl: "https://www.serendibhealthways.com",
};
```

New file `data/resources.ts`:

```ts
export type ParentResource = {
  id: string;
  name: string;
  description: string;
};

export const parentResources: ParentResource[] = [
  /* Vaccine Schedule, Patient Forms, Developmental Milestone Guides —
     each marked with available: false until real files are provided */
];
```

(Exact fields finalized in the implementation plan.)

## Pages

- `/careers` — hiring pitch, "Email us your resume" button (mailto, opens
  the user's mail client, no new tab needed since mailto: doesn't support
  target), and the real "official postings on social media / company
  channels / Indeed" note.
- `/insurance` — "We accept all major insurance" message with the 3 general
  categories as chips, the Serendib Healthways cross-sell card linking
  externally, and a "Call to verify your plan" CTA using `MAIN_PHONE`.
- `/resources` — grid of real resource categories, each card showing a
  "Contact us for a copy" state (no broken download links) since we don't
  have the actual PDF files.
- Homepage teaser sections for all three (compact, consistent with the
  Network/Foundation teasers).
- Header nav: add "Careers," "Insurance," and "Resources" links (replacing
  any prior "Blog" reference).

## Explicitly out of scope

- No real job listings until the client provides current openings.
- No specific named insurers until confirmed.
- No actual downloadable PDF files until the client provides them — resource
  cards show a "coming soon" / "contact us" state, not broken links.
- No form backend/database — the careers "apply" action is a mailto: link
  only.

## Next steps

1. Write an implementation plan (writing-plans skill).
2. After this ships, the only remaining Phase 2 piece is the EN/ES toggle.
