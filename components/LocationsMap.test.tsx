import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocationsMap } from "./LocationsMap";

vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  MarkerF: ({ title }: { title: string }) => <div data-testid="marker">{title}</div>,
}));

describe("LocationsMap", () => {
  it("renders one marker per location", () => {
    render(
      <LocationsMap
        locations={[
          {
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
          },
          {
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
          },
        ]}
      />
    );

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
