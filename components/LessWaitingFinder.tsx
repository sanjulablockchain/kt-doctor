"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/constants";
import { locations } from "@/data/locations";
import { clinicWaitLevels } from "@/data/clinicWaitTimes";
import { rankClinics, type LatLng } from "@/lib/clinicFinder";
import { toE164 } from "@/lib/phone";

type LessWaitingFinderProps = {
  /** Return to the three booking options. */
  onBack: () => void;
  /** A booking link was followed; the dialog should close behind it. */
  onChoose: () => void;
};

type GeoState = "idle" | "locating" | "unavailable";

const fieldClass =
  "w-full rounded-lg border border-border bg-ivory px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal-tint";

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

// The second step of the booking dialog: every physical clinic, shortest wait
// first, each with its own Healow facility link and its own phone number. The
// wait level only sets the order; it is not shown, so a quiet clinic is simply
// the one nearer the top. A visitor can narrow by city, ZIP or clinic name, or
// share their position to break wait ties by distance. The shared Healow link
// stays one click away (in the empty state and the footer) for anyone who
// cannot find their office, so nobody is worse off than the old
// straight-to-Healow button.
export function LessWaitingFinder({ onBack, onChoose }: LessWaitingFinderProps) {
  const t = useTranslations("BookingDialog.finder");
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<LatLng | undefined>();
  const [geoState, setGeoState] = useState<GeoState>("idle");

  // Read once when the finder opens: a stable instant keeps the list from
  // re-sorting under the visitor's finger.
  const now = useMemo(() => new Date(), []);

  const ranked = useMemo(
    () => rankClinics({ clinics: locations, waitLevels: clinicWaitLevels, query, now, origin }),
    [query, now, origin]
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

  const fallbackLink = (
    <a
      href={BOOKING_URL}
      {...externalProps}
      onClick={onChoose}
      className="inline-flex items-center justify-center rounded-md bg-teal px-4 py-2 font-display text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
    >
      {t("fallbackCta")}
    </a>
  );

  return (
    <div className="flex flex-col gap-3 px-4 pb-4 pt-4 sm:px-5">
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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-ivory px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-60"
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

      {/* Only rendered while there is something to say, so it never pads the
          layout with an empty line. */}
      {geoState !== "idle" && (
        <p role="status" aria-live="polite" aria-label={t("locationStatus")} className="text-xs text-ink-soft">
          {geoState === "locating" ? t("locating") : t("locationUnavailable")}
        </p>
      )}

      {ranked.length === 0 ? (
        <div
          role="status"
          aria-labelledby="finder-no-matches"
          className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-6 text-center"
        >
          <p id="finder-no-matches" className="text-sm text-ink-soft">
            {t("noMatches")}
          </p>
          {fallbackLink}
        </div>
      ) : (
        /* Two columns from `sm` keeps the window wide rather than tall; the
           thin scrollbar is sized here because the global 10px one is too
           heavy inside a card list. */
        <ul
          aria-label={t("listLabel")}
          className="grid max-h-[38svh] gap-2 overflow-y-auto pr-1.5 [scrollbar-width:thin] sm:grid-cols-2 sm:max-h-[40svh] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-0 [&::-webkit-scrollbar-thumb]:bg-border"
        >
          {ranked.map(({ location, distanceMiles }) => (
            <li
              key={location.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-ivory p-3.5"
            >
              <div className="min-w-0">
                <h4 className="font-display text-sm font-bold text-ink">{location.name}</h4>
                <p className="text-xs text-ink-soft">{location.address}</p>
                {distanceMiles !== undefined && (
                  <p className="mt-1 text-xs font-semibold text-teal-dark">
                    {t("milesAway", { miles: Math.round(distanceMiles) })}
                  </p>
                )}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <a
                  href={`tel:${toE164(location.phone)}`}
                  aria-label={t("callAt", { name: location.name })}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 font-display text-xs font-semibold whitespace-nowrap text-ink transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal sm:text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5 shrink-0">
                    <path
                      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {location.phone}
                </a>
                <a
                  href={location.bookingUrl ?? BOOKING_URL}
                  {...externalProps}
                  onClick={onChoose}
                  aria-label={t("bookAt", { name: location.name })}
                  className="inline-flex items-center justify-center rounded-md bg-teal px-3 py-2 font-display text-xs font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 sm:text-sm"
                >
                  {t("bookHere")}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
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
        <button
          type="button"
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-border px-3.5 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal sm:self-auto"
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
