export type FaqItem = {
  id: string;
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
};

// Drafted from facts already established elsewhere in this codebase (the seed positions,
// the anti-scam notice). The live ktdoctor.com site has no FAQ section to source this
// from; client to confirm/edit before launch, same as the seed position list.
export const careersFaq: FaqItem[] = [
  {
    id: "multiple-positions",
    question: "Can I apply for more than one position?",
    questionEs: "¿Puedo postularme a más de un puesto?",
    answer:
      "Yes. You are welcome to apply to as many open positions as you are qualified for and interested in. Use the position dropdown in the application form to select the role you would like to apply for first, and mention any other roles of interest in your message.",
    answerEs:
      "Sí. Puede postularse a tantos puestos disponibles como esté calificado e interesado. Use el menú desplegable de puesto en el formulario de postulación para seleccionar el puesto al que desea postularse primero, y mencione cualquier otro puesto de su interés en su mensaje.",
  },
  {
    id: "full-part-time",
    question: "Are full-time and part-time opportunities available?",
    questionEs: "¿Hay oportunidades de tiempo completo y medio tiempo disponibles?",
    answer:
      "Yes. Employment type varies by role and is listed on each open position. Check the Open Positions section for the specific schedule of each opening.",
    answerEs:
      "Sí. El tipo de empleo varía según el puesto y se indica en cada vacante. Consulte la sección de Puestos Disponibles para conocer el horario específico de cada vacante.",
  },
  {
    id: "preferred-location",
    question: "Can I select a preferred clinic location?",
    questionEs: "¿Puedo seleccionar una ubicación de clínica preferida?",
    answer:
      "Yes. Many of our openings list specific clinic locations, and our application form lets you note your location preference in your message. We will do our best to match you with a clinic that works for you.",
    answerEs:
      "Sí. Muchas de nuestras vacantes indican ubicaciones de clínica específicas, y nuestro formulario de postulación le permite indicar su ubicación preferida en su mensaje. Haremos todo lo posible para ubicarlo en una clínica que le convenga.",
  },
  {
    id: "referrals",
    question: "Can I refer someone for an opportunity?",
    questionEs: "¿Puedo referir a alguien para una oportunidad?",
    answer:
      "Yes, we welcome referrals. Have the person you are referring apply directly through this page, or email us their information at the address below.",
    answerEs:
      "Sí, con gusto aceptamos referencias. Pida a la persona que refiere que se postule directamente a través de esta página, o envíenos su información por correo electrónico a la dirección indicada abajo.",
  },
  {
    id: "professional-development",
    question: "Does KTMG provide professional development support?",
    questionEs: "¿KTMG ofrece apoyo para el desarrollo profesional?",
    answer:
      "Yes. We support continuing education, licensure, and CME as part of our benefits package. See the Benefits section above for details.",
    answerEs:
      "Sí. Apoyamos la educación continua, las licencias y la CME como parte de nuestro paquete de beneficios. Consulte la sección de Beneficios arriba para más detalles.",
  },
  {
    id: "genuine-postings",
    question: "How will I know whether a job advertisement is genuine?",
    questionEs: "¿Cómo sabré si un anuncio de empleo es genuino?",
    answer:
      "Our official job postings are only shared on our social media pages, our own company websites, and Indeed. If you see a posting anywhere else claiming to represent Kids & Teens Medical Group, treat it as suspicious and contact us directly to confirm.",
    answerEs:
      "Nuestras ofertas de empleo oficiales solo se comparten en nuestras redes sociales, nuestros propios sitios web y en Indeed. Si ve una publicación en cualquier otro lugar que afirme representar a Kids & Teens Medical Group, considérela sospechosa y contáctenos directamente para confirmar.",
  },
  {
    id: "accommodation",
    question: "Can I request an accommodation during recruitment?",
    questionEs: "¿Puedo solicitar una adaptación durante el proceso de reclutamiento?",
    answer:
      "Yes. If you need an accommodation at any point in the application or interview process, let us know in your application message or by emailing us directly, and we will work with you.",
    answerEs:
      "Sí. Si necesita una adaptación en cualquier momento del proceso de postulación o entrevista, avísenos en su mensaje de postulación o escribiéndonos directamente por correo, y trabajaremos con usted.",
  },
];
