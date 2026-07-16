import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import DoctorDetailPage from "./page";

describe("DoctorDetailPage", () => {
  it("falls back to the shared booking URL for a doctor with no healowUrl", async () => {
    const ui = await DoctorDetailPage({ params: Promise.resolve({ slug: "jon-dandrea" }) });
    render(ui);

    const bookLink = screen.getByRole("link", { name: /book an appointment/i });
    expect(bookLink).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });
});
