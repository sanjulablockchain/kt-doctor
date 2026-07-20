# Dark Mode — Design Spec

Date: 2026-07-18
Status: Approved for planning

## 1. Goal

Add dark mode to the KTMG site with **zero visible or functional change to the
current light appearance**. Dark mode is opt-in via a header toggle, follows the
OS preference by default, and persists per-device.

## 2. Success criteria

- Light mode renders byte-for-byte identical to today (verified by screenshot
  diff against a pre-change baseline).
- Dark mode meets WCAG AA everywhere: text contrast ≥ 4.5:1 (≥ 3:1 for large
  text and non-text UI such as borders/icons/focus rings).
- Every color usage in the audit (§5) is accounted for — themed or explicitly
  kept fixed with a reason.
- Theme is applied before first paint (no flash of the wrong theme).
- Choice persists across sessions in `localStorage` and can return control to
  the OS ("System").
- Existing Vitest suite stays green; new tests cover the toggle + provider.

## 3. Non-goals / explicit scope boundaries

- **No refactor.** Layout, spacing, structure, and component APIs are unchanged.
  The only class edits are one-token swaps needed for theming (`bg-white` →
  `bg-surface`, `ring-white` → `ring-surface`).
- **`text-white` on saturated brand surfaces stays white** (teal/gold/navy
  buttons and chips) — correct in both themes; not touched.
- **The navy region stays dark in both modes** (footer + homepage bottom CTA).
  Its translucent-white borders/washes are correct as-is.
- **WhatsApp brand green (`#25D366`) stays fixed** in both modes.
- **Google Maps raster tiles are not restyled** — only the map's container
  surface is themed. Styling the map itself is out of scope.

## 4. Architecture

### 4.1 Theming mechanism (Tailwind v4, CSS-first)

The project already declares design tokens as CSS custom properties in `:root`
and exposes them to Tailwind via `@theme inline` in `app/globals.css`. Every
Tailwind color utility (`bg-ivory`, `text-ink`, etc.) resolves through these
vars. Dark mode therefore only needs to **redefine the variable values** in a
dark scope — no utility classes change (except the `surface` swap in §4.2).

`data-theme` on the `<html>` element drives it. Three states:

| `data-theme` | Behavior |
|---|---|
| absent / `"system"` | follow `@media (prefers-color-scheme: dark)` |
| `"light"` | force light |
| `"dark"` | force dark |

CSS structure added to `globals.css`:

```css
:root { /* existing light values — unchanged */ }

/* System default: dark when OS asks and the user has not pinned a theme */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) { /* dark values */ }
}

/* Explicit override */
:root[data-theme="dark"] { /* dark values */ }
```

The dark value block is duplicated across the two selectors (media query +
explicit). This is intentional and readable; a shared indirection is not worth
the indirection cost for ~13 tokens.

`color-scheme: light` / `dark` is set per theme so native controls, scrollbars,
and form fields match.

### 4.2 The `surface` token (handling literal `bg-white`)

Tailwind's literal `white` has no token and cannot flip. Introduce:

```css
--color-surface: #ffffff;        /* light — identical to today */
/* dark */ --color-surface: #171d26;
```

Register `--color-surface` in `@theme inline` so `bg-surface`, `ring-surface`,
`border-surface` exist. Then swap the literal usages (see §5.2). Opacity
variants (`bg-surface/60`, `/95`, `/5`) work automatically — Tailwind v4 applies
opacity to var-based colors via `color-mix`.

### 4.3 Theme provider + toggle

- **`ThemeProvider`** (new client component, wraps children in
  `app/[locale]/layout.tsx` inside `NextIntlClientProvider`): holds the current
  preference (`"system" | "light" | "dark"`), writes `localStorage.theme`,
  applies `data-theme` to `document.documentElement`, and — while in `system` —
  subscribes to `matchMedia("(prefers-color-scheme: dark)")` so OS changes take
  effect live. Exposes `{ preference, setPreference }` via context.
