"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/constants";
import { locations } from "@/data/locations";
import { clinicWaitLevels, WAIT_LEVELS_UPDATED, type WaitLevel } from "@/data/clinicWaitTimes";
import { rankClinics, type LatLng } from "@/lib/clinicFinder";

type LessWaitingFinderProps = {
  /** Return to the three booking options. */
  onBack: () => void;
  /** A booking link was followed; the dialog should close behind it. */
  onChoose: () => void;
};

type GeoState = "idle" | "locating" | "unavailable";

const WAIT_LABEL_KEY: Record<WaitLevel, "waitShort" | "waitModerate" | "waitLong" | "waitUnknown"> = {
  short: "waitShort",
  moderate: "waitModerate",
  long: "waitLong",
  unknown: "waitUnknown",
};

// Badge colours stay on theme tokens so they hold up in dark mode. Short
// waits get the teal we steer toward everywhere else; the rest stay quiet.
const WAIT_BADGE_CLASS: Record<WaitLevel, string> = {
  short: "border-teal/40 bg-teal-tint text-teal-dark",
  moderate: "border-gold/50 bg-gold-tint text-ink",
  long: "border-border bg-ivory-deep text-ink-soft",
  unknown: "border-border bg-ivory-deep text-ink-soft",
};

const fieldClass =
  "w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint";

// The second step of the booking dialog: every physical clinic, shortest wait
// first, each with its own Healow facility link. A visitor can narrow by city,
// ZIP or clinic name, or share their position to break wait ties by distance.
// The shared Healow link stays at the bottom for anyone who cannot find their
// office, so nobody is worse off than the old straight-to-Healow button.
export function LessWaitingFinder({ onBack, onChoose }: LessWaitingFinderProps) {
  const t = useTranslations("BookingDialog.finder");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<LatLng | undefined>();
  const [geoState, setGeoState] = useState<GeoState>("idle");

  // Read once when the finder opens: a dialog is not open long enough for
  // "open now" to flip, and a stable instant keeps the list from re-sorting.
  const now = useMemo(() => new Date(), []);

  const ranked = useMemo(
    () => rankClinics({ clinics: locations, waitLevels: clinicWaitLevels, query, now, origin }),
    [query, now, origin]
  );

  const updatedLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(
        new Date(WAIT_LEVELS_UPDATED)
      ),
    [locale]
  );

  function locate() {
    const geolocation = typeof navigator !== "undefined" ? navigator.geolocation : undefined;
    if (!geolocation) {
      setGeoState("unavailable");
      return;
    }
    setGeoState("locating");
    geolocation.getCurrentPosition(
      (position) => {
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGeoState("idle");
      },
      () => setGeoState("unavailable"),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }

  const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-5 pt-4 sm:px-5">
      <div className="flex items-center gap-2.5">
        <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-soft">
          {t("eyebrow")}
        </span>
        <span aria-hidden className="h-px flex-1 border-t border-dotted border-border" />
      </div>

      <div>
        <h3 className="font-display text-base font-bold text-ink sm:text-lg">{t("heading")}</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-soft">{t("body", { count: locations.length })}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
            className={fieldClass}
          />
        </label>
        <button
          type="button"
          onClick={locate}
          disabled={geoState === "locating"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-ivory px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2v3M12 19v3M2 12h3M19 12h3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {t("useMyLocation")}
        </button>
      </div>

      <p role="status" aria-live="polite" className="min-h-[1rem] text-xs text-ink-soft">
        {geoState === "locating" && t("locating")}
        {geoState === "unavailable" && t("locationUnavailable")}
      </p>

      {ranked.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-ink-soft">
          {t("noMatches")}
        </p>
      ) : (
        <ul
          aria-label={t("listLabel")}
          className="flex max-h-[42svh] flex-col gap-2 overflow-y-auto pr-1 sm:max-h-[44svh]"
        >
          {ranked.map(({ location, waitLevel, openNow, distanceMiles }) => (
            <li
              key={location.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-ivory p-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">{location.name}</p>
                <p className="truncate text-xs text-ink-soft">{location.address}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 font-display text-[0.65rem] font-bold uppercase tracking-[0.06em] ${WAIT_BADGE_CLASS[waitLevel]}`}
                  >
                    {t(WAIT_LABEL_KEY[waitLevel])}
                  </span>
                  {openNow !== null && (
                    <span
                      className={`text-xs font-semibold ${
                        openNow ? "text-teal-dark" : "text-ink-soft"
                      }`}
                    >
                      {openNow ? t("openNow") : t("closedNow")}
                    </span>
                  )}
                  {distanceMiles !== undefined && (
                    <span className="text-xs text-ink-soft">
                      {t("milesAway", { miles: Math.round(distanceMiles) })}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={location.bookingUrl ?? BOOKING_URL}
                {...externalProps}
                onClick={onChoose}
                aria-label={t("bookAt", { name: location.name })}
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal px-4 py-2 font-display text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                {t("bookHere")}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[0.8125rem] text-ink-soft">
            {t("fallbackLead")}{" "}
            <a
              href={BOOKING_URL}
              {...externalProps}
              onClick={onChoose}
              className="font-semibold text-teal-dark underline decoration-teal/40 underline-offset-2 transition-colors hover:text-teal"
            >
              {t("fallbackCta")}
            </a>
          </span>
          <span className="text-[0.7rem] text-ink-soft/80">{t("updated", { date: updatedLabel })}</span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-border px-3.5 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal sm:self-auto"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("back")}
        </button>
      </div>
    </div>
  );
}
