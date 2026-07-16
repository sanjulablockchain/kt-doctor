import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ParallaxImage } from "./ParallaxImage";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe("ParallaxImage", () => {
  it("renders the image with the given src and alt", () => {
    mockMatchMedia(false);
    render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="A pediatrician examining a young patient"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    expect(
      screen.getByAltText("A pediatrician examining a young patient")
    ).toBeInTheDocument();
  });

  it("does not attach a scroll listener when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="test image"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.anything()
    );
  });

  it("attaches a passive scroll listener when reduced motion is not preferred", () => {
    mockMatchMedia(false);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="test image"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
  });

  it("removes the scroll listener on unmount", () => {
    mockMatchMedia(false);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <ParallaxImage
        src="https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80"
        alt="test image"
        width={1200}
        height={1400}
        wrapperClassName="h-[22rem] w-full"
      />
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
