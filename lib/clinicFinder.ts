import type { Location } from "./types";
import type { WaitLevel } from "@/data/clinicWaitTimes";
import { isOpenAt } from "./clinicHours";

export type LatLng = { lat: number; lng: number };

export type RankedClinic = {
  location: Location;
  waitLevel: WaitLevel;
  /** null when the clinic's hours could not be read. */
  openNow: boolean | null;
  /** Present only when the visitor's position is known. */
  distanceMiles?: number;
};

const WAIT_ORDER: Record<WaitLevel, number> = { short: 0, moderate: 1, long: 2, unknown: 3 };

const EARTH_RADIUS_MILES = 3958.8;

export function distanceMiles(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Case- and accent-insensitive match on the clinic name or address (so a ZIP works). */
export function matchesQuery(location: Location, query: string): boolean {
  const needle = fold(query.trim());
  if (needle === "") return true;
  return fold(`${location.name} ${location.address}`).includes(needle);
}

type RankInput = {
  clinics: Location[];
  waitLevels: Record<string, WaitLevel>;
  query: string;
  now: Date;
  origin?: LatLng;
};

function hasCoordinates(location: Location): location is Location & LatLng {
  return typeof location.lat === "number" && typeof location.lng === "number";
}

/**
 * The clinics a visitor could walk into, filtered by their search and ordered
 * shortest wait first. Ties go to the nearest clinic when we know where the
 * visitor is, otherwise to the alphabet so the order is stable.
 */
export function rankClinics({ clinics, waitLevels, query, now, origin }: RankInput): RankedClinic[] {
  return clinics
    .filter(hasCoordinates)
    .filter((location) => matchesQuery(location, query))
    .map<RankedClinic>((location) => ({
      location,
      waitLevel: waitLevels[location.id] ?? "unknown",
      openNow: isOpenAt(location.hours.officeHours, now),
      ...(origin ? { distanceMiles: distanceMiles(origin, location) } : {}),
    }))
    .sort((a, b) => {
      const byWait = WAIT_ORDER[a.waitLevel] - WAIT_ORDER[b.waitLevel];
      if (byWait !== 0) return byWait;
      if (a.distanceMiles !== undefined && b.distanceMiles !== undefined) {
        const byDistance = a.distanceMiles - b.distanceMiles;
        if (byDistance !== 0) return byDistance;
      }
      return a.location.name.localeCompare(b.location.name);
    });
}
