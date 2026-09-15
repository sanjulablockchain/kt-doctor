// Formal, press-facing biographies, transcribed from the PDFs supplied by the
// client for the media kit (KTDoctor-MediaKit_Biography.pdf).
//
// These are deliberately distinct from the short, warm, patient-facing bios in
// `data/doctors.ts`, which speak to parents choosing a pediatrician. These
// speak to journalists, partners and event organisers. Each one cross-links to
// its doctor page via `doctorId` so neither version is a dead end.
//
// One change from the source PDF: the biography's third paragraph closed with
// "where the Kids & Teens Medical Group will be participating at its Health
// Fair on October 6". A biography is evergreen and that clause goes stale the
// day after the event, so it is omitted here. It remains, correctly, in the
// dated press release, which is a point-in-time document.

export type PressBioParagraph = {
  text: string;
  textEs: string;
};

export type PressBio = {
  id: string;
  /** Matches an id in `data/doctors.ts`, so the two pages can link to each other. */
  doctorId: string;
  name: string;
  credentials: string;
  role: string;
  roleEs: string;
  portraitSrc: string;
  summary: string;
  summaryEs: string;
  body: PressBioParagraph[];
  /** Speaking availability, pulled out of the body so it can carry a real call to action. */
  speaking: PressBioParagraph | null;
  /** Self-hosted copy of the original PDF. */
  pdfHref: string;
};

export const pressBios: PressBio[] = [
  {
    id: "janesri-de-silva",
    doctorId: "janesri-de-silva",
    name: "Janesri De Silva",
    credentials: "MD, FAAP",
    role: "Founder, Kids & Teens Medical Group",
    roleEs: "Fundadora, Kids & Teens Medical Group",
    portraitSrc: "/doctors/janesri-de-silva.webp",
    summary:
      "Board-certified pediatrician, healthcare leader, and founder of Southern California's largest independent pediatric network. A delegate to the California Medical Association and a 2026 L.A. Care Social Determinants of Health Award recipient.",
    summaryEs:
      "Pediatra certificada por la junta, líder en el sector de la salud y fundadora de la red pediátrica independiente más grande del sur de California. Delegada ante la Asociación Médica de California y galardonada en 2026 con el Premio a los Determinantes Sociales de la Salud de L.A. Care.",
    pdfHref: "/media/ktmg-janesri-de-silva-biography.pdf",
    body: [
      {
        text: "Janesri De Silva, MD, FAAP, is a board-certified pediatrician, healthcare leader, and the esteemed founder of the Kids & Teens Medical Group, Southern California's largest independent pediatric network making a difference in children's health since 2007. She is also a delegate to the California Medical Association, where her influential vote on key issues and policies for change is part of her ongoing contribution and advocacy in the community.",
        textEs:
          "Janesri De Silva, MD, FAAP, es pediatra certificada por la junta, líder en el sector de la salud y estimada fundadora de Kids & Teens Medical Group, la red pediátrica independiente más grande del sur de California, que marca la diferencia en la salud infantil desde 2007. También es delegada ante la Asociación Médica de California, donde su voto influyente sobre temas y políticas clave para el cambio forma parte de su contribución y defensa continuas en la comunidad.",
      },
      {
        text: "Celebrating her excellence in care, Dr. De Silva was individually recognized by L.A. Care in 2026 with the Social Determinants of Health Award for her commitment to outstanding care, serving children and families throughout Los Angeles County. The Kids & Teens Medical Group was honored by L.A. Care in 2024 with the Health Equity Award, in recognition of its commitment to reducing healthcare disparities and improving outcomes for vulnerable populations.",
        textEs:
          "En reconocimiento a su excelencia en la atención, la Dra. De Silva fue distinguida individualmente por L.A. Care en 2026 con el Premio a los Determinantes Sociales de la Salud por su compromiso con la atención excepcional a los niños y las familias de todo el condado de Los Ángeles. Kids & Teens Medical Group fue honrado por L.A. Care en 2024 con el Premio a la Equidad en la Salud, en reconocimiento a su compromiso con la reducción de las disparidades en la atención médica y la mejora de los resultados de las poblaciones vulnerables.",
      },
      {
        text: "Dr. De Silva is honored to partner with L.A. Care and other community organizations, further including USC as a Tier 1 partner with its Health Benefits Plan.",
        textEs:
          "La Dra. De Silva se enorgullece de colaborar con L.A. Care y otras organizaciones comunitarias, incluida USC como socio de Nivel 1 en su Plan de Beneficios de Salud.",
      },
      {
        text: "Since founding the organization in 2007, Dr. De Silva has continued her dedication to advancing health equity, preventive care, and improving access for underserved communities. The Kids & Teens Medical Group has expanded its high-quality pediatric care across 25 clinic locations throughout Los Angeles and surrounding regions. Under her leadership, the organization has developed innovative programs focused on community outreach, care coordination, and culturally responsive healthcare delivery.",
        textEs:
          "Desde que fundó la organización en 2007, la Dra. De Silva ha mantenido su dedicación al avance de la equidad en la salud, la atención preventiva y la mejora del acceso para las comunidades desatendidas. Kids & Teens Medical Group ha ampliado su atención pediátrica de alta calidad a 25 clínicas en Los Ángeles y las regiones circundantes. Bajo su liderazgo, la organización ha desarrollado programas innovadores centrados en el alcance comunitario, la coordinación de la atención y una prestación de servicios de salud culturalmente receptiva.",
      },
      {
        text: "In addition to her clinical and executive leadership roles, Dr. De Silva has further served in hospital upper-management positions, where she mentored future healthcare professionals and championed initiatives to improve health outcomes for children and families. Her notable body of work in the medical field represents a lifelong commitment to ensuring that every child has the opportunity to thrive regardless of socioeconomic background.",
        textEs:
          "Además de sus funciones clínicas y de liderazgo ejecutivo, la Dra. De Silva ha ocupado puestos de alta dirección hospitalaria, donde fue mentora de futuros profesionales de la salud e impulsó iniciativas para mejorar los resultados de salud de los niños y las familias. Su notable trayectoria en el campo de la medicina representa un compromiso de por vida con garantizar que cada niño tenga la oportunidad de prosperar, independientemente de su origen socioeconómico.",
      },
      {
        text: "A native of Sri Lanka, Dr. De Silva has also launched a series of initiatives in her homeland as part of her effort and ongoing commitment to bringing medical attention and support to communities with limited access to care.",
        textEs:
          "Originaria de Sri Lanka, la Dra. De Silva también ha puesto en marcha una serie de iniciativas en su país natal como parte de su esfuerzo y compromiso continuo por llevar atención y apoyo médico a comunidades con acceso limitado a la atención.",
      },
    ],
    speaking: {
      text: "For keynote speaker interest, Dr. De Silva is available to join right-fit events where her continuous mission for advancing health equity in the community can be shared. Organizations planning their next event are invited to get in touch.",
      textEs:
        "Para invitaciones como oradora principal, la Dra. De Silva está disponible para participar en eventos afines donde pueda compartir su misión continua de promover la equidad en la salud en la comunidad. Invitamos a las organizaciones que estén planificando su próximo evento a ponerse en contacto.",
    },
  },
];
