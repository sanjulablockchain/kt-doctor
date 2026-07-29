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
