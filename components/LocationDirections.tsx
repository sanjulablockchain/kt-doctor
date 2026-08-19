"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { appleDirectionsUrl, googleDirectionsUrl } from "@/lib/directions";
import type { Location } from "@/lib/types";

type LocationDirectionsProps = {
  locations: Location[];
};

// Route to the street address rather than the pin's lat/lng: the coordinates in
// data/locations.ts are only city-level approximations, but the address lands
// people at the actual clinic.

const providerLinkClass =
  "flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-teal hover:bg-teal-tint hover:text-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";

export function LocationDirections({ locations }: LocationDirectionsProps) {
  const t = useTranslations("Locations");
  const [query, setQuery] = useState("");

  // Only physical clinics have an address to route to; telehealth is excluded.
  const clinics = useMemo(
    () => locations.filter((loc) => loc.lat !== undefined && loc.lng !== undefined),
    [locations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clinics;
    return clinics.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q)
    );
  }, [clinics, query]);

  return (
    <section aria-label={t("directionsHeading")}>
      <h2 className="font-display text-xl font-bold text-ink">{t("directionsHeading")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("directionsSubheading")}</p>

      <div className="mt-4 flex items-center gap-2.5 rounded-full border border-border bg-ivory px-4 py-2.5 shadow-card transition-colors focus-within:border-teal">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 shrink-0 text-ink-soft"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchLocations")}
          aria-label={t("searchAria")}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
        />
      </div>

      <p className="mt-4 text-sm font-medium text-ink-soft">
        {t("clinicsCount", { filtered: filtered.length, total: clinics.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-border bg-surface px-4 py-8 text-center text-sm text-ink-soft">
          {t("noClinics")}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((location) => (
            <li key={location.id}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-semibold text-ink">
                      {location.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-soft">
                      {location.address}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M3 11 22 2 13 21 11 13 3 11Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  <a
                    href={googleDirectionsUrl(location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("directionsToGoogle", { name: location.name })}
                    className={providerLinkClass}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path
                        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    {t("googleMaps")}
                  </a>
                  <a
                    href={appleDirectionsUrl(location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("directionsToApple", { name: location.name })}
                    className={providerLinkClass}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("appleMaps")}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
