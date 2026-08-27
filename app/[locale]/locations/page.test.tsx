import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import { MAIN_PHONE } from "@/lib/constants";
import LocationsPage from "./page";

describe("LocationsPage", () => {
  it("renders all 25 locations (including Telehealth) in list view by default", () => {
    renderWithIntl(<LocationsPage />);
    expect(screen.getByText("Showing 25 of 25 locations")).toBeInTheDocument();
    expect(screen.getByText("Pasadena")).toBeInTheDocument();
    expect(screen.getByText("Whittier")).toBeInTheDocument();
    expect(screen.getByText("Telehealth")).toBeInTheDocument();
  });

  it("has a List/Map toggle with List selected by default", () => {
    renderWithIntl(<LocationsPage />);
    const listButton = screen.getByRole("button", { name: "List" });
    const mapButton = screen.getByRole("button", { name: "Map" });
    expect(listButton).toBeInTheDocument();
    expect(mapButton).toBeInTheDocument();
    expect(listButton).toHaveAttribute("aria-pressed", "true");
  });

  it("renders the heading and List/Map labels in Spanish when locale is es", () => {
    renderWithIntl(<LocationsPage />, "es");
    expect(screen.getByText("Buscar una clínica")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lista" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mapa" })).toBeInTheDocument();
  });

  it("tells visitors a location page is where they book an appointment", () => {
    renderWithIntl(<LocationsPage />);
    expect(screen.getByText(/book an appointment online/i)).toBeInTheDocument();
  });

  it("offers the main phone number as a tel: link for booking by phone", () => {
    renderWithIntl(<LocationsPage />);
    const phoneLink = screen.getByRole("link", { name: /call/i });
    expect(phoneLink).toHaveAttribute("href", "tel:+18183615437");
    expect(phoneLink).toHaveAttribute(
      "aria-label",
      `Call ${MAIN_PHONE} to book an appointment`
    );
    expect(phoneLink).toHaveTextContent(MAIN_PHONE);
  });

  it("offers the same phone booking option in Spanish", () => {
    renderWithIntl(<LocationsPage />, "es");
    expect(screen.getByText(/reservar una cita por teléfono/i)).toBeInTheDocument();

    const phoneLink = screen.getByRole("link", { name: /llame/i });
    expect(phoneLink).toHaveAttribute("href", "tel:+18183615437");
    expect(phoneLink).toHaveTextContent(MAIN_PHONE);
  });
});
