# Homepage Booking CTA Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage bottom "Book an Appointment" banner with an on-theme, richer version (live same-day status pill, corner glow, arrow button, secondary phone link), extracted into a tested component.

**Architecture:** Extract the inline bottom-CTA JSX from `app/[locale]/page.tsx` into a new client component `components/BookingCtaBanner.tsx` that uses `useTranslations("Home")` and the shared design tokens. Reuse the existing `ktmg-ping` pulse keyframe (gated for reduced motion) and `data-on-navy` theming mechanism so the banner renders identically in light and dark. Wrap it in the existing `Reveal` wrapper on the homepage for the site's standard scroll-in.

**Tech Stack:** Next.js 16 (App Router), React 19, next-intl 4 (`en` + `es`), Tailwind CSS 4, Vitest + Testing Library.

## Global Constraints

- **On-theme only:** use existing tokens — `bg-navy`, `bg-teal`/`bg-teal-dark`, `text-white`, `font-display` (Plus Jakarta Sans). Do NOT introduce `#0C1B26` or Space Grotesk or any new color/font.
- **Theme parity:** the banner root carries `data-on-navy` so token values pin to their light variants; navy + white text are theme-invariant.
- **No horizontal overflow:** the decorative glow must be clipped by `overflow-hidden` on the banner root.
- **Reduced motion:** the pulse ring must carry `motion-reduce:hidden`; no JS-driven motion.
- **i18n parity:** every new message key MUST exist in BOTH `messages/en.json` and `messages/es.json` under `Home`, or `useTranslations` errors for the missing locale.
- **Real data:** primary CTA → `BOOKING_URL`; phone → `MAIN_PHONE` (both from `lib/constants.ts`). Do not hardcode.
- **Version control:** the working tree is dirty and the user prefers build+test without committing. Treat all `git commit` steps as OPTIONAL / deferred — do not block on them and never ask git-strategy questions. Run the test/lint/build gates regardless.

---

### Task 1: `BookingCtaBanner` component + i18n keys

Self-contained, independently testable. i18n keys are folded in because the component's test renders the real message files via `renderWithIntl`.

**Files:**
- Create: `components/BookingCtaBanner.tsx`
- Create: `components/BookingCtaBanner.test.tsx`
- Modify: `messages/en.json` (add two keys under `Home`)
- Modify: `messages/es.json` (add two keys under `Home`)

**Interfaces:**
- Consumes: `BOOKING_URL`, `MAIN_PHONE` from `@/lib/constants`; `useTranslations` from `next-intl`; `renderWithIntl` from `@/lib/test-utils`.
- Produces: `export function BookingCtaBanner(): JSX.Element` (no props) from `@/components/BookingCtaBanner`. New `Home` message keys `bottomCtaPill` and `bottomCtaCall` (the latter takes a `{phone}` param).

- [ ] **Step 1: Write the failing test**

Create `components/BookingCtaBanner.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { BookingCtaBanner } from "./BookingCtaBanner";
import { BOOKING_URL, MAIN_PHONE } from "@/lib/constants";

describe("BookingCtaBanner", () => {
  it("renders the heading, body, and same-day status pill", () => {
    render(<BookingCtaBanner />);
    expect(screen.getByText("Your child can be seen today.")).toBeInTheDocument();
    expect(screen.getByText(/book online in under a minute/i)).toBeInTheDocument();
    expect(screen.getByText("Same-day openings today")).toBeInTheDocument();
  });

  it("links the primary button to the Healow booking URL in a new tab", () => {
    render(<BookingCtaBanner />);
    const book = screen.getByRole("link", { name: /book an appointment/i });
    expect(book).toHaveAttribute("href", BOOKING_URL);
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a tel: phone link with an accessible call label", () => {
    render(<BookingCtaBanner />);
    const phone = screen.getByRole("link", { name: /call/i });
    expect(phone.getAttribute("href")).toMatch(/^tel:\+1\d{10}$/);
    expect(phone).toHaveAttribute("aria-label", `Call ${MAIN_PHONE}`);
    expect(phone).toHaveTextContent(MAIN_PHONE);
  });

  it("renders the status pill in Spanish when locale is es", () => {
    render(<BookingCtaBanner />, "es");
    expect(screen.getByText("Citas para el mismo día, hoy")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- BookingCtaBanner`
