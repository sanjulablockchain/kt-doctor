import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersStory } from "./CareersStory";

describe("CareersStory", () => {
  it("renders the story heading and both body paragraphs", () => {
    render(<CareersStory />);
    expect(
      screen.getByRole("heading", { name: "Built on Trust, Grown by Our Team" })
    ).toBeInTheDocument();
    expect(screen.getByText(/largest pediatric group in Los Angeles/i)).toBeInTheDocument();
    expect(screen.getByText(/Janesri and Sunil De Silva Scholarship/i)).toBeInTheDocument();
  });

  it("embeds the story video with a poster", () => {
    render(<CareersStory />);
    const source = document.querySelector("video source");
    expect(source).toHaveAttribute("src", "/careers/story-video.mp4");
  });
});
