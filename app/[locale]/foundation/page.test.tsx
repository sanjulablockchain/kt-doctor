import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import FoundationPage from "./page";

describe("FoundationPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<FoundationPage />);
  });
});
