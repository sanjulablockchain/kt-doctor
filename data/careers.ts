export type Department =
  | "Clinical"
  | "Clinical Support"
  | "Administration"
  | "Operations"
  | "Therapy"
  | "Finance";

export type EmploymentType = "Full-time" | "Part-time" | "Full-time / Part-time";

export type Position = {
  id: string;
  title: string;
  titleEs: string;
  department: Department;
  locations: string;
  employmentType: EmploymentType;
  summary: string;
  summaryEs: string;
  description: string;
  descriptionEs: string;
  responsibilities: string[];
  responsibilitiesEs: string[];
  requirements: string[];
  requirementsEs: string[];
};

// Fixed display order for the department filter.
export const DEPARTMENTS: Department[] = [
  "Clinical",
  "Clinical Support",
  "Administration",
  "Operations",
  "Therapy",
  "Finance",
];

// Seed list from the approved mockup. The client confirms/edits the exact roles
// before launch; ids are stable slugs used as the Apply deep-link value.
export const positions: Position[] = [
  {
    id: "pediatrician",
    title: "Pediatrician (MD/DO)",
    titleEs: "Pediatra (MD/DO)",
    department: "Clinical",
    locations: "Multiple Locations",
    employmentType: "Full-time",
    summary:
      "Board-certified pediatrician to provide primary care for patients ages 0 to 21. FAAP preferred.",
    summaryEs:
      "Pediatra certificado para brindar atención primaria a pacientes de 0 a 21 años. Se prefiere FAAP.",
    description:
      "Provide comprehensive primary and preventive care to patients from birth through age 21 across one of our Greater LA clinics, working alongside a supportive clinical and administrative team.",
    descriptionEs:
      "Brinde atención primaria y preventiva integral a pacientes desde el nacimiento hasta los 21 años en una de nuestras clínicas del área de Los Ángeles, junto a un equipo clínico y administrativo que le brinda apoyo.",
    responsibilities: [
      "Conduct well-child exams, sick visits, and same-day urgent visits",
      "Diagnose and manage acute and chronic pediatric conditions",
      "Order, interpret, and follow up on labs and referrals",
      "Counsel parents on nutrition, development, and preventive care",
      "Maintain accurate, timely documentation in the EHR",
    ],
    responsibilitiesEs: [
      "Realizar exámenes de niño sano, visitas por enfermedad y visitas urgentes el mismo día",
      "Diagnosticar y tratar afecciones pediátricas agudas y crónicas",
      "Solicitar, interpretar y dar seguimiento a laboratorios y referencias",
      "Asesorar a los padres sobre nutrición, desarrollo y atención preventiva",
      "Mantener una documentación clínica precisa y oportuna en el sistema EHR",
    ],
    requirements: [
      "MD or DO from an accredited medical school",
      "Board certified or board eligible in pediatrics (FAAP preferred)",
      "Active California medical license and DEA registration",
      "Strong communication skills in English; Spanish a plus",
      "Comfortable with EHR-based charting (eClinicalWorks/Healow)",
    ],
    requirementsEs: [
      "Título de MD o DO de una escuela de medicina acreditada",
      "Certificación o elegibilidad de junta en pediatría (se prefiere FAAP)",
      "Licencia médica activa de California y registro DEA",
      "Buenas habilidades de comunicación en inglés; el español es una ventaja",
      "Familiaridad con el registro clínico electrónico (eClinicalWorks/Healow)",
    ],
  },
  {
    id: "pediatric-np",
    title: "Pediatric Nurse Practitioner",
    titleEs: "Enfermera Practicante Pediátrica",
    department: "Clinical",
    locations: "Hollywood, Tarzana",
    employmentType: "Full-time",
    summary: "PNP to provide well-child visits, sick visits, and telehealth consultations.",
    summaryEs:
      "Enfermera practicante pediátrica para visitas de niño sano, visitas por enfermedad y consultas de telesalud.",
    description:
      "Deliver well-child, sick, and telehealth visits under a collaborative practice model, with the flexibility to work across our Hollywood and Tarzana clinics.",
    descriptionEs:
      "Brinde visitas de niño sano, visitas por enfermedad y consultas de telesalud bajo un modelo de práctica colaborativa, con la flexibilidad de trabajar entre nuestras clínicas de Hollywood y Tarzana.",
    responsibilities: [
      "Perform well-child checkups, sick visits, and telehealth consultations",
      "Administer and track immunizations per the CDC schedule",
      "Collaborate with supervising physicians on complex cases",
      "Educate families on developmental milestones and home care",
      "Keep clinical notes current and accurate",
    ],
    responsibilitiesEs: [
      "Realizar chequeos de niño sano, visitas por enfermedad y consultas de telesalud",
      "Administrar y registrar vacunas según el calendario del CDC",
      "Colaborar con los médicos supervisores en casos complejos",
      "Educar a las familias sobre hitos del desarrollo y cuidado en casa",
      "Mantener las notas clínicas actualizadas y precisas",
    ],
    requirements: [
      "Active California NP license with pediatric certification (CPNP or FNP)",
      "Current DEA registration",
      "1+ years of pediatric or family practice experience preferred",
      "Comfortable with telehealth platforms",
      "Bilingual (English/Spanish) a plus",
    ],
    requirementsEs: [
      "Licencia activa de enfermera practicante en California con certificación pediátrica (CPNP o FNP)",
      "Registro DEA vigente",
      "Se prefiere 1 o más años de experiencia en pediatría o medicina familiar",
      "Familiaridad con plataformas de telesalud",
      "Bilingüe (inglés/español) es una ventaja",
    ],
  },
  {
    id: "medical-assistant",
    title: "Medical Assistant",
    titleEs: "Asistente Médico",
    department: "Clinical Support",
    locations: "Pasadena, Glendale, Arcadia",
    employmentType: "Full-time",
    summary: "Bilingual (English/Spanish) MA to assist with patient intake, vitals, and procedures.",
    summaryEs:
      "Asistente médico bilingüe (inglés/español) para apoyar la admisión de pacientes, signos vitales y procedimientos.",
    description:
      "Support our clinical team across the Pasadena, Glendale, and Arcadia clinics by preparing patients for visits and assisting with routine procedures.",
    descriptionEs:
      "Apoye a nuestro equipo clínico en las clínicas de Pasadena, Glendale y Arcadia preparando a los pacientes para sus visitas y ayudando con procedimientos de rutina.",
    responsibilities: [
      "Room patients and record vitals, height, and weight",
      "Assist providers with exams, immunizations, and procedures",
      "Prepare and maintain exam rooms and instruments",
      "Enter clinical data accurately into the EHR",
      "Communicate clearly with patients and families in English and Spanish",
    ],
    responsibilitiesEs: [
      "Acomodar a los pacientes en las salas y registrar signos vitales, estatura y peso",
      "Asistir a los proveedores con exámenes, vacunas y procedimientos",
      "Preparar y mantener las salas de examen e instrumentos",
      "Registrar los datos clínicos con precisión en el sistema EHR",
      "Comunicarse claramente con pacientes y familias en inglés y español",
    ],
    requirements: [
      "Certified Medical Assistant (CMA/RMA) or equivalent training",
      "Bilingual English/Spanish required",
      "Current CPR certification",
      "Prior pediatric experience a plus",
      "Reliable, punctual, and comfortable in a fast-paced clinic",
    ],
    requirementsEs: [
      "Asistente médico certificado (CMA/RMA) o capacitación equivalente",
      "Se requiere ser bilingüe en inglés y español",
      "Certificación vigente en RCP",
      "La experiencia pediátrica previa es una ventaja",
      "Persona confiable, puntual y cómoda en una clínica de ritmo dinámico",
    ],
  },
  {
    id: "front-office-coordinator",
    title: "Front Office Coordinator",
    titleEs: "Coordinador de Recepción",
    department: "Administration",
    locations: "Northridge, Van Nuys",
    employmentType: "Full-time",
    summary: "Manage patient scheduling, insurance verification, and front desk operations.",
    summaryEs:
      "Gestionar la programación de pacientes, la verificación de seguros y las operaciones de recepción.",
    description:
      "Own the front-desk experience at our Northridge and Van Nuys clinics, from the first phone call through checkout.",
    descriptionEs:
      "Sea responsable de la experiencia de recepción en nuestras clínicas de Northridge y Van Nuys, desde la primera llamada telefónica hasta la salida del paciente.",
    responsibilities: [
      "Greet patients and manage a busy check-in/checkout flow",
      "Schedule and confirm appointments across multiple providers",
      "Verify insurance eligibility and collect co-pays",
      "Answer phones and route calls to the right department",
      "Keep the waiting area organized and welcoming",
    ],
    responsibilitiesEs: [
      "Recibir a los pacientes y gestionar un flujo activo de registro y salida",
      "Programar y confirmar citas para múltiples proveedores",
      "Verificar la elegibilidad del seguro y cobrar los copagos",
      "Contestar llamadas y dirigirlas al departamento correspondiente",
      "Mantener la sala de espera organizada y acogedora",
    ],
    requirements: [
      "1+ years of front-office or customer service experience (medical office preferred)",
      "Comfortable with EHR scheduling systems",
      "Strong organizational and multitasking skills",
      "Bilingual English/Spanish a plus",
      "Professional, friendly phone manner",
    ],
    requirementsEs: [
      "1 o más años de experiencia en recepción o servicio al cliente (se prefiere oficina médica)",
      "Familiaridad con sistemas de programación EHR",
      "Buenas habilidades de organización y capacidad para realizar varias tareas",
      "El bilingüismo en inglés y español es una ventaja",
      "Trato telefónico profesional y amable",
    ],
  },
  {
    id: "telehealth-coordinator",
    title: "Telehealth Coordinator",
    titleEs: "Coordinador de Telesalud",
    department: "Operations",
    locations: "Remote",
    employmentType: "Full-time",
    summary: "Coordinate virtual visits, manage the telehealth platform, and support patients with technology.",
    summaryEs:
      "Coordinar visitas virtuales, administrar la plataforma de telesalud y ayudar a los pacientes con la tecnología.",
    description:
      "Keep our virtual visit program running smoothly, supporting both patients and providers with technology and scheduling for telehealth appointments.",
    descriptionEs:
      "Mantenga nuestro programa de visitas virtuales funcionando sin problemas, apoyando a pacientes y proveedores con la tecnología y la programación de citas de telesalud.",
    responsibilities: [
      "Schedule and confirm telehealth appointments",
      "Walk patients through connecting to video visits",
      "Troubleshoot common technology issues in real time",
      "Coordinate with clinical staff on same-day telehealth needs",
      "Track and report telehealth visit volume",
    ],
    responsibilitiesEs: [
      "Programar y confirmar citas de telesalud",
      "Guiar a los pacientes para conectarse a las videoconsultas",
      "Resolver problemas técnicos comunes en tiempo real",
      "Coordinar con el personal clínico las necesidades de telesalud del mismo día",
      "Registrar e informar el volumen de visitas de telesalud",
    ],
    requirements: [
      "Comfortable working fully remote with a reliable internet connection",
      "Strong phone and written communication skills",
      "Prior healthcare scheduling or call-center experience preferred",
      "Patience and clear communication with parents and caregivers",
      "Bilingual English/Spanish a plus",
    ],
    requirementsEs: [
      "Cómodo trabajando de forma completamente remota con conexión a internet confiable",
      "Buenas habilidades de comunicación telefónica y escrita",
      "Se prefiere experiencia previa en programación médica o centros de llamadas",
      "Paciencia y comunicación clara con padres y cuidadores",
      "El bilingüismo en inglés y español es una ventaja",
    ],
  },
  {
    id: "speech-language-pathologist",
    title: "Speech Language Pathologist",
    titleEs: "Patólogo del Habla y Lenguaje",
    department: "Therapy",
    locations: "West LA (LAIPT)",
    employmentType: "Full-time / Part-time",
    summary: "Pediatric SLP for children under 10. In-person and teletherapy sessions.",
    summaryEs:
      "Patólogo del habla pediátrico para niños menores de 10 años. Sesiones presenciales y de teleterapia.",
    description:
      "Provide speech and language therapy to children under 10 through our LAIPT program, with a mix of in-person and teletherapy sessions.",
    descriptionEs:
      "Brinde terapia del habla y lenguaje a niños menores de 10 años a través de nuestro programa LAIPT, con una combinación de sesiones presenciales y de teleterapia.",
    responsibilities: [
      "Evaluate and treat speech, language, and feeding disorders in young children",
      "Develop and update individualized treatment plans",
      "Deliver both in-person and teletherapy sessions",
      "Communicate progress with parents and referring providers",
      "Maintain compliant clinical documentation",
    ],
    responsibilitiesEs: [
      "Evaluar y tratar trastornos del habla, lenguaje y alimentación en niños pequeños",
      "Desarrollar y actualizar planes de tratamiento individualizados",
      "Ofrecer sesiones presenciales y de teleterapia",
      "Comunicar el progreso a los padres y a los proveedores que hacen la referencia",
      "Mantener una documentación clínica conforme a las normas",
    ],
    requirements: [
      "Master's degree in Speech Language Pathology",
      "Active California SLP license (ASHA CCC preferred)",
      "Experience with pediatric caseloads",
      "Comfortable delivering teletherapy",
      "Bilingual English/Spanish a plus",
    ],
    requirementsEs: [
      "Maestría en Patología del Habla y Lenguaje",
      "Licencia activa de California como patólogo del habla (se prefiere ASHA CCC)",
      "Experiencia con casos pediátricos",
      "Cómodo ofreciendo sesiones de teleterapia",
      "El bilingüismo en inglés y español es una ventaja",
    ],
  },
  {
    id: "occupational-therapist",
    title: "Occupational Therapist",
    titleEs: "Terapeuta Ocupacional",
    department: "Therapy",
    locations: "West LA (LAIPT)",
    employmentType: "Part-time",
    summary: "Pediatric OT specializing in sensory processing and fine motor development.",
    summaryEs:
      "Terapeuta ocupacional pediátrico especializado en procesamiento sensorial y desarrollo motor fino.",
    description:
      "Join our LAIPT team supporting children's sensory processing and fine motor development through individualized occupational therapy.",
    descriptionEs:
      "Únase a nuestro equipo de LAIPT apoyando el procesamiento sensorial y el desarrollo motor fino de los niños mediante terapia ocupacional individualizada.",
    responsibilities: [
      "Evaluate children for sensory, motor, and developmental needs",
      "Design and deliver individualized OT treatment plans",
      "Track progress and adjust goals with families and providers",
      "Document sessions in line with insurance and clinical standards",
      "Collaborate with speech and behavioral therapists on shared cases",
    ],
    responsibilitiesEs: [
      "Evaluar a los niños según sus necesidades sensoriales, motoras y de desarrollo",
      "Diseñar y ofrecer planes de tratamiento de terapia ocupacional individualizados",
      "Dar seguimiento al progreso y ajustar metas junto a familias y proveedores",
      "Documentar las sesiones conforme a los estándares de seguros y clínicos",
      "Colaborar con terapeutas del habla y conductuales en casos compartidos",
    ],
    requirements: [
      "Master's degree in Occupational Therapy",
      "Active California OT license",
      "Pediatric OT experience preferred",
      "Strong communication with parents and multidisciplinary teams",
      "Part-time schedule flexibility",
    ],
    requirementsEs: [
      "Maestría en Terapia Ocupacional",
      "Licencia activa de California como terapeuta ocupacional",
      "Se prefiere experiencia en terapia ocupacional pediátrica",
      "Buena comunicación con padres y equipos multidisciplinarios",
      "Flexibilidad de horario de medio tiempo",
    ],
  },
  {
    id: "billing-specialist",
    title: "Billing Specialist",
    titleEs: "Especialista en Facturación",
    department: "Finance",
    locations: "Pasadena (HQ)",
    employmentType: "Full-time",
    summary: "Medical billing and coding specialist with pediatric experience. CPC certification preferred.",
    summaryEs:
      "Especialista en facturación y codificación médica con experiencia pediátrica. Se prefiere certificación CPC.",
    description:
      "Support accurate, timely reimbursement for our clinics from our Pasadena headquarters, handling coding, claims, and payer follow-up.",
    descriptionEs:
      "Apoye el reembolso preciso y oportuno de nuestras clínicas desde nuestra oficina central en Pasadena, gestionando codificación, reclamos y seguimiento con las aseguradoras.",
    responsibilities: [
      "Prepare and submit accurate medical claims to insurance payers",
      "Review and apply correct CPT/ICD-10 coding for pediatric visits",
      "Follow up on denials, rejections, and outstanding balances",
      "Reconcile payments and post remittances",
      "Communicate with patients on billing questions",
    ],
    responsibilitiesEs: [
      "Preparar y enviar reclamos médicos precisos a las aseguradoras",
      "Revisar y aplicar la codificación CPT/ICD-10 correcta para visitas pediátricas",
      "Dar seguimiento a rechazos, denegaciones y saldos pendientes",
      "Reconciliar pagos y registrar remesas",
      "Comunicarse con los pacientes sobre preguntas de facturación",
    ],
    requirements: [
      "2+ years of medical billing and coding experience",
      "CPC certification preferred",
      "Familiarity with pediatric billing and major payers",
      "Proficiency with EHR/billing software",
      "Detail-oriented with strong follow-through",
    ],
    requirementsEs: [
      "2 o más años de experiencia en facturación y codificación médica",
      "Se prefiere certificación CPC",
      "Familiaridad con la facturación pediátrica y las principales aseguradoras",
      "Dominio de software de facturación y EHR",
      "Atención al detalle y buen seguimiento de tareas",
    ],
  },
];
