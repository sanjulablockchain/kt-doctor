/**
 * Turn-by-turn directions deep links.
 *
 * A destination is either a street address (preferred, and what the clinic
 * tiles use) or a lat/lng pair. Coordinates are passed through unencoded so the
 * comma stays a comma, which is what both providers expect.
 *
 * `maps.apple.com` opens the native Maps app on iOS, iPadOS, and macOS, and
 * falls back to Apple's web Maps in other browsers, so one URL covers everyone.
 */
export type DirectionsDestination = string | { lat: number; lng: number };

function serializeDestination(destination: DirectionsDestination): string {
  if (typeof destination === "string") return encodeURIComponent(destination);
  return `${destination.lat},${destination.lng}`;
}

export function googleDirectionsUrl(destination: DirectionsDestination): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${serializeDestination(
    destination
  )}`;
}

export function appleDirectionsUrl(destination: DirectionsDestination): string {
  // dirflg=d asks for driving directions, matching Google's default mode.
  return `https://maps.apple.com/?daddr=${serializeDestination(destination)}&dirflg=d`;
}
