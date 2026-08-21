import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { HeroSlideshow } from "./HeroSlideshow";

function setPrefersReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? reduced : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );
}

// The active slide is the only one not marked aria-hidden.
function activeAlt(): string | null {
  const active = document.querySelector("[data-active] img");
  return active?.getAttribute("alt") ?? null;
}

describe("HeroSlideshow", () => {
  beforeEach(() => {
    setPrefersReducedMotion(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders all 4 slides, each with its own alt text", () => {
    render(<HeroSlideshow />);
    const images = screen.getAllByRole("img", { hidden: true });
    expect(images).toHaveLength(4);
    for (const image of images) {
      expect(image.getAttribute("alt")).toBeTruthy();
    }
  });

  it("shows the first slide and hides the rest on mount", () => {
    const { container } = render(<HeroSlideshow />);
    const layers = container.querySelectorAll("[data-active], [aria-hidden='true']");
    expect(layers).toHaveLength(4);
    expect(activeAlt()).toMatch(/bright kitchen/i);
  });

  it("advances to the next slide after the hold interval", () => {
    render(<HeroSlideshow />);
    expect(activeAlt()).toMatch(/bright kitchen/i);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(activeAlt()).toMatch(/golden sunset/i);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(activeAlt()).toMatch(/blossoming spring trees/i);
  });

  it("wraps back around to the first slide", () => {
    render(<HeroSlideshow />);
    act(() => {
      vi.advanceTimersByTime(6000 * 4);
    });
    expect(activeAlt()).toMatch(/bright kitchen/i);
  });

  it("does not auto-advance when the visitor prefers reduced motion", () => {
    setPrefersReducedMotion(true);
    render(<HeroSlideshow />);

    act(() => {
      vi.advanceTimersByTime(6000 * 3);
    });
    expect(activeAlt()).toMatch(/bright kitchen/i);
  });

  it("stops the timer on unmount", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = render(<HeroSlideshow />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
