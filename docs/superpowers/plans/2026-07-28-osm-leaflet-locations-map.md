# OpenStreetMap + Leaflet Locations Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Google My Maps iframe on `/locations`' Map tab with a self-hosted, keyless `react-leaflet` map using free CARTO tiles, with brand-colored interactive pins and full light/dark theme support.

**Architecture:** `components/LocationsMap.tsx` stays the public entry point (filters locations to the mappable subset, renders an accessible wrapper) but now dynamically imports a new `components/LocationsMapLeaflet.tsx` with `next/dynamic({ ssr: false })`, since `leaflet` touches `window`/`document` at module-evaluation time and would break server rendering otherwise. The old Google My Maps implementation is preserved as a commented-out block in `LocationsMap.tsx` rather than deleted.

**Tech Stack:** `react-leaflet` v5 + `leaflet`, CARTO's free keyless raster basemaps (Positron/Dark Matter), the existing `ThemeProvider` context plus `window.matchMedia` for live theme resolution, Vitest + Testing Library with mocked `react-leaflet`/`leaflet`.

Spec: `docs/superpowers/specs/2026-07-28-osm-leaflet-locations-map-design.md`

## Global Constraints

- **Do not run `git commit` at any point in this plan.** The user explicitly asked to review all changes uncommitted. Every task ends with verification, not a commit step.
- Never use the em dash (`—`) in any code, comments, or copy (project style rule).
- No new i18n strings are needed. Reuse the existing `Locations.getDirections`, `Locations.viewDetails`, and `Locations.mapTitle` keys already present in both `messages/en.json` and `messages/es.json`. Do not edit those files.
- Every UI change must work in both light and dark mode and be responsive (mobile/tablet/desktop). The existing `MAP_SHELL_CLASSES = "h-72 w-full sm:h-96 lg:h-[32rem]"` sizing is reused unchanged; new CSS must use the existing `--color-*`/`--shadow-*` custom properties from `app/globals.css`, not hardcoded colors.
- Do not modify `data/locations.ts`, `docs/mymaps-setup.md`, or `docs/locations-mymaps-import.csv`.
- Custom interactive elements need keyboard/focus support and ARIA labels where semantics aren't native.
- Colocate `.test.ts`/`.test.tsx` files next to the component they cover, matching existing coverage patterns.

---

### Task 1: Install Leaflet dependencies and add themed CSS overrides

**Files:**
- Modify: `package.json` (via `npm install`, not hand-edited)
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS classes `.ktmg-map-pin` and `.ktmg-map-popup` that Task 2 applies to Leaflet's `divIcon` and `Popup` components.

- [ ] **Step 1: Install the packages**

Run:
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

- [ ] **Step 2: Verify the install**

Run: `npm ls leaflet react-leaflet @types/leaflet`
Expected: all three listed with no `UNMET PEER DEPENDENCY` or `invalid` warnings. `react-leaflet` should resolve to a 5.x version (React 19 compatible).

- [ ] **Step 3: Add the CSS block**

Append to the end of `app/globals.css` (after the existing `slide-in-right` keyframes block):

```css

/* Locations map (Leaflet + CARTO tiles, components/LocationsMapLeaflet.tsx).
   Leaflet's default .leaflet-div-icon draws a white box, border, and shadow
   behind custom HTML icons; reset it so only our inline SVG pin shows. Popup
   chrome, the zoom control, and the attribution control are restyled to
   match the site's card system in both themes instead of Leaflet's
   light-only default chrome, reusing the same design tokens as everywhere
   else in this file. */
.ktmg-map-pin {
  background: transparent;
  border: none;
  box-shadow: none;
}
.ktmg-map-popup .leaflet-popup-content-wrapper {
  background: var(--color-surface);
  color: var(--color-ink);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
}
.ktmg-map-popup .leaflet-popup-tip {
  background: var(--color-surface);
}
.ktmg-map-popup .leaflet-popup-close-button {
  color: var(--color-ink-soft);
}
.leaflet-control-attribution {
  background: var(--color-surface);
  color: var(--color-ink-soft);
}
.leaflet-control-attribution a {
  color: var(--color-teal-dark);
}
.leaflet-control-zoom a {
  background: var(--color-surface);
  color: var(--color-ink);
  border-color: var(--color-border);
}
.leaflet-control-zoom a:hover {
  background: var(--color-ivory-deep);
}
```

