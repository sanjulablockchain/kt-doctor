# OpenStreetMap + Leaflet Locations Map, Design Spec

Date: 2026-07-28
Status: Approved

## Background

`/locations`' Map tab (`components/LocationsMap.tsx`) currently embeds a
curated Google **My Maps** map via a plain `<iframe src="https://www.google.com/maps/d/embed?mid=...">`.
It's free and keyless, but:

- It's cross-origin, so we can't restyle it, make pins interactive, or link
  a pin to the location's detail page.
- My Maps renders a title/toolbar bar with no way to disable it. The current
  code works around this with a CSS crop hack (`MYMAPS_HEADER_CROP_PX`):
  grow the iframe's height and shift it up with a negative `margin-top`
  inside an `overflow-hidden` wrapper.
- There is no dark-mode variant, which conflicts with this repo's UI
  requirement that every feature supports both themes.

This spec replaces the iframe with a self-hosted `react-leaflet` map using
free, keyless OpenStreetMap-derived tiles, giving us real control over
markers, popups, and theming, while keeping the "no API key, no billing"
property that motivated the original My Maps choice.

## Goals

- Replace the iframe with a `react-leaflet` `<MapContainer>` rendering
  every clinic (locations with `lat`/`lng`) as a pin, auto-fit to bounds.
- Support light and dark mode with real themed cartography, not a CSS
  filter, switching live with the site's theme toggle and OS preference.
- Make pins interactive: clicking one opens a popup with the clinic's name,
  address, a "Get Directions" link, and a "View Details" link to its
  existing `/locations/[slug]` page.
- Use a custom brand-teal marker instead of Leaflet's default red pin.
- Stay fully keyless and free (no signup, no billing, no rate-limited paid
  tier), the same bar as the current setup.

## Explicitly out of scope

- Marker clustering. With ~24 pins across the LA/Ventura metro area this
  isn't needed yet; revisit if pins visibly overlap at the default
  fit-to-bounds zoom.
- Changing `data/locations.ts` or its `lat`/`lng` values. This spec is a
  rendering-layer change only. (The existing note that those coordinates
  are city-level approximations pending Geocoding API refinement is
  unaffected and unrelated to this change.)
- Deleting the old Google My Maps code, `docs/mymaps-setup.md`, or
  `docs/locations-mymaps-import.csv`. Kept per explicit request, see
  "Legacy code" below.
- The List tab, the List/Map switcher, and `LocationDirections.tsx` (the
  address-search list shown below the map). Untouched.

## Design

### 1. File split (new)

`react-leaflet`'s `<MapContainer>` and the `leaflet` package touch
`window`/`document` during module evaluation, not just at render time,
which breaks under Next.js server-side rendering even inside a `"use
client"` component (client components are still rendered once on the
server for the initial HTML). The standard fix, and the one this spec
uses, is to isolate all Leaflet-touching code into its own module and load
it with `next/dynamic(..., { ssr: false })`, which excludes that module
from the server bundle entirely.

Two components:

- `components/LocationsMap.tsx`: unchanged responsibility (filters
  locations to the mappable subset, renders the accessible wrapper),
  updated to dynamically import and render the new Leaflet component
  instead of the iframe. This file also keeps the old Google My Maps
  implementation as a commented-out block, see "Legacy code" below.
- `components/LocationsMapLeaflet.tsx` (new): the actual `react-leaflet`
  map. Only ever loaded client-side via `next/dynamic`, so it's safe for
  this file to import `leaflet`, `leaflet/dist/leaflet.css`, and
  `react-leaflet` at the top level.

### 2. Map rendering

`LocationsMapLeaflet` renders a `<MapContainer>` filling its parent, which
keeps the same outer sizing `LocationsMap.tsx` already uses
(`MAP_SHELL_CLASSES = "h-72 w-full sm:h-96 lg:h-[32rem]"`), so the page
layout is unaffected. The same `isMappable()` filter used today (locations
with both `lat` and `lng`) determines which locations get a `<Marker>`;
locations without coordinates (currently just Telehealth) are skipped, as
today.

A small helper component (`FitBounds`, defined in the same file since it's
tightly coupled and short enough not to warrant its own file) uses
react-leaflet's `useMap()` to compute a `LatLngBounds` from all mappable
locations on mount and calls `map.fitBounds(bounds)`, replacing the fixed
framing baked into the old My Maps embed.

### 3. Tiles and theming

Two free, keyless CARTO raster basemaps (built on OpenStreetMap data),
chosen by resolved theme:

- Light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
  (Positron)
- Dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
  (Dark Matter)

Both require only the standard attribution string
(`© CARTO, © OpenStreetMap contributors`), rendered automatically by
Leaflet's built-in attribution control via the `<TileLayer attribution>`
prop. No key, no signup, no billing.

