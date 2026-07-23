# SEO — Design

**Date:** 2026-07-23
**Status:** Approved (pending spec review)

## Problem

The site has only skeletal SEO. Nearly every route already exports a basic
`title`/`description` (via `metadata` or `generateMetadata`), but the machinery
search engines and social platforms actually reward is missing:

- No `metadataBase`, so no absolute URLs for canonical/Open Graph.
- No canonical URLs and no `hreflang` alternates — critical for a bilingual
  (`en`/`es`) site, or Google treats the two locales as duplicate content.
- No Open Graph / Twitter card tags — link previews are bare.
- No `sitemap.xml`, no `robots.txt`.
- No structured data (JSON-LD) — a pediatric group with named physicians and
  ~25 clinic locations is exactly the case where `MedicalOrganization`,
  `Physician`, and `LocalBusiness` markup drive rich results and local SEO.
- No social share images.
- The **home page** (`app/[locale]/page.tsx`) has no metadata at all.
- Metadata on `/es` pages is currently **English** even though the page bodies
  are translated.

## Goal

Add comprehensive, correct, bilingual technical SEO: consistent per-page metadata
with canonical + `hreflang`, Open Graph / Twitter cards, JSON-LD structured data,
`sitemap.xml`, `robots.txt`, and generated Open Graph share images — with metadata
localized into Spanish on `/es` routes.

## Decisions (from brainstorming)

- **Scope:** Everything — core technical SEO **+** structured data **+** generated
  OG images.
- **Localization:** Yes. Move meta titles/descriptions into `next-intl` message
  files so `/es` pages get real Spanish metadata.
- **Canonical domain:** `https://www.ktdoctor.com` (the `www` host, matching
  `data/legal.ts` and `data/doctors.ts`).
- **OG image font:** bundle one brand `.ttf` (Plus Jakarta Sans) into the repo for
  Satori — cleanest and on-brand.
- **Architecture:** a central SEO module (`lib/seo.ts`) rather than inline
  per-page duplication, matching how the codebase already centralizes shared logic
  (`lib/constants.ts`, `lib/filters.ts`).

## Environment facts (verified)

- Next.js **16.2.10**, `next-intl` v4, React 19. App Router under `app/[locale]/`.
- Routing: `defineRouting({ locales: ["en","es"], defaultLocale: "en",
  localePrefix: "as-needed" })`. So the default locale has **no prefix**
  (`/about`) and Spanish is prefixed (`/es/about`). `middleware.ts` handles it.
- Per Next 16 docs (read from `node_modules/next/dist/docs/`): `params` is a
  `Promise` in `generateMetadata` **and** in `opengraph-image` default exports;
  `sitemap.ts` supports `alternates.languages`; `robots.ts` returns
  `MetadataRoute.Robots`; OG images generate via `next/og` `ImageResponse`.
- Data localization: `stories` (blog), `services`, and `faqs` carry `*Es` fields.
  `doctors` and `locations` are **English-only**.
- The FAQ (`FaqAccordion`, backed by `data/faq.ts`) renders on the **home page**.

## Routes covered

**Static (14):** `/`, `/about`, `/blog`, `/careers`, `/doctors`, `/foundation`,
`/insurance`, `/locations`, `/network`, `/privacy-policy`, `/resources`,
`/services`, `/terms-and-conditions`, `/testimonials`.

**Dynamic:** `/doctors/[slug]` (from `data/doctors`), `/locations/[slug]` (from
`data/locations`), `/services/[slug]` (flattened from `serviceCategories`),
`/blog/[slug]` (from `data/stories`).

## Approach

### 1. Foundations — `lib/seo.ts` + constants + root layout

Add to `lib/constants.ts`:

```ts
export const SITE_URL = "https://www.ktdoctor.com";
export const SITE_NAME = "Kids & Teens Medical Group";
```

New `lib/seo.ts`:

