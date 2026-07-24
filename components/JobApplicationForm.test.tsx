import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import type { ApplicationFormState } from "@/app/[locale]/careers/actions";

const actionMock =
  vi.fn<(prev: ApplicationFormState, formData: FormData) => Promise<ApplicationFormState>>();

vi.mock("@/app/[locale]/careers/actions", () => ({
  sendJobApplication: (prev: ApplicationFormState, formData: FormData) => actionMock(prev, formData),
}));

import { JobApplicationForm } from "./JobApplicationForm";

function Harness() {
  return <JobApplicationForm positionId="" onPositionChange={() => {}} />;
}

beforeEach(() => actionMock.mockReset());
afterEach(() => vi.useRealTimers());

describe("JobApplicationForm", () => {
  it("renders name, email, position, and CV fields", () => {
    render(<Harness />);
    expect(screen.getByRole("textbox", { name: /full name/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeRequired();
    expect(screen.getByRole("button", { name: /position/i })).toBeInTheDocument();
    // File input has no textbox role; find by label text.
    expect(screen.getByLabelText(/upload your cv/i)).toBeInTheDocument();
  });

  it("includes a hidden honeypot field", () => {
    const { container } = render(<Harness />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).not.toBeVisible();
  });

  it("blocks submit and shows an error when the CV is missing", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /submit application/i }));
    expect(await screen.findByText(/please attach your cv/i)).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("blocks submit on an invalid email", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "bad");
    await user.upload(
      screen.getByLabelText(/upload your cv/i),
      new File(["x"], "cv.pdf", { type: "application/pdf" })
    );
    await user.click(screen.getByRole("button", { name: /submit application/i }));
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("shows the success panel after a successful submission", async () => {
    actionMock.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.upload(
      screen.getByLabelText(/upload your cv/i),
      new File(["x"], "cv.pdf", { type: "application/pdf" })
    );
    await user.click(screen.getByRole("button", { name: /submit application/i }));
    expect(await screen.findByText(/application received/i)).toBeInTheDocument();
  });
});
