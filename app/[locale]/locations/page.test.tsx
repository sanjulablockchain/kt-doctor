import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
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
});
