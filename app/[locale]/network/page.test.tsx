import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import NetworkPage from "./page";

describe("NetworkPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<NetworkPage />);
  });
});
