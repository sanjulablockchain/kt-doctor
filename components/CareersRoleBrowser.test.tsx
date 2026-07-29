import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersRoleBrowser } from "./CareersRoleBrowser";

describe("CareersRoleBrowser", () => {
  it("renders all 8 role categories with an open-role count", () => {
    render(<CareersRoleBrowser onExplore={() => {}} />);
    expect(screen.getByRole("heading", { name: "Physicians" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Students and Early Careers" })).toBeInTheDocument();
    const physiciansCard = screen.getByRole("heading", { name: "Physicians" }).closest("div")!;
    expect(within(physiciansCard).getByText(/2 open roles/)).toBeInTheDocument();
  });

  it("uses singular phrasing for a category with exactly 1 open role", () => {
    render(<CareersRoleBrowser onExplore={() => {}} />);
    const corporateAdminCard = screen
      .getByRole("heading", { name: "Corporate and Administrative Services" })
      .closest("div")!;
    expect(within(corporateAdminCard).getByText(/^1 open role$/)).toBeInTheDocument();
  });

  it("calls onExplore with the category's departments when Explore is clicked", async () => {
    const user = userEvent.setup();
    const onExplore = vi.fn();
    render(<CareersRoleBrowser onExplore={onExplore} />);
    const card = screen.getByRole("heading", { name: "Physicians" }).closest("div")!;
    await user.click(within(card).getByRole("button", { name: "Explore roles" }));
    expect(onExplore).toHaveBeenCalledWith(["Clinical"]);
  });
});
