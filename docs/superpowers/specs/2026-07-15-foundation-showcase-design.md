# Foundation Showcase — Design Spec

Date: 2026-07-15
Status: Approved (Phase 2, part 2 of the KTMG website rebuild)

## Background

The boss's manus.space mockup includes a Foundation/charity section (a
Sri Lanka school wellness program with a $47,500-of-$100,000 donation
progress bar, school-by-school completion percentages, and named
testimonials). Investigating this during brainstorming found that
**Kids and Teens Foundation is a real, separate 501(c)(3) nonprofit** with
its own live site (`kidsandteensfoundation.org`), run by the same leadership
as KTMG (Dr. Janesri De Silva, CEO) — but its real programs and real state
differ substantially from the mockup's fabricated version:

- The Sri Lanka medical mission is real but **not yet scheduled** ("Date
  TBA" on their own site) — there are no operating school wellness centers,
  no completion percentages, and no donation total to report.
- The named testimonials in the mockup (Kasun, Priya's Mother, Fr. Anthony)
  do not appear anywhere on the real foundation site and cannot be verified.

Because this touches a real charity accepting real donations, this spec
explicitly avoids reproducing any fabricated statistic or testimonial.
Instead it follows the same pattern used for the Network showcase
(`docs/superpowers/specs/2026-07-15-one-network-showcase-design.md`):
real content, with a link out to the foundation's own site for full detail
and actual donations.

## Goals

- Give the KTMG site a `/foundation` page and homepage teaser presenting the
  Kids and Teens Foundation using only real, verifiable content.
- Link "Donate Now" directly to the foundation's real donate page
  (`https://kidsandteensfoundation.org/donate/`) — do not build a donation
  form or process payments in this codebase.
- Do not include any dollar figures, percentages, or testimonials that
  aren't confirmed on the foundation's own site.

## Real reference data (captured 2026-07-15)

- Real logo saved to `public/foundation-logo.png` (854×283, downloaded
  directly from
  `kidsandteensfoundation.org/wp-content/uploads/2024/01/KTMG-found-logo-final-1.png`)
- Mission (their own copy): "Our mission is to provide critical medical care
  to those in need, provide opportunities to those who want to pursue
  medicine, and educate the public on common conditions."
- Real programs (from their "Our Work" page):
  - **Free Clinic Days & Continued Care** — monthly free clinic days at
    KTMG's busiest locations for underinsured/uninsured families, plus
    continued low-cost follow-up care and help enrolling in medical plans.
  - **Medical Missions** — sending doctors abroad where care is lacking;
    first planned mission to Negombo, Sri Lanka, via partner Saint Joseph
    Hospital (date not yet announced).
  - **Internship Opportunities** — internships/job opportunities for
    lower-income students.
  - **Mentorship** — a mentorship program for students ages 18 to 24
    pursuing medicine.
  - **Community & Educational Outreach** — collaborating with local
    governments/organizations to improve school health education.
  - **Scholarships** — the Janesri and Sunil De Silva Scholarship, awarded
    annually to students pursuing pre-med, biology, chemistry, or related
    fields.
- Real donate URL: `https://kidsandteensfoundation.org/donate/` (confirmed
  live, HTTP 200, as of 2026-07-15)
- Real site URL: `https://kidsandteensfoundation.org`

## Data model

New file `data/foundation.ts`:

```ts
export type FoundationProgram = {
  id: string;
  name: string;
  description: string;
};

export type Foundation = {
  name: string;
  mission: string;
  logoSrc: string;
  siteUrl: string;
  donateUrl: string;
  programs: FoundationProgram[];
};
```

## Pages

- `/foundation` — logo, mission statement, a grid of the 6 real programs
  above, a "Donate Now" button (external link to the real donate page, new
  tab) and a "Visit the Foundation site →" link (external, new tab).
- Homepage teaser — a compact section with the logo, a one-line mission
  summary, and both the "Donate Now" and "Learn more" (internal link to
  `/foundation`) actions.

## Explicitly out of scope

- No donation form, payment processing, or dollar-amount tracking in this
  codebase.
- No testimonials, no completion percentages, no fundraising totals — none
  of this is confirmed real content.
- No EN/ES translation of this content (later phase).

## Known gaps / risks to track

- The Sri Lanka mission has no confirmed date — copy must say "planned" or
  "date to be announced," not imply it is currently operating.
- If the client later provides real, consented testimonials or real
  fundraising figures from the foundation itself, those can be added in a
  follow-up — but only from a confirmed source, not invented.

## Next steps

1. Write an implementation plan (writing-plans skill).
2. After this ships, move to the remaining Phase 2 pieces: Blog + Careers +
   Insurance, then the EN/ES toggle.
