"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/LocationCard";
import { LocationsMap } from "@/components/LocationsMap";

type View = "list" | "map";

export function LocationsPageContent() {
  const t = useTranslations("Locations");
  const [view, setView] = useState<View>("list");

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrowCount", { count: locations.length })}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-card">
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
              view === "list" ? "bg-teal text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t("list")}
          </button>
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={`rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors ${
              view === "map" ? "bg-teal text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t("map")}
          </button>
        </div>

        <p className="text-sm font-medium text-ink-soft">
          {t("showingLocations", { count: locations.length })}
        </p>
      </div>

      {view === "list" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-card">
          <LocationsMap locations={locations} />
        </div>
      )}
    </main>
  );
}
