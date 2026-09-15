import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import MediaPage from "./page";

// `generateMetadata` is not covered here: it resolves its copy through
// `getTranslations`, which throws outside a server component, so the other
// static pages in this app do not unit-test it either. The metadata shape it
// produces is covered by `buildMetadata` in lib/seo.test.ts, and the two media
// detail routes do assert their own metadata because they read from data
// rather than from the message catalogue.
describe("MediaPage", () => {
  it("renders the media hub heading", () => {
    render(<MediaPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Press and media resources."
    );
  });

  it("renders the Spanish heading when locale is es", () => {
    render(<MediaPage />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Recursos de prensa y medios."
    );
  });
});
