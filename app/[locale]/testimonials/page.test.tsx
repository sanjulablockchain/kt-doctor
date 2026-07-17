import { describe, it } from "vitest";
import { renderWithIntl } from "@/lib/test-utils";
import TestimonialsPage from "./page";

describe("TestimonialsPage", () => {
  it("renders without crashing", () => {
    renderWithIntl(<TestimonialsPage />);
  });
});
