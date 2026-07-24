"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  sendJobApplication,
  type ApplicationFormState,
} from "@/app/[locale]/careers/actions";
import {
  validateApplication,
  validateCvFile,
  CV_ACCEPT,
  type ApplicationFieldErrors,
  type ApplicationValues,
} from "@/lib/careersSchema";
import { positions } from "@/data/careers";
import { FilterDropdown } from "@/components/FilterDropdown";

const INITIAL_STATE: ApplicationFormState = { status: "idle" };
const SUCCESS_RESET_MS = 6000;

type FieldName = keyof ApplicationFieldErrors;

const fieldClass =
  "w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200";
const labelClass = "block font-display text-xs font-semibold text-ink";
const errorClass = "mt-1 text-xs font-medium text-red-600";

type Props = {
  positionId: string;
  onPositionChange: (id: string) => void;
};

export function JobApplicationForm({ positionId, onPositionChange }: Props) {
  const t = useTranslations("Careers");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendJobApplication, INITIAL_STATE);
  const [dismissedState, setDismissedState] = useState<ApplicationFormState | null>(null);
  const [clientErrors, setClientErrors] = useState<ApplicationFieldErrors>({});

  const showSuccess = state.status === "success" && dismissedState !== state;

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setDismissedState(state), SUCCESS_RESET_MS);
    return () => clearTimeout(timer);
  }, [showSuccess, state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const raw: ApplicationValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      position: String(data.get("position") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const textResult = validateApplication(raw);
    const errs: ApplicationFieldErrors = textResult.success ? {} : { ...textResult.fieldErrors };
    // Read the CV directly off the file input rather than via FormData.get.
    // In jsdom, FormData(form) constructs its entry list from the input's
    // internal implementation object, which does not see the file that
    // @testing-library/user-event's upload() assigns via a property override
    // on the DOM wrapper; input.files does see it, and behaves identically
    // to FormData in real browsers for a single-file field.
    const cvInput = form.elements.namedItem("cv") as HTMLInputElement | null;
    const cvFile = cvInput?.files?.[0] ?? null;
    const cvError = validateCvFile(cvFile);
    if (cvError) errs.cv = cvError;
    if (Object.keys(errs).length > 0) {
      event.preventDefault();
      setClientErrors(errs);
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
        className="flex flex-col items-center justify-center rounded-2xl border border-teal/30 bg-teal-tint/40 p-10 text-center"
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
  const fieldErrors: ApplicationFieldErrors = { ...state.fieldErrors, ...clientErrors };

  function errorFor(field: FieldName) {
    const code = fieldErrors[field];
    if (!code) return null;
    return (
      <p id={`careers-${field}-error`} className={errorClass}>
        {t(`errors.${code}`)}
      </p>
    );
  }

  function ariaProps(field: FieldName) {
    return fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `careers-${field}-error` }
      : {};
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-xs text-ink-soft">{t("requiredNote")}</p>

      <div aria-hidden style={{ display: "none" }} className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="careers-name" className={labelClass}>
          {t("nameLabel")} *
        </label>
        <input
          id="careers-name"
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
          <label htmlFor="careers-email" className={labelClass}>
            {t("emailLabel")} *
          </label>
          <input
            id="careers-email"
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
          <label htmlFor="careers-phone" className={labelClass}>
            {t("phoneLabel")}
          </label>
          <input
            id="careers-phone"
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
        <span className={labelClass}>{t("positionLabel")}</span>
        <div className="mt-1">
          <FilterDropdown
            ariaLabel={t("positionLabel")}
            value={positionId}
            placeholder={t("positionDefault")}
            options={positions.map((p) => ({
              value: p.id,
              label: locale === "es" ? p.titleEs : p.title,
            }))}
            onChange={onPositionChange}
            fullWidth
          />
        </div>
        {/* Custom listbox isn't a native form control; mirror its value into
            a hidden input so FormData still carries "position" on submit. */}
        <input type="hidden" name="position" value={positionId} />
      </div>

      <div>
        <label htmlFor="careers-message" className={labelClass}>
          {t("messageLabel")}
        </label>
        <textarea
          id="careers-message"
          name="message"
          maxLength={2000}
          rows={4}
          defaultValue={values?.message}
          placeholder={t("messagePlaceholder")}
          onChange={() => clearFieldError("message")}
          className={`${fieldClass} mt-1 resize-y`}
          {...ariaProps("message")}
        />
        {errorFor("message")}
      </div>

      <div>
        <label htmlFor="careers-cv" className={labelClass}>
          {t("cvLabel")} *
        </label>
        <input
          id="careers-cv"
          name="cv"
          type="file"
          required
          accept={CV_ACCEPT}
          onChange={() => clearFieldError("cv")}
          className={`${fieldClass} mt-1 file:mr-3 file:rounded-full file:border-0 file:bg-teal-tint file:px-4 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-teal-dark`}
          {...ariaProps("cv")}
        />
        <p className="mt-1 text-xs text-ink-soft/80">{t("cvHint")}</p>
        {errorFor("cv")}
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

      <p className="text-center text-xs text-ink-soft/80">{t("privacyNote")}</p>
    </form>
  );
}
