import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { RingCentralChat, RINGCENTRAL_CHAT_LOADER_URL } from "./RingCentralChat";

function scriptsInDocument(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll("script"));
}

afterEach(() => {
  scriptsInDocument().forEach((script) => script.remove());
});

describe("RingCentralChat", () => {
  it("points at the RingCentral chat loader over HTTPS", () => {
    const url = new URL(RINGCENTRAL_CHAT_LOADER_URL);
    expect(url.protocol).toBe("https:");
    expect(url.hostname.endsWith(".chat.digital.ringcentral.com")).toBe(true);
    expect(url.pathname.endsWith("/loader.js")).toBe(true);
  });

  // One render only: next/script keeps a module-level cache of what it has
  // already injected, so a second render of the same tag is a no-op.
  it("loads the chat loader asynchronously", () => {
    const { container } = render(<RingCentralChat />);

    expect(container).toBeEmptyDOMElement();
    const loader = scriptsInDocument().find((script) => script.src !== "");
    expect(loader?.src).toBe(RINGCENTRAL_CHAT_LOADER_URL);
    expect(loader?.async).toBe(true);
  });
});
