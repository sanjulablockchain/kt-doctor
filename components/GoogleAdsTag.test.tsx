import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { GoogleAdsTag } from "./GoogleAdsTag";

const ADS_ID = "AW-18411557639";

function scriptsInDocument(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll("script"));
}

afterEach(() => {
  vi.unstubAllEnvs();
  scriptsInDocument().forEach((script) => script.remove());
});

describe("GoogleAdsTag", () => {
  it("renders no tag at all when the conversion ID is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", "");

    const { container } = render(<GoogleAdsTag />);

    expect(container).toBeEmptyDOMElement();
    expect(scriptsInDocument()).toHaveLength(0);
  });

  // One render for both scripts: next/script keeps a module-level cache of what
  // it has already injected, so a second render of the same tag is a no-op.
  it("loads gtag.js for the configured account and bootstraps it inline", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);

    render(<GoogleAdsTag />);

    const scripts = scriptsInDocument();
    const loader = scripts.find((script) => script.src !== "");
    expect(loader?.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`);
    expect(loader?.async).toBe(true);

    const inline = scripts.find((script) => script.src === "");
    expect(inline?.innerHTML).toContain("window.dataLayer = window.dataLayer || []");
    expect(inline?.innerHTML).toContain(`gtag('config', '${ADS_ID}')`);
  });
});