The resolved theme is computed from the existing `useTheme()` context
(`ThemeProvider.tsx`, `"system" | "light" | "dark"`): if the preference is
`"light"` or `"dark"`, use it directly; if `"system"`, resolve it against
`window.matchMedia("(prefers-color-scheme: dark)")`. A small hook
subscribes to that media query, mirroring the `useSyncExternalStore`
pattern `ThemeProvider` already uses for the stored preference, so the
tile layer swaps live if the user flips the theme toggle or their OS theme
changes while the map is open.

### 4. Markers and popups

Pins use a custom Leaflet `divIcon` built from an inline SVG teardrop-pin
matching the icon already used in `LocationCard.tsx`, filled with the
site's teal tokens, instead of Leaflet's default red marker image. This
also sidesteps the well-known Leaflet-plus-bundler default-icon-path
breakage, since a `divIcon` needs no external image assets.

Clicking a pin opens a react-leaflet `<Popup>` (real React content, not raw
HTML) containing:

- Clinic name and address (plain text, matching `ink`/`ink-soft` tokens)
- "Get Directions" link to `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`,
  `target="_blank" rel="noopener noreferrer"` (same pattern as
  `LocationDirections.tsx`)
- "View Details" link to `/locations/{id}` via the locale-aware `Link` from
  `@/i18n/navigation` (same pattern as `LocationCard.tsx`), using the
  existing `Locations.viewDetails` i18n string

Popup chrome (background, border, text color, close button), the default
marker icon's white background box, the zoom control, and the attribution
control all get scoped CSS overrides added to `app/globals.css`, following
the same hand-written-CSS-block pattern already used there (e.g. the theme
tokens and the scrollbar styles), reusing the same `--color-surface` /
`--color-ink` / `--color-border` design tokens so the entire map matches
the site's styling in both themes instead of Leaflet's light-only default
chrome. No CSS modules are introduced; this repo doesn't use them
elsewhere.

Leaflet markers are keyboard-focusable and open their popup on Enter by
default (`marker.options.keyboard`, true unless explicitly disabled), so
no extra keyboard-handling code is needed. Each marker gets an
`aria-label` of the clinic name via a ref callback (`divIcon` markers have
no built-in accessible name the way image-based markers get one from
`alt`).

### 5. Legacy code

Per explicit request, the current Google My Maps implementation, including
the branch that showed an address-list fallback when the map was disabled
via `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=""`, is kept as a clearly labeled,
commented-out block in `LocationsMap.tsx` rather than deleted, so it's easy
to find and revert to. It will not execute: with no key or billing
required, the new map has no "unavailable" state to fall back from, so
that whole branch (iframe, env var, crop hack, and its fallback UI) moves
into the comment as one unit. `docs/mymaps-setup.md` and
`docs/locations-mymaps-import.csv` stay untouched as historical reference.
`.env.local.example`'s `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` entry gets a
one-line note that the variable is no longer read by the live code path.

### 6. Dependencies

Add to `package.json`:

- `leaflet` + `react-leaflet` (v5, React 19-compatible) to `dependencies`
- `@types/leaflet` to `devDependencies`

`leaflet/dist/leaflet.css` is imported directly at the top of
`LocationsMapLeaflet.tsx`. Next.js's App Router allows stylesheets
published by external packages to be imported from any colocated client
component, not just the root layout, confirmed against this repo's bundled
Next 16 docs (`node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`).

## Testing

`react-leaflet`'s `<MapContainer>` drives real Leaflet DOM/layout logic
(pane creation, `getBoundingClientRect`-based sizing, tile loading) that
jsdom can't meaningfully emulate. Following this repo's existing pattern of
mocking third-party integrations at the module boundary (e.g.
`ContactForm.test.tsx`), tests are split to match the new file split:

`components/LocationsMapLeaflet.test.tsx` mocks `react-leaflet` and
`leaflet` with lightweight stand-ins and asserts on:

- One marker rendered per mappable location.
- The tile `url` resolves to the light CARTO endpoint by default, the dark
  endpoint when the theme preference is `"dark"`, and the dark endpoint
  when the preference is `"system"` and `matchMedia` reports a dark OS
  preference.
- Each marker's popup content includes the clinic's name, address, a
  "Get Directions" link pointing at its `lat`/`lng`, and a "View Details"
  link pointing at `/locations/{id}`.

`components/LocationsMap.test.tsx` mocks the `LocationsMapLeaflet` module
directly and asserts on:

- The accessible wrapper renders with the expected region label.
- Only mappable locations are passed through; Telehealth (no `lat`/`lng`)
  is excluded, the same coverage as today.

## Risks / follow-ups

- CARTO's free basemap endpoint is intended for light/evaluation-level
  traffic, the same caveat that applies to plain OSM tiles. If traffic
  grows enough to matter, revisit with a paid/signed-up tile provider,
  tracked as a follow-up, not blocking this change.
- No marker clustering yet (see "Explicitly out of scope"). Revisit if
  pins overlap noticeably once real coordinates replace the city-level
  approximations.
