# EN/ES Toggle — Plan A (Infrastructure + Core Pages) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add next-intl routed-locale infrastructure (`/` for English, `/es/...` for Spanish) and fully translate Header, Footer, Home, Doctors, and Locations. Move all other existing routes under the new `[locale]` segment so the site keeps working, without translating their content yet (that's Plan B).

**Architecture:** next-intl with `app/[locale]/...` routing, a `middleware.ts` for locale detection, static JSON message dictionaries (`messages/en.json`, `messages/es.json`), and a locale-aware `Link` replacing `next/link`'s `Link` everywhere internal navigation exists. Page content that needs translations becomes (or already is) a `"use client"` component using `useTranslations()`, matching the Server+Client split already established for Doctors/Locations in Phase 1.

**Tech Stack:** next-intl (latest stable), Next.js App Router, existing Vitest + React Testing Library setup.

## Global Constraints

- No git repository is in use — do not run `git init` or commit. Every task ends with a manual verification step instead of a commit step.
- English is the default locale with **no URL prefix** (`/doctors`); Spanish is prefixed (`/es/doctors`).
- Doctor names, credentials, clinic addresses/phone/email, and all real external URLs (Healow, Serendib, sgmdoctor.com, laipt.org, kidsandteensfoundation.org) are facts, not prose — they stay identical in both locales. Do not translate them.
- The specialty label "Pediatrics" stays in English in both locales for now (single fixed value across all doctors — revisit if more specialties are added later).
- **Known interim gap, not a bug to silently fix here:** the Home page's own copy (hero, stats, "why families choose us," section headings/links) is fully translated in this plan. The Network/Foundation/Careers/Insurance/Resources teaser *cards* on the homepage pull brand/mission/program descriptions from `data/network.ts` and `data/foundation.ts`, which are not translated until Plan B — so on `/es`, those specific card descriptions will still read in English. This is expected and acceptable for this plan; flag it to the client as a known gap closed by Plan B, not something to fix here.
- Translations are written to be fluent and accurate but have not been reviewed by a certified native Spanish speaker — flag this to the client as a pre-launch follow-up, not a blocker.
- Do not use the em dash ("—") in any user-facing copy, in either language.
- Mobile responsive throughout, matching the existing design system.

---

### Task 1: next-intl infrastructure and test utilities

**Files:**
- Create: `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`
- Create: `middleware.ts`
- Modify: `next.config.ts`
- Create: `messages/en.json`, `messages/es.json`
- Create: `lib/test-utils.tsx`
- Test: `lib/test-utils.test.tsx`

**Interfaces:**
- Produces: `routing` (locales `["en", "es"]`, default `"en"`), locale-aware `Link`/`usePathname`/`useRouter` from `i18n/navigation.ts`, and `renderWithIntl(ui, locale?)` test helper — consumed by every later task.

- [ ] **Step 1: Install next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Create the routing config**

Create `i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
```

- [ ] **Step 3: Create the locale-aware navigation helpers**

Create `i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Create the request config**

Create `i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5: Create the middleware**

Create `middleware.ts` (project root, alongside `package.json`):

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 6: Wire the next-intl plugin into Next config**

Modify `next.config.ts`:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Create the starting message dictionaries**

Create `messages/en.json`:

```json
{}
```

Create `messages/es.json`:

```json
{}
```

- [ ] **Step 8: Write the failing test for the test utility**

Create `lib/test-utils.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "./test-utils";

function Greeting() {
  return <p>Hello</p>;
}

describe("renderWithIntl", () => {
  it("renders a component wrapped with NextIntlClientProvider", () => {
    renderWithIntl(<Greeting />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Run the test to verify it fails**

```bash
npm test -- lib/test-utils.test.tsx
```

Expected: FAIL — `Cannot find module './test-utils'`.

- [ ] **Step 10: Write the test utility**

Create `lib/test-utils.tsx`:

```tsx
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

const messagesByLocale = { en: enMessages, es: esMessages } as const;

