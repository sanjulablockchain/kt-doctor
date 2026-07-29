import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersFaq } from "./CareersFaq";
import { careersFaq } from "@/data/careersFaq";

describe("CareersFaq", () => {
  it("renders every FAQ question", () => {
    render(<CareersFaq />);
    for (const item of careersFaq) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  it("expands when a question is clicked", async () => {
    const user = userEvent.setup();
    render(<CareersFaq />);
    const first = careersFaq[0];
    const summary = screen.getByText(first.question);
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    await user.click(summary);
    expect(details).toHaveAttribute("open");
  });
});
