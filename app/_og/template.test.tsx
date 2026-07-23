import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OgCard, ogSize, ogContentType } from "./template";

describe("OgCard", () => {
  it("renders the title and eyebrow text", () => {
    render(<OgCard eyebrow="Our Doctors" title="Dr. Jane Smith" />);
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
    expect(screen.getByText("Dr. Jane Smith")).toBeInTheDocument();
  });

  it("exposes the standard OG image size and content type", () => {
    expect(ogSize).toEqual({ width: 1200, height: 630 });
    expect(ogContentType).toBe("image/png");
  });
});
