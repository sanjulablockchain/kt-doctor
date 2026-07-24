"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Position } from "@/data/careers";

type Props = {
  position: Position;
  onClose: () => void;
  onApply: (id: string) => void;
};

// Job-details popup: full description, responsibilities, and requirements for
// one position. Closes on Escape, on backdrop click, or via the close button.
// Locks page scroll while open so the background doesn't scroll behind it.
export function PositionDetailsModal({ position, onClose, onApply }: Props) {
  const t = useTranslations("Careers");
  const locale = useLocale();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const title = locale === "es" ? position.titleEs : position.title;
  const description = locale === "es" ? position.descriptionEs : position.description;
  const responsibilities = locale === "es" ? position.responsibilitiesEs : position.responsibilities;
  const requirements = locale === "es" ? position.requirementsEs : position.requirements;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-surface shadow-card"
      >
        {/* Header stays pinned so the close control is always reachable. */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <h2 id="job-details-title" className="font-display text-xl font-bold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeLabel")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-6 pb-4 pt-1 text-xs text-ink-soft">
          <span>{position.locations}</span>
          <span aria-hidden>&middot;</span>
          <span>{t(position.employmentType === "Full-time" ? "typeFullTime" : position.employmentType === "Part-time" ? "typePartTime" : "typeFullPartTime")}</span>
        </div>

        {/* Only this middle section scrolls, so the header and Apply button
            below are always visible even on a short viewport. */}
        <div className="flex-1 overflow-y-auto border-t border-border px-6 py-4">
          <h3 className="font-display text-sm font-bold text-ink">{t("descriptionHeading")}</h3>
          <p className="mt-1 text-sm text-ink-soft">{description}</p>

          <h3 className="mt-4 font-display text-sm font-bold text-ink">{t("responsibilitiesHeading")}</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {responsibilities.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-4 font-display text-sm font-bold text-ink">{t("requirementsHeading")}</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {requirements.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => onApply(position.id)}
            className="w-full rounded-full bg-teal px-6 py-3 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            {t("applyForRole")}
          </button>
        </div>
      </div>
    </div>
  );
}
