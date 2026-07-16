export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  services: string[];
  logoSrc: string;
  externalUrl?: string;
  internalHref?: string;
  partnerCredit?: { label: string; url: string };
};

export const networkBrands: NetworkBrand[] = [
  {
    id: "ktmg",
    name: "Kids & Teens Medical Group",
    tagline: "The flagship pediatric network.",
    description:
      "Board-certified pediatric care across 24 clinics in Greater LA, for ages 0 to 21.",
    services: ["Primary Care", "Urgent Care", "Telehealth", "Newborn Care"],
    logoSrc: "/clinic-logo.svg",
    internalHref: "/doctors",
  },
  {
    id: "st-gianna",
    name: "St. Gianna Medical Group",
    tagline: "Family practice for all ages.",
    description:
      "Comprehensive healthcare for adults and children, with same-day appointments and 24/7 booking. Partners with KTMG to extend care beyond pediatrics.",
    services: [
      "Same-Day Appointments",
      "24/7 Booking",
      "Telehealth",
      "Advanced Wound Care",
    ],
    logoSrc: "/sgm-logo.png",
    externalUrl: "https://www.sgmdoctor.com",
  },
  {
    id: "laipt",
    name: "LA Intensive Pediatric Therapy",
    tagline: "Expert pediatric therapy since 2010.",
    description:
      "Individual and center-based speech, occupational, and developmental therapy for children.",
    services: ["Speech Therapy", "Occupational Therapy", "Sensory Integration"],
    logoSrc: "/laipt-logo.png",
    externalUrl: "https://www.laipt.org",
  },
  {
    id: "st-joseph-hospital",
    name: "St. Joseph Hospital Negombo",
    tagline: "US-standard care in Negombo, Sri Lanka.",
    description:
      "A hospital in Negombo, Sri Lanka, managed and operated by Kids & Teens Pediatric Medical Group, USA, bringing American healthcare standards to affordable, accessible care.",
    services: [
      "Emergency & Outpatient Care",
      "Inpatient Care",
      "Telemedicine",
      "Pharmacy & Diagnostics",
    ],
    logoSrc: "/sjh-logo.png",
    externalUrl: "https://www.sjhospital.lk",
    partnerCredit: {
      label: "Insurance coordination via Asiacorp Insurance Brokers",
      url: "https://acig.lk",
    },
  },
];
