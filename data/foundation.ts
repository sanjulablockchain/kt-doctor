export type FoundationProgram = {
  id: string;
  name: string;
  description: string;
};

export type Foundation = {
  name: string;
  mission: string;
  logoSrc: string;
  siteUrl: string;
  donateUrl: string;
  programs: FoundationProgram[];
};

export const foundation: Foundation = {
  name: "Kids and Teens Foundation",
  mission:
    "Providing critical medical care to those in need, opportunities to those who want to pursue medicine, and education so every family can act on conditions that are easily treated and prevented at home.",
  logoSrc: "/foundation-logo.png",
  siteUrl: "https://kidsandteensfoundation.org",
  donateUrl: "https://kidsandteensfoundation.org/donate/",
  programs: [
    {
      id: "free-clinic-days",
      name: "Free Clinic Days & Continued Care",
      description:
        "Monthly free clinic days at KTMG's busiest locations for families with little or no medical coverage, plus continued low-cost follow-up care.",
    },
    {
      id: "medical-missions",
      name: "Medical Missions",
      description:
        "A planned medical mission to Negombo, Sri Lanka, with partner Saint Joseph Hospital, bringing doctors to communities with limited access to care. Date to be announced.",
    },
    {
      id: "internships",
      name: "Internship Opportunities",
      description:
        "Internship and job opportunities for lower-income students transitioning from education into the workforce.",
    },
    {
      id: "mentorship",
      name: "Mentorship",
      description:
        "A mentorship program pairing medical professionals with students ages 18 to 24 who are pursuing or considering a career in medicine.",
    },
    {
      id: "community-outreach",
      name: "Community & Educational Outreach",
      description:
        "Working with local governments and organizations to improve school health education and community wellbeing.",
    },
    {
      id: "scholarships",
      name: "Scholarships",
      description:
        "Home of the Janesri and Sunil De Silva Scholarship, awarded annually to students pursuing pre-med, biology, chemistry, or related fields.",
    },
  ],
};

export type SriLankaSchool = {
  id: string;
  name: string;
  location: string;
  studentCount: string;
  programs: string[];
};

export type SriLankaProgram = {
  heading: string;
  mission: string;
};

export const sriLankaProgram: SriLankaProgram = {
  heading: "Transforming School Wellness in Sri Lanka",
  mission:
    "Converting and managing wellness centers at leading Negombo schools, bringing world-class pediatric care to students who need it most.",
};

export const sriLankaSchools: SriLankaSchool[] = [
  {
    id: "st-peters-college",
    name: "St. Peter's College",
    location: "Negombo",
    studentCount: "1,200+ students",
    programs: [
      "Vision Screening",
      "Dental Check-ups",
      "Nutrition Programs",
      "Mental Health Counseling",
    ],
  },
  {
    id: "st-josephs-college",
    name: "St. Joseph's College",
    location: "Negombo",
    studentCount: "900+ students",
    programs: [
      "Sports Physicals",
      "Immunization Drives",
      "First Aid Training",
      "Health Education",
    ],
  },
  {
    id: "loyola-college",
    name: "Loyola College",
    location: "Negombo",
    studentCount: "1,100+ students",
    programs: [
      "Telehealth Access",
      "Chronic Disease Mgmt",
      "Hygiene Programs",
      "Parent Workshops",
    ],
  },
  {
    id: "maristella-college",
    name: "Maristella College",
    location: "Negombo",
    studentCount: "800+ students",
    programs: [
      "Speech Therapy",
      "Occupational Therapy",
      "Sensory Programs",
      "Growth Monitoring",
    ],
  },
];
