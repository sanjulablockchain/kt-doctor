export type LocationHours = {
  officeHours: string;
  telehealthHours: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  extension: string;
  lat?: number;
  lng?: number;
  description: string;
  hours: LocationHours;
  photos: string[];
  // Per-facility Healow booking deep link (the `f=` code), harvested from the
  // live location page's "Book Appointment Now" button. Absent for the
  // telehealth pseudo-location, which has no physical facility page.
  bookingUrl?: string;
};

export type Doctor = {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  locationIds: string[];
  bio?: string;
  photoSrc?: string;
  healowUrl?: string;
};
