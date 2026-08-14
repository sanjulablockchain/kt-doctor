import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { MobileQuickDrawer } from "./MobileQuickDrawer";
import { foundation } from "@/data/foundation";

function fireTouchEvent(type: string, x: number, y: number) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "touches", { value: [{ clientX: x, clientY: y }] });
  fireEvent(window, event);
}

describe("MobileQuickDrawer", () => {
  it("renders the closed launcher button", () => {
    render(<MobileQuickDrawer />);
    const toggle = screen.getByRole("button", { name: "Open quick actions" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the grid sheet on tap, showing Season and Donate tiles", async () => {
    render(<MobileQuickDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "Open quick actions" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Season" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Donate to the Kids and Teens Foundation/i })).toBeInTheDocument();
  });

  it("opens the Season banner drawer when the Season tile is tapped, closing the grid", async () => {
    render(<MobileQuickDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "Open quick actions" }));
    await userEvent.click(screen.getByRole("button", { name: "Season" }));

    expect(screen.getByRole("img", { name: /Global Iodine Deficiency Prevention Day/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Season" })).not.toBeInTheDocument();
  });

  it("links the Donate tile to the foundation donate URL in a new tab", async () => {
    render(<MobileQuickDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "Open quick actions" }));

    const donateLink = screen.getByRole("link", { name: /Donate to the Kids and Teens Foundation/i });
    expect(donateLink).toHaveAttribute("href", foundation.donateUrl);
    expect(donateLink).toHaveAttribute("target", "_blank");
  });

  it("closes the grid sheet on Escape", async () => {
    render(<MobileQuickDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "Open quick actions" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the grid sheet when the backdrop is clicked", async () => {
    render(<MobileQuickDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "Open quick actions" }));
    const backdrop = document.querySelector('[data-testid="quick-actions-backdrop"]');
    expect(backdrop).not.toBeNull();

    await userEvent.click(backdrop as Element);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the grid sheet via an edge swipe starting near the left edge", () => {
    render(<MobileQuickDrawer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireTouchEvent("touchstart", 10, 300);
    fireTouchEvent("touchmove", 90, 300);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not open via a swipe that starts away from the edge", () => {
    render(<MobileQuickDrawer />);

    fireTouchEvent("touchstart", 200, 300);
    fireTouchEvent("touchmove", 280, 300);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders Spanish tile labels when locale is es", async () => {
    render(<MobileQuickDrawer />, "es");
    await userEvent.click(screen.getByRole("button", { name: "Abrir acciones rápidas" }));

    expect(screen.getByRole("button", { name: "Temporada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Donar a la Fundación Kids and Teens/i })).toBeInTheDocument();
  });
});
