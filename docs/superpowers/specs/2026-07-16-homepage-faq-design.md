# Homepage FAQ Section — Design

## Goal

Add a "Frequently Asked Questions" section to the homepage, positioned above the
final "Book an appointment today" CTA banner (which sits directly above the
site footer), so the page flow ends: teasers → FAQ → CTA banner → Footer.

## Content

8 fixed Q&A pairs (provided by stakeholder), covering: first-visit prep,
walk-ins, accepted insurance, ages treated, telehealth, switching doctors,
after-hours/weekend care, and transferring from another HMO/IPA.

Section chrome:
- Eyebrow: "Questions parents ask"
- Heading: "Frequently Asked Questions"
- Subheading: "Everything you need to know about visiting our clinics."

## Data layer

New `data/faq.ts`:

```ts
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [ /* 8 items, English text verbatim from stakeholder */ ];
```

This follows the existing `data/resources.ts` / `data/locations.ts` pattern:
factual/content data that lives outside the translation system. Per stakeholder
decision, the Q&A body text is **English-only for now** — no Spanish
translation of questions/answers in this iteration.

## i18n

The section's chrome (eyebrow/heading/subheading) is still translated, matching
every other section on the homepage:

- `messages/en.json` → `Home.faqEyebrow`, `Home.faqHeading`, `Home.faqSubheading`
- `messages/es.json` → same keys, Spanish translations

This keeps the section frame locale-aware even though the Q&A content itself
stays English until a future translation pass.

## Component: `components/FaqAccordion.tsx`

- Client component (`"use client"`).
- Props: `{ items: FaqItem[] }`.
- **Single-open accordion**: one `openId` state (`string | null`). Clicking a
  question that's already open closes it; clicking a different question opens
  it and closes whichever was open.
- Each item:
  - A `<button>` header showing the question, `aria-expanded={isOpen}`,
    `aria-controls`/`id` wiring to its answer panel, and a chevron icon that
    rotates 180° when open (consistent with the rotating/translating icon
    micro-interactions used elsewhere on the page, e.g. the `→` hover
    animations).
  - An answer panel below, rendered in the DOM with `hidden` toggled by state
    (so content is present for SEO/testability, not just visually collapsed).
- Visual style matches existing card language: `rounded-2xl border
  border-border bg-white shadow-card`, `font-display` for questions,
  `text-ink-soft` for answers — same tokens used in `ServiceCard`,
  `NetworkCard`, etc.

## Mobile responsiveness

- Section wrapper: same `mx-auto max-w-6xl px-5 sm:px-8` container used by
  every other homepage section — no overflow on narrow viewports.
- Single-column stacked list at all breakpoints (no side-by-side layout to
  break) — the accordion naturally reflows without a separate mobile variant.
- Question buttons are full-width with generous vertical padding (`py-4`+) for
  comfortable touch targets.
- Type scales with the same `text-sm`/`sm:text-base`-style convention already
  used across the page.

## Placement in `app/[locale]/page.tsx`

New `<section>` inserted immediately after the "Careers / Insurance /
Resources / Services" teaser grid section and immediately before the navy
"Bottom CTA" banner section. `Footer` itself is rendered in
`app/[locale]/layout.tsx` as a sibling after `{children}`, so this placement
puts the FAQ directly above the footer once the CTA banner is accounted for,
per stakeholder's chosen ordering.

## Testing

- New `components/FaqAccordion.test.tsx`:
  - Renders all questions.
  - Only one answer is expanded at a time.
  - Clicking a second question closes the first and opens the second.
  - `aria-expanded` reflects open/closed state correctly.
- Update `app/[locale]/page.test.tsx`:
  - Add an assertion that the FAQ heading and first question render on the
    homepage.

## Out of scope

- Spanish translation of the Q&A content (explicitly deferred).
- Schema.org `FAQPage` structured data / SEO markup (not requested).
- Reusing the accordion component elsewhere on the site (not requested).
