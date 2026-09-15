// Press releases issued by the practice, transcribed from the PDFs supplied by
// the client for the media kit (KTDoctor-MediaKit_Press Release.pdf).
//
// These are published as real HTML pages rather than PDF links so they are
// indexable and readable on a phone; the original PDF stays available as a
// download for journalists via `pdfHref`.
//
// Copy is transcribed faithfully with three deliberate changes:
//   1. The source headline is a single all-caps run-on sentence. It is split
//      here into `title` (the headline) and `deck` (the existing subhead) and
//      set in title case, because reproducing a 40-word all-caps block reads
//      badly on the web and is poor for screen readers. The unedited original
//      is preserved in `sourceHeadline` below so nothing is lost.
//   2. Em dashes in the source are replaced with commas, per the project copy
//      style rule.
//   3. The trailing "for more information, visit www.ktdoctor.com" line is not
//      a body paragraph; the page renders it as boilerplate instead.

export type PressReleaseParagraph = {
  text: string;
  textEs: string;
};

export type PressRelease = {
  id: string;
  /** ISO date, used for <time dateTime> and JSON-LD. */
  date: string;
  displayDate: string;
  displayDateEs: string;
  title: string;
  titleEs: string;
  deck: string;
  deckEs: string;
  dateline: string;
  datelineEs: string;
  excerpt: string;
  excerptEs: string;
  body: PressReleaseParagraph[];
  /** Self-hosted copy of the original PDF. */
  pdfHref: string;
  /** The unedited all-caps headline exactly as it appears in the source PDF. */
  sourceHeadline: string;
};

