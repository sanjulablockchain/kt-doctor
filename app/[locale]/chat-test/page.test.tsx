import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import enMessages from "@/messages/en.json";
import { RINGCENTRAL_CHAT_LOADER_URL } from "@/components/RingCentralChat";
import ChatTestPage, { generateMetadata } from "./page";

// `getTranslations` throws outside a server component, so it is stubbed with a
// lookup into the real English catalogue. That lets this test assert the one
// metadata property this page must never lose: noindex.
vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) =>
    key.split(".").reduce<unknown>(
      (node, part) => (node as Record<string, unknown>)[part],
      enMessages.Seo
    ),
}));

describe("ChatTestPage", () => {
  it("renders the chat test heading and the privacy note", () => {
    render(<ChatTestPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Website chat test"
    );
    expect(
      screen.getByText("Please do not enter real patient information while testing.")
    ).toBeInTheDocument();
  });

  it("loads the RingCentral chat widget", () => {
    render(<ChatTestPage />);
    const loader = Array.from(document.querySelectorAll("script")).find(
      (script) => script.src === RINGCENTRAL_CHAT_LOADER_URL
    );
    expect(loader).toBeDefined();
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<ChatTestPage />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Prueba del chat del sitio web"
    );
  });
});

describe("ChatTestPage metadata", () => {
  it("keeps the page out of search engines", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toBe("Website Chat Test");
  });
});
