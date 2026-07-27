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
      "Board-certified pediatric care across 25 clinics in Greater LA, for ages 0 to 21.",
    descriptionEs:
      "Atención pediátrica certificada en 25 clínicas del área de Los Ángeles, para edades de 0 a 21 años.",
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
  {
    id: "serendib-healthways",
    name: "Serendib Healthways",
    tagline: "Pediatric health plans across Greater LA.",
    taglineEs: "Planes de salud pediátrica en toda el área de Los Ángeles.",
    description:
      "A pediatric HMO/IPA network with 20+ clinic locations and 50+ board-certified doctors, offering affordable children's health coverage across Los Angeles County.",
    descriptionEs:
      "Una red pediátrica HMO/IPA con más de 20 clínicas y más de 50 médicos certificados, que ofrece cobertura de salud infantil asequible en todo el condado de Los Ángeles.",
    services: ["Pediatric HMO/IPA", "Same-Day Appointments", "Telehealth", "After-Hours Urgent Care"],
    servicesEs: ["HMO/IPA Pediátrico", "Citas el Mismo Día", "Telesalud", "Atención de Urgencia Fuera de Horario"],
    logoSrc: "/serendib-healthways-logo.svg",
    externalUrl: "https://www.serendibhealthways.com/",
  },
  {
    id: "pediatric-after-hour",
    name: "After-Hours Pediatric Urgent Care",
    tagline: "Out of hours? We're here for yours.",
    taglineEs: "¿Fuera de horario? Aquí estamos para ustedes.",
    description:
      "24/7 pediatric urgent care across more than 20 California clinics, for ages 0 to 21, accepted by all major insurance plans.",
    descriptionEs:
      "Atención de urgencia pediátrica las 24 horas en más de 20 clínicas de California, para edades de 0 a 21 años, aceptando todos los seguros principales.",
    services: ["24/7 Urgent Care", "Same-Day Appointments", "Ages 0 to 21", "All Insurance Accepted"],
    servicesEs: ["Atención de Urgencia 24/7", "Citas el Mismo Día", "Edades de 0 a 21", "Todos los Seguros Aceptados"],
    logoSrc: "/pediatric-after-hour-logo.png",
    externalUrl: "https://pediatricafterhour.com/",
  },
  {
    id: "human-compass-mso",
    name: "Human Compass MSO",
    tagline: "Guiding care, delivering human solutions.",
    taglineEs: "Guiando la atención, entregando soluciones humanas.",
    description:
      "A Southern California management services organization connecting patients with primary, specialty, and urgent care providers for over 25 years.",
    descriptionEs:
      "Una organización de servicios de gestión del sur de California que conecta a pacientes con proveedores de atención primaria, especializada y de urgencia desde hace más de 25 años.",
    services: ["Primary Care Network", "Specialty Care", "Urgent Care", "Provider Management"],
    servicesEs: ["Red de Atención Primaria", "Atención Especializada", "Atención de Urgencia", "Gestión de Proveedores"],
    logoSrc: "/human-compass-mso-logo.png",
    externalUrl: "https://humancompassmso.com/",
  },
  {
    id: "acig",
    name: "ACIG - Asiacorp Insurance Brokers",
    tagline: "Insurance solutions across Sri Lanka.",
    taglineEs: "Soluciones de seguros en todo Sri Lanka.",
    description:
      "An insurance brokerage offering tailored motor, health, life, and corporate insurance solutions for individuals and businesses in Sri Lanka.",
    descriptionEs:
      "Una correduría de seguros que ofrece soluciones personalizadas de seguros de vehículos, salud, vida y corporativos para personas y empresas en Sri Lanka.",
    services: ["Health Insurance", "Life Insurance", "Motor Insurance", "Corporate Insurance"],
    servicesEs: ["Seguro de Salud", "Seguro de Vida", "Seguro de Vehículos", "Seguro Corporativo"],
    logoSrc: "/acig-logo.png",
    externalUrl: "https://acig.lk/",
  },
  {
    id: "blockchain-bpo",
    name: "Blockchain BPO",
    tagline: "Offshore teams for US businesses.",
    taglineEs: "Equipos externos para empresas de EE. UU.",
    description:
      "A business process outsourcing company providing dedicated offshore teams in Sri Lanka and Mexico for customer care, claims processing, and billing support.",
    descriptionEs:
      "Una empresa de tercerización de procesos que ofrece equipos externos dedicados en Sri Lanka y México para atención al cliente, procesamiento de reclamos y soporte de facturación.",
    services: ["Customer Care", "Claims Processing", "Billing Support", "Data Entry"],
    servicesEs: ["Atención al Cliente", "Procesamiento de Reclamos", "Soporte de Facturación", "Entrada de Datos"],
    logoSrc: "/blockchain-bpo-logo.png",
    externalUrl: "https://www.myblockchainbpo.com/",
  },
];