- `localePath(locale, path)` — applies the `as-needed` rule: `en` → `path`
  (home → `/`), `es` → `/es${path}` (home → `/es`).
- `absoluteUrl(locale, path)` → `${SITE_URL}${localePath(locale, path)}`.
- `buildAlternates(path)` → `{ canonical: absoluteUrl("en", path), languages: {
  en, es, "x-default": <en> } }`. Canonical always points at the English URL;
  `x-default` → English.
- `buildMetadata({ locale, path, title, description, image?, type? })` →
  `Metadata` with `title`, `description`, `alternates`, `openGraph`
  (title/description/url/siteName/locale/type + image when given) and `twitter`
  (`summary_large_image`). Relative image paths resolve against `metadataBase`.

`app/[locale]/layout.tsx` changes:

- `metadataBase: new URL(SITE_URL)`.
- `title: { default: "Kids & Teens Medical Group | Pediatric Care Across Greater
  LA", template: "%s | Kids & Teens Medical Group" }`.
- Site-wide default `openGraph` (siteName, `locale` per request locale, type
  `website`) and `twitter` (`summary_large_image`). Keeps existing `icons`.

### 2. Per-page metadata + Spanish localization

- New `Seo` namespace in `messages/en.json` **and** `messages/es.json`:
  `{ "<pageKey>": { "title": ..., "description": ... } }` for the 14 static
  routes, **including `home`** (fixes the missing home metadata).
- Each static `page.tsx` gets/updates `generateMetadata({ params })` that reads
  its `Seo.<pageKey>` strings via `getTranslations({ locale, namespace: "Seo" })`
  and returns `buildMetadata({ locale, path, title, description })`. The
  title-template suffix replaces the hardcoded `"| Kids & Teens Medical Group"`
  strings currently in some titles.
- Dynamic pages:
  - **blog & services** — use existing `*Es` fields for localized title/description.
  - **doctors & locations** — English-only data; title/description stay English
    but still get correct canonical/`hreflang`/OG via `buildMetadata`.
- Preserve existing `generateStaticParams` on all dynamic routes; `generateMetadata`
  returns `{}` for a not-found slug (current behavior).

### 3. Structured data (JSON-LD)

New `components/JsonLd.tsx` — a server component rendering
`<script type="application/ld+json" dangerouslySetInnerHTML={{ __html:
JSON.stringify(data) }} />`. Builders live in `lib/seo.ts` (pure functions,
unit-tested):

- `organizationJsonLd()` → `MedicalOrganization` (name, url, logo, telephone from
  `MAIN_PHONE`, `sameAs`, `areaServed: "Greater Los Angeles"`). Rendered site-wide
  in `[locale]/layout.tsx`.
- `physicianJsonLd(doctor, locale)` → `Physician` (name, `medicalSpecialty`,
  `worksFor` the org, affiliated locations, `image`, `url`). Doctor detail page.
- `localBusinessJsonLd(location)` → `MedicalClinic` (name, `address` parsed into
  `PostalAddress`, `geo` from `lat`/`lng` when present, `telephone`, `url`,
  `image` from first photo, opening hours from `hours.officeHours`). Location
  detail page.
- `articleJsonLd(story, locale)` → `Article` + `MedicalWebPage` (headline, image,
  `datePublished` from `story.date`, author, publisher = org). Blog post page.
- `breadcrumbJsonLd(items)` → `BreadcrumbList`. All four detail pages.
- `faqPageJsonLd(faqs, locale)` → `FAQPage`. Home page (localized via `*Es`).

Address parsing: `data/locations.ts` addresses are single strings like
`"5115 Clareton Dr UNIT 150, Agoura Hills, CA 91301"`. A small `parseAddress`
helper splits into `streetAddress` / `addressLocality` / `addressRegion` /
`postalCode`; if parsing is uncertain it falls back to emitting the full string as
`streetAddress` (never emits wrong structured fields).

### 4. `sitemap.ts` + `robots.ts`

