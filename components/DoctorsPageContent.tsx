"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { doctors } from "@/data/doctors";
import { locations } from "@/data/locations";
import { filterDoctors, getAllSpecialties } from "@/lib/filters";
import { DoctorCard } from "@/components/DoctorCard";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 12;

export function DoctorsPageContent() {
  const t = useTranslations("Doctors");
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLParagraphElement>(null);

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

  // Any filter change returns the user to the first page, so a filter can never
  // leave them stranded on a page that no longer exists.
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleLocationChange(value: string) {
    setLocationId(value);
    setPage(1);
  }

  function handleSpecialtyChange(value: string) {
    setSpecialty(value);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description", { count: doctors.length })}</p>

      <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <div className="mx-auto w-full max-w-55 shrink-0 sm:mx-0 sm:w-52 sm:max-w-none lg:w-60">
            <Image
              src="/doctors/care-team.jpg"
              alt={t("expertiseImageAlt")}
              width={236}
              height={347}
              className="h-auto w-full rounded-2xl object-cover shadow-card"
            />
          </div>

          <div className="sm:flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-tint px-3 py-1 font-display text-xs font-semibold text-teal-dark">
              <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 7.5V12l3 2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("expertiseAvailability")}
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {t("expertiseHeading")}
            </h2>
            <div className="mt-3 max-w-2xl space-y-3 text-ink-soft">
              <p>{t("expertiseBody1")}</p>
              <p>{t("expertiseBody2")}</p>
              <p>{t("expertiseBody3")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 rounded-full border border-border bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
        />

        <FilterDropdown
          ariaLabel={t("filterByLocation")}
          value={locationId}
          placeholder={t("allLocations")}
          options={locations.map((loc) => ({ value: loc.id, label: loc.name }))}
          onChange={handleLocationChange}
        />

        <FilterDropdown
          ariaLabel={t("filterBySpecialty")}
          value={specialty}
          placeholder={t("allSpecialties")}
          options={specialties.map((s) => ({ value: s, label: s }))}
          onChange={handleSpecialtyChange}
        />
      </div>

      <p
        ref={resultsRef}
        className="mt-6 scroll-mt-24 text-sm font-medium text-ink-soft"
      >
        {t("showingProviders", { filtered: filtered.length, total: doctors.length })}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            locationNames={doc.locationIds.map((id) => locationNameById.get(id) ?? id)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </main>
  );
}
