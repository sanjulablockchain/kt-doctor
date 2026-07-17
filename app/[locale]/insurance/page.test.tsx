import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import InsurancePage from "./page";

describe("InsurancePage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<InsurancePage />);
  });
});
