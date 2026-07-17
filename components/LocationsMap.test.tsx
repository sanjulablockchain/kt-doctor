import "@testing-library/jest-dom/vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";

vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: undefined }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  MarkerF: ({ title }: { title: string }) => <div data-testid="marker">{title}</div>,
}));

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
  afterEach(() => {
    vi.unstubAllEnvs();
  });

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
