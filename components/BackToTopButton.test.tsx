import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { BackToTopButton } from "./BackToTopButton";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, configurable: true });
}

describe("BackToTopButton", () => {
  beforeEach(() => {
    setScrollY(0);
    window.scrollTo = vi.fn();
  });

  it("is hidden from assistive tech until the page is scrolled down", () => {
    render(<BackToTopButton />);
    expect(screen.getByTestId("back-to-top")).toHaveAttribute("aria-hidden", "true");
  });

  it("becomes visible after scrolling past the threshold", () => {
    render(<BackToTopButton />);
    setScrollY(500);
    fireEvent.scroll(window);
    expect(screen.getByRole("button", { name: "Back to top" })).toHaveAttribute(
      "aria-hidden",
      "false"
    );
  });

  it("scrolls smoothly to the top when clicked", () => {
    render(<BackToTopButton />);
    setScrollY(500);
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole("button", { name: "Back to top" }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
