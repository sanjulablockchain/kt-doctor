import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { PositionDetailsModal } from "./PositionDetailsModal";
import { positions } from "@/data/careers";

const pediatrician = positions.find((p) => p.id === "pediatrician")!;

describe("PositionDetailsModal", () => {
  it("renders the title, description, responsibilities, and requirements", () => {
    render(<PositionDetailsModal position={pediatrician} onClose={vi.fn()} onApply={vi.fn()} />);
    expect(screen.getByRole("heading", { name: pediatrician.title })).toBeInTheDocument();
    expect(screen.getByText(pediatrician.description)).toBeInTheDocument();
    for (const item of pediatrician.responsibilities) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    for (const item of pediatrician.requirements) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<PositionDetailsModal position={pediatrician} onClose={onClose} onApply={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<PositionDetailsModal position={pediatrician} onClose={onClose} onApply={vi.fn()} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked but not when the panel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <PositionDetailsModal position={pediatrician} onClose={onClose} onApply={vi.fn()} />
    );
    await user.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onApply with the position id when 'Apply for this role' is clicked", async () => {
    const onApply = vi.fn();
    const user = userEvent.setup();
    render(<PositionDetailsModal position={pediatrician} onClose={vi.fn()} onApply={onApply} />);
    await user.click(screen.getByRole("button", { name: /apply for this role/i }));
    expect(onApply).toHaveBeenCalledWith("pediatrician");
  });
});