export const pressReleases: PressRelease[] = [
  {
    id: "la-care-usc-recognition",
    // The supplied PDF carries no release date. This is the date the piece was
    // handed over for publication; confirm with the client if they need the
    // original issue date shown instead.
    date: "2026-09-15",
    displayDate: "September 15, 2026",
    displayDateEs: "15 de septiembre de 2026",
    title:
      "Kids & Teens Medical Group Receives Widespread Recognition from Partnerships with L.A. Care and USC Health Benefits",
    titleEs:
      "Kids & Teens Medical Group recibe un amplio reconocimiento por sus alianzas con L.A. Care y USC Health Benefits",
    sourceHeadline:
      "KIDS & TEENS MEDICAL GROUP RECEIVES WIDESPREAD RECOGNITION FROM VALUED PARTNERSHIPS WITH L.A. CARE AND USC HEALTH BENEFITS AMONG OTHER COMMUNITY ORGANIZATIONS THROUGH EXPANSIVE NETWORK 25 CLINICS STRONG IN LOS ANGELES COUNTY AND SURROUNDING REGIONS",
    deck: "Kids & Teens Medical Group founder Dr. Janesri De Silva, a delegate to the California Medical Association, contributes influence on important policies for change as part of an ongoing mission for advancing health equity in the community.",
    deckEs:
      "La fundadora de Kids & Teens Medical Group, la Dra. Janesri De Silva, delegada ante la Asociación Médica de California, aporta su influencia en políticas importantes para el cambio como parte de su misión continua de promover la equidad en la salud en la comunidad.",
    dateline: "Los Angeles, CA",
    datelineEs: "Los Ángeles, CA",
    excerpt:
      "Under founder Dr. Janesri De Silva, Kids & Teens Medical Group has grown into Southern California's largest independent pediatric network, recognized by L.A. Care with the Social Determinants of Health Award and joining USC's Health Benefits Fair as a Tier 1 partner.",
    excerptEs:
      "Bajo el liderazgo de su fundadora, la Dra. Janesri De Silva, Kids & Teens Medical Group se ha convertido en la red pediátrica independiente más grande del sur de California, reconocida por L.A. Care con el Premio a los Determinantes Sociales de la Salud y participando en la Feria de Beneficios de Salud de USC como socio de Nivel 1.",
    pdfHref: "/media/ktmg-press-release.pdf",
    body: [
      {
        text: "Under the leadership of its esteemed founder, Janesri De Silva, MD, FAAP, a board-certified pediatrician and healthcare leader, the Kids & Teens Medical Group has grown into Southern California's largest independent pediatric network making a difference in children's wellness.",
        textEs:
          "Bajo el liderazgo de su estimada fundadora, Janesri De Silva, MD, FAAP, pediatra certificada por la junta y líder en el sector de la salud, Kids & Teens Medical Group se ha convertido en la red pediátrica independiente más grande del sur de California, marcando la diferencia en el bienestar de los niños.",
      },
      {
        text: "A delegate to the California Medical Association, Dr. De Silva leverages her continued advocacy in the community through her influential vote on key issues and policies for change.",
        textEs:
          "Como delegada ante la Asociación Médica de California, la Dra. De Silva impulsa su defensa continua en la comunidad a través de su voto influyente sobre temas y políticas clave para el cambio.",
      },
      {
        text: "Representing excellence in care, Kids & Teens Medical Group will be participating as a Tier 1 partner at USC's Health Benefits Fair on October 6.",
        textEs:
          "En representación de la excelencia en la atención, Kids & Teens Medical Group participará como socio de Nivel 1 en la Feria de Beneficios de Salud de USC el 6 de octubre.",
      },
      {
        text: "Serving children and families throughout Los Angeles County, \"Our organization has achieved so much since its inception and we look forward to doing even more so every child in every community receives the attention and treatment they deserve,\" states Dr. De Silva.",
        textEs:
          "Al servicio de los niños y las familias de todo el condado de Los Ángeles, la Dra. De Silva afirma: \"Nuestra organización ha logrado muchísimo desde su creación y esperamos hacer aún más para que cada niño de cada comunidad reciba la atención y el tratamiento que merece\".",
      },
      {
        text: "L.A. Care individually recognized her commitment to outstanding care this year with the Social Determinants of Health Award. Kids & Teens Medical Group was further honored by L.A. Care in 2024 with the Health Equity Award, in recognition of its demonstrable work in reducing healthcare disparities and improving outcomes for vulnerable populations.",
        textEs:
          "L.A. Care reconoció individualmente su compromiso con la atención excepcional este año con el Premio a los Determinantes Sociales de la Salud. Kids & Teens Medical Group fue honrado además por L.A. Care en 2024 con el Premio a la Equidad en la Salud, en reconocimiento a su labor demostrable para reducir las disparidades en la atención médica y mejorar los resultados de las poblaciones vulnerables.",
      },
      {
        text: "Since founding the organization in 2007, Dr. De Silva has continued her dedication to advancing health equity, preventive care, and improving access for underserved communities. Under her stewardship, the organization has developed innovative programs focused on community outreach, care coordination, and culturally responsive healthcare delivery.",
        textEs:
          "Desde que fundó la organización en 2007, la Dra. De Silva ha mantenido su dedicación al avance de la equidad en la salud, la atención preventiva y la mejora del acceso para las comunidades desatendidas. Bajo su gestión, la organización ha desarrollado programas innovadores centrados en el alcance comunitario, la coordinación de la atención y una prestación de servicios de salud culturalmente receptiva.",
      },
      {
        text: "This further includes initiatives in Sri Lanka, from which Dr. De Silva is a native, as part of her ongoing effort to bring medical attention and support to communities with limited access to care.",
        textEs:
          "Esto incluye además iniciativas en Sri Lanka, de donde la Dra. De Silva es originaria, como parte de su esfuerzo continuo por llevar atención y apoyo médico a comunidades con acceso limitado a la atención.",
      },
      {
        text: "Wielding her lifelong commitment, Dr. De Silva underscores, \"We are dedicated to ensuring that every child has the opportunity to thrive regardless of socioeconomic background.\"",
        textEs:
          "Fiel a su compromiso de toda la vida, la Dra. De Silva subraya: \"Estamos dedicados a garantizar que cada niño tenga la oportunidad de prosperar, independientemente de su origen socioeconómico\".",
      },
      {
        text: "The Kids & Teens Medical Group further offers a convenient Telehealth service for remote medical consultations wherever the family is, providing direct access to board-certified pediatricians from the comfort of one's couch.",
        textEs:
          "Kids & Teens Medical Group también ofrece un cómodo servicio de Telesalud para consultas médicas a distancia dondequiera que esté la familia, brindando acceso directo a pediatras certificados por la junta desde la comodidad del sofá.",
      },
      {
        text: "The Kids & Teens Medical Group has expanded its highly revered pediatric care across 25 clinic locations throughout Los Angeles and surrounding regions, further establishing why the organization is the largest pediatric medical network in Southern California: Agoura Hills, Arcadia, Beverly Hills, Camarillo, Canyon Country, Culver City, Downey, Glendale, Hollywood, La Cañada, La Mirada, Mission Hills, Northridge, Pasadena, Pico Rivera, San Fernando, San Pedro, Santa Monica, Tarzana, Torrance, Valencia, Van Nuys, West Hills, and Whittier, including its Telehealth service.",
        textEs:
          "Kids & Teens Medical Group ha ampliado su reconocida atención pediátrica a 25 clínicas en Los Ángeles y las regiones circundantes, lo que confirma por qué la organización es la red médica pediátrica más grande del sur de California: Agoura Hills, Arcadia, Beverly Hills, Camarillo, Canyon Country, Culver City, Downey, Glendale, Hollywood, La Cañada, La Mirada, Mission Hills, Northridge, Pasadena, Pico Rivera, San Fernando, San Pedro, Santa Monica, Tarzana, Torrance, Valencia, Van Nuys, West Hills y Whittier, incluido su servicio de Telesalud.",
      },
    ],
  },
];
