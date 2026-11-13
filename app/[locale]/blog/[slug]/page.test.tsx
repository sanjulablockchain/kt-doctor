import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import BlogPostPage, { generateStaticParams } from "./page";

describe("BlogPostPage", () => {
  it("generates static params for all 6 stories", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(6);
    expect(params).toContainEqual({ slug: "halloween-safety-tips" });
    expect(params).toContainEqual({ slug: "cold-flu-rsv-season-2026" });
    expect(params).toContainEqual({ slug: "holiday-travel-health-checklist" });
  });

  it("splits a section body into separate paragraphs at blank lines", async () => {
    const ui = await BlogPostPage({
      params: Promise.resolve({ slug: "cold-flu-rsv-season-2026" }),
    });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Flu, RSV and COVID Season: When to Bring Your Child In"
    );
    const first = screen.getByText(/^Every fall and winter, flu, RSV/);
    const second = screen.getByText(/^Most children recover with rest and fluids/);
    expect(first.tagName).toBe("P");
    expect(second.tagName).toBe("P");
    expect(first).not.toBe(second);
    expect(
      screen.getByRole("heading", { level: 2, name: "Call 911 or Go to the ER for Emergencies" })
    ).toBeInTheDocument();
  });

  it("renders a new post in Spanish when locale is es", async () => {
    const ui = await BlogPostPage({
      params: Promise.resolve({ slug: "holiday-travel-health-checklist", locale: "es" }),
    });
    render(ui, "es");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Viajar con Niños Esta Temporada Navideña: Una Lista de Salud para Padres"
    );
    expect(screen.getByText("Prepare un Botiquín para los Niños")).toBeInTheDocument();
  });

  it("renders the title, date, image, and all real sections", async () => {
    const ui = await BlogPostPage({
      params: Promise.resolve({ slug: "halloween-safety-tips" }),
    });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Halloween Safety Tips for Parents"
    );
    expect(screen.getByText("October 21, 2023")).toBeInTheDocument();
    expect(screen.getByAltText("Halloween Safety Tips for Parents")).toBeInTheDocument();
    expect(screen.getByText("Candy Rules")).toBeInTheDocument();
    expect(
      screen.getByText(/check treats for any open wrappers or signs of tampering/i)
    ).toBeInTheDocument();
  });

  it("renders a back link to /blog", async () => {
    const ui = await BlogPostPage({
      params: Promise.resolve({ slug: "halloween-safety-tips" }),
    });
    render(ui);

    expect(screen.getByRole("link", { name: /back to blog/i })).toHaveAttribute("href", "/blog");
  });

  it("renders the Spanish back link when locale is es", async () => {
    const ui = await BlogPostPage({ params: Promise.resolve({ slug: "halloween-safety-tips" }) });
    render(ui, "es");
    expect(screen.getByRole("link", { name: /volver al blog/i })).toHaveAttribute("href", "/es/blog");
  });

  it("renders the Spanish title, excerpt, and sections when locale is es", async () => {
    const ui = await BlogPostPage({
      params: Promise.resolve({ slug: "halloween-safety-tips", locale: "es" }),
    });
    render(ui, "es");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Consejos de Seguridad para Halloween para los Padres"
    );
    expect(
      screen.getByText(/Halloween es una de las noches más emocionantes/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Reglas para los Dulces")).toBeInTheDocument();
    expect(
      screen.getByText(/revise los dulces por envolturas abiertas/i)
    ).toBeInTheDocument();
  });
});
