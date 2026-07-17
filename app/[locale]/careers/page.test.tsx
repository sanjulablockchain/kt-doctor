import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import CareersPage from "./page";

describe("CareersPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<CareersPage />);
  });
});
