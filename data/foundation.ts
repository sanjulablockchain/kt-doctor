export type FoundationProgram = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
};

export type Foundation = {
  name: string;
  mission: string;
  missionEs: string;
  logoSrc: string;
  siteUrl: string;
  donateUrl: string;
  programs: FoundationProgram[];
};

export const foundation: Foundation = {
  name: "Kids and Teens Foundation",
  mission:
    "Providing critical medical care to those in need, opportunities to those who want to pursue medicine, and education so every family can act on conditions that are easily treated and prevented at home.",
  missionEs:
    "Brindando atención médica esencial a quienes la necesitan, oportunidades a quienes desean seguir una carrera en medicina, y educación para que cada familia pueda actuar ante condiciones fáciles de tratar y prevenir en casa.",
  logoSrc: "/foundation-logo.png",
  siteUrl: "https://kidsandteensfoundation.org",
  donateUrl: "https://kidsandteensfoundation.org/donate/",
  programs: [
    {
      id: "free-clinic-days",
      name: "Free Clinic Days & Continued Care",
      nameEs: "Días de Clínica Gratuita y Atención Continua",
      description:
        "Monthly free clinic days at KTMG's busiest locations for families with little or no medical coverage, plus continued low-cost follow-up care.",
      descriptionEs:
        "Días mensuales de clínica gratuita en las ubicaciones más concurridas de KTMG para familias con poca o ninguna cobertura médica, además de atención de seguimiento continua a bajo costo.",
    },
    {
      id: "medical-missions",
      name: "Medical Missions",
      nameEs: "Misiones Médicas",
      description:
        "A planned medical mission to Negombo, Sri Lanka, with partner Saint Joseph Hospital, bringing doctors to communities with limited access to care. Date to be announced.",
      descriptionEs:
        "Una misión médica planeada a Negombo, Sri Lanka, junto con el Hospital Saint Joseph, llevando médicos a comunidades con acceso limitado a la atención. Fecha por anunciar.",
    },
    {
      id: "internships",
      name: "Internship Opportunities",
      nameEs: "Oportunidades de Pasantías",
      description:
        "Internship and job opportunities for lower-income students transitioning from education into the workforce.",
      descriptionEs:
        "Oportunidades de pasantías y empleo para estudiantes de bajos ingresos que hacen la transición de la educación al mundo laboral.",
    },
    {
      id: "mentorship",
      name: "Mentorship",
      nameEs: "Mentoría",
      description:
        "A mentorship program pairing medical professionals with students ages 18 to 24 who are pursuing or considering a career in medicine.",
      descriptionEs:
        "Un programa de mentoría que conecta a profesionales médicos con estudiantes de 18 a 24 años que buscan o consideran una carrera en medicina.",
    },
    {
      id: "community-outreach",
      name: "Community & Educational Outreach",
      nameEs: "Alcance Comunitario y Educativo",
      description:
        "Working with local governments and organizations to improve school health education and community wellbeing.",
      descriptionEs:
        "Trabajando con gobiernos locales y organizaciones para mejorar la educación de salud escolar y el bienestar comunitario.",
    },
    {
      id: "scholarships",
      name: "Scholarships",
      nameEs: "Becas",
      description:
        "Home of the Janesri and Sunil De Silva Scholarship, awarded annually to students pursuing pre-med, biology, chemistry, or related fields.",
      descriptionEs:
        "Sede de la Beca Janesri y Sunil De Silva, otorgada anualmente a estudiantes que cursan pre-medicina, biología, química u otros campos relacionados.",
    },
  ],
};

export type SriLankaSchool = {
  id: string;
  name: string;
  location: string;
  studentCount: string;
  studentCountEs: string;
  programs: string[];
  programsEs: string[];
};

export type SriLankaProgram = {
  heading: string;
  headingEs: string;
  mission: string;
  missionEs: string;
};

export const sriLankaProgram: SriLankaProgram = {
  heading: "Transforming School Wellness in Sri Lanka",
  headingEs: "Transformando el Bienestar Escolar en Sri Lanka",
  mission:
    "Converting and managing wellness centers at leading Negombo schools, bringing world-class pediatric care to students who need it most.",
  missionEs:
    "Convirtiendo y gestionando centros de bienestar en las principales escuelas de Negombo, llevando atención pediátrica de clase mundial a los estudiantes que más la necesitan.",
};

export const sriLankaSchools: SriLankaSchool[] = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    studentCountEs: "más de 1,200 estudiantes",
    programs: ["Vision Screening", "Dental Check-ups", "Nutrition Programs", "Mental Health Counseling"],
    programsEs: [
      "Exámenes de Visión",
      "Revisiones Dentales",
      "Programas de Nutrición",
      "Asesoramiento de Salud Mental",
    ],
  },
  {
    id: "st-josephs-college",
    name: "St. Joseph's College",
    location: "Negombo",
    studentCount: "900+ students",
    studentCountEs: "más de 900 estudiantes",
    programs: ["Sports Physicals", "Immunization Drives", "First Aid Training", "Health Education"],
    programsEs: [
      "Exámenes Físicos Deportivos",
      "Jornadas de Vacunación",
      "Capacitación en Primeros Auxilios",
      "Educación en Salud",
    ],
  },
  {
    id: "loyola-college",
    name: "Loyola College",
    location: "Negombo",
    studentCount: "1,100+ students",
    studentCountEs: "más de 1,100 estudiantes",
    programs: ["Telehealth Access", "Chronic Disease Mgmt", "Hygiene Programs", "Parent Workshops"],
    programsEs: [
      "Acceso a Telesalud",
      "Manejo de Enfermedades Crónicas",
      "Programas de Higiene",
      "Talleres para Padres",
    ],
  },
  {
    id: "maristella-college",
    name: "Maristella College",
    location: "Negombo",
    studentCount: "800+ students",
    studentCountEs: "más de 800 estudiantes",
    programs: ["Speech Therapy", "Occupational Therapy", "Sensory Programs", "Growth Monitoring"],
    programsEs: [
      "Terapia del Habla",
      "Terapia Ocupacional",
      "Programas Sensoriales",
      "Monitoreo del Crecimiento",
    ],
  },
];