Expected: FAIL — cannot resolve `./BookingCtaBanner` (module does not exist yet).

- [ ] **Step 3: Add the i18n keys (en)**

In `messages/en.json`, inside the `Home` object, next to the existing
`bottomCtaHeading` / `bottomCtaBody` keys, add:

```json
    "bottomCtaPill": "Same-day openings today",
    "bottomCtaCall": "Call {phone}",
```

(Keep JSON valid — ensure the preceding line ends with a comma.)

- [ ] **Step 4: Add the i18n keys (es)**

In `messages/es.json`, inside the `Home` object, next to its
`bottomCtaHeading` / `bottomCtaBody` keys, add:

```json
    "bottomCtaPill": "Citas para el mismo día, hoy",
    "bottomCtaCall": "Llamar al {phone}",
```

(Keep JSON valid — ensure the preceding line ends with a comma.)

- [ ] **Step 5: Implement the component**

Create `components/BookingCtaBanner.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { BOOKING_URL, MAIN_PHONE } from "@/lib/constants";

// Homepage bottom "book an appointment" banner. A fixed-navy surface (identical
// in light and dark via data-on-navy) carrying a live "same-day openings" status
// pill, the primary Healow booking CTA, and a secondary phone link. The pulsing
// dot reuses the shared `ktmg-ping` keyframe and is gated for reduced motion,
// matching ClinicNearYouCard.
export function BookingCtaBanner() {
  const t = useTranslations("Home");
  const telHref = `tel:+1${MAIN_PHONE.replace(/\D/g, "")}`;

  return (
    <div
      data-on-navy
      className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-navy px-8 py-10 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Decorative corner glow — clipped by overflow-hidden so it never causes
          horizontal page scroll. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(14,143,160,0.28), transparent 65%)",
        }}
      />

      {/* Left: logo + text */}
      <div className="relative flex items-center gap-4">
        <Image
          src="/clinic-logo.svg"
          alt=""
          aria-hidden
          width={48}
          height={15}
          className="hidden h-12 w-auto brightness-0 invert sm:block"
          unoptimized
        />
        <div>
          <span className="inline-flex w-fit items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-teal motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
              <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
            {t("bottomCtaPill")}
          </span>
          <p className="mt-2 font-display text-xl font-bold">{t("bottomCtaHeading")}</p>
          <p className="mt-1 text-white/70">{t("bottomCtaBody")}</p>
        </div>
      </div>

      {/* Right: primary CTA + phone */}
      <div className="relative flex w-full flex-col gap-2 sm:w-auto">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {t("bookAppointment")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href={telHref}
          aria-label={t("bottomCtaCall", { phone: MAIN_PHONE })}
          className="inline-flex items-center justify-center gap-2 py-1 font-display text-sm font-semibold text-white/85 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {MAIN_PHONE}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- BookingCtaBanner`
Expected: PASS — all 4 tests green.

- [ ] **Step 7 (OPTIONAL — deferred per user preference): Commit**

```bash
git add components/BookingCtaBanner.tsx components/BookingCtaBanner.test.tsx messages/en.json messages/es.json
git commit -m "feat: add BookingCtaBanner component with same-day pill and phone link"
```

---

### Task 2: Wire the banner into the homepage

Replace the inline bottom-CTA section in the homepage with the new component,
wrapped in `Reveal` for the standard scroll-in.

**Files:**
- Modify: `app/[locale]/page.tsx` (add import; replace the Bottom CTA section, currently lines 566–593)
- Test: `app/[locale]/page.test.tsx` (existing — must stay green; no edits expected)

