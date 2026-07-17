# Locations Map Fix — Design Spec

Date: 2026-07-17
Status: Approved

## Background

`/locations` has a List | Map tab toggle (`components/LocationsPageContent.tsx`).
The List tab is fine. The Map tab (`components/LocationsMap.tsx`) currently
renders Google's default "This page can't load Google Maps correctly" error
dialog with the "For development purposes only" watermark and plain
unstyled red pins, on `http://localhost:3001/locations`.

**Root cause:** `LocationsMap.tsx` passes
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""` into `useJsApiLoader`. No key is
configured (`.env.local.example` documents the variable but no `.env.local`
exists yet), so the Google Maps JS API fails auth and renders exactly this
fallback. Nothing else is misconfigured — this is expected behavior for a
Google Maps embed with no valid key.

A real API key will be created later (out of scope for this spec — tracked
as a follow-up). This spec covers making the Map tab correct and
well-behaved both with and without a key present.

### Billing note (for the record)

Any Google Maps Platform key, including the Maps JavaScript API used here,
requires a GCP billing account (payment method on file) before it loads at
all, independent of usage volume. Google provides a recurring free monthly
usage allotment per API; a single clinic-locator map at realistic traffic
should stay within it, but the card-on-file requirement is mandatory
regardless. When the real key is created: restrict it by HTTP referrer
(prod domain + localhost) and set a GCP budget alert. Confirm current exact
free-tier numbers on Google's pricing page at that time — not guaranteed
current here.

## Goals

- Replace today's broken/ugly Map tab rendering with a clean, branded
  fallback whenever there's no valid key or the map fails to load — instead
  of exposing Google's raw error widget.
- When a valid key is present, make the map actually useful: clicking a pin
  shows clinic details and a "Get Directions" link (Google Maps directions,
  opens in a new tab), not just a bare marker.
- Fit the map to show all clinic pins automatically, instead of a
  hand-tuned fixed center/zoom that may clip outliers.
- Make the map container height responsive (mobile vs. desktop) instead of
  a single fixed `24rem`.

## Explicitly out of scope

- The List tab and the List/Map tab switcher itself — untouched.
- Custom branded pin icons or a custom/muted map tile style — kept as
  default Google Maps look per explicit choice; only the interaction
  (popups, directions, fit-to-bounds) and the error/loading states change.
- Actually creating/enabling the Google Maps API key or GCP billing account
  — the code will read `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from the
  environment as it does today; provisioning the real key is a manual
  follow-up outside this change.
- Merging List and Map into one combined side-by-side view — tabs stay
  separate.

## Design

### 1. No-key / load-error fallback

`useJsApiLoader` already returns `loadError` alongside `isLoaded`; the
current code only checks `isLoaded`. Add explicit handling:

- No key configured (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` empty/undefined) →
  skip calling the loader's real auth path and render the fallback
  immediately.
- `loadError` set (auth failure, network failure, etc.) → render the same
  fallback.
- Fallback UI: a card matching the site's existing tokens (rounded-3xl
  border, `border-border`, `shadow-card`) with a short message ("Map is
  temporarily unavailable — see clinic addresses below") followed by a
  simple list of clinic name + address, each linking out to
  `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` (or
  URL-encoded address for entries without lat/lng) so users can still get
  directions with zero JS map dependency.

### 2. Marker click → InfoWindow with directions

- Import `InfoWindow` from `@react-google-maps/api` (already a dependency,
  no package changes needed).
- Track `selectedLocationId` in component state; clicking a `MarkerF` sets
  it, clicking the InfoWindow's close button or another marker
  clears/replaces it. Only one InfoWindow open at a time.
- InfoWindow content: location name (bold), address, phone, a "View
  details" link to `/locations/[id]`, and a "Get Directions" link to
  `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`,
  `target="_blank" rel="noopener noreferrer"`.

### 3. Fit bounds to all pins

- Replace the hardcoded `center`/`zoom={9}` props with an `onLoad` callback
  on `GoogleMap` that builds a `google.maps.LatLngBounds`, extends it with
  every location's `{ lat, lng }` (same filter already used for markers),
  and calls `map.fitBounds(bounds)`.
- Keep a static fallback `center`/`zoom` (today's values) for the brief
  moment before `onLoad` fires, and for the (currently impossible, since
  the fallback in §1 handles the no-locations-with-coords case before
  reaching the map) edge case of zero geocoded locations.

### 4. Responsive container height

- Replace the fixed `containerStyle = { width: "100%", height: "24rem" }`
  object with a responsive wrapper: the outer div gets Tailwind height
  classes (e.g. `h-72 sm:h-96 lg:h-[32rem]`) and `containerStyle` uses
  `width: "100%", height: "100%"` so the map fills whatever height the
  breakpoint gives it. Width was already responsive; only height changes.

### 5. Pins and map tiles

- No change — default Google `MarkerF` pins, default map tile styling.
  This keeps the change low-risk and behavior-focused, per explicit
  decision to defer visual/branding polish.

## Testing

Update `components/LocationsMap.test.tsx` (mocks `@react-google-maps/api`):

- No key / `loadError` present → fallback UI renders (not a bare
  `GoogleMap`), and it lists clinic addresses with directions links.
- Clicking a marker opens an `InfoWindow`-equivalent showing that clinic's
  name, address, and a directions link pointing at its lat/lng.
- Existing coverage continues to pass: one marker per location, and
  locations without `lat`/`lng` (e.g. Telehealth) are skipped instead of
  crashing.

## Risks / follow-ups

- Until a real API key exists, users only ever see the fallback list in
  §1 — that's intentional and is strictly better than today's broken
  widget, but it means this change won't visibly "become a map" until the
  key is provisioned (tracked separately, not in this spec).
- Custom pin styling / muted map theme was explicitly deferred — worth
  revisiting once the key exists and the team wants closer visual parity
  with `ktdoctor.com`'s branding.
