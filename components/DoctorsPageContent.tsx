"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { filterDoctors, getAllSpecialties } from "@/lib/filters";
import { DoctorCard } from "@/components/DoctorCard";
import { FilterDropdown } from "@/components/FilterDropdown";

export function DoctorsPageContent() {
  const t = useTranslations("Doctors");
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState("");
  const [specialty, setSpecialty] = useState("");

  const specialties = useMemo(() => getAllSpecialties(doctors), []);

  const filtered = useMemo(
    () =>
      filterDoctors(doctors, {
        search: search || undefined,
        locationId: locationId || undefined,
        specialty: specialty || undefined,
      }),
    [search, locationId, specialty]
  );

  const locationNameById = useMemo(
    () => new Map(locations.map((l) => [l.id, l.name])),
    []
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description", { count: doctors.length })}</p>

      <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-border bg-white p-4 shadow-card sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-border bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
        />

        <FilterDropdown
          ariaLabel={t("filterByLocation")}
          value={locationId}
          placeholder={t("allLocations")}
          options={locations.map((loc) => ({ value: loc.id, label: loc.name }))}
          onChange={setLocationId}
        />

        <FilterDropdown
          ariaLabel={t("filterBySpecialty")}
          value={specialty}
          placeholder={t("allSpecialties")}
          options={specialties.map((s) => ({ value: s, label: s }))}
          onChange={setSpecialty}
        />
      </div>

      <p className="mt-6 text-sm font-medium text-ink-soft">
        {t("showingProviders", { filtered: filtered.length, total: doctors.length })}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            locationNames={doc.locationIds.map((id) => locationNameById.get(id) ?? id)}
          />
        ))}
      </div>
    </main>
  );
}
