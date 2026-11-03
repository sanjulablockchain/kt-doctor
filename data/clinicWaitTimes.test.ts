import { describe, it, expect } from "vitest";
import { clinicWaitLevels, WAIT_LEVELS, waitLevelFor } from "./clinicWaitTimes";
import { locations } from "./locations";

describe("clinicWaitLevels", () => {
  it("names only real clinic ids, so a renamed clinic cannot leave a stale entry", () => {
    const ids = new Set(locations.map((l) => l.id));
    for (const id of Object.keys(clinicWaitLevels)) {
      expect(ids.has(id), `${id} is not a clinic id`).toBe(true);
    }
  });

  it("covers every physical clinic, so none drops out of the finder by accident", () => {
    const physical = locations.filter((l) => typeof l.lat === "number");
    for (const clinic of physical) {
      expect(clinicWaitLevels[clinic.id], `${clinic.id} has no wait level`).toBeDefined();
    }
  });

  it("uses only the known wait levels", () => {
    for (const level of Object.values(clinicWaitLevels)) {
      expect(WAIT_LEVELS).toContain(level);
    }
  });

  it("reports unknown for a clinic with no entry rather than guessing", () => {
    expect(waitLevelFor("telehealth")).toBe("unknown");
  });
});
