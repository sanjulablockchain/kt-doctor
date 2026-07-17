import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import ResourcesPage from "./page";

describe("ResourcesPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<ResourcesPage />);
  });
});