- **`ThemeToggle`** (new client component): a 3-segment pill (System / Light /
  Dark) with sun / monitor / moon icons, reusing the exact styling of the
  existing EN/ES language pill in `components/Header.tsx` (same rounded-full
  group, `bg-ivory-deep` track, `bg-teal text-white` active segment). Placed in
  the header directly beside the language pill, and it inherits the mobile
  drawer / desktop responsive behavior already there. Icons use `currentColor`.
  Fully labeled for a11y (`role="group"`, `aria-label`, per-segment
  `aria-pressed`/`aria-current`).

### 4.4 No-flash inline script

A small blocking script injected in the layout `<head>` runs before paint:

```js
// pseudocode
const stored = localStorage.getItem("theme");        // "light"|"dark"|null
if (stored === "light" || stored === "dark") {
  document.documentElement.dataset.theme = stored;
}
// else: leave unset → CSS @media handles system default
```

`<html suppressHydrationWarning>` because the script mutates the element before
React hydrates.

> **Implementation gate (AGENTS.md):** this Next.js (16.2.10) may differ from
> training data. Before writing the head script / layout changes, read the
> relevant guides under `node_modules/next/dist/docs/` (script & head handling,
> layout, metadata) and follow current conventions.

## 5. Full color audit

### 5.1 Token source of truth — `app/globals.css`

All get dark values (§6). Tokens: `ivory`, `ivory-deep`, `ink`, `ink-soft`,
`navy`, `teal`, `teal-dark`, `teal-tint`, `gold`, `gold-tint`, `border`. Plus
`--shadow-soft`, `--shadow-card`, and the `::selection` rule. New: `surface`.

### 5.2 Literal `bg-white` / `ring-white` → `surface` (~4 dozen usages across ~24 files)

Swap `bg-white`→`bg-surface`, `ring-white`→`ring-surface` (opacity variants
preserved). Exact count to be pinned per file during implementation (a broad
grep for all literal white/navy/ivory usages returned 52 lines across 24 files;
that superset includes the §5.3 `text-white` and §5.4 navy exclusions, so the
swap set is smaller). Files: `app/[locale]/page.tsx` (many), `app/[locale]/doctors/[slug]/page.tsx`,
`app/[locale]/locations/[slug]/page.tsx`, `app/[locale]/services/[slug]/page.tsx`,
`components/Header.tsx`, `components/ContactWidget.tsx`, `components/DoctorCard.tsx`
(incl. `ring-white` avatar ring), `components/ServiceCard.tsx`,
`components/ResourceCard.tsx`, `components/ProgramCard.tsx`,
`components/NetworkCard.tsx`, `components/LocationCard.tsx`,
`components/BlogPageContent.tsx`, `components/FaqAccordion.tsx`,
`components/FilterDropdown.tsx`, `components/DoctorsPageContent.tsx`,
`components/LocationsPageContent.tsx`, `components/LocationsMap.tsx`,
`components/SriLankaTimeline.tsx`, `components/TestimonialsPageContent.tsx`,
`components/AboutPageContent.tsx`, `components/CareersPageContent.tsx`,
`components/InsurancePageContent.tsx`, `components/FoundationPageContent.tsx`.

> Care needed: `border-white/…`, `bg-white/5`, `bg-white/12` inside
> `components/Footer.tsx` are on the **navy** surface — these are NOT swapped;
> they are intentional light-on-dark and stay as-is.

### 5.3 `text-white` on brand surfaces — KEEP (not changed)

~20 occurrences on `bg-teal` / `bg-teal-dark` / `bg-gold` / `bg-navy` /
`bg-ink-soft` (buttons, CTAs, chips, ContactWidget FAB, DonateTab, Pagination
active page, Header appointment button + active language segment). White on
saturated color is correct in both themes.

### 5.4 Navy region — dark in both modes (verify contrast only)

