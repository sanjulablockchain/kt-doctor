import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import BlogPostPage, { generateStaticParams } from "./page";

describe("BlogPostPage", () => {
  it("generates static params for all 4 real stories", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(4);
    expect(params).toContainEqual({ slug: "halloween-safety-tips" });
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
