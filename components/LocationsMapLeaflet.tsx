"use client";

import { useSyncExternalStore } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/components/ThemeProvider";
import type { MappableLocation } from "@/lib/types";

type LocationsMapLeafletProps = {
  locations: MappableLocation[];
};

const TILE_LAYERS = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const;

const PIN_ICON_HTML = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a7 7 0 0 0-7 7c0 5.5 7 12 7 12s7-6.5 7-12a7 7 0 0 0-7-7Z" style="fill:var(--color-teal);stroke:var(--color-teal-dark)" stroke-width="1.2"/>
  <circle cx="12" cy="9" r="2.5" style="fill:var(--color-surface)"/>
</svg>`;

const clinicIcon = L.divIcon({
  html: PIN_ICON_HTML,
  className: "ktmg-map-pin",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

function subscribeToColorScheme(onStoreChange: () => void): () => void {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSystemPrefersDark(): boolean {
  return false;
}

function useResolvedTheme(): "light" | "dark" {
  const { preference } = useTheme();
  const systemPrefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    getSystemPrefersDark,
    getServerSystemPrefersDark
  );
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

function directionsUrl(location: MappableLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
}

export function LocationsMapLeaflet({ locations }: LocationsMapLeafletProps) {
  const t = useTranslations("Locations");
  const theme = useResolvedTheme();
  const tileLayer = TILE_LAYERS[theme];
  const bounds = locations.map((loc): [number, number] => [loc.lat, loc.lng]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={clinicIcon}
          title={location.name}
          eventHandlers={{
            add: (e) => {
              e.target.getElement()?.setAttribute("aria-label", location.name);
            },
          }}
        >
          <Popup className="ktmg-map-popup">
            <p className="font-display text-sm font-semibold text-ink">{location.name}</p>
            <p className="mt-1 text-xs text-ink-soft">{location.address}</p>
            <div className="mt-2 flex flex-col gap-1">
              <a
                href={directionsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-teal-dark hover:text-teal"
              >
                {t("getDirections")}
              </a>
              <Link
                href={`/locations/${location.id}`}
                className="text-xs font-semibold text-teal-dark hover:text-teal"
              >
                {t("viewDetails")}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
