"use client";

import { useCallback, useMemo, useState } from "react";
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Location } from "@/lib/types";

type LocationsMapProps = {
  locations: Location[];
};

type MappableLocation = Location & { lat: number; lng: number };

const MAP_SHELL_CLASSES = "h-72 w-full sm:h-96 lg:h-[32rem]";
const containerStyle = { width: "100%", height: "100%" };

// Centered roughly on the Greater LA area, covering all 24 clinics.
const center = { lat: 34.1, lng: -118.3 };

function isMappable(loc: Location): loc is MappableLocation {
  return loc.lat !== undefined && loc.lng !== undefined;
}

function directionsUrl(loc: MappableLocation) {
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const t = useTranslations("Locations");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });
  const mappable = useMemo(() => locations.filter(isMappable), [locations]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mappable.find((loc) => loc.id === selectedId) ?? null;

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (mappable.length === 0) return;
      const bounds = new google.maps.LatLngBounds();
      mappable.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }));
      map.fitBounds(bounds);
    },
    [mappable]
  );

  if (!apiKey || loadError) {
    return (
      <div className="bg-white p-6 sm:p-8">
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

  if (!isLoaded) {
    return (
      <div className={`${MAP_SHELL_CLASSES} flex items-center justify-center bg-white text-ink-soft`}>
        {t("loadingMap")}
      </div>
    );
  }

  return (
    <div className={MAP_SHELL_CLASSES}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9} onLoad={onMapLoad}>
        {mappable.map((loc) => (
          <MarkerF
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.name}
            onClick={() => setSelectedId(loc.id)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelectedId(null)}
          >
            <div className="min-w-[180px] text-sm">
              <p className="font-display font-semibold text-ink">{selected.name}</p>
              <p className="mt-1 text-ink-soft">{selected.address}</p>
              <p className="mt-1 text-ink-soft">{selected.phone}</p>
              <div className="mt-2 flex flex-col gap-1">
                <Link
                  href={`/locations/${selected.id}`}
                  className="font-display font-semibold text-teal-dark hover:text-teal"
                >
                  {t("viewDetails")}
                </Link>
                <a
                  href={directionsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-semibold text-teal-dark hover:text-teal"
                >
                  {t("getDirections")}
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
