import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroCarousel } from "./HeroCarousel";

const slides = [
  { id: "one", label: "First", content: <p>First slide body</p> },
  { id: "two", label: "Second", content: <p>Second slide body</p> },
];

function panel(name: string) {
  return screen.getByRole("tabpanel", { name });
}

describe("HeroCarousel", () => {
  it("renders a labelled tab per slide, with the first selected", () => {
    render(<HeroCarousel slides={slides} label="Highlights" />);
    expect(screen.getByRole("tablist", { name: "Highlights" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute("aria-selected", "false");
  });

  it("keeps every slide in the markup but makes the inactive one inert", () => {
    render(<HeroCarousel slides={slides} label="Highlights" />);
    expect(screen.getByText("Second slide body")).toBeInTheDocument();
    expect(panel("First")).not.toHaveAttribute("inert");
    expect(panel("Second")).toHaveAttribute("inert");
  });

  it("switches slides when a tab is clicked", async () => {
    render(<HeroCarousel slides={slides} label="Highlights" />);
    await userEvent.click(screen.getByRole("tab", { name: "Second" }));
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute("aria-selected", "true");
    expect(panel("Second")).not.toHaveAttribute("inert");
    expect(panel("First")).toHaveAttribute("inert");
  });

  it("uses a roving tabindex and moves with the arrow, Home and End keys", async () => {
    render(<HeroCarousel slides={slides} label="Highlights" />);
    const first = screen.getByRole("tab", { name: "First" });
    const second = screen.getByRole("tab", { name: "Second" });
    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");

    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    expect(first).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(second).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(first).toHaveFocus();
  });

  it("switches on a horizontal swipe, but not on a vertical scroll", () => {
    render(<HeroCarousel slides={slides} label="Highlights" />);
    const area = panel("First").parentElement!;

    fireEvent.touchStart(area, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(area, { changedTouches: [{ clientX: 290, clientY: 400 }] });
    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute("aria-selected", "true");

    fireEvent.touchStart(area, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(area, { changedTouches: [{ clientX: 150, clientY: 110 }] });
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute("aria-selected", "true");
  });

  it("stacks the slides in one cell from xl and removes the inactive one below it", () => {
    render(<HeroCarousel slides={slides} label="Highlights" />);
    expect(panel("First").className).toContain("xl:[grid-area:1/1]");
    expect(panel("Second").className).toContain("max-xl:hidden");
    expect(panel("First").className).not.toContain("max-xl:hidden");
  });
});
