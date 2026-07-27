import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { SocialLinks } from "./SocialLinks";

describe("SocialLinks", () => {
  it("renders all 4 social links with correct hrefs and labels", () => {
    render(<SocialLinks />);
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/pediatriciansincalifornia/"
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/napediatricurgentcare/"
    );
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/KTDoctorGroup"
    );
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UCpc-umQeo6CQFLHq4bTWeUQ"
    );
  });

  it("opens every link in a new tab safely", () => {
    render(<SocialLinks />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
