"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  sendContactMessage,
  type ContactFormState,
} from "@/app/[locale]/contact/actions";
import {
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contactSchema";

const INITIAL_STATE: ContactFormState = { status: "idle" };

// How long the "thank you" confirmation stays up before the empty form
// returns so the visitor can send another message.
const SUCCESS_RESET_MS = 5000;

type FieldName = keyof ContactValues;

const fieldClass =
  "w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200";
const labelClass = "block font-display text-xs font-semibold text-ink";
const errorClass = "mt-1 text-xs font-medium text-red-600";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_STATE);
  // Track the exact success we've dismissed. A brand-new success is a different
  // object, so the confirmation re-shows without a synchronous setState in the
  // effect body (which the React compiler flags as a cascading render).
  const [dismissedState, setDismissedState] = useState<ContactFormState | null>(null);
  // Client-side validation errors, shown instantly before any server round-trip.
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});

  const showSuccess = state.status === "success" && dismissedState !== state;

  // Auto-return to the form after the confirmation has been up a short while.
  // The effect only schedules a timer; the state update happens in the timeout
  // callback, never synchronously in the effect body.
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setDismissedState(state), SUCCESS_RESET_MS);
    return () => clearTimeout(timer);
  }, [showSuccess, state]);

  // Validate on the client first: block the submit and show inline messages if
  // anything is invalid. Valid input falls through to the server action (which
  // re-validates with the same schema as the authoritative check). Keeping the
  // `action` prop means the form still posts and validates server-side if JS
  // hasn't loaded.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const raw: ContactValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const result = validateContact(raw);
    if (!result.success) {
      event.preventDefault();
      setClientErrors(result.fieldErrors);
    } else {
      setClientErrors({});
    }
  }

  function clearFieldError(field: FieldName) {
    setClientErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  if (showSuccess) {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center rounded-2xl border border-teal/30 bg-teal-tint/40 p-10 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-ink">{t("successTitle")}</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setDismissedState(state)}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-teal px-6 py-3 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const values = state.values;
  // Client errors take precedence; server field errors only surface on the
  // no-JS path (where client validation never ran).
  const fieldErrors: ContactFieldErrors = { ...state.fieldErrors, ...clientErrors };

  function errorFor(field: FieldName) {
    const code = fieldErrors[field];
    if (!code) return null;
    return (
      <p id={`contact-${field}-error`} className={errorClass}>
        {t(`errors.${code}`)}
      </p>
    );
  }

  function ariaProps(field: FieldName) {
    return fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `contact-${field}-error` }
      : {};
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold text-ink">{t("formTitle")}</h2>
      <p className="text-xs text-ink-soft">{t("requiredNote")}</p>

      {/* Honeypot: hidden from humans; bots that fill it are dropped server-side.
          `display:none` (inline) is what actually hides it. The off-screen
          classes are belt-and-suspenders, but Tailwind CSS isn't applied in the
          jsdom test env, so the inline style is what keeps it non-visible there. */}
      <div aria-hidden style={{ display: "none" }} className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t("nameLabel")} *
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={values?.name}
          placeholder={t("namePlaceholder")}
          onChange={() => clearFieldError("name")}
          className={`${fieldClass} mt-1`}
          {...ariaProps("name")}
        />
        {errorFor("name")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t("emailLabel")} *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            defaultValue={values?.email}
            placeholder={t("emailPlaceholder")}
            onChange={() => clearFieldError("email")}
            className={`${fieldClass} mt-1`}
            {...ariaProps("email")}
          />
          {errorFor("email")}
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {t("phoneLabel")}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={40}
            defaultValue={values?.phone}
            placeholder={t("phonePlaceholder")}
            onChange={() => clearFieldError("phone")}
            className={`${fieldClass} mt-1`}
            {...ariaProps("phone")}
          />
          {errorFor("phone")}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          {t("subjectLabel")} *
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={150}
          defaultValue={values?.subject}
          placeholder={t("subjectPlaceholder")}
          onChange={() => clearFieldError("subject")}
          className={`${fieldClass} mt-1`}
          {...ariaProps("subject")}
        />
        {errorFor("subject")}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t("messageLabel")} *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          defaultValue={values?.message}
          placeholder={t("messagePlaceholder")}
          onChange={() => clearFieldError("message")}
          className={`${fieldClass} mt-1 resize-y`}
          {...ariaProps("message")}
        />
        {errorFor("message")}
      </div>

      {state.status === "error" && state.errorCode && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t(`errors.${state.errorCode}`)}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? t("submitting") : t("submit")}
      </button>

      <p className="text-xs text-ink-soft/80">{t("privacyNote")}</p>
    </form>
  );
}
