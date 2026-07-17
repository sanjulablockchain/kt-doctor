"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
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
  const mappable = locations.filter(isMappable);

  if (!apiKey || loadError) {
    return (
      <div className={`${MAP_SHELL_CLASSES} overflow-y-auto bg-white p-6`}>
        <p className="text-sm text-ink-soft">{t("mapUnavailable")}</p>
        <ul className="mt-4 space-y-4">
          {mappable.map((loc) => (
            <li key={loc.id} className="text-sm">
              <p className="font-display font-semibold text-ink">{loc.name}</p>
              <p className="text-ink-soft">{loc.address}</p>
              <a
                href={directionsUrl(loc)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-semibold text-teal-dark hover:text-teal"
              >
                {t("getDirections")}
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
        Loading map...
      </div>
    );
  }

  return (
    <div className={MAP_SHELL_CLASSES}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {mappable.map((loc) => (
          <MarkerF key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
        ))}
      </GoogleMap>
    </div>
  );
}
