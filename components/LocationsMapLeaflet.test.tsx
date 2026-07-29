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
  hours: { officeHours: "Monday-Friday, 9AM-6PM", telehealthHours: "Monday-Sunday, 9AM-8PM" },
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
    expect(screen.getByTestId("tile-layer").dataset.url).toContain("voyager");
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

  it("shows the clinic name, address, office hours, directions link, and details link in the popup", () => {
    renderMap([alpha]);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("1 A St")).toBeInTheDocument();
    expect(screen.getByText("Office Hours:")).toBeInTheDocument();
    expect(screen.getByText("Monday-Friday, 9AM-6PM")).toBeInTheDocument();
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
