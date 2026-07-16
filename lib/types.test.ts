import { describe, it, expect } from "vitest";
import type { Doctor, Location } from "./types";

describe("Doctor type", () => {
  it("allows a doctor without healowUrl (backward compatible)", () => {
    const doc: Doctor = { id: "a", name: "A", credentials: "MD", specialties: [], locationIds: [] };
    expect(doc.healowUrl).toBeUndefined();
  });

  it("allows a doctor with healowUrl", () => {
    const doc: Doctor = {
      id: "a", name: "A", credentials: "MD", specialties: [], locationIds: [],
      healowUrl: "https://healow.com/apps/provider/a-123",
    };
    expect(doc.healowUrl).toBe("https://healow.com/apps/provider/a-123");
  });
});

describe("Location type", () => {
  it("allows a location without lat/lng (non-physical, e.g. telehealth)", () => {
    const loc: Location = {
      id: "telehealth", name: "Telehealth", address: "Video visits only — no physical address",
      phone: "", email: "", extension: "", description: "d",
      hours: { officeHours: "", telehealthHours: "" }, photos: [],
    };
    expect(loc.lat).toBeUndefined();
    expect(loc.lng).toBeUndefined();
  });
});
