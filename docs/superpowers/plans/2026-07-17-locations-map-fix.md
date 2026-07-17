# Locations Map Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the Map tab on `/locations`, which currently renders Google's raw "can't load Google Maps correctly" error widget (no API key configured), by adding a branded fallback, click-to-directions popups, auto-fit map bounds, and a responsive container height.

**Architecture:** All changes live in the single client component `components/LocationsMap.tsx` (already used by `components/LocationsPageContent.tsx`, which is out of scope and untouched). The component gains three render branches — no-key/error fallback, loading, and loaded-map — sharing one height-class constant so the Map tab never jumps size when switching states. The loaded-map branch adds an `InfoWindow` on marker click and an `onLoad` callback that calls `map.fitBounds()` over every clinic's coordinates.

**Tech Stack:** Next.js App Router, React 19, `@react-google-maps/api` (already a dependency, no new packages), next-intl for i18n, Tailwind CSS v4, Vitest + React Testing Library + `@testing-library/user-event`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-17-locations-map-fix-design.md`.
- Do not modify `components/LocationsPageContent.tsx`, the List tab, or the List/Map tab switcher.
- Do not add custom marker icons or a custom map tile style — default Google Maps pins/tiles stay as-is.
- Do not add new npm dependencies. `GoogleMap`, `MarkerF`, `InfoWindow`, and `useJsApiLoader` all come from the existing `@react-google-maps/api` (`^2.20.8`). The `google.maps.*` global types (e.g. `google.maps.Map`, `google.maps.LatLngBounds`) are available via `@types/google.maps`, which ships transitively as a dependency of `@react-google-maps/api` — no explicit install needed.
- All new user-facing strings go through `useTranslations("Locations")` (see `components/LocationsPageContent.tsx` for the existing pattern) with matching keys added to **both** `messages/en.json` and `messages/es.json`.
- Internal links use the locale-aware `Link` from `@/i18n/navigation` (see `components/LocationCard.tsx`). External links (Google Maps directions) use a plain `<a target="_blank" rel="noopener noreferrer">` (see `components/DoctorCard.tsx` or `app/[locale]/locations/[slug]/page.tsx` for the existing pattern).
- `vitest.setup.ts` sets no environment variables, so `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is unset by default in tests. Any test that needs the "loaded map" path (not the fallback) must call `vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key")` and every test file that uses `vi.stubEnv` must clean up with `vi.unstubAllEnvs()` in an `afterEach`.
- **`messages/en.json` and `messages/es.json` already have unrelated uncommitted changes from other in-progress work** (confirmed via `git status`). When committing in this plan, stage those two files with `git add -p messages/en.json messages/es.json` and select only the hunk(s) that add this plan's new `Locations.*` keys — never `git add messages/en.json` wholesale, or unrelated pending work gets swept into these commits.
- Test command for a single file: `npx vitest run <path>` (the project's `npm test` script is `vitest run` for the whole suite).

---

### Task 1: No-key / load-error fallback with directions links

**Files:**
- Modify: `components/LocationsMap.tsx`
- Modify: `components/LocationsMap.test.tsx`
- Modify: `messages/en.json` (`Locations` block)
- Modify: `messages/es.json` (`Locations` block)

**Interfaces:**
- Produces: `type MappableLocation = Location & { lat: number; lng: number }`, `function isMappable(loc: Location): loc is MappableLocation`, `function directionsUrl(loc: MappableLocation): string`, and `const MAP_SHELL_CLASSES: string` — all consumed by Task 2 and Task 3 in the same file.

- [ ] **Step 1: Add new translation keys**

In `messages/en.json`, find the `"Locations"` block:

```json
  "Locations": {
    "eyebrowCount": "{count} Locations",
    "heading": "Find a Clinic",
    "description": "A clinic close to home, from the Valley to the South Bay.",
    "list": "List",
    "map": "Map",
    "showingLocations": "Showing {count} of {count} locations"
  },
```

Replace it with:

```json
  "Locations": {
    "eyebrowCount": "{count} Locations",
    "heading": "Find a Clinic",
    "description": "A clinic close to home, from the Valley to the South Bay.",
    "list": "List",
    "map": "Map",
    "showingLocations": "Showing {count} of {count} locations",
    "mapUnavailable": "Map is temporarily unavailable — see clinic addresses below.",
    "getDirections": "Get Directions"
  },
```

In `messages/es.json`, find the `"Locations"` block:

```json
  "Locations": {
    "eyebrowCount": "{count} ubicaciones",
    "heading": "Buscar una clínica",
    "description": "Una clínica cerca de casa, desde el Valley hasta el South Bay.",
    "list": "Lista",
    "map": "Mapa",
    "showingLocations": "Mostrando {count} de {count} ubicaciones"
  },
```

Replace it with:

```json
  "Locations": {
    "eyebrowCount": "{count} ubicaciones",
    "heading": "Buscar una clínica",
    "description": "Una clínica cerca de casa, desde el Valley hasta el South Bay.",
    "list": "Lista",
    "map": "Mapa",
    "showingLocations": "Mostrando {count} de {count} ubicaciones",
    "mapUnavailable": "El mapa no está disponible en este momento. Consulta las direcciones de las clínicas a continuación.",
    "getDirections": "Cómo llegar"
  },
```

- [ ] **Step 2: Write the failing tests**

Replace the full contents of `components/LocationsMap.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocationsMap } from "./LocationsMap";

vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: undefined }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  MarkerF: ({ title }: { title: string }) => <div data-testid="marker">{title}</div>,
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

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

const beta = {
  id: "b",
  name: "Beta",
  address: "2 B St",
  phone: "2",
  email: "b@x.com",
  extension: "2",
  lat: 34.1,
  lng: -118.1,
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
  it("renders a fallback with directions links when no API key is configured", () => {
    render(<LocationsMap locations={[alpha, beta]} />);

    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("1 A St")).toBeInTheDocument();
    const directionsLinks = screen.getAllByRole("link", { name: "Get Directions" });
    expect(directionsLinks).toHaveLength(2);
    expect(directionsLinks[0]).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=34,-118"
    );
  });

  it("renders one marker per location when an API key is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");

    render(<LocationsMap locations={[alpha, beta]} />);

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("skips locations without lat/lng instead of crashing", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");

    render(<LocationsMap locations={[alpha, telehealth]} />);

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(1);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Telehealth")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests to verify the first one fails**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: FAIL on "renders a fallback with directions links when no API key is configured" (the component currently renders `GoogleMap` regardless of whether a key is set). The other two tests pass already since the current component ignores the key entirely.

- [ ] **Step 4: Implement the fallback**

Replace the full contents of `components/LocationsMap.tsx`:

```tsx
"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { Location } from "@/lib/types";

type LocationsMapProps = {
  locations: Location[];
};

type MappableLocation = Location & { lat: number; lng: number };

const MAP_SHELL_CLASSES = "h-72 w-full sm:h-96 lg:h-[32rem]";
const containerStyle = { width: "100%", height: "100%" };

// Centered roughly on the Greater LA area, covering all 24 clinics.
const center = { lat: 34.1, lng: -118.3 };

function isMappable(loc: Location): loc is MappableLocation {
  return loc.lat !== undefined && loc.lng !== undefined;
}

function directionsUrl(loc: MappableLocation) {
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const t = useTranslations("Locations");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });
  const mappable = locations.filter(isMappable);

  if (!apiKey || loadError) {
    return (
      <div className={`${MAP_SHELL_CLASSES} overflow-y-auto bg-white p-6`}>
        <p className="text-sm text-ink-soft">{t("mapUnavailable")}</p>
        <ul className="mt-4 space-y-4">
          {mappable.map((loc) => (
            <li key={loc.id} className="text-sm">
              <p className="font-display font-semibold text-ink">{loc.name}</p>
              <p className="text-ink-soft">{loc.address}</p>
              <a
                href={directionsUrl(loc)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-semibold text-teal-dark hover:text-teal"
              >
                {t("getDirections")}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${MAP_SHELL_CLASSES} flex items-center justify-center bg-white text-ink-soft`}>
        Loading map...
      </div>
    );
  }

  return (
    <div className={MAP_SHELL_CLASSES}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {mappable.map((loc) => (
          <MarkerF key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
        ))}
      </GoogleMap>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add components/LocationsMap.tsx components/LocationsMap.test.tsx
git add -p messages/en.json messages/es.json
git commit -m "$(cat <<'EOF'
fix: replace broken Google Maps error widget with a branded fallback

The Map tab on /locations had no API key configured, so it rendered
Google's raw "can't load Google Maps correctly" dialog. Add a fallback
that lists clinic addresses with directions links whenever there's no
key or the map fails to load, and give the map shell a responsive
height instead of a fixed 24rem.
EOF
)"
```

When `git add -p` runs, only stage the hunk(s) that add `mapUnavailable` and `getDirections` under `"Locations"` — skip any other hunks in those files (they belong to unrelated in-progress work).

---

### Task 2: Marker click opens an info window with details and directions

**Files:**
- Modify: `components/LocationsMap.tsx`
- Modify: `components/LocationsMap.test.tsx`
- Modify: `messages/en.json` (`Locations` block)
- Modify: `messages/es.json` (`Locations` block)

**Interfaces:**
- Consumes from Task 1: `MappableLocation`, `isMappable`, `directionsUrl`, `MAP_SHELL_CLASSES`.
- Produces: internal `selectedId` state (not exported) — Task 3 does not need it.

- [ ] **Step 1: Add the `viewDetails` translation key**

In `messages/en.json`, inside `"Locations"`, change:

```json
    "mapUnavailable": "Map is temporarily unavailable — see clinic addresses below.",
    "getDirections": "Get Directions"
```

to:

```json
    "mapUnavailable": "Map is temporarily unavailable — see clinic addresses below.",
    "getDirections": "Get Directions",
    "viewDetails": "View Details"
```

In `messages/es.json`, inside `"Locations"`, change:

```json
    "mapUnavailable": "El mapa no está disponible en este momento. Consulta las direcciones de las clínicas a continuación.",
    "getDirections": "Cómo llegar"
```

to:

```json
    "mapUnavailable": "El mapa no está disponible en este momento. Consulta las direcciones de las clínicas a continuación.",
    "getDirections": "Cómo llegar",
    "viewDetails": "Ver detalles"
```

- [ ] **Step 2: Write the failing test**

In `components/LocationsMap.test.tsx`, replace the mock at the top of the file:

```tsx
vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: undefined }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  MarkerF: ({ title }: { title: string }) => <div data-testid="marker">{title}</div>,
}));
```

with:

```tsx
vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: undefined }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  MarkerF: ({ title, onClick }: { title: string; onClick?: () => void }) => (
    <button type="button" data-testid="marker" onClick={onClick}>
      {title}
    </button>
  ),
  InfoWindow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="info-window">{children}</div>
  ),
}));
```

Add this import near the top of the file, alongside the other imports:

```tsx
import userEvent from "@testing-library/user-event";
```

Add this test inside the `describe("LocationsMap", ...)` block, after the "skips locations without lat/lng" test:

```tsx
  it("opens an info window with details and a directions link when a marker is clicked", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");
    const user = userEvent.setup();

    render(<LocationsMap locations={[alpha, beta]} />);

    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(screen.getByTestId("info-window")).toBeInTheDocument();
    expect(screen.getByText("1 A St")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/locations/a"
    );
    expect(screen.getByRole("link", { name: "Get Directions" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=34,-118"
    );
  });
```

Note: the existing "renders a fallback..." test asserts `getAllByRole("link", { name: "Get Directions" })` has length 2 — that still holds here since no marker is clicked in that test, so no `InfoWindow` (and its own "Get Directions" link) is rendered.

- [ ] **Step 3: Run tests to verify the new one fails**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: FAIL on the new test — clicking "Alpha" throws because `MarkerF`'s mock now expects an `onClick` prop the component doesn't pass yet, and no `data-testid="info-window"` is ever rendered.

- [ ] **Step 4: Implement marker click + info window**

In `components/LocationsMap.tsx`, add `useState` to the React import:

```tsx
import { useState } from "react";
```

Add `InfoWindow` to the `@react-google-maps/api` import:

```tsx
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from "@react-google-maps/api";
```

Add `Link` from the i18n navigation helper, alongside the `Location` import:

```tsx
import { Link } from "@/i18n/navigation";
import { Location } from "@/lib/types";
```

Inside the component, add `selectedId` state and a `selected` lookup right after `const mappable = locations.filter(isMappable);`:

```tsx
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mappable.find((loc) => loc.id === selectedId) ?? null;
```

Replace the final `return` block (the loaded-map branch):

```tsx
  return (
    <div className={MAP_SHELL_CLASSES}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {mappable.map((loc) => (
          <MarkerF key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
        ))}
      </GoogleMap>
    </div>
  );
```

with:

```tsx
  return (
    <div className={MAP_SHELL_CLASSES}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {mappable.map((loc) => (
          <MarkerF
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.name}
            onClick={() => setSelectedId(loc.id)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelectedId(null)}
          >
            <div className="min-w-[180px] text-sm">
              <p className="font-display font-semibold text-ink">{selected.name}</p>
              <p className="mt-1 text-ink-soft">{selected.address}</p>
              <p className="mt-1 text-ink-soft">{selected.phone}</p>
              <div className="mt-2 flex flex-col gap-1">
                <Link
                  href={`/locations/${selected.id}`}
                  className="font-display font-semibold text-teal-dark hover:text-teal"
                >
                  {t("viewDetails")}
                </Link>
                <a
                  href={directionsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-semibold text-teal-dark hover:text-teal"
                >
                  {t("getDirections")}
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add components/LocationsMap.tsx components/LocationsMap.test.tsx
git add -p messages/en.json messages/es.json
git commit -m "$(cat <<'EOF'
feat: show clinic details and a directions link on marker click

Clicking a pin on the /locations Map tab now opens an info window with
the clinic's name, address, phone, a link to its detail page, and a
"Get Directions" link that opens Google Maps directions in a new tab.
EOF
)"
```

Again, only stage the `viewDetails` hunk via `git add -p` — leave unrelated pending changes in those two files untouched.

---

### Task 3: Auto-fit map bounds and translate the loading state

**Files:**
- Modify: `components/LocationsMap.tsx`
- Modify: `components/LocationsMap.test.tsx`
- Modify: `messages/en.json` (`Locations` block)
- Modify: `messages/es.json` (`Locations` block)

**Interfaces:**
- Consumes from Task 1: `mappable` (the filtered array in the component body).
- No new exports — this is the final task for this component.

- [ ] **Step 1: Add the `loadingMap` translation key**

In `messages/en.json`, inside `"Locations"`, change:

```json
    "getDirections": "Get Directions",
    "viewDetails": "View Details"
```

to:

```json
    "getDirections": "Get Directions",
    "viewDetails": "View Details",
    "loadingMap": "Loading map…"
```

In `messages/es.json`, inside `"Locations"`, change:

```json
    "getDirections": "Cómo llegar",
    "viewDetails": "Ver detalles"
```

to:

```json
    "getDirections": "Cómo llegar",
    "viewDetails": "Ver detalles",
    "loadingMap": "Cargando el mapa…"
```

- [ ] **Step 2: Write the failing test**

In `components/LocationsMap.test.tsx`, add this above the `vi.mock(...)` call (mocks are hoisted, so `vi.hoisted` is required to share these references between the mock factory and the tests):

```tsx
const { fitBoundsMock, boundsExtendMock } = vi.hoisted(() => ({
  fitBoundsMock: vi.fn(),
  boundsExtendMock: vi.fn(),
}));
```

Replace the `GoogleMap` entry inside the existing `vi.mock("@react-google-maps/api", ...)` factory:

```tsx
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
```

with:

```tsx
  GoogleMap: ({
    children,
    onLoad,
  }: {
    children: React.ReactNode;
    onLoad?: (map: { fitBounds: typeof fitBoundsMock }) => void;
  }) => {
    onLoad?.({ fitBounds: fitBoundsMock });
    return <div data-testid="google-map">{children}</div>;
  },
```

Add a `beforeEach` alongside the existing `afterEach` to stub the `google.maps.LatLngBounds` global and reset the shared spies:

```tsx
beforeEach(() => {
  fitBoundsMock.mockClear();
  boundsExtendMock.mockClear();
  (globalThis as { google?: unknown }).google = {
    maps: { LatLngBounds: vi.fn(() => ({ extend: boundsExtendMock })) },
  };
});
```

This requires importing `beforeEach` alongside the other vitest imports:

```tsx
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
```

Add this test inside the `describe("LocationsMap", ...)` block:

```tsx
  it("fits the map to every mappable location on load", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");

    render(<LocationsMap locations={[alpha, beta]} />);

    expect(fitBoundsMock).toHaveBeenCalledTimes(1);
    expect(boundsExtendMock).toHaveBeenCalledTimes(2);
    expect(boundsExtendMock).toHaveBeenCalledWith({ lat: 34, lng: -118 });
    expect(boundsExtendMock).toHaveBeenCalledWith({ lat: 34.1, lng: -118.1 });
  });
```

- [ ] **Step 3: Run tests to verify the new one fails**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: FAIL on the new test — `fitBoundsMock` is never called because `GoogleMap` isn't passed an `onLoad` prop yet.

- [ ] **Step 4: Implement fitBounds and the translated loading state**

In `components/LocationsMap.tsx`, add `useCallback` to the React import:

```tsx
import { useCallback, useState } from "react";
```

Add an `onMapLoad` callback right after the `selected` lookup:

```tsx
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (mappable.length === 0) return;
      const bounds = new google.maps.LatLngBounds();
      mappable.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }));
      map.fitBounds(bounds);
    },
    [mappable]
  );
```

Add `onLoad={onMapLoad}` to the `GoogleMap` element:

```tsx
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9} onLoad={onMapLoad}>
```

Replace the hardcoded loading text:

```tsx
      <div className={`${MAP_SHELL_CLASSES} flex items-center justify-center bg-white text-ink-soft`}>
        Loading map...
      </div>
```

with:

```tsx
      <div className={`${MAP_SHELL_CLASSES} flex items-center justify-center bg-white text-ink-soft`}>
        {t("loadingMap")}
      </div>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run components/LocationsMap.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 6: Run the full test suite, lint, and typecheck**

Run: `npm test`
Expected: all suites pass, no regressions elsewhere.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, open `http://localhost:3001/locations` (or whatever port it prints), switch to the Map tab.

- Without `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set in `.env.local`: confirm the branded fallback list renders (no Google error dialog), and each "Get Directions" link opens Google Maps directions in a new tab.
- If a real key is available to test with: set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`, restart the dev server, confirm all 24 clinic pins are visible on load (not clipped), clicking a pin opens the info window with correct name/address/phone, "View Details" navigates to that clinic's page, and "Get Directions" opens Google Maps.
- Resize the browser (or use device toolbar) to confirm the map shell height changes at the `sm`/`lg` breakpoints and the map fills its container at each size.

- [ ] **Step 8: Commit**

```bash
git add components/LocationsMap.tsx components/LocationsMap.test.tsx
git add -p messages/en.json messages/es.json
git commit -m "$(cat <<'EOF'
feat: auto-fit the locations map to all clinic pins

Replace the hand-tuned fixed center/zoom with map.fitBounds() over
every clinic's coordinates, so all pins stay visible regardless of
viewport size or future location changes. Also translate the loading
state's copy.
EOF
)"
```

Only stage the `loadingMap` hunk via `git add -p` in those two files.
