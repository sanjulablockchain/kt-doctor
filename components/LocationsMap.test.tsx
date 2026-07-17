import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";

const { fitBoundsMock, boundsExtendMock } = vi.hoisted(() => ({
  fitBoundsMock: vi.fn(),
  boundsExtendMock: vi.fn(),
}));

vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: undefined }),
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
  MarkerF: ({ title, onClick }: { title: string; onClick?: () => void }) => (
    <button type="button" data-testid="marker" onClick={onClick}>
      {title}
    </button>
  ),
  InfoWindow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="info-window">{children}</div>
  ),
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

beforeEach(() => {
  fitBoundsMock.mockClear();
  boundsExtendMock.mockClear();
  (globalThis as { google?: unknown }).google = {
    maps: {
      LatLngBounds: vi.fn(function LatLngBounds() {
        return { extend: boundsExtendMock };
      }),
    },
  };
});

import { LocationsMap } from "./LocationsMap";

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

  it("fits the map to every mappable location on load", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "test-key");

    render(<LocationsMap locations={[alpha, beta]} />);

    expect(fitBoundsMock).toHaveBeenCalledTimes(1);
    expect(boundsExtendMock).toHaveBeenCalledTimes(2);
    expect(boundsExtendMock).toHaveBeenCalledWith({ lat: 34, lng: -118 });
    expect(boundsExtendMock).toHaveBeenCalledWith({ lat: 34.1, lng: -118.1 });
  });
});
