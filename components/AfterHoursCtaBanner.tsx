"use client";

import { useTranslations } from "next-intl";
import { AFTER_HOURS_PHONE } from "@/lib/constants";
import { networkBrands } from "@/data/network";

const afterHoursBrand = networkBrands.find((b) => b.id === "pediatric-after-hour")!;

// Homepage teaser for the After-Hours Pediatric Urgent Care partner brand
// (see data/network.ts). Modeled on ClinicNearYouCard/InfoStatCard's
// surface-card-plus-accent-panel pattern, but not a single whole-card link
// (like BookingCtaBanner) since it carries two independent CTAs: an external
// link and a tel: link.
export function AfterHoursCtaBanner() {
  const t = useTranslations("Home");
  const telHref = `tel:+1${AFTER_HOURS_PHONE.replace(/\D/g, "")}`;

  const buttonFocusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card md:flex-row">
      {/* Content — above the schedule panel on mobile, left of it on desktop. */}
      <div className="order-2 flex flex-1 flex-col justify-center p-7 sm:p-10 md:order-1">
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("afterHoursEyebrow")}
        </span>
        <h2 className="mt-2 max-w-md font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t("afterHoursHeading")}
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">{t("afterHoursBody")}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={afterHoursBrand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full bg-teal px-6 py-3 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark ${buttonFocusRing}`}
          >
            {t("afterHoursCta")}
          </a>
          <a
            href={telHref}
            aria-label={t("afterHoursCallLabel", { phone: AFTER_HOURS_PHONE })}
            className={`rounded-full border border-border bg-surface px-6 py-3 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark ${buttonFocusRing}`}
          >
            {AFTER_HOURS_PHONE}
          </a>
        </div>
      </div>

      {/* Schedule panel — fixed teal gradient, same tokens as InfoStatCard's
          "teal" variant, so it reads identically in light and dark mode. */}
      <div className="order-1 flex shrink-0 flex-col gap-5 bg-gradient-to-br from-teal to-teal-dark p-7 text-white sm:p-8 md:order-2 md:w-[38%]">
        <span className="inline-flex w-fit items-center gap-2 font-display text-xs font-semibold uppercase tracking-wide text-white/90">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-white motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
            <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          {t("afterHoursOpenNow")}
        </span>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              {t("afterHoursWeeknightsLabel")}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-white">
              {t("afterHoursWeeknightsValue")}
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              {t("afterHoursWeekendsLabel")}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-white">
              {t("afterHoursWeekendsValue")}
            </p>
          </div>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              {t("afterHoursVirtualLabel")}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-white">
              {t("afterHoursVirtualValue")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
