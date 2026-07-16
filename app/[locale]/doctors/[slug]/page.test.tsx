import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import DoctorDetailPage from "./page";

describe("DoctorDetailPage", () => {
  it("uses the doctor's own healowUrl for the Book an Appointment link", async () => {
    const ui = await DoctorDetailPage({ params: Promise.resolve({ slug: "amrita-dosanjh" }) });
    render(ui);

    const bookLink = screen.getByRole("link", { name: /book an appointment/i });
    expect(bookLink).toHaveAttribute(
      "href",
      "https://healow.com/apps/provider/amrita-dosanjh-3161324"
    );
  });
});
