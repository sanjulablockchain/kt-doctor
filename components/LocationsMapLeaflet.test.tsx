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

  it("loads tiles from OpenStreetMap, with no API key in the URL", () => {
    renderMap([alpha]);
    const url = screen.getByTestId("tile-layer").dataset.url ?? "";
    expect(url).toBe("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    expect(url).not.toContain("api_key");
  });

  it("credits OpenStreetMap in the tile attribution", () => {
    renderMap([alpha]);
    const attribution = screen.getByTestId("tile-layer").dataset.attribution ?? "";
    expect(attribution).toContain("openstreetmap.org/copyright");
    expect(attribution).toContain("OpenStreetMap");
  });

  it("uses the same tiles in dark mode, which is applied in CSS", () => {
    localStorage.setItem("theme", "dark");
    renderMap([alpha]);
    expect(screen.getByTestId("tile-layer").dataset.url).toBe(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
  });

  it("shows the clinic name, address, office hours, and details link in the popup", () => {
    renderMap([alpha]);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("1 A St")).toBeInTheDocument();
    expect(screen.getByText("Office Hours:")).toBeInTheDocument();
    expect(screen.getByText("Monday-Friday, 9AM-6PM")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/locations/a"
    );
  });

  it("offers both Google Maps and Apple Maps directions to the marker coordinates", () => {
    renderMap([alpha]);
    expect(screen.getByText("Get Directions")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get directions to Alpha in Google Maps" })
    ).toHaveAttribute("href", "https://www.google.com/maps/dir/?api=1&destination=34,-118");
    expect(
      screen.getByRole("link", { name: "Get directions to Alpha in Apple Maps" })
    ).toHaveAttribute("href", "https://maps.apple.com/?daddr=34,-118&dirflg=d");
  });

  it("opens both directions links in a new tab safely", () => {
    renderMap([alpha]);
    for (const link of screen.getAllByRole("link", { name: /Get directions/ })) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
