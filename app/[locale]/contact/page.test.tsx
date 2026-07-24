import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import ContactPage from "./page";

describe("ContactPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<ContactPage />);
  });
});
