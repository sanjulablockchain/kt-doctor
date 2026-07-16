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