- [ ] **Step 4: Verify the build still succeeds**

Run: `npm run build`
Expected: build completes with no CSS or dependency errors. (Nothing imports `leaflet` yet, so this only validates the CSS syntax and the installed packages.)

- [ ] **Step 5: Do not commit.** Leave these changes unstaged for the user to review.

---

### Task 2: Add the `MappableLocation` type and build `LocationsMapLeaflet`

**Files:**
- Modify: `lib/types.ts`
- Create: `components/LocationsMapLeaflet.tsx`
- Create: `components/LocationsMapLeaflet.test.tsx`

**Interfaces:**
- Consumes: `Location` type from `lib/types.ts` (`id`, `name`, `address`, `lat?`, `lng?`, ...).
- Produces: `export type MappableLocation = Location & { lat: number; lng: number }` from `lib/types.ts`, consumed by Task 3. `export function LocationsMapLeaflet({ locations }: { locations: MappableLocation[] })` from `components/LocationsMapLeaflet.tsx`, consumed by Task 3.

- [ ] **Step 1: Add the shared type**

In `lib/types.ts`, add after the `Location` type definition:

```ts
export type MappableLocation = Location & { lat: number; lng: number };
```

- [ ] **Step 2: Write the failing tests**

Create `components/LocationsMapLeaflet.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationsMapLeaflet } from "./LocationsMapLeaflet";
import type { MappableLocation } from "@/lib/types";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: ({ url, attribution }: { url: string; attribution: string }) => (
    <div data-testid="tile-layer" data-url={url} data-attribution={attribution} />
  ),
  Marker: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div data-testid="marker" data-title={title}>
      {children}
    </div>
  ),
  Popup: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="popup" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("leaflet", () => ({
  default: { divIcon: vi.fn(() => ({})) },
}));

function renderMap(locations: MappableLocation[]) {
  return render(
    <ThemeProvider>
      <LocationsMapLeaflet locations={locations} />
    </ThemeProvider>
  );
}

const alpha: MappableLocation = {
  id: "a",
  name: "Alpha",
  address: "1 A St",
  phone: "1",
  email: "a@x.com",
  extension: "1",
  lat: 34,
  lng: -118,
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

const beta: MappableLocation = {
  ...alpha,
  id: "b",
  name: "Beta",
  address: "2 B St",
  lat: 34.1,
  lng: -118.1,
};

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  vi.unstubAllGlobals();
});

describe("LocationsMapLeaflet", () => {
  it("renders one marker per location", () => {
    renderMap([alpha, beta]);
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
  });

  it("uses the light CARTO tiles by default", () => {
    renderMap([alpha]);
    expect(screen.getByTestId("tile-layer").dataset.url).toContain("light_all");
  });

  it("uses the dark CARTO tiles when the theme preference is dark", () => {
    localStorage.setItem("theme", "dark");
    renderMap([alpha]);
    expect(screen.getByTestId("tile-layer").dataset.url).toContain("dark_all");
  });

  it("uses the dark CARTO tiles when the preference is system and the OS prefers dark", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
    renderMap([alpha]);
    expect(screen.getByTestId("tile-layer").dataset.url).toContain("dark_all");
  });

  it("shows the clinic name, address, directions link, and details link in the popup", () => {
    renderMap([alpha]);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("1 A St")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Directions" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=34,-118"
    );
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/locations/a"
    );
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run components/LocationsMapLeaflet.test.tsx`
Expected: FAIL because `./LocationsMapLeaflet` does not exist yet.

- [ ] **Step 4: Implement the component**

Create `components/LocationsMapLeaflet.tsx`:

```tsx
"use client";

import { useSyncExternalStore } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/components/ThemeProvider";
import type { MappableLocation } from "@/lib/types";

type LocationsMapLeafletProps = {
  locations: MappableLocation[];
};

const TILE_LAYERS = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const;

const PIN_ICON_HTML = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a7 7 0 0 0-7 7c0 5.5 7 12 7 12s7-6.5 7-12a7 7 0 0 0-7-7Z" fill="var(--color-teal)" stroke="var(--color-teal-dark)" stroke-width="1.2"/>
  <circle cx="12" cy="9" r="2.5" fill="var(--color-surface)"/>
</svg>`;

