export type StorySection = {
  heading: string;
  headingEs: string;
  body: string;
  bodyEs: string;
};

export type Story = {
  id: string;
  title: string;
  titleEs: string;
  date: string;
  author?: string;
  imageSrc: string;
  excerpt: string;
  excerptEs: string;
  sections: StorySection[];
};

export const stories: Story[] = [
  {
    id: "autism-awareness-month",
    title:
      "Supporting Our Young Patients: Celebrating Autism Awareness Month in Pediatric Care",
    titleEs:
      "Apoyando a Nuestros Pacientes Jóvenes: Celebrando el Mes de Concientización sobre el Autismo en la Atención Pediátrica",
    date: "April 5, 2024",
    imageSrc: "/blog-autism-awareness-month.png",
    excerpt:
      "Kids & Teens Medical Group joins the global community each April in recognizing Autism Awareness Month, reflecting on how pediatric care can better support children with autism and their families.",
    excerptEs:
      "Cada mes de abril, Kids & Teens Medical Group se une a la comunidad global para reconocer el Mes de Concientización sobre el Autismo, reflexionando sobre cómo la atención pediátrica puede apoyar mejor a los niños con autismo y a sus familias.",
    sections: [
      {
        heading: "Understanding Autism Spectrum Disorder",
        headingEs: "Entendiendo el Trastorno del Espectro Autista",
        body: "Autism Spectrum Disorder (ASD) is a developmental condition that affects communication, social interaction, and behavior, with a wide range of presentations and needs from child to child.",
        bodyEs: "El Trastorno del Espectro Autista (TEA) es una condición del desarrollo que afecta la comunicación, la interacción social y el comportamiento, con una amplia variedad de manifestaciones y necesidades de un niño a otro.",
      },
      {
        heading: "Supporting Children with Autism and Their Families",
        headingEs: "Apoyando a los Niños con Autismo y a sus Familias",
        body: "As pediatric providers, we aim to create a welcoming, supportive environment through individualized care, sensory-friendly spaces, clear communication, collaboration with specialists and schools, and ongoing support and resources for families.",
        bodyEs: "Como proveedores pediátricos, buscamos crear un entorno cálido y de apoyo mediante atención individualizada, espacios amigables a nivel sensorial, comunicación clara, colaboración con especialistas y escuelas, y apoyo continuo con recursos para las familias.",
      },
      {
        heading: "Raising Awareness",
        headingEs: "Generando Conciencia",
        body: "Autism Awareness Month is an opportunity for pediatric practices to educate staff, engage with the local community through outreach and events, and empower children with autism and their families to advocate for their needs.",
        bodyEs: "El Mes de Concientización sobre el Autismo es una oportunidad para que las consultas pediátricas capaciten a su personal, se conecten con la comunidad local mediante actividades y eventos, y ayuden a los niños con autismo y a sus familias a defender sus necesidades.",
      },
    ],
  },
  {
    id: "breathe-easy-this-winter",
    title: "Breathe Easy This Winter: Simple Steps to Protect Your Child from Asthma",
    titleEs: "Respire Tranquilo Este Invierno: Pasos Sencillos para Proteger a su Hijo del Asma",
    date: "December 13, 2023",
    author: "Dr. Janesri De Silva",
    imageSrc: "/blog-breathe-easy-this-winter.png",
    excerpt:
      "Winter weather can be tough on kids with asthma. Dr. Janesri De Silva shares practical, real-world steps families can take to keep symptoms under control through the colder months.",
    excerptEs:
      "El clima invernal puede ser difícil para los niños con asma. La Dra. Janesri De Silva comparte pasos prácticos y realistas que las familias pueden tomar para mantener los síntomas bajo control durante los meses más fríos.",
    sections: [
      {
        heading: "Cold Air Precautions",
        headingEs: "Precauciones con el Aire Frío",
        body: "Cold winter air can trigger asthma symptoms, so it helps to have your child wear a scarf or mask outdoors, limit time in especially cold weather, and keep an eye on local air quality.",
        bodyEs: "El aire frío del invierno puede desencadenar síntomas de asma, así que ayuda que su hijo use una bufanda o mascarilla al aire libre, limite el tiempo en climas especialmente fríos, y esté atento a la calidad del aire local.",
      },
      {
        heading: "Indoor Air Quality",
        headingEs: "Calidad del Aire Interior",
        body: "What's in the air at home matters too. Keeping the house clean, avoiding smoke exposure, maintaining humidity between 30 and 50 percent, and using a HEPA filter can all help cut down on common indoor triggers like dust and allergens.",
        bodyEs: "Lo que hay en el aire de casa también importa. Mantener la casa limpia, evitar la exposición al humo, conservar la humedad entre el 30 y el 50 por ciento, y usar un filtro HEPA ayudan a reducir desencadenantes comunes en interiores como el polvo y los alérgenos.",
      },
      {
        heading: "Regular Asthma Check-ups",
        headingEs: "Chequeos Regulares de Asma",
        body: "Even when symptoms feel well controlled, regular visits let your pediatrician adjust medications and offer personalized guidance for the winter months.",
        bodyEs: "Incluso cuando los síntomas parecen estar bien controlados, las visitas regulares permiten que su pediatra ajuste los medicamentos y ofrezca orientación personalizada para los meses de invierno.",
      },
      {
        heading: "Flu Vaccination",
        headingEs: "Vacunación contra la Gripe",
        body: "An annual flu shot is especially important for children with asthma, since the flu can make respiratory symptoms worse and raise the risk of a serious asthma flare-up.",
        bodyEs: "La vacuna anual contra la gripe es especialmente importante para los niños con asma, ya que la gripe puede empeorar los síntomas respiratorios y aumentar el riesgo de una crisis de asma grave.",
      },
      {
        heading: "Additional Tips for Parents",
        headingEs: "Consejos Adicionales para los Padres",
        body: "It helps to know your child's specific triggers, have an asthma action plan in place with your pediatrician, talk with your child about their condition in an age-appropriate way, and always keep rescue medication on hand.",
        bodyEs: "Ayuda conocer los desencadenantes específicos de su hijo, contar con un plan de acción para el asma junto con su pediatra, hablar con su hijo sobre su condición de una manera apropiada para su edad, y tener siempre a mano el medicamento de rescate.",
      },
    ],
  },
  {
    id: "halloween-safety-tips",
    title: "Halloween Safety Tips for Parents",
    titleEs: "Consejos de Seguridad para Halloween para los Padres",
    date: "October 21, 2023",
    author: "Dr. Janesri De Silva",
    imageSrc: "/blog-halloween-safety-tips.png",
    excerpt:
      "Halloween is one of the most exciting nights of the year for kids. A little planning around bedtime, costumes, and candy can help make it a safe one too.",
    excerptEs:
      "Halloween es una de las noches más emocionantes del año para los niños. Un poco de planificación con la hora de dormir, los disfraces y los dulces puede ayudar a que también sea una noche segura.",
    sections: [
      {
        heading: "Set a Bedtime and Plan Ahead",
        headingEs: "Establezca una Hora de Dormir y Planifique con Anticipación",
        body: "Talk with your kids about bedtime expectations ahead of time, since Halloween excitement can easily throw off routines.",
        bodyEs: "Hable con sus hijos sobre las expectativas de la hora de dormir con anticipación, ya que la emoción de Halloween puede alterar fácilmente las rutinas.",
      },
      {
        heading: "Safety for Older Kids",
        headingEs: "Seguridad para los Niños Mayores",
        body: "For kids trick-or-treating without direct supervision, set clear boundaries on where they can go, have them carry a flashlight or wear glow-in-the-dark gear, remind them to use crosswalks, and encourage them to stick together in a group.",
        bodyEs: "Para los niños que piden dulces sin supervisión directa, establezca límites claros sobre a dónde pueden ir, pídales que lleven una linterna o usen accesorios que brillen en la oscuridad, recuérdeles usar los cruces peatonales, y anímelos a mantenerse juntos en grupo.",
      },
      {
        heading: "Candy Rules",
        headingEs: "Reglas para los Dulces",
        body: "Set expectations for how much candy is okay to eat that night, check treats for any open wrappers or signs of tampering, and make sure kids know not to eat anything unwrapped or homemade from someone they don't know.",
        bodyEs: "Establezca expectativas sobre cuántos dulces está bien comer esa noche, revise los dulces por envolturas abiertas o señales de manipulación, y asegúrese de que los niños sepan que no deben comer nada sin envoltura o casero que reciban de alguien que no conocen.",
      },
      {
        heading: "Costume Safety",
        headingEs: "Seguridad en los Disfraces",
        body: "Choose flame-resistant costumes, add reflective tape or glowsticks for visibility after dark, and skip masks or costumes that make it hard to see or move comfortably.",
        bodyEs: "Elija disfraces resistentes al fuego, agregue cinta reflectante o barras luminosas para mayor visibilidad después del anochecer, y evite máscaras o disfraces que dificulten ver o moverse cómodamente.",
      },
      {
        heading: "Planning Ahead",
        headingEs: "Planificando con Anticipación",
        body: "Plan costumes early to avoid last-minute stress, use non-toxic, skin-friendly makeup, and double check that your child can see and move well in their costume.",
        bodyEs: "Planifique los disfraces con anticipación para evitar el estrés de último momento, use maquillaje no tóxico y apto para la piel, y verifique que su hijo pueda ver y moverse bien con su disfraz.",
      },
      {
        heading: "Encourage Communication",
        headingEs: "Fomente la Comunicación",
        body: "Keep the conversation open with your kids about Halloween so you can address any worries and set expectations together.",
        bodyEs: "Mantenga una conversación abierta con sus hijos sobre Halloween para poder abordar cualquier preocupación y establecer expectativas juntos.",
      },
      {
        heading: "Alternatives to Trick-or-Treating",
        headingEs: "Alternativas para Pedir Dulces",
        body: "If trick-or-treating isn't the right fit this year, a movie night, an arts and crafts project, or decorating the house and handing out treats at home can be just as fun.",
        bodyEs: "Si pedir dulces no es la opción adecuada este año, una noche de película, un proyecto de manualidades, o decorar la casa y repartir dulces desde ahí pueden ser igual de divertidos.",
      },
      {
        heading: "Enjoy the Precious Time Together",
        headingEs: "Disfruten el Tiempo Juntos",
        body: "Whatever you choose to do, Halloween is a great chance to spend quality time together as a family.",
        bodyEs: "Cualquiera sea la actividad que elijan, Halloween es una gran oportunidad para pasar tiempo de calidad en familia.",
      },
    ],
  },
  {
    id: "er-vs-urgent-care",
    title: "The Difference between Pediatric Emergency Room & Urgent Care in California",
    titleEs: "La Diferencia entre la Sala de Emergencias Pediátrica y la Atención de Urgencia en California",
    date: "August 23, 2023",
    imageSrc: "/blog-er-vs-urgent-care.png",
    excerpt:
      "Knowing whether to head to the pediatric ER or an urgent care center can make all the difference when your child needs care fast. Here's how to tell which is right for the moment.",
    excerptEs:
      "Saber si debe ir a la sala de emergencias pediátrica o a un centro de atención de urgencia puede marcar la diferencia cuando su hijo necesita atención rápida. Así puede saber cuál es la opción correcta para el momento.",
    sections: [
      {
        heading: "Understanding Pediatric Emergency Rooms",
        headingEs: "Entendiendo las Salas de Emergencias Pediátricas",
        body: "Pediatric ERs are built for severe, life-threatening conditions that need immediate, intensive care, staffed by pediatric specialists with access to advanced equipment for cases like serious injuries, breathing difficulties, or seizures.",
        bodyEs: "Las salas de emergencias pediátricas están diseñadas para condiciones graves que ponen en riesgo la vida y necesitan atención inmediata e intensiva, con especialistas pediátricos que tienen acceso a equipo avanzado para casos como lesiones graves, dificultad para respirar o convulsiones.",
      },
      {
        heading: "Exploring Urgent Care Centers",
        headingEs: "Conociendo los Centros de Atención de Urgencia",
        body: "Urgent care centers handle non-critical situations that still need prompt attention, like minor cuts, sprains, moderate infections, or a mild fever.",
        bodyEs: "Los centros de atención de urgencia manejan situaciones no críticas que aún necesitan atención rápida, como cortes menores, esguinces, infecciones moderadas o fiebre leve.",
      },
      {
        heading: "When to Choose the Emergency Room",
        headingEs: "Cuándo Elegir la Sala de Emergencias",
        body: "Head straight to the ER for anything potentially life-threatening, such as severe burns, head injuries, severe allergic reactions, or trouble breathing.",
        bodyEs: "Diríjase directamente a la sala de emergencias ante cualquier situación que pueda poner en riesgo la vida, como quemaduras graves, lesiones en la cabeza, reacciones alérgicas severas o dificultad para respirar.",
      },
      {
        heading: "When to Opt for Urgent Care",
        headingEs: "Cuándo Optar por la Atención de Urgencia",
        body: "Urgent care is a great fit for non-severe needs outside regular office hours, like ear infections or minor fractures, usually with shorter wait times than the ER.",
        bodyEs: "La atención de urgencia es una excelente opción para necesidades no graves fuera del horario regular de consulta, como infecciones de oído o fracturas menores, generalmente con tiempos de espera más cortos que en la sala de emergencias.",
      },
      {
        heading: "Staff Qualifications and Facilities",
        headingEs: "Calificaciones del Personal e Instalaciones",
        body: "Pediatric ERs are staffed by pediatricians and pediatric nurses with advanced diagnostic and treatment equipment, while urgent care centers have qualified medical staff and more basic capabilities suited to non-emergent care.",
        bodyEs: "Las salas de emergencias pediátricas cuentan con pediatras y enfermeras pediátricas con equipo avanzado de diagnóstico y tratamiento, mientras que los centros de atención de urgencia tienen personal médico calificado con capacidades más básicas, adecuadas para atención no urgente.",
      },
      {
        heading: "Cost and Wait Times",
        headingEs: "Costo y Tiempos de Espera",
        body: "Urgent care tends to be a more cost-effective option with shorter wait times for non-life-threatening issues, while ERs prioritize by severity of condition.",
        bodyEs: "La atención de urgencia suele ser una opción más económica con tiempos de espera más cortos para problemas que no ponen en riesgo la vida, mientras que las salas de emergencias priorizan según la gravedad de la condición.",
      },
      {
        heading: "Choosing the Right Option",
        headingEs: "Eligiendo la Opción Correcta",
        body: "When in doubt, let the severity of the situation guide you: life-threatening conditions belong in the ER, while non-emergent urgent needs are well suited to urgent care.",
        bodyEs: "Ante la duda, deje que la gravedad de la situación lo guíe: las condiciones que ponen en riesgo la vida corresponden a la sala de emergencias, mientras que las necesidades urgentes no críticas se atienden bien en un centro de atención de urgencia.",
      },
    ],
  },
];
