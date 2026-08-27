"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appleDirectionsUrl, googleDirectionsUrl } from "@/lib/directions";
import type { MappableLocation } from "@/lib/types";

type LocationsMapLeafletProps = {
  locations: MappableLocation[];
};

/* OpenStreetMap's own tile server: keyless and free. (We used CARTO's
   basemaps before; CARTO now stamps "API KEY REQUIRED" across every tile it
   serves to an anonymous request.) OSM publishes no dark basemap, so dark
   mode reuses these same tiles and inverts them in CSS rather than swapping
   the URL - see --map-tile-filter in app/globals.css, which hangs off the
   same [data-theme] / prefers-color-scheme signals as every other themed
   token, so the map needs no theme code of its own. */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// OSM's standard style serves tiles down to z19; Leaflet's own default caps at 18.
const TILE_MAX_ZOOM = 19;

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

const popupLinkClass = "text-xs font-semibold text-teal-dark hover:text-teal";

export function LocationsMapLeaflet({ locations }: LocationsMapLeafletProps) {
  const t = useTranslations("Locations");
  const bounds = locations.map((loc): [number, number] => [loc.lat, loc.lng]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
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
            <p className="mt-2 text-xs text-ink-soft">
              <span className="font-semibold text-ink">{t("officeHoursLabel")}:</span>{" "}
              {location.hours.officeHours}
            </p>
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-xs font-semibold text-ink">{t("getDirections")}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <a
                  href={googleDirectionsUrl({ lat: location.lat, lng: location.lng })}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("directionsToGoogle", { name: location.name })}
                  className={popupLinkClass}
                >
                  {t("googleMaps")}
                </a>
                <span aria-hidden className="text-xs text-ink-soft">
                  ·
                </span>
                <a
                  href={appleDirectionsUrl({ lat: location.lat, lng: location.lng })}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("directionsToApple", { name: location.name })}
                  className={popupLinkClass}
                >
                  {t("appleMaps")}
                </a>
              </div>
              <Link href={`/locations/${location.id}`} className={`mt-1 ${popupLinkClass}`}>
                {t("viewDetails")}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
