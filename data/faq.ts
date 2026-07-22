export type FaqItem = {
  id: string;
  question: string;
  questionEs: string;
  answer: string;
  answerEs: string;
};

export const faqs: FaqItem[] = [
  {
    id: "first-visit",
    question: "What should I bring to my child's first visit?",
    questionEs: "¿Qué debo llevar a la primera visita de mi hijo?",
    answer:
      "Please bring your child's insurance card, a valid photo ID, any previous medical records or immunization history, and a list of current medications. For newborns, bring the hospital discharge paperwork. Arriving 15 minutes early helps us get your paperwork completed smoothly.",
    answerEs:
      "Por favor traiga la tarjeta de seguro de su hijo, una identificación con foto válida, cualquier historial médico o de vacunación previo, y una lista de medicamentos actuales. Para recién nacidos, traiga los documentos de alta del hospital. Llegar 15 minutos antes nos ayuda a completar su papeleo sin contratiempos.",
  },
  {
    id: "walk-ins",
    question: "Do you accept walk-in patients?",
    questionEs: "¿Aceptan pacientes sin cita previa?",
    answer:
      "Yes! We welcome walk-in patients at all of our 25 clinic locations during regular business hours (Mon-Fri, 9AM-6PM). Same-day appointments are also available - you can book online in under a minute or call us directly. Wait times for walk-ins are typically under 30 minutes.",
    answerEs:
      "¡Sí! Recibimos pacientes sin cita previa en las 25 clínicas durante el horario regular (lunes a viernes, 9 a.m. a 6 p.m.). También hay citas disponibles el mismo día: puede reservar en línea en menos de un minuto o llamarnos directamente. El tiempo de espera para pacientes sin cita suele ser menor a 30 minutos.",
  },
  {
    id: "insurance-plans",
    question: "What insurance plans do you accept?",
    questionEs: "¿Qué planes de seguro aceptan?",
    answer:
      "We accept all major insurance plans including HMO, PPO, Medi-Cal, LA Care, Molina Healthcare, Blue Shield, Healthnet, Anthem, Optum, and Regal Medical Group. Coverage is never a barrier to care at our clinics. If you're unsure about your plan, call us and we'll verify your coverage.",
    answerEs:
      "Aceptamos todos los principales planes de seguro, incluyendo HMO, PPO, Medi-Cal, LA Care, Molina Healthcare, Blue Shield, Healthnet, Anthem, Optum y Regal Medical Group. La cobertura nunca es una barrera para la atención en nuestras clínicas. Si no está seguro de su plan, llámenos y verificaremos su cobertura.",
  },
  {
    id: "ages-treated",
    question: "What ages do you treat?",
    questionEs: "¿Qué edades atienden?",
    answer:
      "Kids & Teens Medical Group provides care for patients from birth through age 21. This includes newborns, infants, toddlers, school-age children, adolescents, and young adults. Our St. Gianna Medical Group locations also offer family practice for patients of all ages.",
    answerEs:
      "Kids & Teens Medical Group brinda atención a pacientes desde el nacimiento hasta los 21 años. Esto incluye recién nacidos, bebés, niños pequeños, niños en edad escolar, adolescentes y adultos jóvenes. Nuestras ubicaciones de St. Gianna Medical Group también ofrecen medicina familiar para pacientes de todas las edades.",
  },
  {
    id: "telehealth",
    question: "How does telehealth work?",
    questionEs: "¿Cómo funciona la telesalud?",
    answer:
      "Our telehealth service connects you with your trusted KTMG pediatrician via secure video call. Available Mon-Sat 9AM-9PM and Sundays 12PM-6PM. Simply book online, and you'll receive a link to join your video visit. Your doctor can diagnose, prescribe medications, and send prescriptions directly to your pharmacy - all from the comfort of home.",
    answerEs:
      "Nuestro servicio de telesalud lo conecta con su pediatra de confianza de KTMG mediante videollamada segura. Disponible de lunes a sábado de 9 a.m. a 9 p.m. y domingos de 12 p.m. a 6 p.m. Simplemente reserve en línea y recibirá un enlace para unirse a su visita por video. Su médico puede diagnosticar, recetar medicamentos y enviar las recetas directamente a su farmacia, todo desde la comodidad de su hogar.",
  },
  {
    id: "switch-doctor",
    question: "Can I switch my child's doctor within the network?",
    questionEs: "¿Puedo cambiar el médico de mi hijo dentro de la red?",
    answer:
      "Absolutely. With 89+ providers across 25 locations, you can switch pediatricians at any time. Your child's medical records are centralized and accessible from any KTMG clinic, so there's no paperwork or delays when transitioning to a new provider.",
    answerEs:
      "Por supuesto. Con más de 89 proveedores en 25 ubicaciones, puede cambiar de pediatra en cualquier momento. Los registros médicos de su hijo están centralizados y accesibles desde cualquier clínica de KTMG, por lo que no hay papeleo ni demoras al cambiar de proveedor.",
  },
  {
    id: "after-hours",
    question: "Do you offer after-hours and weekend care?",
    questionEs: "¿Ofrecen atención fuera de horario y los fines de semana?",
    answer:
      "Yes. Our Pediatric After Hours clinics provide evening and weekend urgent care staffed by board-certified pediatricians. Telehealth is also available 7 days a week, including evenings (until 9PM Mon-Sat) and Sundays (12PM-6PM). Your child can always be seen when they need care.",
    answerEs:
      "Sí. Nuestras clínicas Pediatric After Hours brindan atención de urgencia por las tardes y los fines de semana, atendidas por pediatras certificados. La telesalud también está disponible los 7 días de la semana, incluyendo tardes (hasta las 9 p.m. de lunes a sábado) y domingos (12 p.m. a 6 p.m.). Su hijo siempre puede ser atendido cuando lo necesite.",
  },
  {
    id: "transfer-hmo",
    question: "How do I transfer from another HMO/IPA?",
    questionEs: "¿Cómo transfiero desde otro HMO/IPA?",
    answer:
      "Through our Serendib Healthways HMO/IPA, transferring is hassle-free. Our transfer team handles all the paperwork for you. Simply call (626) 655-4041 or visit serendibhealthways.com to schedule a call with our transfer team. The switch can happen immediately in most cases.",
    answerEs:
      "A través de nuestro HMO/IPA Serendib Healthways, la transferencia es sencilla. Nuestro equipo de transferencias se encarga de todo el papeleo por usted. Simplemente llame al (626) 655-4041 o visite serendibhealthways.com para programar una llamada con nuestro equipo de transferencias. El cambio puede ocurrir de inmediato en la mayoría de los casos.",
  },
];
