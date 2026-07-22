import { describe, it, expect, afterEach } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocationDirections } from "./LocationDirections";

afterEach(cleanup);

const alpha = {
  id: "alpha",
  name: "Alpha",
  address: "100 Main St, Alphatown, CA 90001",
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
  id: "beta",
  name: "Beta",
  address: "200 Oak Ave, Betaville, CA 90002",
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
  address: "Video visits only — no physical address",
  phone: "",
  email: "",
  extension: "",
  description: "",
  hours: { officeHours: "", telehealthHours: "" },
  photos: [],
};

const all = [alpha, beta, telehealth] as never[];

describe("LocationDirections", () => {
  it("renders a directions tile for each physical clinic and excludes telehealth", () => {
    render(<LocationDirections locations={all} />);

    expect(screen.getByRole("link", { name: "Get directions to Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get directions to Beta" })).toBeInTheDocument();
    expect(screen.queryByText("Telehealth")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 2 clinics")).toBeInTheDocument();
  });

  it("links each tile to Google Maps directions using the encoded street address", () => {
    render(<LocationDirections locations={all} />);

    expect(screen.getByRole("link", { name: "Get directions to Alpha" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=100%20Main%20St%2C%20Alphatown%2C%20CA%2090001"
    );
  });

  it("opens directions in a new tab safely", () => {
    render(<LocationDirections locations={all} />);
    const link = screen.getByRole("link", { name: "Get directions to Alpha" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("filters clinics by name as the user types", async () => {
    const user = userEvent.setup();
    render(<LocationDirections locations={all} />);

    await user.type(screen.getByRole("textbox", { name: "Search clinics" }), "beta");

    expect(screen.getByRole("link", { name: "Get directions to Beta" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Get directions to Alpha" })).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 2 clinics")).toBeInTheDocument();
  });

  it("filters clinics by address text too", async () => {
    const user = userEvent.setup();
    render(<LocationDirections locations={all} />);

    await user.type(screen.getByRole("textbox", { name: "Search clinics" }), "oak ave");

    expect(screen.getByRole("link", { name: "Get directions to Beta" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Get directions to Alpha" })).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<LocationDirections locations={all} />);

    await user.type(screen.getByRole("textbox", { name: "Search clinics" }), "zzzzz");

    expect(screen.getByText("No clinics match your search.")).toBeInTheDocument();
    expect(screen.getByText("Showing 0 of 2 clinics")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Get directions/ })).not.toBeInTheDocument();
  });
});
