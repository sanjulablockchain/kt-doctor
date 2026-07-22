"use client";

import { useTranslations } from "next-intl";
import { Location } from "@/lib/types";

type LocationsMapProps = {
  locations: Location[];
};

type MappableLocation = Location & { lat: number; lng: number };

const MAP_SHELL_CLASSES = "h-72 w-full sm:h-96 lg:h-[32rem]";

// Free, keyless Google Maps embed — no API key, no billing. The default is a
// curated Google "My Maps" showing every clinic (source data:
// docs/locations-mymaps-import.csv; setup steps: docs/mymaps-setup.md). Override
// with NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to point at a different map, or set that
// to an empty string to show the address-list fallback instead.
const DEFAULT_EMBED_URL =
  "https://www.google.com/maps/d/embed?mid=1YYdtWQyub1yRh-FGsTWNQEIYDvHQHvI&ehbc=2E312F";
const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? DEFAULT_EMBED_URL;

// Google My Maps (/maps/d/embed) renders a title/toolbar bar at the top of the
// iframe that has no option to disable. We can't hide it directly (it's served
// cross-origin from google.com), so we clip it: grow the iframe by the bar's
// height and shift it up under an overflow-hidden container. The bottom "Google
// My Maps" attribution stays visible. Only applied to My Maps embeds — a plain
// search embed (output=embed) has no such bar.
const isMyMapsEmbed = mapEmbedUrl.includes("/maps/d/");
const MYMAPS_HEADER_CROP_PX = 72;

function isMappable(loc: Location): loc is MappableLocation {
  return loc.lat !== undefined && loc.lng !== undefined;
}

function directionsUrl(loc: MappableLocation) {
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const t = useTranslations("Locations");
  const mappable = locations.filter(isMappable);

  if (!mapEmbedUrl) {
    return (
      <div className="bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-3 rounded-2xl bg-teal-tint px-4 py-3">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 h-5 w-5 shrink-0 text-teal-dark"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 11v5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
          <p className="text-sm text-ink-soft">{t("mapUnavailable")}</p>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {mappable.map((loc) => (
            <li key={loc.id}>
              <p className="font-display text-base font-semibold text-ink">{loc.name}</p>
              <p className="mt-1 text-sm text-ink-soft">{loc.address}</p>
              <a
                href={directionsUrl(loc)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-display text-sm font-semibold text-teal-dark transition-colors hover:text-teal"
              >
                {t("getDirections")}
                <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`${MAP_SHELL_CLASSES} overflow-hidden`}>
      <iframe
        src={mapEmbedUrl}
        loading="lazy"
        title={t("mapTitle")}
        referrerPolicy="no-referrer-when-downgrade"
        style={
          isMyMapsEmbed
            ? {
                width: "100%",
                height: `calc(100% + ${MYMAPS_HEADER_CROP_PX}px)`,
                marginTop: `-${MYMAPS_HEADER_CROP_PX}px`,
                border: 0,
                display: "block",
              }
            : { width: "100%", height: "100%", border: 0, display: "block" }
        }
      />
    </div>
  );
}
