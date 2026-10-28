import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AUTO_ADVANCE_MS, HeroCarousel } from "./HeroCarousel";

const slides = [
  { id: "one", label: "First", content: <p>First slide body</p> },
  { id: "two", label: "Second", content: <p>Second slide body</p> },
];

function renderCarousel() {
  return render(
    <HeroCarousel slides={slides} label="Highlights" pauseLabel="Pause slides" playLabel="Play slides" />
  );
}

function panel(name: string) {
  return screen.getByRole("tabpanel", { name });
}

function tab(name: string) {
  return screen.getByRole("tab", { name });
}

function progress() {
  return screen.getByTestId("hero-slide-progress");
}

// Ends the progress bar's animation. jsdom has no AnimationEvent, so React may
// listen for the prefixed event name instead; fire that only if the standard
// one did nothing, so the slide advances exactly once.
function fillProgress() {
  const selected = () => screen.getByRole("tab", { selected: true }).id;
  const before = selected();
  fireEvent.animationEnd(progress());
  if (selected() === before) fireEvent(progress(), new Event("webkitAnimationEnd", { bubbles: true }));
}

describe("HeroCarousel", () => {
  it("renders a labelled tab per slide, with the first selected", () => {
    renderCarousel();
    expect(screen.getByRole("tablist", { name: "Highlights" })).toBeInTheDocument();
    expect(tab("First")).toHaveAttribute("aria-selected", "true");
    expect(tab("Second")).toHaveAttribute("aria-selected", "false");
  });

  it("keeps every slide in the markup but makes the inactive one inert", () => {
    renderCarousel();
    expect(screen.getByText("Second slide body")).toBeInTheDocument();
    expect(panel("First")).not.toHaveAttribute("inert");
    expect(panel("Second")).toHaveAttribute("inert");
  });

  it("switches slides when a tab is clicked", async () => {
    renderCarousel();
    await userEvent.click(tab("Second"));
    expect(tab("Second")).toHaveAttribute("aria-selected", "true");
    expect(panel("Second")).not.toHaveAttribute("inert");
    expect(panel("First")).toHaveAttribute("inert");
  });

  it("uses a roving tabindex and moves with the arrow, Home and End keys", async () => {
    renderCarousel();
    expect(tab("First")).toHaveAttribute("tabindex", "0");
    expect(tab("Second")).toHaveAttribute("tabindex", "-1");

    tab("First").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tab("Second")).toHaveFocus();
    expect(tab("Second")).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    expect(tab("First")).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(tab("Second")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(tab("First")).toHaveFocus();
  });

  it("switches on a horizontal swipe, but not on a vertical scroll", () => {
    renderCarousel();
    const area = panel("First").parentElement!;

    fireEvent.touchStart(area, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(area, { changedTouches: [{ clientX: 290, clientY: 400 }] });
    expect(tab("First")).toHaveAttribute("aria-selected", "true");

    fireEvent.touchStart(area, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(area, { changedTouches: [{ clientX: 150, clientY: 110 }] });
    expect(tab("Second")).toHaveAttribute("aria-selected", "true");
  });

  it("stacks the slides in one cell from xl and removes the inactive one below it", () => {
    renderCarousel();
    expect(panel("First").className).toContain("xl:[grid-area:1/1]");
    expect(panel("Second").className).toContain("max-xl:hidden");
    expect(panel("First").className).not.toContain("max-xl:hidden");
  });

  it("cross-fades between slides", () => {
    renderCarousel();
    expect(panel("First").className).toContain("transition-[opacity,translate]");
    expect(panel("First").className).toContain("opacity-100");
    expect(panel("Second").className).toContain("opacity-0");
  });

  describe("auto-advance", () => {
    it("fills a progress bar in the active tab over 10 seconds", () => {
      renderCarousel();
      expect(AUTO_ADVANCE_MS).toBe(10_000);
      expect(tab("First")).toContainElement(progress());
      expect(progress().style.animationName).toBe("ktmg-progress");
      expect(progress().style.animationDuration).toBe("10000ms");
      expect(progress().style.animationPlayState).toBe("running");
    });

    it("moves to the next slide when the bar fills, and wraps around", () => {
      renderCarousel();
      fillProgress();
      expect(tab("Second")).toHaveAttribute("aria-selected", "true");
      expect(tab("Second")).toContainElement(progress());
      fillProgress();
      expect(tab("First")).toHaveAttribute("aria-selected", "true");
    });

    it("pauses while hovered", () => {
      renderCarousel();
      const root = screen.getByRole("tablist").closest(".flex-col")!;
      fireEvent.mouseEnter(root);
      expect(progress().style.animationPlayState).toBe("paused");
      fireEvent.mouseLeave(root);
      expect(progress().style.animationPlayState).toBe("running");
    });

    it("can be paused and resumed with the pause button", async () => {
      renderCarousel();
      await userEvent.click(screen.getByRole("button", { name: "Pause slides" }));
      expect(progress().style.animationPlayState).toBe("paused");
      await userEvent.click(screen.getByRole("button", { name: "Play slides" }));
      expect(screen.getByRole("button", { name: "Pause slides" })).toBeInTheDocument();
    });

    it("keeps the pause button out of the tab list", () => {
      renderCarousel();
      expect(screen.getByRole("tablist")).not.toContainElement(
        screen.getByRole("button", { name: "Pause slides" })
      );
    });

    it("does not advance under reduced motion: the bar and the button hide", () => {
      renderCarousel();
      expect(progress().className).toContain("motion-reduce:hidden");
      expect(screen.getByRole("button", { name: "Pause slides" }).className).toContain("motion-reduce:hidden");
    });

    it("keeps rotating changes silent and announces them once stopped", async () => {
      renderCarousel();
      const area = panel("First").parentElement!;
      expect(area).toHaveAttribute("aria-live", "off");
      await userEvent.click(screen.getByRole("button", { name: "Pause slides" }));
      expect(area).toHaveAttribute("aria-live", "polite");
    });
  });
});