**Interfaces:**
- Consumes: `BookingCtaBanner` from `@/components/BookingCtaBanner` (Task 1); `Reveal` (already imported in `page.tsx`).
- Produces: nothing new; homepage renders the banner.

- [ ] **Step 1: Add the import**

In `app/[locale]/page.tsx`, add near the other component imports (e.g. after the
`ClinicNearYouCard` import on line 11):

```tsx
import { BookingCtaBanner } from "@/components/BookingCtaBanner";
```

- [ ] **Step 2: Replace the Bottom CTA section**

In `app/[locale]/page.tsx`, replace this entire block (the `{/* Bottom CTA */}`
section, currently lines 566–593):

```tsx
      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div data-on-navy className="flex flex-col items-start gap-6 rounded-3xl bg-navy px-8 py-10 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/clinic-logo.svg"
              alt=""
              aria-hidden
              width={48}
              height={15}
              className="hidden h-12 w-auto brightness-0 invert sm:block"
              unoptimized
            />
            <div>
              <p className="font-display text-xl font-bold">{t("bottomCtaHeading")}</p>
              <p className="mt-1 text-white/70">{t("bottomCtaBody")}</p>
            </div>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            {t("bookAppointment")}
          </a>
        </div>
      </section>
```

with:

```tsx
      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <Reveal>
          <BookingCtaBanner />
        </Reveal>
      </section>
```

- [ ] **Step 3: Confirm no imports were orphaned**

`Image` is still used (doctors preview, foundation teaser, stories, partners),
`BOOKING_URL` is still used (hero CTA), and `Reveal` is already imported. No
import removal is needed. Confirm by scanning `page.tsx` for remaining `Image`
and `BOOKING_URL` usages.

Run: `npm run lint`
Expected: clean (no unused-import errors).

- [ ] **Step 4: Run the homepage tests**

Run: `npm test -- "page"`
Expected: PASS — including "renders links to find a doctor, find a clinic, and
book an appointment" (both booking links still resolve to `BOOKING_URL`; the new
phone link's accessible name is "Call …" and is excluded from `/book/i`) and the
Spanish CTA assertion.

- [ ] **Step 5: Full verification**

Run: `npm test`
Expected: all suites PASS.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6 (OPTIONAL — deferred per user preference): Commit**

```bash
git add "app/[locale]/page.tsx"
git commit -m "feat: use BookingCtaBanner in homepage bottom CTA"
```

---

## Self-Review

**Spec coverage:**
- On-theme navy/teal/Plus Jakarta Sans → Task 1 component classes + Global Constraints. ✓
- Full composition (pill, glow, arrow button, phone link) → Task 1 component. ✓
- `data-on-navy` theme parity → Task 1 root. ✓
- `overflow-hidden` prevents horizontal scroll → Task 1 root + glow. ✓
- Reduced-motion pulse gating → Task 1 (`motion-reduce:hidden`). ✓
- Responsive stacking → Task 1 (`flex-col ... sm:flex-row`). ✓
- i18n `bottomCtaPill` + `bottomCtaCall` in en + es → Task 1 Steps 3–4. ✓
- New component test → Task 1 Step 1. ✓
- Existing `page.test.tsx` stays green → Task 2 Step 4. ✓
- `Reveal` scroll-in wrapper → Task 2 Step 2. ✓
- Verification (test/lint/build) → Task 2 Steps 3–5. ✓

**Placeholder scan:** No TBD/TODO; all code shown in full. ✓

**Type consistency:** `BookingCtaBanner` (no props) defined in Task 1, consumed in Task 2. Message keys `bottomCtaPill` / `bottomCtaCall` defined in Task 1 Steps 3–4, used in Task 1 Step 5. `telHref` regex in the test (`/^tel:\+1\d{10}$/`) matches the component's `tel:+1${digits}` construction. ✓
