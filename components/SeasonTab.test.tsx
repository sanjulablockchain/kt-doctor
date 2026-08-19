import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { SeasonTab } from "./SeasonTab";

describe("SeasonTab", () => {
  it("renders the closed floating tab with the Season label", () => {
    render(<SeasonTab />);
    const toggle = screen.getByRole("button", { name: "Open seasonal updates" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Season")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the drawer on click and shows every seasonal banner", async () => {
    render(<SeasonTab />);
    await userEvent.click(screen.getByRole("button", { name: "Open seasonal updates" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Global Iodine Deficiency Prevention Day/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Back to school reminder/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Back to school vision check/ })).toBeInTheDocument();
  });

  it("renders one image per banner asset, each with descriptive alt text", async () => {
    render(<SeasonTab />);
    await userEvent.click(screen.getByRole("button", { name: "Open seasonal updates" }));

    const banners = screen.getAllByRole("img");
    expect(banners).toHaveLength(3);
    for (const banner of banners) {
      expect(banner.getAttribute("alt")).toBeTruthy();
    }
  });

  it("closes the drawer when the close button is clicked", async () => {
    render(<SeasonTab />);
    await userEvent.click(screen.getByRole("button", { name: "Open seasonal updates" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Close seasonal updates" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the drawer on Escape", async () => {
    render(<SeasonTab />);
    await userEvent.click(screen.getByRole("button", { name: "Open seasonal updates" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the drawer when the backdrop is clicked", async () => {
    render(<SeasonTab />);
    await userEvent.click(screen.getByRole("button", { name: "Open seasonal updates" }));
    const backdrop = document.querySelector('[data-testid="season-drawer-backdrop"]');
    expect(backdrop).not.toBeNull();

    await userEvent.click(backdrop as Element);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the Spanish label and aria labels when locale is es", () => {
    render(<SeasonTab />, "es");
    expect(screen.getByText("Temporada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir novedades de temporada" })).toBeInTheDocument();
  });
});
