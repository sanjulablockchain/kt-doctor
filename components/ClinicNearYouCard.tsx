"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// The map panel plots the network's REAL geography: every clinic that carries a
// lat/lng (telehealth intentionally has none — see data/locations.ts) becomes a
// pin, projected from its true coordinates into the panel's 0–100 space. Both
// axes are normalized independently to a padded box so the constellation fills
// the panel regardless of its aspect ratio. Computed once at module scope so the
// server and client render identical markup (no hydration drift).
const PAD = 12; // keep pins inside 12%–88% of the panel
const geoLocations = locations.filter(
  (l): l is typeof l & { lat: number; lng: number } =>
    typeof l.lat === "number" && typeof l.lng === "number"
);

const lats = geoLocations.map((l) => l.lat);
const lngs = geoLocations.map((l) => l.lng);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);
const spanLat = maxLat - minLat || 1;
const spanLng = maxLng - minLng || 1;
const centerLat = (minLat + maxLat) / 2;
const centerLng = (minLng + maxLng) / 2;

const PINS = geoLocations.map((l) => {
  const nx = (l.lng - minLng) / spanLng; // west → east
  const ny = (maxLat - l.lat) / spanLat; // north (top) → south
  return {
    id: l.id,
    x: Number((PAD + nx * (100 - PAD * 2)).toFixed(2)),
    y: Number((PAD + ny * (100 - PAD * 2)).toFixed(2)),
    dist: Math.hypot(l.lng - centerLng, l.lat - centerLat),
  };
});

// The clinic closest to the region's center anchors the "network" lines and
// carries the pulsing "care near you" marker.
const PRIMARY = PINS.reduce((a, b) => (b.dist < a.dist ? b : a), PINS[0]);

export function ClinicNearYouCard() {
  const t = useTranslations("Home");
  const reducedMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Scroll parallax: drift the grid and the pin field at slightly different
  // rates as the card crosses the viewport, for a shallow sense of depth. The
  // grid layer is oversized (-inset) so its shift never exposes a bare edge.
  useEffect(() => {
    if (reducedMotion) return;
    const grid = gridRef.current;
    const field = fieldRef.current;
    if (!grid || !field) return;

    let frameId: number | null = null;

    function update() {
      frameId = null;
      if (!grid || !field) return;
      const panel = field.parentElement;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const fromCenter = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
      grid.style.transform = `translate3d(0, ${clamp(fromCenter * 0.05, 16)}px, 0)`;
      field.style.transform = `translate3d(0, ${clamp(fromCenter * 0.12, 22)}px, 0)`;
    }

    function onScroll() {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [reducedMotion]);

  return (
    <Link
      href="/locations"
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:flex-row"
    >
      {/* Content — below the map on mobile, left of it on desktop. */}
      <div className="order-2 flex flex-1 flex-col justify-center p-7 sm:p-10 md:order-1">
        <span className="inline-flex w-fit items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-dark">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-teal-dark motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
            <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-teal-dark" />
          </span>
          {t("clinicNearYouEyebrow")}
        </span>

        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t("clinicNearYouHeading")}
        </h3>

        <p className="mt-2 max-w-md text-ink-soft">
          {t("clinicNearYouBody", { count: locations.length })}
        </p>

        <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-colors group-hover:bg-teal-dark">
          {t("viewLocations")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Signature: the live network map. */}
      <div className="relative order-1 h-44 overflow-hidden bg-gradient-to-br from-teal to-teal-dark md:order-2 md:h-auto md:w-[42%] md:min-h-[15rem]">
        {/* Faint coordinate grid (parallax, slow). */}
        <div
          ref={gridRef}
          aria-hidden
          className="pointer-events-none absolute -inset-6 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Soft depth glows. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-6 h-32 w-32 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 right-4 h-36 w-36 rounded-full bg-white/10 blur-2xl"
        />

        {/* Pin field (parallax, faster) with a hover zoom on the inner layer. */}
        <div ref={fieldRef} aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
            {/* Network lines radiating from the central clinic. */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {PINS.filter((p) => p.id !== PRIMARY.id).map((p) => (
                <line
                  key={p.id}
                  x1={PRIMARY.x}
                  y1={PRIMARY.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="0.4"
                />
              ))}
            </svg>

            {/* Secondary clinics — every one equal weight, a plain dot. */}
            {PINS.filter((p) => p.id !== PRIMARY.id).map((p) => (
              <span
                key={p.id}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              />
            ))}

            {/* Primary clinic — the pulsing "care near you" marker. */}
            <span
              className="absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${PRIMARY.x}%`, top: `${PRIMARY.y}%` }}
            >
              <span className="absolute inset-0 rounded-full bg-white/50 motion-reduce:hidden animate-[ktmg-ping_2.4s_ease-out_infinite]" />
              <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.25)]">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-dark" />
              </span>
            </span>
          </div>
        </div>

        {/* Count chip — the network's scale, in the map's own context. */}
        <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-display text-xs font-semibold text-teal-dark shadow-sm backdrop-blur">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path
              d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.25" stroke="currentColor" strokeWidth="2" />
          </svg>
          {t("clinicNearYouMapChip", { count: locations.length })}
        </span>
      </div>
    </Link>
  );
}