`components/Footer.tsx` and `app/[locale]/page.tsx:580` CTA: `bg-navy`,
`text-ivory/*`, `border-white/10`, `bg-white/5`, `bg-teal/15`, `text-teal-tint`.
Keep. Confirm navy still separates from the darker page background in dark mode
(navy `#1e2940` is lighter than the proposed page bg, so it does).

### 5.5 Genuinely hardcoded hex/rgba

- `components/ContactWidget.tsx:69,71` — `bg-[#25D366]` + `/10`,`/20` tints
  (WhatsApp green). Keep the solid green; the tint over a dark surface is
  acceptable — verify legibility.
- `components/Header.tsx:76` — `shadow-[0_1px_0_0_rgba(18,24,31,0.04)]` ink
  hairline. Replace with a token-driven / theme-neutral hairline (near-invisible
  in dark; ensure it doesn't produce a light line on dark).

### 5.6 Icons — already safe

All SVGs use `fill`/`stroke="currentColor"` → inherit themed text color. No work.

### 5.7 Form controls — verify during implementation

Audit native `<input>/<select>/<textarea>` (e.g. any search field on the doctors
page) and ensure background/text/border/placeholder/focus are themed. Add to
this list any found.

## 6. Proposed dark palette (final hex tuned to AA at build time)

| Token | Light (unchanged) | Dark (proposed) |
|---|---|---|
| `ivory` (page bg) | `#f8fafc` | `#0f141a` |
| `ivory-deep` | `#eef2f6` | `#1a212b` |
| `surface` | `#ffffff` | `#171d26` |
| `ink` (text) | `#12181f` | `#e8edf2` |
| `ink-soft` | `#56606e` | `#9aa6b4` |
| `border` | `#dde3ea` | `#2a323d` |
| `teal` | `#0e8fa0` | brightened (~`#17a9bd`) for on-dark contrast |
| `teal-dark` | `#0b6e7c` | tuned so hover state stays distinct |
| `teal-tint` | `#e4f5f6` | dark teal wash (~`#123033`) |
| `gold` | `#d6a34a` | ~`#e0b25f` |
| `gold-tint` | `#fbf1de` | ~`#2a2417` |
| `navy` | `#1e2940` | kept |
| `--shadow-soft` | teal-tinted | black-based, stronger (soft shadows vanish on dark) |
| `--shadow-card` | ink-tinted | black-based, stronger |

## 7. Files touched (summary)

- **New:** `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`, tests for
  both.
- **Edited:** `app/globals.css` (dark palette + `surface` token + `color-scheme`
  + shadows + `::selection`), `app/[locale]/layout.tsx` (provider wrap,
  no-flash script, `suppressHydrationWarning`), `components/Header.tsx` (mount
  `ThemeToggle`, hairline shadow, `bg-white`→`bg-surface`), + the 23 other files
  in §5.2 for the mechanical `surface` swap.

## 8. Testing strategy

1. **Baseline first:** capture Playwright screenshots of all routes in light
   mode *before* changes.
2. **Light unchanged:** after changes, re-screenshot light mode and diff against
   the baseline — expect no differences.
3. **Dark visual pass:** screenshot all routes in dark mode.
4. **Contrast:** assert AA on key text/UI pairs in dark mode.
5. **Unit:** Vitest for `ThemeProvider` (default=system, override light/dark,
   persistence, live OS change while in system) and `ThemeToggle`
   (renders 3 states, sets preference, a11y attributes).
6. **Full suite:** `npm test` green; `npm run build` succeeds.

## 9. Risks

- **Flash of wrong theme** if the head script is misplaced — mitigated by the
  AGENTS.md doc-read gate and `suppressHydrationWarning`.
- **Opacity-on-var** rendering: confirm `bg-surface/95` etc. compile correctly
  under this Tailwind v4 setup during the first build.
- **Missed color**: the screenshot diff + a final manual dark sweep of every
  route is the backstop.
