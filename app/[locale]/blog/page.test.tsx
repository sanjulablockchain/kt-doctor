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

  it("links each story card to its detail page", () => {
    render(<BlogPage />);
    expect(
      screen.getByRole("link", { name: /halloween safety tips for parents/i })
    ).toHaveAttribute("href", "/blog/halloween-safety-tips");
  });
});