Both at the **`app/` root** (not inside `[locale]`) → served at `/sitemap.xml`
and `/robots.txt`.

- `app/sitemap.ts` — default export returns `MetadataRoute.Sitemap`. For each of
  the 14 static routes and every dynamic slug (doctors, locations, services,
  blog), emit one entry keyed on the English URL with
  `alternates.languages: { en, es }`. Sensible `changeFrequency`/`priority`
  (home highest; legal pages lowest). `lastModified: new Date()` at build time.
- `app/robots.ts` — `rules: { userAgent: "*", allow: "/" }`,
  `sitemap: ${SITE_URL}/sitemap.xml`, `host: SITE_URL`.

### 5. Generated Open Graph images (`next/og`)

Bundle `Plus_Jakarta_Sans` (one or two weights) as `.ttf` under
`app/_og/fonts/`, read via `readFile(join(process.cwd(), "app/_og/fonts/…"))`.
A shared `app/_og/template.tsx` helper renders the branded card (brand background,
logo, title text, "Kids & Teens Medical Group" wordmark) to keep all cards
visually identical.

- `app/[locale]/opengraph-image.tsx` — branded **default** (logo + tagline),
  covering home and all static pages. `size = { width: 1200, height: 630 }`,
  `contentType = "image/png"`, `alt`.
- Per-type generators, each reading its entity by slug and rendering the entity
  name into the shared template:
  - `app/[locale]/doctors/[slug]/opengraph-image.tsx`
  - `app/[locale]/locations/[slug]/opengraph-image.tsx`
  - `app/[locale]/blog/[slug]/opengraph-image.tsx`
  - `app/[locale]/services/[slug]/opengraph-image.tsx`

Next auto-emits `og:image` / `twitter:image` tags (absolute via `metadataBase`);
no manual image wiring needed in `buildMetadata` for these routes.

### 6. Tests & verification

Follow the existing colocated `*.test.ts` / vitest convention; write tests first
(TDD) for the pure logic:

- `lib/seo.test.ts` — `localePath`/`absoluteUrl` for both locales incl. home;
  `buildAlternates` shape (canonical + en/es/x-default); `buildMetadata` output;
  each JSON-LD builder emits valid `@context`/`@type` and expected fields;
  `parseAddress` incl. the fallback path.
- `app/sitemap.test.ts` — expected URL count (static + all dynamic slugs), every
  entry absolute and under `SITE_URL`, each has `alternates.languages.es`.
- `app/robots.test.ts` — allows `/`, references the sitemap.
- `components/JsonLd.test.tsx` — renders one script tag with the serialized JSON.

Conventions to honor: **no em dash (—)** in data/user-facing strings (enforced by
existing tests); keep the Spanish strings in the same style as existing `*Es`
copy.

Final gate: `npm run test`, `npm run build`, and `npm run lint` all green; spot-check
rendered `<head>` (canonical, hreflang, og:*) and one generated OG image via the
dev server / Playwright.

## Out of scope

- Analytics / GTM / pixels.
- Search Console / Bing verification tokens (a `verification` field can be added
  later once a token exists — noted as a one-line follow-up).
- Core Web Vitals / performance tuning.
- Server-level host canonicalization (apex → www redirects) and trailing-slash
  policy — infra concern, not app code.
- Translating `doctors`/`locations` data into Spanish (out of scope; their
  metadata stays English by design).

## Risks

- **OG image generation** is the highest-effort/risk piece (Satori font loading,
  reading data at image-build time). Isolated behind the shared `app/_og/template`
  helper; if a per-type generator proves troublesome it can fall back to the
  branded default without affecting the rest of the work.
- **Address parsing** for `LocalBusiness` — mitigated by the full-string fallback
  so malformed structured data is never emitted.
- **hreflang correctness** with `as-needed` prefixing — covered directly by
  `lib/seo` unit tests for both locales and the home (`/` vs `/es`) edge case.
