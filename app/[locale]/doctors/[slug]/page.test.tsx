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

  // A doctor who also has a formal press biography should not be a dead end:
  // the two versions of her story link to each other.
  it("links to the press biography for a doctor who has one", async () => {
    const ui = await DoctorDetailPage({ params: Promise.resolve({ slug: "janesri-de-silva" }) });
    render(ui);

    expect(screen.getByRole("link", { name: /full press biography/i })).toHaveAttribute(
      "href",
      "/media/leadership/janesri-de-silva"
    );
  });

  it("shows no press biography link for a doctor who has none", async () => {
    const ui = await DoctorDetailPage({ params: Promise.resolve({ slug: "amrita-dosanjh" }) });
    render(ui);

    expect(screen.queryByRole("link", { name: /press biography/i })).not.toBeInTheDocument();
  });
});
