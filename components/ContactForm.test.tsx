import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import type { ContactFormState } from "@/app/[locale]/contact/actions";

const actionMock =
  vi.fn<(prev: ContactFormState, formData: FormData) => Promise<ContactFormState>>();

vi.mock("@/app/[locale]/contact/actions", () => ({
  sendContactMessage: (prev: ContactFormState, formData: FormData) => actionMock(prev, formData),
}));

import { ContactForm } from "./ContactForm";

beforeEach(() => actionMock.mockReset());
// Safety net: ensure no test leaves fake timers on, which would hang the
// findByText polling in later tests.
afterEach(() => vi.useRealTimers());

describe("ContactForm", () => {
  it("renders all required fields", () => {
    render(<ContactForm />);
    expect(screen.getByRole("textbox", { name: /full name/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /subject/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeRequired();
    // Phone is optional
    expect(screen.getByRole("textbox", { name: /phone/i })).not.toBeRequired();
  });

  it("includes a hidden honeypot field that is not visible to users", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).not.toBeVisible();
  });

  it("shows the success panel after a successful submission", async () => {
    actionMock.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/your message has been sent/i)).toBeInTheDocument();
  });

  it("returns to the empty form when 'Send another message' is clicked after success", async () => {
    actionMock.mockResolvedValueOnce({ status: "success" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Confirmation shows, offering a way back to the form.
    const sendAnother = await screen.findByRole("button", { name: /send another message/i });
    await user.click(sendAnother);

    // The empty form is back, ready for another message.
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /full name/i })).toHaveValue("");
  });

  it("shows a send error message and keeps the form when the action fails", async () => {
    actionMock.mockResolvedValueOnce({ status: "error", errorCode: "sendFailed" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "jane@example.com");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/couldn't send your message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("validates on the client and does NOT call the server action when the email is invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "bad");
    await user.type(screen.getByRole("textbox", { name: /subject/i }), "Hi");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute("aria-invalid", "true");
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("shows required-field errors on an empty submit without calling the server action", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a subject/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("clears a field error once the user corrects it", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Jane");
    expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
  });
});