const clinicIcon = L.divIcon({
  html: PIN_ICON_HTML,
  className: "ktmg-map-pin",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

function subscribeToColorScheme(onStoreChange: () => void): () => void {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSystemPrefersDark(): boolean {
  return false;
}

function useResolvedTheme(): "light" | "dark" {
  const { preference } = useTheme();
  const systemPrefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    getSystemPrefersDark,
    getServerSystemPrefersDark
  );
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

function directionsUrl(location: MappableLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
}

export function LocationsMapLeaflet({ locations }: LocationsMapLeafletProps) {
  const t = useTranslations("Locations");
  const theme = useResolvedTheme();
  const tileLayer = TILE_LAYERS[theme];
  const bounds = locations.map((loc): [number, number] => [loc.lat, loc.lng]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={clinicIcon}
          title={location.name}
          ref={(instance) => {
            instance?.getElement()?.setAttribute("aria-label", location.name);
          }}
        >
          <Popup className="ktmg-map-popup">
            <p className="font-display text-sm font-semibold text-ink">{location.name}</p>
            <p className="mt-1 text-xs text-ink-soft">{location.address}</p>
            <div className="mt-2 flex flex-col gap-1">
              <a
                href={directionsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-teal-dark hover:text-teal"
              >
                {t("getDirections")}
              </a>
              <Link
                href={`/locations/${location.id}`}
                className="text-xs font-semibold text-teal-dark hover:text-teal"
              >
                {t("viewDetails")}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

Notes for the implementer:
- `MapContainer`'s `bounds`/`boundsOptions` props (confirmed against the react-leaflet docs) replace the more common `center`/`zoom` pattern, so the map always frames every clinic on mount with no hardcoded center. These props are immutable after the initial render, which is fine since `locations` doesn't change during a page view.
- The mocked `Marker` in the test is a plain function component, so passing it a `ref` will print a harmless "Function components cannot be given refs" warning to the test console. That's expected. The `aria-label` behavior itself needs a real Leaflet-rendered DOM element to verify, which jsdom can't provide, so it isn't unit-tested here; it's covered by code review of the `ref` callback instead.
- `Icon`/`DivIcon` options (`html`, `className`, `iconSize`, `iconAnchor`, `popupAnchor`) and `Marker`'s `keyboard: true` default (tabbable, Enter opens the popup) are confirmed against the current Leaflet reference docs.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run components/LocationsMapLeaflet.test.tsx`
Expected: PASS, all 5 tests.

- [ ] **Step 6: Do not commit.** Leave these changes unstaged for the user to review.

---

### Task 3: Rewire `LocationsMap.tsx` to the new map and update its test

**Files:**
- Modify: `components/LocationsMap.tsx`
- Modify: `components/LocationsMap.test.tsx`
- Modify: `.env.local.example`

**Interfaces:**
- Consumes: `MappableLocation` from `lib/types.ts` and `LocationsMapLeaflet` from `components/LocationsMapLeaflet.tsx` (both produced by Task 2).
- Produces: `export function LocationsMap({ locations }: { locations: Location[] })`, unchanged public signature, consumed by `components/LocationsPageContent.tsx` (no changes needed there).

- [ ] **Step 1: Write the failing tests**

Replace the full contents of `components/LocationsMap.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocationsMap } from "./LocationsMap";

vi.mock("./LocationsMapLeaflet", () => ({
  LocationsMapLeaflet: ({ locations }: { locations: Array<{ id: string }> }) => (
    <div data-testid="leaflet-map">
      {locations.map((loc) => (
        <span key={loc.id}>{loc.id}</span>
      ))}
    </div>
  ),
}));

const alpha = {
  id: "a",
  name: "Alpha",
  address: "1 A St",
  phone: "1",
  email: "a@x.com",
  extension: "1",
  lat: 34,
  lng: -118,
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

const telehealth = {
  id: "telehealth",
  name: "Telehealth",
  address: "Video visits only",
  phone: "",
  email: "",
  extension: "",
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

describe("LocationsMap", () => {
  it("renders an accessible map region", async () => {
    render(<LocationsMap locations={[alpha, telehealth] as never} />);
    expect(
      await screen.findByRole("region", { name: "Map of Kids & Teens clinic locations" })
    ).toBeInTheDocument();
  });

  it("passes only locations with coordinates through to the map", async () => {
    render(<LocationsMap locations={[alpha, telehealth] as never} />);
    const map = await screen.findByTestId("leaflet-map");
    expect(map).toHaveTextContent("a");
    expect(map).not.toHaveTextContent("telehealth");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: FAIL. The existing `LocationsMap.tsx` still renders the Google My Maps iframe, so `getByRole("region", ...)` and `findByTestId("leaflet-map")` won't find anything yet.

- [ ] **Step 3: Rewrite the component**

Replace the full contents of `components/LocationsMap.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { Location, MappableLocation } from "@/lib/types";

const MAP_SHELL_CLASSES = "h-72 w-full sm:h-96 lg:h-[32rem]";

const LocationsMapLeaflet = dynamic(
  () => import("./LocationsMapLeaflet").then((mod) => mod.LocationsMapLeaflet),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-ivory-deep" />,
  }
);

function isMappable(loc: Location): loc is MappableLocation {
  return loc.lat !== undefined && loc.lng !== undefined;
}

type LocationsMapProps = {
  locations: Location[];
};

/* ============================================================================
 * LEGACY: Google My Maps iframe embed, superseded by the OpenStreetMap +
 * Leaflet map below. Kept commented out (not deleted) per explicit request,
 * for reference and easy revert. Does not run.
 *
 * Setup steps for this embed: docs/mymaps-setup.md.
 * Source data: docs/locations-mymaps-import.csv.
 *
 * // Free, keyless Google Maps embed, no API key, no billing. The default is
 * // a curated Google "My Maps" showing every clinic (source data:
 * // docs/locations-mymaps-import.csv; setup steps: docs/mymaps-setup.md).
 * // Override with NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to point at a different
 * // map, or set that to an empty string to show the address-list fallback
 * // instead.
 * const DEFAULT_EMBED_URL =
 *   "https://www.google.com/maps/d/embed?mid=1YYdtWQyub1yRh-FGsTWNQEIYDvHQHvI&ehbc=2E312F";
 * const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? DEFAULT_EMBED_URL;
 *
 * // Google My Maps (/maps/d/embed) renders a title/toolbar bar at the top of
 * // the iframe that has no option to disable. It can't be hidden directly
 * // (it's served cross-origin from google.com), so it's clipped: grow the
 * // iframe by the bar's height and shift it up under an overflow-hidden
 * // container. The bottom "Google My Maps" attribution stays visible. Only
 * // applied to My Maps embeds, a plain search embed (output=embed) has no
 * // such bar.
 * const isMyMapsEmbed = mapEmbedUrl.includes("/maps/d/");
 * const MYMAPS_HEADER_CROP_PX = 72;
 *
 * function LegacyLocationsMap({ locations }: LocationsMapProps) {
 *   const t = useTranslations("Locations");
 *   const mappable = locations.filter(isMappable);
 *
 *   if (!mapEmbedUrl) {
 *     return (
 *       <div className="bg-surface p-6 sm:p-8">
 *         <div className="flex items-start gap-3 rounded-2xl bg-teal-tint px-4 py-3">
 *           <svg
 *             aria-hidden
 *             viewBox="0 0 24 24"
 *             fill="none"
 *             className="mt-0.5 h-5 w-5 shrink-0 text-teal-dark"
 *           >
 *             <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
 *             <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
 *             <circle cx="12" cy="8" r="1" fill="currentColor" />
 *           </svg>
 *           <p className="text-sm text-ink-soft">{t("mapUnavailable")}</p>
 *         </div>
 *         <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
 *           {mappable.map((loc) => (
 *             <li key={loc.id}>
 *               <p className="font-display text-base font-semibold text-ink">{loc.name}</p>
 *               <p className="mt-1 text-sm text-ink-soft">{loc.address}</p>
 *               <a
 *                 href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
 *                 target="_blank"
 *                 rel="noopener noreferrer"
 *                 className="mt-2 inline-flex items-center gap-1 font-display text-sm font-semibold text-teal-dark transition-colors hover:text-teal"
 *               >
 *                 {t("getDirections")}
 *                 <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4 w-4">
 *                   <path
 *                     d="M5 12h14M13 6l6 6-6 6"
 *                     stroke="currentColor"
 *                     strokeWidth="1.8"
 *                     strokeLinecap="round"
 *                     strokeLinejoin="round"
 *                   />
 *                 </svg>
 *               </a>
 *             </li>
 *           ))}
 *         </ul>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <div className={`${MAP_SHELL_CLASSES} overflow-hidden`}>
 *       <iframe
 *         src={mapEmbedUrl}
 *         loading="lazy"
 *         title={t("mapTitle")}
 *         referrerPolicy="no-referrer-when-downgrade"
 *         style={
 *           isMyMapsEmbed
 *             ? {
 *                 width: "100%",
 *                 height: `calc(100% + ${MYMAPS_HEADER_CROP_PX}px)`,
 *                 marginTop: `-${MYMAPS_HEADER_CROP_PX}px`,
 *                 border: 0,
 *                 display: "block",
 *               }
 *             : { width: "100%", height: "100%", border: 0, display: "block" }
 *         }
 *       />
 *     </div>
 *   );
 * }
 * ========================================================================== */

export function LocationsMap({ locations }: LocationsMapProps) {
  const t = useTranslations("Locations");
  const mappable = locations.filter(isMappable);

  return (
    <div
      role="region"
      aria-label={t("mapTitle")}
      className={`${MAP_SHELL_CLASSES} overflow-hidden`}
    >
      <LocationsMapLeaflet locations={mappable} />
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Update the env var documentation**

In `.env.local.example`, replace the top comment block:

```dotenv
# OPTIONAL. The locations map works out of the box with no key and no config:
# a curated, keyless Google "My Maps" showing every clinic is baked into the app
# as the default (see components/LocationsMap.tsx and docs/mymaps-setup.md).
#
# Set this only to point the map at a DIFFERENT Google "My Maps" embed URL, or
# set it to an empty string to hide the map and show the clinic-address list.
#
# Left commented out on purpose: uncommenting with an empty value HIDES the map.
# NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
```

with:

```dotenv
# LEGACY, no longer read by the live code path. The locations map now renders
# a self-hosted OpenStreetMap + Leaflet map (components/LocationsMapLeaflet.tsx)
# with free, keyless CARTO tiles, so it needs no key or config at all. This
# variable only still applies to the commented-out Google My Maps code kept in
# components/LocationsMap.tsx for reference; see docs/mymaps-setup.md.
# NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
```

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: PASS, no regressions elsewhere (in particular `components/LocationsPageContent.tsx` has no test file today, so nothing else references the old `LocationsMap` test fixtures).

- [ ] **Step 7: Run lint and build**

Run: `npm run lint` then `npm run build`
Expected: both succeed with no errors.

- [ ] **Step 8: Do not commit.** Leave these changes unstaged for the user to review.

---

## Self-Review Notes

- **Spec coverage:** file split for SSR safety (Task 2/3), tile theming with system-preference resolution (Task 2, tested), custom teal pin and popup with Get Directions/View Details links (Task 2), CSS theming of pin/popup/zoom/attribution controls (Task 1), legacy code preserved as a comment (Task 3), dependency additions (Task 1). All spec sections map to a task.
- **Type consistency:** `MappableLocation` is defined once in `lib/types.ts` (Task 2, Step 1) and imported by both `LocationsMapLeaflet.tsx` (Task 2) and `LocationsMap.tsx` (Task 3), avoiding duplicate/divergent definitions. `LocationsMapLeaflet`'s prop name (`locations`) and shape match between its implementation (Task 2) and how `LocationsMap.tsx` calls it (Task 3).
- **No placeholders:** all code blocks are complete, runnable implementations, not sketches.
