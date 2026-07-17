import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<AboutPage />);
  });
});
