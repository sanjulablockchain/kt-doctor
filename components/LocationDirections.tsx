"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Location } from "@/lib/types";

type LocationDirectionsProps = {
  locations: Location[];
};

// Route to the street address rather than the pin's lat/lng — the coordinates in
// data/locations.ts are only city-level approximations, but the address lands
// people at the actual clinic.
function directionsUrl(location: Location): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    location.address
  )}`;
}

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
              <a
                href={directionsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("getDirectionsTo", { name: location.name })}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-semibold text-ink transition-colors group-hover:text-teal-dark">
                    {location.name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-ink-soft">
                    {location.address}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark transition-colors group-hover:bg-teal group-hover:text-white"
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
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
