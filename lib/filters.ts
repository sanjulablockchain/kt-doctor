import type { Doctor } from "./types";

export type DoctorFilters = {
  locationId?: string;
  specialty?: string;
  search?: string;
};

export function filterDoctors(doctors: Doctor[], filters: DoctorFilters): Doctor[] {
  return doctors.filter((doc) => {
    if (filters.locationId && !doc.locationIds.includes(filters.locationId)) {
      return false;
    }
    if (filters.specialty && !doc.specialties.includes(filters.specialty)) {
      return false;
    }
    if (filters.search) {
      const needle = filters.search.toLowerCase();
      if (!doc.name.toLowerCase().includes(needle)) {
        return false;
      }
    }
    return true;
  });
}

export function getAllSpecialties(doctors: Doctor[]): string[] {
  const set = new Set<string>();
  for (const doc of doctors) {
    for (const s of doc.specialties) set.add(s);
  }
  return Array.from(set).sort();
}
