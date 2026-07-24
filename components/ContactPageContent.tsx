"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { locations } from "@/data/locations";
import { MAIN_PHONE, TEXT_PHONE, GENERAL_EMAIL } from "@/lib/constants";

function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

const cardClass =
  "flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-teal/40";
const chipClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark";

export function ContactPageContent() {
  const t = useTranslations("Contact");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Reveal className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-tint px-3 py-1 font-display text-xs font-semibold text-teal-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          {t("eyebrow")}
        </span>
        <h1 className="mx-auto mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-soft">{t("intro")}</p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Left rail: channels, hours, emergency. On desktop the column
            stretches to the form's height and distributes its cards so the
            bottom edges align (no trailing whitespace). */}
        <Reveal className="flex flex-col gap-4 lg:justify-between">
          <a href={`tel:${toE164(MAIN_PHONE)}`} className={cardClass}>
            <span aria-hidden className={chipClass}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h4.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1L6.6 10.8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t("callTitle")}
              </span>
              <span className="block font-display text-lg font-bold text-ink">{MAIN_PHONE}</span>
              <span className="block text-xs text-ink-soft">{t("callHelper")}</span>
            </span>
          </a>

          <a href={`sms:${toE164(TEXT_PHONE)}`} className={cardClass}>
            <span aria-hidden className={chipClass}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4.06A2.5 2.5 0 0 1 4 13.5v-8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t("textTitle")}
              </span>
              <span className="block font-display text-lg font-bold text-ink">{TEXT_PHONE}</span>
              <span className="block text-xs text-ink-soft">{t("textHelper")}</span>
            </span>
          </a>

          <a href={`mailto:${GENERAL_EMAIL}`} className={cardClass}>
            <span aria-hidden className={chipClass}>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m4.5 6.5 7.5 6 7.5-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {t("emailTitle")}
              </span>
              <span className="block break-all font-display text-base font-bold text-ink">
                {GENERAL_EMAIL}
              </span>
              <span className="block text-xs text-ink-soft">{t("emailHelper")}</span>
            </span>
          </a>

          {/* Office hours. `data-on-navy` pins ivory/teal-tint to their light
              values so the text stays legible on this always-navy card in dark
              mode too (same mechanism the Footer uses). */}
          <div data-on-navy className="rounded-2xl bg-navy p-5 text-ivory">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-teal-tint">
              {t("hoursTitle")}
            </h2>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ivory/80">{t("hoursWeekdays")}</dt>
                <dd className="font-semibold">{t("hoursWeekdaysTime")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ivory/80">{t("hoursSaturday")}</dt>
                <dd className="font-semibold">{t("hoursSaturdayTime")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ivory/80">{t("hoursSunday")}</dt>
                <dd className="font-semibold">{t("hoursSundayTime")}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs text-ivory/70">
              {t("hoursNote", { count: locations.length })}{" "}
              <Link href="/locations" className="font-semibold text-teal-tint hover:underline">
                {t("hoursLink")} →
              </Link>
            </p>
          </div>

          {/* Emergency notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <span aria-hidden className="mt-0.5 text-red-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-sm text-red-800">
              <strong className="font-semibold">{t("emergencyTitle")}</strong> {t("emergencyBody")}
            </p>
          </div>
        </Reveal>

        {/* Right: form */}
        <Reveal className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <ContactForm />
        </Reveal>
      </div>
    </main>
  );
}
