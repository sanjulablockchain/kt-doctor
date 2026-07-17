import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

const originalMatchMedia = window.matchMedia;
const originalIO = globalThis.IntersectionObserver;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

// Minimal IntersectionObserver stand-in that lets a test fire the callback.
class MockIO {
  static instances: MockIO[] = [];
  callback: IntersectionObserverCallback;
  elements: Element[] = [];
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    MockIO.instances.push(this);
  }
  observe(el: Element) {
    this.elements.push(el);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: this.elements[0] } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  globalThis.IntersectionObserver = originalIO;
  MockIO.instances = [];
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  it("renders children fully visible when IntersectionObserver is unavailable", () => {
    mockMatchMedia(false);
    // jsdom has no IntersectionObserver; assert the fallback keeps content shown.
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal>
        <p>hello</p>
      </Reveal>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("opacity-100");
    expect(container.firstChild).not.toHaveClass("opacity-0");
  });

  it("stays visible and does not observe under reduced motion", () => {
    mockMatchMedia(true);
    globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal>
        <p>hi</p>
      </Reveal>
    );
    expect(MockIO.instances.length).toBe(0);
    expect(container.firstChild).toHaveClass("opacity-100");
  });

  it("arms hidden then reveals once on intersection when motion is allowed", () => {
    mockMatchMedia(false);
    globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal>
        <p>reveal me</p>
      </Reveal>
    );
    // Armed after mount effect: hidden until it intersects.
    expect(container.firstChild).toHaveClass("opacity-0");
    expect(MockIO.instances.length).toBe(1);

    act(() => {
      MockIO.instances[0].trigger(true);
    });
    expect(container.firstChild).toHaveClass("opacity-100");
    expect(container.firstChild).not.toHaveClass("opacity-0");
  });

  it("applies a transition delay for staggering", () => {
    mockMatchMedia(false);
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    const { container } = render(
      <Reveal delayMs={140}>
        <p>staggered</p>
      </Reveal>
    );
    expect(container.firstChild).toHaveStyle({ transitionDelay: "140ms" });
  });
});
