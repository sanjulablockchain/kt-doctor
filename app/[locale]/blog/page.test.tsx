import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import BlogPage from "./page";

describe("BlogPage", () => {
  it("has an h1 and renders all 4 real stories", () => {
    render(<BlogPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parent Stories & Tips");

    expect(screen.getByText("Halloween Safety Tips for Parents")).toBeInTheDocument();
    expect(
      screen.getByText("Breathe Easy This Winter: Simple Steps to Protect Your Child from Asthma")
    ).toBeInTheDocument();
  });

  it("lists all 6 stories with the November 2026 posts first", () => {
    render(<BlogPage />);
    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((href) => href?.startsWith("/blog/"));
    expect(hrefs).toHaveLength(6);
    expect(hrefs.slice(0, 2)).toEqual([
      "/blog/cold-flu-rsv-season-2026",
      "/blog/holiday-travel-health-checklist",
    ]);
  });

  it("renders the new posts' Spanish titles when locale is es", () => {
    render(<BlogPage />, "es");
    expect(
      screen.getByText("Temporada de Gripe, VRS y COVID: Cuándo Traer a su Hijo a Consulta")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Viajar con Niños Esta Temporada Navideña: Una Lista de Salud para Padres")
    ).toBeInTheDocument();
  });

  it("links each story card to its detail page", () => {
    render(<BlogPage />);
    expect(
      screen.getByRole("link", { name: /halloween safety tips for parents/i })
    ).toHaveAttribute("href", "/blog/halloween-safety-tips");
  });

  it("renders the eyebrow and heading in Spanish when locale is es", () => {
    render(<BlogPage />, "es");
    expect(screen.getByText("De Nuestro Blog")).toBeInTheDocument();
    expect(screen.getByText("Historias y Consejos para Padres")).toBeInTheDocument();
  });

  it("renders story titles and excerpts in Spanish when locale is es", () => {
    render(<BlogPage />, "es");
    expect(
      screen.getByText("Consejos de Seguridad para Halloween para los Padres")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Halloween es una de las noches más emocionantes/i)
    ).toBeInTheDocument();
  });
});
