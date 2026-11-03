// Typical waiting-room load per clinic, keyed by the location id in
// data/locations.ts. This is what the "offices with less waiting" step of the
// booking dialog sorts by.
//
// There is no live feed from eClinicalWorks/Healow for this, so the office
// team maintains it by hand: edit the level, update WAIT_LEVELS_UPDATED, and
// redeploy. Keep every physical clinic listed (the test enforces it) so none
// silently falls to "unknown" and sinks to the bottom of the list.
//
// PLACEHOLDER VALUES (2026-11-03): the levels below were set to exercise the
// finder in review and have NOT been confirmed with the clinics. Replace them
// with the real picture from the front desks before this ships.

export const WAIT_LEVELS = ["short", "moderate", "long", "unknown"] as const;
export type WaitLevel = (typeof WAIT_LEVELS)[number];

/** ISO date of the last manual review, shown to visitors as "Updated ...". */
export const WAIT_LEVELS_UPDATED = "2026-11-03";

export const clinicWaitLevels: Record<string, Exclude<WaitLevel, "unknown">> = {
  "agoura-hills": "short",
  arcadia: "moderate",
  "beverly-hills": "moderate",
  camarillo: "short",
  "canyon-country": "short",
  "culver-city": "moderate",
  downey: "long",
  glendale: "long",
  hollywood: "moderate",
  "la-canada": "short",
  "la-mirada": "short",
  "mission-hills": "long",
  northridge: "moderate",
  pasadena: "long",
  "pico-rivera": "moderate",
  "san-fernando": "long",
  "san-pedro": "short",
  "santa-monica": "short",
  tarzana: "moderate",
  torrance: "moderate",
  valencia: "short",
  "van-nuys": "long",
  "west-hills": "short",
  whittier: "moderate",
};

export function waitLevelFor(locationId: string): WaitLevel {
  return clinicWaitLevels[locationId] ?? "unknown";
}
