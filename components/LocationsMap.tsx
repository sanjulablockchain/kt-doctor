"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Location } from "@/lib/types";

type LocationsMapProps = {
  locations: Location[];
};

const containerStyle = { width: "100%", height: "24rem" };

// Centered roughly on the Greater LA area, covering all 24 clinics.
const center = { lat: 34.1, lng: -118.3 };

export function LocationsMap({ locations }: LocationsMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
      {locations
        .filter((loc): loc is typeof loc & { lat: number; lng: number } => loc.lat !== undefined && loc.lng !== undefined)
        .map((loc) => (
          <MarkerF key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name} />
        ))}
    </GoogleMap>
  );
}
