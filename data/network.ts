export type NetworkBrand = {
  id: string;
  name: string;
  tagline: string;
  taglineEs: string;
  description: string;
  descriptionEs: string;
  services: string[];
  servicesEs: string[];
  logoSrc: string;
  /* Optional dark-mode logo. Only needed for logos whose ink is near-black and
     would vanish on the dark card surface (the KTMG crest); colored logos read
     fine on both surfaces and omit this. */
  logoDarkSrc?: string;
  externalUrl?: string;
  internalHref?: string;
};

export const networkBrands: NetworkBrand[] = [
  {
    id: "ktmg",
    name: "Kids & Teens Medical Group",
    tagline: "The flagship pediatric network.",
    taglineEs: "La red pediátrica insignia.",
    description:
      "Board-certified pediatric care across 24 clinics in Greater LA, for ages 0 to 21.",
    descriptionEs:
      "Atención pediátrica certificada en 24 clínicas del área de Los Ángeles, para edades de 0 a 21 años.",
    services: ["Primary Care", "Urgent Care", "Telehealth", "Newborn Care"],
    servicesEs: ["Atención Primaria", "Atención de Urgencia", "Telesalud", "Cuidado del Recién Nacido"],
    logoSrc: "/clinic-logo.svg",
    logoDarkSrc: "/clinic-logo-dark.svg",
    internalHref: "/doctors",
  },
  {
    id: "st-gianna",
    name: "St. Gianna Medical Group",
    tagline: "Family practice for all ages.",
    taglineEs: "Medicina familiar para todas las edades.",
    description:
      "Comprehensive healthcare for adults and children, with same-day appointments and 24/7 booking. Partners with KTMG to extend care beyond pediatrics.",
    descriptionEs:
      "Atención médica integral para adultos y niños, con citas el mismo día y reservas las 24 horas. Trabaja junto a KTMG para extender la atención más allá de la pediatría.",
    services: ["Same-Day Appointments", "24/7 Booking", "Telehealth", "Advanced Wound Care"],
    servicesEs: ["Citas el Mismo Día", "Reservas 24/7", "Telesalud", "Cuidado Avanzado de Heridas"],
    logoSrc: "/sgm-logo.png",
    externalUrl: "https://www.sgmdoctor.com",
  },
  {
    id: "laipt",
    name: "LA Intensive Pediatric Therapy",
    tagline: "Expert pediatric therapy since 2010.",
    taglineEs: "Terapia pediátrica experta desde 2010.",
    description:
      "Individual and center-based speech, occupational, and developmental therapy for children.",
    descriptionEs:
      "Terapia individual y en centro de habla, ocupacional y de desarrollo para niños.",
    services: ["Speech Therapy", "Occupational Therapy", "Sensory Integration"],
    servicesEs: ["Terapia del Habla", "Terapia Ocupacional", "Integración Sensorial"],
    logoSrc: "/laipt-logo.png",
    externalUrl: "https://www.laipt.org",
  },
  {
    id: "st-joseph-hospital",
    name: "St. Joseph Hospital Negombo",
    tagline: "US-standard care in Negombo, Sri Lanka.",
    taglineEs: "Atención con estándares de EE. UU. en Negombo, Sri Lanka.",
    description:
      "Operated by Kids & Teens Medical Group, USA, bringing American healthcare standards to affordable, accessible care.",
    descriptionEs:
      "Operado por Kids & Teens Medical Group, EE. UU., con estándares de salud estadounidenses para una atención accesible y asequible.",
    services: [
      "Emergency & Outpatient Care",
      "Inpatient Care",
      "Telemedicine",
      "Pharmacy & Diagnostics",
    ],
    servicesEs: [
      "Emergencias y Consulta Externa",
      "Atención Hospitalaria",
      "Telemedicina",
      "Farmacia y Diagnóstico",
    ],
    logoSrc: "/sjh-logo.png",
    externalUrl: "https://www.sjhospital.lk",
  },
];