export function renderWithIntl(ui: ReactElement, locale: "en" | "es" = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
      {ui}
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 11: Run the test to verify it passes**

```bash
npm test -- lib/test-utils.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 12: Verify manually**

```bash
npm run dev
```

Confirm the dev server still starts cleanly with no errors from the new middleware/config (the site's routes haven't moved yet, so pages still render as before). Stop the server.

---

### Task 2: Move the root layout and Home page under `[locale]`

**Files:**
- Create: `app/[locale]/layout.tsx`
- Delete: `app/layout.tsx`
- Move: `app/page.tsx` → `app/[locale]/page.tsx` (content unchanged in this task)
- Move: `app/page.test.tsx` → `app/[locale]/page.test.tsx` (content unchanged in this task)

**Interfaces:**
- Consumes: `routing` (Task 1)
- Produces: working locale-prefixed routing for `/` and `/es`, consumed by Task 3 (remaining route moves).

- [ ] **Step 1: Create the new locale-aware root layout**

Create `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kids & Teens Medical Group",
  description: "Board-certified pediatric care across Greater LA.",
  icons: {
    icon: "/clinic-logo.svg",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Delete the old root layout**

```bash
rm "app/layout.tsx"
```

- [ ] **Step 3: Move the Home page and its test**

```bash
mkdir -p "app/[locale]"
mv "app/page.tsx" "app/[locale]/page.tsx"
mv "app/page.test.tsx" "app/[locale]/page.test.tsx"
```

Do not edit the content of either file in this step — the imports inside (`@/lib/constants`, `@/data/...`, `@/components/...`) resolve the same regardless of the file's own location, so no content changes are needed yet.

- [ ] **Step 4: Run the full test suite**

```bash
npm test
```

Expected: all existing tests still pass (the Home page test still imports `from "./page"`, which now resolves to the moved file).

- [ ] **Step 5: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/` — confirm the homepage loads exactly as before (still in English, since nothing is translated yet). Open `http://localhost:3000/es` — confirm it also loads (same English content for now — that's expected, translation happens in Task 5). Confirm no console errors about missing locale or messages. Stop the server.

---

### Task 3: Move the remaining routes and switch to locale-aware links

**Files:**
- Move: `app/doctors/` → `app/[locale]/doctors/`
- Move: `app/locations/` → `app/[locale]/locations/`
- Move: `app/network/` → `app/[locale]/network/`
- Move: `app/foundation/` → `app/[locale]/foundation/`
- Move: `app/careers/` → `app/[locale]/careers/`
- Move: `app/insurance/` → `app/[locale]/insurance/`
- Move: `app/resources/` → `app/[locale]/resources/`
- Modify: `components/Header.tsx`, `components/Footer.tsx`, `app/[locale]/page.tsx`, `components/NetworkCard.tsx` (swap `next/link`'s `Link` for the locale-aware one)

**Interfaces:**
- Consumes: locale-aware `Link` from `i18n/navigation.ts` (Task 1)
- Produces: every route now lives under `[locale]` and every internal link preserves the current locale, consumed by all later tasks and by Plan B.

- [ ] **Step 1: Move the remaining route directories**

```bash
for dir in doctors locations network foundation careers insurance resources; do
  mv "app/$dir" "app/[locale]/$dir"
done
```

- [ ] **Step 2: Run the full test suite to confirm the moves alone don't break anything**

```bash
npm test
```

Expected: all tests still pass (no content changed yet, only file locations).

- [ ] **Step 3: Swap the Link import in Header.tsx**

Modify `components/Header.tsx` — change:

```tsx
import Link from "next/link";
```

to:

```tsx
import { Link } from "@/i18n/navigation";
```

- [ ] **Step 4: Swap the Link import in Footer.tsx**

Modify `components/Footer.tsx` — change:

```tsx
import Link from "next/link";
```

to:

```tsx
import { Link } from "@/i18n/navigation";
```

- [ ] **Step 5: Swap the Link import in the Home page**

Modify `app/[locale]/page.tsx` — change:

```tsx
import Link from "next/link";
```

to:

```tsx
import { Link } from "@/i18n/navigation";
```

- [ ] **Step 6: Swap the Link import in NetworkCard**

Modify `components/NetworkCard.tsx` — change:

```tsx
import Link from "next/link";
```

to:

```tsx
import { Link } from "@/i18n/navigation";
```

- [ ] **Step 7: Run the full test suite**

```bash
npm test
```

Expected: all tests still pass — the locale-aware `Link` renders a real `<a>` element with the same `href`/text content the tests already assert on (it only adds automatic locale-prefixing at runtime inside the Next.js router, which the RTL environment doesn't invoke without a router context, so hrefs in tests still resolve as plain paths like `/doctors`).

- [ ] **Step 8: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/es/doctors`, `http://localhost:3000/es/locations`, `http://localhost:3000/es/network`, `http://localhost:3000/es/foundation`, `http://localhost:3000/es/careers`, `http://localhost:3000/es/insurance`, `http://localhost:3000/es/resources` — confirm every one loads without error (still English content, expected until Plan B / Task 5-6 of this plan). From the English homepage (`/`), click "Find a Doctor" and confirm it goes to `/doctors` (no `/es` prefix). Stop the server.

---

### Task 4: Translate Header and Footer, add the language switcher

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Modify: `components/Header.tsx`, `components/Header.test.tsx`
- Modify: `components/Footer.tsx`, `components/Footer.test.tsx`
- Modify: `lib/constants.ts`

**Interfaces:**
- Consumes: `useTranslations`, `useLocale`, `usePathname` (from `i18n/navigation.ts`)
- Produces: `TEXT_PHONE_ES` constant, consumed by Footer only.

- [ ] **Step 1: Add the real Spanish text line to constants**

Modify `lib/constants.ts` — add after the existing `TEXT_PHONE` line:

```ts
export const TEXT_PHONE_ES = "(818) 423-5637";
```

- [ ] **Step 2: Add Header and Footer messages**

Modify `messages/en.json`:

```json
{
  "Header": {
    "doctors": "Doctors",
    "locations": "Locations",
    "more": "More",
    "network": "Network",
    "foundation": "Foundation",
    "careers": "Careers",
    "insurance": "Insurance",
    "resources": "Resources",
    "payOnline": "Pay Online",
    "portalLogIn": "Portal Log In",
    "appointments": "Appointments",
    "toggleMenu": "Toggle menu"
  },
  "Footer": {
    "tagline": "Board-certified pediatric care across 24 Greater LA clinics, with same-day visits, telehealth, and a doctor your family can stick with.",
    "textLabel": "Text",
    "patients": "Patients",
    "about": "About",
    "doctors": "Doctors",
    "locations": "Locations",
    "insurance": "Insurance",
    "resources": "Resources",
    "network": "Network",
    "foundation": "Foundation",
    "careers": "Careers",
    "rights": "All rights reserved."
  }
}
```

Modify `messages/es.json`:

```json
{
  "Header": {
    "doctors": "Doctores",
    "locations": "Ubicaciones",
    "more": "Más",
    "network": "Red",
    "foundation": "Fundación",
    "careers": "Empleo",
    "insurance": "Seguro",
    "resources": "Recursos",
    "payOnline": "Pagar en línea",
    "portalLogIn": "Portal del paciente",
    "appointments": "Citas",
    "toggleMenu": "Abrir menú"
  },
  "Footer": {
    "tagline": "Atención pediátrica certificada en 24 clínicas del área de Los Ángeles, con visitas el mismo día, telesalud y un médico con quien su familia puede continuar.",
    "textLabel": "Mensaje de texto",
    "patients": "Pacientes",
    "about": "Nosotros",
    "doctors": "Doctores",
    "locations": "Ubicaciones",
    "insurance": "Seguro",
    "resources": "Recursos",
    "network": "Red",
    "foundation": "Fundación",
    "careers": "Empleo",
    "rights": "Todos los derechos reservados."
  }
}
```

- [ ] **Step 3: Write the failing test for the language switcher**

Modify `components/Header.test.tsx` — replace the whole file with:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { Header } from "./Header";

describe("Header", () => {
  it("renders nav links to Doctors and Locations", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("renders the real booking, pay online, and patient portal links", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: /appointments/i })).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
    expect(screen.getByRole("link", { name: /pay online/i })).toHaveAttribute(
      "href",
      "https://healowpay.com"
    );
    expect(screen.getByRole("link", { name: /portal log in/i })).toHaveAttribute(
      "href",
      "https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp"
    );
  });

  it("renders a nav link to /network", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute("href", "/network");
  });

  it("renders a nav link to /foundation", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/foundation"
    );
  });

  it("renders nav links to Careers, Insurance, and Resources", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
    expect(screen.getByRole("link", { name: "Insurance" })).toHaveAttribute(
      "href",
      "/insurance"
    );
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute(
      "href",
      "/resources"
    );
  });

  it("toggles the desktop 'More' dropdown open and closed", async () => {
    renderWithIntl(<Header />);
    const moreButton = screen.getByRole("button", { name: "More" });
    expect(moreButton).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the mobile menu open and closed", async () => {
    renderWithIntl(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(screen.getByTestId("mobile-menu")).toHaveClass("hidden");

    await userEvent.click(toggle);
    expect(screen.getByTestId("mobile-menu")).not.toHaveClass("hidden");
  });

  it("renders an EN/ES language switcher linking to the same page in the other locale", () => {
    renderWithIntl(<Header />, "en");
    expect(screen.getByRole("link", { name: "ES" })).toBeInTheDocument();

    renderWithIntl(<Header />, "es");
    expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

```bash
npm test -- components/Header.test.tsx
```

Expected: FAIL — the current `Header` still uses hardcoded English strings directly (not via `useTranslations`) and has no language switcher, but since the *text* still matches for now, the failures should specifically be about the missing "ES"/"EN" switcher link. If `render` (not `renderWithIntl`) was still imported anywhere, that would also fail since `Header` will soon require the `NextIntlClientProvider` context — expected either way.

- [ ] **Step 5: Rewrite the Header component**

Replace `components/Header.tsx` entirely:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BOOKING_URL, PAY_ONLINE_URL, PATIENT_PORTAL_URL, MAIN_PHONE } from "@/lib/constants";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:
// links, e.g. "+18183615437" — matches components/Footer.tsx's formatting.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

const linkClass =
  "rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent";

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreOpen]);

  const otherLocale = locale === "en" ? "es" : "en";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory/95 shadow-[0_1px_0_0_rgba(18,24,31,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-5 py-2.5 sm:flex-nowrap sm:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/clinic-logo.svg"
            alt="Kids & Teens Medical Group"
            width={48}
            height={15}
            className="h-11 w-auto sm:h-12"
            priority
            unoptimized
          />
        </Link>

        <nav
          data-testid="mobile-menu"
          className={`order-4 w-full flex-col gap-1 border-t border-border pt-3 font-medium text-ink-soft sm:order-none sm:flex sm:w-auto sm:flex-1 sm:flex-row sm:items-center sm:justify-center sm:gap-7 sm:border-none sm:pt-0 sm:text-sm ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          <Link href="/doctors" className={linkClass}>
            {t("doctors")}
          </Link>
          <Link href="/locations" className={linkClass}>
            {t("locations")}
          </Link>

          <div ref={moreRef} className="relative flex flex-col gap-1 sm:inline-block">
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className="hidden items-center gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:flex sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
            >
              {t("more")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={`flex flex-col gap-1 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-56 sm:flex-col sm:gap-0.5 sm:rounded-2xl sm:border sm:border-border sm:bg-white sm:p-2 sm:shadow-card ${
                moreOpen ? "sm:flex" : "sm:hidden"
              }`}
            >
              <Link
                href="/network"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("network")}
              </Link>
              <Link
                href="/foundation"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("foundation")}
              </Link>
              <Link
                href="/careers"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("careers")}
              </Link>
              <Link
                href="/insurance"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("insurance")}
              </Link>
              <Link
                href="/resources"
                onClick={() => setMoreOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory-deep hover:text-teal-dark"
              >
                {t("resources")}
              </Link>
            </div>
          </div>

          <a href={PAY_ONLINE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t("payOnline")}
          </a>
          <a
            href={PATIENT_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("portalLogIn")}
          </a>
          <a
            href={`tel:${toE164(MAIN_PHONE)}`}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 font-display font-semibold text-ink sm:rounded-none sm:px-0 sm:py-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-teal-dark">
              <path
                d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {MAIN_PHONE}
          </a>

          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-xl px-3 py-2.5 font-display font-semibold uppercase text-ink-soft transition-colors hover:bg-ivory-deep hover:text-teal-dark sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </nav>

        <div className="order-3 flex shrink-0 items-center gap-2.5 sm:order-none">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-4 py-2 font-display text-xs font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t("appointments")}
          </a>

          <button
            type="button"
            aria-label={t("toggleMenu")}
            aria-pressed={menuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-border sm:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
npm test -- components/Header.test.tsx
```

Expected: PASS, 8 tests.

- [ ] **Step 7: Write the failing test for Footer**

Replace `components/Footer.test.tsx` entirely:

```tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the phone, text line, and email as clickable links", () => {
    renderWithIntl(<Footer />);

    expect(screen.getByRole("link", { name: "(818) 361-5437" })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
    expect(screen.getByRole("link", { name: /626\) 298-7121/ })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
    expect(screen.getByRole("link", { name: "customerservice@ktdoctor.com" })).toHaveAttribute(
      "href",
      "mailto:customerservice@ktdoctor.com"
    );
  });

  it("renders links to every page on the site", () => {
    renderWithIntl(<Footer />);
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute(
      "href",
      "/locations"
    );
    expect(screen.getByRole("link", { name: "Insurance" })).toHaveAttribute(
      "href",
      "/insurance"
    );
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute(
      "href",
      "/resources"
    );
    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute("href", "/network");
    expect(screen.getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/foundation"
    );
    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
  });

  it("uses the Spanish text line when rendered in the es locale", () => {
    renderWithIntl(<Footer />, "es");
    expect(screen.getByRole("link", { name: /818\) 423-5637/ })).toHaveAttribute(
      "href",
      "sms:+18184235637"
    );
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

```bash
npm test -- components/Footer.test.tsx
```

Expected: FAIL — `Footer` doesn't yet use translations or the Spanish text line.

- [ ] **Step 9: Rewrite the Footer component**

Replace `components/Footer.tsx` entirely:

```tsx
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MAIN_PHONE, TEXT_PHONE, TEXT_PHONE_ES, GENERAL_EMAIL } from "@/lib/constants";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437".
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const textPhone = locale === "es" ? TEXT_PHONE_ES : TEXT_PHONE;

  return (
    <footer className="mt-16 bg-navy text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:flex-row sm:justify-between sm:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory p-1.5">
              <Image
                src="/clinic-logo.svg"
                alt="Kids & Teens Medical Group"
                width={36}
                height={11}
                className="h-full w-auto"
                unoptimized
              />
            </span>
            <p className="font-display text-lg font-bold">Kids &amp; Teens Medical Group</p>
          </div>
          <p className="mt-4 text-sm text-ivory/70">{t("tagline")}</p>

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a
              href={`tel:${toE164(MAIN_PHONE)}`}
              className="font-semibold text-ivory hover:text-teal-tint"
            >
              {MAIN_PHONE}
            </a>
            <a href={`sms:${toE164(textPhone)}`} className="text-ivory/70 hover:text-ivory">
              {t("textLabel")}: {textPhone}
            </a>
            <a href={`mailto:${GENERAL_EMAIL}`} className="text-ivory/70 hover:text-ivory">
              {GENERAL_EMAIL}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("patients")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/doctors" className="hover:text-ivory">
                  {t("doctors")}
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-ivory">
                  {t("locations")}
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-ivory">
                  {t("insurance")}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-ivory">
                  {t("resources")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-teal-tint">
              {t("about")}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory/80">
              <li>
                <Link href="/network" className="hover:text-ivory">
                  {t("network")}
                </Link>
              </li>
              <li>
                <Link href="/foundation" className="hover:text-ivory">
                  {t("foundation")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-ivory">
                  {t("careers")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-ivory/50 sm:px-8">
        © {new Date().getFullYear()} Kids &amp; Teens Medical Group. {t("rights")}
      </div>
    </footer>
  );
}
```

- [ ] **Step 10: Run the test to verify it passes**

```bash
npm test -- components/Footer.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 11: Run the full test suite**

```bash
npm test
```

Expected: every test file passes.

- [ ] **Step 12: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/` — confirm the header/footer render in English, and clicking "ES" in the nav navigates to `/es` with the header/footer now in Spanish (including the Spanish text line `(818) 423-5637` in the footer). Click "EN" from there to confirm it returns to `/`. Test on mobile width too — confirm the EN/ES link appears in the mobile menu. Stop the server.

---

### Task 5: Translate the Home page

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl), `renderWithIntl` (Task 1)
- Produces: nothing new — this task only translates the Home page's own static copy (per the Global Constraints note, the embedded Network/Foundation/Insurance card descriptions stay English until Plan B).

- [ ] **Step 1: Add Home page messages**

Modify `messages/en.json` — keep the existing `"Header"` and `"Footer"` keys from Task 4 exactly as they are, and add a new `"Home"` key as a sibling (the file's top-level shape becomes `{"Header": {...}, "Footer": {...}, "Home": {...}}`):

```json
"Home": {
    "badge": "{count} clinics across Greater LA",
    "headingStart": "Compassionate pediatric care,",
    "headingHighlight": "close to home.",
    "subheading": "Board-certified pediatricians across Greater LA, with same-day visits, telehealth, and a doctor your family can stick with from newborn to age 21.",
    "bookAppointment": "Book an Appointment",
    "findDoctor": "Find a Doctor",
    "findClinic": "Find a Clinic",
    "statClinics": "Clinic locations",
    "statProviders": "Board-certified providers",
    "statYears": "Years of pediatric care",
    "statAges": "Ages served",
    "whyChooseUsEyebrow": "Why families choose us",
    "whyChooseUsHeading": "Care built around your family's schedule.",
    "whyChooseUsBody": "{count} clinics across Greater LA means expert pediatric care is always close by, with same-day visits and telehealth for the days you can't make it in.",
    "featureSameDay": "Same-day visits",
    "featureTelehealth": "Telehealth visits",
    "featureBoardCertified": "Board-certified team",
    "featureAges": "Ages 0 to 21 welcome",
    "teamEyebrow": "Our team",
    "teamHeading": "{count} board-certified pediatricians",
    "browseAllDoctors": "Browse all doctors",
    "networkEyebrow": "One Network",
    "networkHeading": "More ways to care for your family.",
    "seeFullNetwork": "See the full network",
    "clinicNearYouHeading": "A clinic near you",
    "clinicNearYouBody": "{count} locations across Greater LA with addresses, phone lines, and a live map.",
    "viewLocations": "View locations",
    "careersHeading": "Careers",
    "careersBody": "Join a pediatric network built around same-day care.",
    "joinOurTeam": "Join our team",
    "insuranceHeading": "Insurance",
    "insuranceBody": "{categories}, and Serendib Healthways.",
    "seeAcceptedInsurance": "See accepted insurance",
    "resourcesHeading": "Parent Resources",
    "resourcesBody": "Vaccine schedules, forms, and developmental guides.",
    "browseResources": "Browse parent resources",
    "bottomCtaHeading": "Your child can be seen today.",
    "bottomCtaBody": "Book online in under a minute, or call and we'll find the soonest opening."
  }
```

Modify `messages/es.json` the same way — keep the existing `"Header"` and `"Footer"` keys from Task 4 exactly as they are, and add this `"Home"` key as a sibling:

```json
"Home": {
    "badge": "{count} clínicas en el área de Los Ángeles",
    "headingStart": "Atención pediátrica compasiva,",
    "headingHighlight": "cerca de casa.",
    "subheading": "Pediatras certificados en el área de Los Ángeles, con visitas el mismo día, telesalud y un médico con quien su familia puede continuar desde recién nacido hasta los 21 años.",
    "bookAppointment": "Reservar una cita",
    "findDoctor": "Buscar un doctor",
    "findClinic": "Buscar una clínica",
    "statClinics": "Clínicas",
    "statProviders": "Médicos certificados",
    "statYears": "Años de atención pediátrica",
    "statAges": "Edades atendidas",
    "whyChooseUsEyebrow": "Por qué las familias nos eligen",
    "whyChooseUsHeading": "Atención adaptada al horario de su familia.",
    "whyChooseUsBody": "{count} clínicas en el área de Los Ángeles significa que la atención pediátrica experta siempre está cerca, con visitas el mismo día y telesalud para los días que no pueda venir.",
    "featureSameDay": "Visitas el mismo día",
    "featureTelehealth": "Visitas por telesalud",
    "featureBoardCertified": "Equipo certificado",
    "featureAges": "Edades de 0 a 21 años",
    "teamEyebrow": "Nuestro equipo",
    "teamHeading": "{count} pediatras certificados",
    "browseAllDoctors": "Ver todos los doctores",
    "networkEyebrow": "Una red",
    "networkHeading": "Más formas de cuidar a su familia.",
    "seeFullNetwork": "Ver la red completa",
    "clinicNearYouHeading": "Una clínica cerca de usted",
    "clinicNearYouBody": "{count} ubicaciones en el área de Los Ángeles con direcciones, teléfonos y un mapa en vivo.",
    "viewLocations": "Ver ubicaciones",
    "careersHeading": "Empleo",
    "careersBody": "Únase a una red pediátrica enfocada en la atención el mismo día.",
    "joinOurTeam": "Únase a nuestro equipo",
    "insuranceHeading": "Seguro",
    "insuranceBody": "{categories}, y Serendib Healthways.",
    "seeAcceptedInsurance": "Ver seguros aceptados",
    "resourcesHeading": "Recursos para padres",
    "resourcesBody": "Calendarios de vacunas, formularios y guías de desarrollo.",
    "browseResources": "Ver recursos para padres",
    "bottomCtaHeading": "Su hijo puede ser atendido hoy.",
    "bottomCtaBody": "Reserve en línea en menos de un minuto, o llame y encontraremos la cita más pronta."
  }
}
```

- [ ] **Step 2: Write the failing test for translated Home page content**

Modify `app/[locale]/page.test.tsx` — add a new test inside the existing `describe("Home page", ...)` block (keep all existing tests as-is, just change `render` to `renderWithIntl` throughout the file and add the import):

```tsx
import { renderWithIntl } from "@/lib/test-utils";
```

Replace every `render(<Home />)` call in the file with `renderWithIntl(<Home />)`, and add this new test:

```tsx
  it("renders the hero heading and CTA copy in Spanish when locale is es", () => {
    renderWithIntl(<Home />, "es");
    expect(screen.getByText("cerca de casa.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reservar una cita/i })).toBeInTheDocument();
  });
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- app/\[locale\]/page.test.tsx
```

Expected: FAIL — `Home` still renders hardcoded English strings regardless of locale.

- [ ] **Step 4: Rewrite the Home page to use translations**

Replace `app/[locale]/page.tsx` entirely:

```tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BOOKING_URL } from "@/lib/constants";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";
import { networkBrands } from "@/data/network";
import { NetworkCard } from "@/components/NetworkCard";
import { foundation } from "@/data/foundation";
import { insuranceInfo } from "@/data/insurance";

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Home() {
  const t = useTranslations("Home");
  const previewDoctors = doctors.slice(0, 4);
  const avatarTints = ["bg-teal-tint text-teal-dark", "bg-gold-tint text-gold"];

  const STATS = [
    { label: t("statClinics"), value: `${locations.length}` },
    { label: t("statProviders"), value: `${doctors.length}+` },
    { label: t("statYears"), value: "18+" },
    { label: t("statAges"), value: "0-21" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-teal-tint/60 to-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path
                  d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {t("badge", { count: locations.length })}
            </span>

            <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              {t("headingStart")}{" "}
              <span className="text-teal-dark">{t("headingHighlight")}</span>
            </h1>

            <p className="max-w-lg text-lg text-ink-soft">{t("subheading")}</p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
              >
                {t("bookAppointment")}
              </a>
              <Link
                href="/doctors"
                className="rounded-full border border-border bg-white px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                {t("findDoctor")}
              </Link>
              <Link
                href="/locations"
                className="rounded-full border border-border bg-white px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                {t("findClinic")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=1200&q=80"
                alt="A pediatrician examining a young patient during a check-up"
                width={1200}
                height={1400}
                className="h-[22rem] w-full object-cover sm:h-[26rem]"
                priority
              />
            </div>

            <div className="relative z-10 mx-4 -mt-10 rounded-2xl border border-border bg-white p-5 shadow-card sm:absolute sm:-bottom-8 sm:left-6 sm:right-6 sm:mx-0 sm:mt-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <p className="font-display text-2xl font-extrabold text-teal-dark">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs leading-tight text-ink-soft">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why families choose us */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?auto=format&fit=crop&w=1000&q=80"
              alt="Modern medical clinic building with a glass facade"
              width={1000}
              height={1000}
              className="h-72 w-full object-cover sm:h-96"
            />
          </div>

          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              {t("whyChooseUsEyebrow")}
            </span>
            <h2 className="mt-2 max-w-md font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {t("whyChooseUsHeading")}
            </h2>
            <p className="mt-3 max-w-md text-ink-soft">
              {t("whyChooseUsBody", { count: locations.length })}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {[
                {
                  label: t("featureSameDay"),
                  icon: (
                    <path
                      d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z M12 7v5l3.5 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: t("featureTelehealth"),
                  icon: (
                    <path
                      d="M15 10.5 20 7v10l-5-3.5M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: t("featureBoardCertified"),
                  icon: (
                    <path
                      d="m9 12 2 2 4-4M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: t("featureAges"),
                  icon: (
                    <path
                      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      {item.icon}
                    </svg>
                  </span>
                  <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors preview */}
      <section className="border-y border-border bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
                {t("teamEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("teamHeading", { count: doctors.length })}
              </h2>
            </div>
            <Link
              href="/doctors"
              className="font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("browseAllDoctors")} →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {previewDoctors.map((doc, i) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-border bg-white p-5 text-center shadow-card"
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-bold ${
                    avatarTints[i % avatarTints.length]
                  }`}
                >
                  {initials(doc.name)}
                </div>
                <p className="mt-3 font-display text-sm font-bold text-ink">{doc.name}</p>
                <p className="text-xs text-ink-soft">{doc.credentials}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network teaser */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
              {t("networkEyebrow")}
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {t("networkHeading")}
            </h2>
          </div>
          <Link
            href="/network"
            className="font-display font-semibold text-teal-dark hover:text-teal"
          >
            {t("seeFullNetwork")} →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {networkBrands.map((brand) => (
            <NetworkCard key={brand.id} brand={brand} compact />
          ))}
        </div>
      </section>

      {/* Find a clinic */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Link
          href="/locations"
          className="group flex flex-col gap-6 rounded-3xl border border-border bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-tint text-gold">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                <path
                  d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <div>
              <p className="font-display text-xl font-bold text-ink">
                {t("clinicNearYouHeading")}
              </p>
              <p className="mt-1 text-ink-soft">
                {t("clinicNearYouBody", { count: locations.length })}
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-border px-5 py-2.5 font-display font-semibold text-ink transition-colors group-hover:border-teal group-hover:text-teal-dark">
            {t("viewLocations")}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </section>

      {/* Foundation teaser */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-white p-8 text-center shadow-card sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Image
              src={foundation.logoSrc}
              alt={`${foundation.name} logo`}
              width={160}
              height={53}
              unoptimized
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="font-display text-lg font-bold text-ink">{foundation.name}</p>
              <p className="mt-1 max-w-md text-sm text-ink-soft">{foundation.mission}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={foundation.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              Donate Now
            </a>
            <Link
              href="/foundation"
              className="rounded-full border border-border bg-white px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Careers, Insurance, Resources teaser */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-card">
            <p className="font-display text-lg font-bold text-ink">{t("careersHeading")}</p>
            <p className="mt-2 text-sm text-ink-soft">{t("careersBody")}</p>
            <Link
              href="/careers"
              className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("joinOurTeam")} →
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-card">
            <p className="font-display text-lg font-bold text-ink">{t("insuranceHeading")}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {t("insuranceBody", { categories: insuranceInfo.acceptedCategories.join(", ") })}
            </p>
            <Link
              href="/insurance"
              className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("seeAcceptedInsurance")} →
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-card">
            <p className="font-display text-lg font-bold text-ink">{t("resourcesHeading")}</p>
            <p className="mt-2 text-sm text-ink-soft">{t("resourcesBody")}</p>
            <Link
              href="/resources"
              className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
            >
              {t("browseResources")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-navy px-8 py-10 text-white sm:flex-row sm:items-center sm:justify-between">
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
    </main>
  );
}
```

Note: the Foundation teaser section's "Donate Now" and "Learn more" button text, and its logo/mission (from `foundation.name`/`foundation.mission`), are intentionally left as plain English strings here per the Global Constraints note — they come from `data/foundation.ts`, which Plan B translates.

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- app/\[locale\]/page.test.tsx
```

Expected: PASS, all tests including the new Spanish test.

- [ ] **Step 6: Run the full test suite**

```bash
npm test
```

Expected: every test file passes.

- [ ] **Step 7: Verify manually**

```bash
npm run dev
```

Open `http://localhost:3000/` and `http://localhost:3000/es` side by side (or in two tabs). Confirm the hero, stats, "why families choose us," doctors preview, "a clinic near you," and bottom CTA are all in Spanish on `/es`. Confirm the Foundation teaser's mission text and the Careers/Insurance/Resources card *headings* are translated, but note (as expected per this plan's known gap) the Foundation's own description text stays in English until Plan B. Resize to mobile width and spot-check both locales. Stop the server.

---

### Task 6: Translate Doctors and Locations pages

**Files:**
- Modify: `messages/en.json`, `messages/es.json`
- Modify: `components/DoctorsPageContent.tsx`, `app/[locale]/doctors/page.test.tsx`
- Modify: `components/LocationsPageContent.tsx`, `app/[locale]/locations/page.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (next-intl), `renderWithIntl` (Task 1)
- Produces: nothing new — final task of Plan A.

- [ ] **Step 1: Add Doctors and Locations messages**

Modify `messages/en.json` — keep the existing `"Header"`, `"Footer"`, and `"Home"` keys exactly as they are, and add these two new keys as siblings:

```json
"Doctors": {
    "eyebrow": "Our Team",
    "heading": "Our Doctors",
    "description": "{count} board-certified pediatricians across Greater LA. Search by name, or filter by clinic and specialty.",
    "searchPlaceholder": "Search by name...",
    "filterByLocation": "Filter by location",
    "filterBySpecialty": "Filter by specialty",
    "allLocations": "All Locations",
    "allSpecialties": "All Specialties",
    "showingProviders": "Showing {filtered} of {total} providers"
  },
  "Locations": {
    "eyebrowCount": "{count} Locations",
    "heading": "Find a Clinic",
    "description": "A clinic close to home, from the Valley to the South Bay.",
    "list": "List",
    "map": "Map",
    "showingLocations": "Showing {count} of {count} locations"
  }
```

Modify `messages/es.json` the same way — keep the existing `"Header"`, `"Footer"`, and `"Home"` keys exactly as they are, and add these two new keys as siblings:

```json
"Doctors": {
    "eyebrow": "Nuestro Equipo",
    "heading": "Nuestros Doctores",
    "description": "{count} pediatras certificados en el área de Los Ángeles. Busque por nombre, o filtre por clínica y especialidad.",
    "searchPlaceholder": "Buscar por nombre...",
    "filterByLocation": "Filtrar por ubicación",
    "filterBySpecialty": "Filtrar por especialidad",
    "allLocations": "Todas las ubicaciones",
    "allSpecialties": "Todas las especialidades",
    "showingProviders": "Mostrando {filtered} de {total} médicos"
  },
  "Locations": {
    "eyebrowCount": "{count} ubicaciones",
    "heading": "Buscar una clínica",
    "description": "Una clínica cerca de casa, desde el Valley hasta el South Bay.",
    "list": "Lista",
    "map": "Mapa",
    "showingLocations": "Mostrando {count} de {count} ubicaciones"
  }
```

- [ ] **Step 2: Write the failing test for translated Doctors content**

Modify `app/[locale]/doctors/page.test.tsx` — add the import `import { renderWithIntl } from "@/lib/test-utils";`, replace every `render(<DoctorsPage />)` with `renderWithIntl(<DoctorsPage />)`, and add:

```tsx
  it("renders the heading and search placeholder in Spanish when locale is es", () => {
    renderWithIntl(<DoctorsPage />, "es");
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre...")).toBeInTheDocument();
  });
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test -- app/\[locale\]/doctors/page.test.tsx
```

Expected: FAIL — `DoctorsPageContent` still uses hardcoded English strings.

- [ ] **Step 4: Rewrite DoctorsPageContent to use translations**

Replace `components/DoctorsPageContent.tsx` entirely:

```tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { filterDoctors, getAllSpecialties } from "@/lib/filters";
import { DoctorCard } from "@/components/DoctorCard";

export function DoctorsPageContent() {
  const t = useTranslations("Doctors");
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState("");
  const [specialty, setSpecialty] = useState("");

  const specialties = useMemo(() => getAllSpecialties(doctors), []);

  const filtered = useMemo(
    () =>
      filterDoctors(doctors, {
        search: search || undefined,
        locationId: locationId || undefined,
        specialty: specialty || undefined,
      }),
    [search, locationId, specialty]
  );

  const locationNameById = useMemo(() => new Map(locations.map((l) => [l.id, l.name])), []);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description", { count: doctors.length })}</p>

      <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-border bg-white p-4 shadow-card sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-border bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
        />

        <label className="flex flex-col text-sm">
          <span className="sr-only">{t("filterByLocation")}</span>
          <select
            aria-label={t("filterByLocation")}
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="rounded-full border border-border bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
          >
            <option value="">{t("allLocations")}</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="sr-only">{t("filterBySpecialty")}</span>
          <select
            aria-label={t("filterBySpecialty")}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-full border border-border bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
          >
            <option value="">{t("allSpecialties")}</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm font-medium text-ink-soft">
        {t("showingProviders", { filtered: filtered.length, total: doctors.length })}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            locationNames={doc.locationIds.map((id) => locationNameById.get(id) ?? id)}
          />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- app/\[locale\]/doctors/page.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Write the failing test for translated Locations content**

Modify `app/[locale]/locations/page.test.tsx` — add the import `import { renderWithIntl } from "@/lib/test-utils";`, replace every `render(<LocationsPage />)` with `renderWithIntl(<LocationsPage />)`, and add:

```tsx
  it("renders the heading and List/Map labels in Spanish when locale is es", () => {
    renderWithIntl(<LocationsPage />, "es");
    expect(screen.getByText("Buscar una clínica")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lista" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mapa" })).toBeInTheDocument();
  });
```

- [ ] **Step 7: Run the test to verify it fails**

```bash
npm test -- app/\[locale\]/locations/page.test.tsx
```

Expected: FAIL — `LocationsPageContent` still uses hardcoded English strings.

- [ ] **Step 8: Rewrite LocationsPageContent to use translations**

Replace `components/LocationsPageContent.tsx` entirely:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/LocationCard";
import { LocationsMap } from "@/components/LocationsMap";

type View = "list" | "map";

export function LocationsPageContent() {
  const t = useTranslations("Locations");
  const [view, setView] = useState<View>("list");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrowCount", { count: locations.length })}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-card">
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
              view === "list" ? "bg-teal text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t("list")}
          </button>
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
              view === "map" ? "bg-teal text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t("map")}
          </button>
        </div>

        <p className="text-sm font-medium text-ink-soft">
          {t("showingLocations", { count: locations.length })}
        </p>
      </div>

      {view === "list" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-card">
          <LocationsMap locations={locations} />
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

```bash
npm test -- app/\[locale\]/locations/page.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Run the full test suite**

```bash
npm test
```

Expected: every test file across the whole app passes.

- [ ] **Step 11: Verify manually end-to-end**

```bash
npm run dev
```

1. Open `http://localhost:3000/es/doctors` — confirm the heading, search placeholder, filter labels, and results count are in Spanish, and doctor names/credentials/location names are unchanged.
2. Open `http://localhost:3000/es/locations` — confirm the heading, description, and List/Map buttons are in Spanish, and addresses/phone numbers are unchanged.
3. From `/es/doctors`, click the "EN" switcher — confirm it goes to `/doctors` with English content.
4. From `/doctors`, click "ES" — confirm it goes to `/es/doctors`, not just `/es`.
5. Resize to mobile width and spot-check both pages in both locales.

Stop the server once confirmed.

---

## Self-Review Notes

- **Spec coverage:** next-intl infra + locale-aware Link (Tasks 1-3), Header/Footer translation + language switcher + real Spanish text line (Task 4), Home page translation (Task 5), Doctors/Locations translation (Task 6) — all covered.
- **Known gap carried forward, not silently resolved:** the Foundation/Network/Insurance card copy embedded in the Home page (sourced from `data/foundation.ts`/`data/network.ts`) stays English until Plan B — called out explicitly in Global Constraints and in Task 5's manual verification step, not fixed here.
- **Type/key consistency check:** every `t("key")` call in each rewritten component has a matching key in both `messages/en.json` and `messages/es.json` with the same interpolation placeholders (`{count}`, `{filtered}`, `{total}`, `{categories}`).
- **No git:** every task ends in a manual verification step, not a commit.
- **No em dash:** all new copy above was written without one, in both languages.
