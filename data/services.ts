export type Benefit = {
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
};

export type Service = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  longDescription: string;
  longDescriptionEs: string;
  imageSrc?: string;
  imageAlt?: string;
  imageAltEs?: string;
  imageAspectClass?: string;
  benefits?: Benefit[];
  howItWorks?: string;
  howItWorksEs?: string;
  showSchedule?: boolean;
};

export type ServiceCategory = {
  id: string;
  name: string;
  nameEs: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "preventive-wellness",
    name: "Preventive & Wellness Care",
    nameEs: "Atención Preventiva y de Bienestar",
    services: [
      {
        id: "well-child-exam",
        name: "Well Child Exam",
        nameEs: "Examen de Niño Sano",
        description: "Routine preventive wellness checkups tracking growth and development at every age.",
        descriptionEs: "Chequeos preventivos de rutina que dan seguimiento al crecimiento y desarrollo a cada edad.",
        longDescription: "Well child exams are routine visits from infancy through the teen years that track your child's growth, development, and overall health. Each visit covers physical growth, developmental milestones, vaccinations, nutrition, and behavioral health, with guidance tailored to your child's age. These regular checkups help our pediatricians catch potential concerns early, before they become bigger problems.",
        longDescriptionEs: "Los exámenes de niño sano son visitas de rutina desde la infancia hasta la adolescencia que dan seguimiento al crecimiento, desarrollo y salud general de su hijo. Cada visita abarca el crecimiento físico, los hitos del desarrollo, las vacunas, la nutrición y la salud conductual, con orientación adaptada a la edad de su hijo. Estos chequeos regulares ayudan a nuestros pediatras a detectar posibles problemas a tiempo, antes de que se conviertan en algo mayor.",
      },
      {
        id: "physicals",
        name: "Physicals",
        nameEs: "Exámenes Físicos",
        description: "Routine health examinations, including sports and school physicals.",
        descriptionEs: "Exámenes de salud de rutina, incluyendo físicos deportivos y escolares.",
        longDescription: "Following American Academy of Pediatrics guidelines, we recommend regular physical exams from infancy through age 21 to track immunizations, growth, and development. These visits give you a chance to discuss any health concerns while your pediatrician confirms your child is on a healthy path. Physicals can be scheduled online or by phone, whether for a routine checkup or a specific concern like a sports or school physical.",
        longDescriptionEs: "Siguiendo las pautas de la Academia Americana de Pediatría, recomendamos exámenes físicos regulares desde la infancia hasta los 21 años para dar seguimiento a las vacunas, el crecimiento y el desarrollo. Estas visitas le dan la oportunidad de conversar sobre cualquier inquietud de salud mientras su pediatra confirma que su hijo va por buen camino. Los exámenes físicos se pueden programar en línea o por teléfono, ya sea para un chequeo de rutina o para una necesidad específica, como un físico deportivo o escolar.",
      },
      {
        id: "free-vaccines",
        name: "Free Vaccines",
        nameEs: "Vacunas Gratuitas",
        description: "Complimentary childhood immunizations for eligible patients.",
        descriptionEs: "Inmunizaciones infantiles gratuitas para pacientes elegibles.",
        longDescription: "Through the state's Child Health and Disability Prevention program, we provide free vaccinations for eligible children and teens. Our board-certified pediatricians administer all CDC-recommended vaccines to help protect your child and the community from preventable diseases. Ask your pediatrician about the recommended immunization schedule at your next visit.",
        longDescriptionEs: "A través del programa estatal de Prevención de Discapacidades y Salud Infantil, ofrecemos vacunas gratuitas para niños y adolescentes elegibles. Nuestros pediatras certificados administran todas las vacunas recomendadas por los CDC para ayudar a proteger a su hijo y a la comunidad de enfermedades prevenibles. Consulte con su pediatra sobre el calendario de vacunación recomendado en su próxima visita.",
      },
      {
        id: "covid-19-vaccine",
        name: "COVID-19 Vaccine",
        nameEs: "Vacuna contra el COVID-19",
        description: "Vaccination services to help protect your child against COVID-19.",
        descriptionEs: "Servicios de vacunación para ayudar a proteger a su hijo contra el COVID-19.",
        longDescription: "We offer COVID-19 vaccinations, including initial doses and boosters, for patients across our clinics. Vaccines undergo rigorous testing and have proven highly effective at preventing severe illness and hospitalization. Getting vaccinated helps protect your family and contributes to community immunity for those most vulnerable.",
        longDescriptionEs: "Ofrecemos vacunas contra el COVID-19, incluyendo dosis iniciales y refuerzos, para pacientes en todas nuestras clínicas. Las vacunas se someten a pruebas rigurosas y han demostrado ser altamente eficaces para prevenir enfermedades graves y hospitalizaciones. Vacunarse ayuda a proteger a su familia y contribuye a la inmunidad comunitaria para los más vulnerables.",
      },
      {
        id: "nutrition",
        name: "Nutrition",
        nameEs: "Nutrición",
        description: "Dietary guidance and nutritional support for growing children.",
        descriptionEs: "Orientación alimentaria y apoyo nutricional para niños en crecimiento.",
        longDescription: "Proper nutrition is the foundation of a healthy childhood, and our pediatric team offers dietary assessments and personalized nutrition guidance at every stage. From feeding guidance for infants to healthy eating education for school-age children and teens, we tailor our approach to your child's developmental needs. We also support families working on weight management with practical, judgment-free guidance.",
        longDescriptionEs: "Una buena nutrición es la base de una infancia saludable, y nuestro equipo pediátrico ofrece evaluaciones dietéticas y orientación nutricional personalizada en cada etapa. Desde la orientación alimentaria para bebés hasta la educación sobre alimentación saludable para niños en edad escolar y adolescentes, adaptamos nuestro enfoque a las necesidades de desarrollo de su hijo. También apoyamos a las familias que trabajan en el manejo de peso con orientación práctica y sin juicios.",
      },
    ],
  },
  {
    id: "newborn-family",
    name: "Newborn & Family Care",
    nameEs: "Atención al Recién Nacido y la Familia",
    services: [
      {
        id: "newborn-care",
        name: "Newborn Care",
        nameEs: "Cuidado del Recién Nacido",
        description: "Dedicated care for infants from their very first days.",
        descriptionEs: "Atención dedicada para bebés desde sus primeros días.",
        longDescription: "Our board-certified pediatricians provide comprehensive care for newborns, from monitoring growth and development to guiding feeding and nutrition. Visits include age-appropriate vaccinations, developmental milestone tracking, and guidance on sleep, diapering, and other early parenting questions. We also offer free meet-and-greet consultations so you can get to know your pediatrician before your baby arrives.",
        longDescriptionEs: "Nuestros pediatras certificados brindan atención integral para recién nacidos, desde el monitoreo del crecimiento y desarrollo hasta la orientación sobre alimentación y nutrición. Las visitas incluyen vacunas adecuadas para la edad, seguimiento de hitos del desarrollo y orientación sobre el sueño, el cambio de pañales y otras dudas de la crianza temprana. También ofrecemos consultas gratuitas de bienvenida para que pueda conocer a su pediatra antes de que llegue su bebé.",
      },
      {
        id: "expectant-parents",
        name: "Expectant Parents",
        nameEs: "Padres en Espera",
        description: "Prenatal guidance to help new parents prepare before baby arrives.",
        descriptionEs: "Orientación prenatal para ayudar a los nuevos padres a prepararse antes de la llegada del bebé.",
        longDescription: "We offer free meet-and-greet consultations for expectant parents, giving you the chance to meet and choose a pediatrician before your baby is born. Once your baby arrives, we coordinate care at partner hospitals and schedule a follow-up visit within 24 to 48 hours of discharge. Our team can also help guide you through insurance enrollment and what to expect at your baby's first pediatric visits.",
        longDescriptionEs: "Ofrecemos consultas gratuitas de bienvenida para padres en espera, dándole la oportunidad de conocer y elegir a un pediatra antes de que nazca su bebé. Una vez que llega su bebé, coordinamos la atención en los hospitales asociados y programamos una visita de seguimiento dentro de las 24 a 48 horas posteriores al alta. Nuestro equipo también puede ayudarlo a orientarse sobre la inscripción al seguro y qué esperar en las primeras visitas pediátricas de su bebé.",
      },
      {
        id: "circumcisions",
        name: "Circumcisions",
        nameEs: "Circuncisiones",
        description: "Circumcision procedures for newborns and children.",
        descriptionEs: "Procedimientos de circuncisión para recién nacidos y niños.",
        longDescription: "We offer circumcision procedures for newborns and children performed by qualified physicians, with anesthesia used to minimize discomfort. Circumcision is a personal decision for every family, and our team is happy to discuss the potential benefits and considerations so you can make the choice that's right for your child. Clear post-procedure care instructions are provided to support healing.",
        longDescriptionEs: "Ofrecemos procedimientos de circuncisión para recién nacidos y niños realizados por médicos calificados, con anestesia para minimizar las molestias. La circuncisión es una decisión personal de cada familia, y nuestro equipo está disponible para conversar sobre los posibles beneficios y consideraciones para que pueda tomar la decisión adecuada para su hijo. Se brindan instrucciones claras de cuidado posterior al procedimiento para apoyar la recuperación.",
      },
    ],
  },
  {
    id: "sick-urgent",
    name: "Sick & Urgent Care",
    nameEs: "Atención de Enfermedades y Urgencias",
    services: [
      {
        id: "sick-visits",
        name: "Sick Visits",
        nameEs: "Visitas por Enfermedad",
        description: "Prompt treatment for acute illnesses when your child isn't feeling well.",
        descriptionEs: "Tratamiento oportuno para enfermedades agudas cuando su hijo no se siente bien.",
        longDescription: "When your child isn't feeling well, our same-day sick visits give you fast access to a pediatrician who can diagnose and treat acute illnesses and minor injuries. Appointments can be scheduled online or by phone, and telehealth options are available for added convenience. Beyond sick visits, our locations also offer vaccinations, sports injury care, and other pediatric services your family may need.",
        longDescriptionEs: "Cuando su hijo no se siente bien, nuestras visitas por enfermedad el mismo día le dan acceso rápido a un pediatra que puede diagnosticar y tratar enfermedades agudas y lesiones menores. Las citas se pueden programar en línea o por teléfono, y también hay opciones de telesalud disponibles para mayor comodidad. Además de las visitas por enfermedad, nuestras ubicaciones también ofrecen vacunas, atención de lesiones deportivas y otros servicios pediátricos que su familia pueda necesitar.",
      },
      {
        id: "same-day-appointments",
        name: "Same-Day Appointments",
        nameEs: "Citas el Mismo Día",
        description: "Urgent care made easy with same-day scheduling at most locations.",
        descriptionEs: "Atención de urgencia sencilla con citas disponibles el mismo día en la mayoría de las ubicaciones.",
        longDescription: "We know that when your child is sick or hurt, timely care matters, which is why we offer same-day appointments at our clinics across Greater LA. You can schedule by phone, online, or through after-hours telehealth, so care is available when you need it most. Same-day scheduling means less time worrying and more time getting your child the attention they need.",
        longDescriptionEs: "Sabemos que cuando su hijo está enfermo o lastimado, la atención oportuna importa, por eso ofrecemos citas el mismo día en nuestras clínicas de toda el área de Los Ángeles. Puede programar por teléfono, en línea o mediante telesalud fuera de horario, para que la atención esté disponible cuando más la necesite. Las citas el mismo día significan menos tiempo preocupándose y más tiempo consiguiendo la atención que su hijo necesita.",
        imageSrc: "/services/same-day-appointments.jpg",
        imageAlt: "A pediatrician smiling with a young child holding a teddy bear",
        imageAltEs: "Una pediatra sonriendo con una niña pequeña que sostiene un osito de peluche",
      },
      {
        id: "walk-ins",
        name: "Walk-Ins",
        nameEs: "Visitas sin Cita",
        description: "Unscheduled visits welcome for urgent needs.",
        descriptionEs: "Visitas sin cita previa bienvenidas para necesidades urgentes.",
        longDescription: "Walk-in visits are welcome at our clinics for common illnesses, minor injuries, infections, allergies, and other unexpected health concerns. Our pediatricians provide prompt, experienced care without requiring an appointment ahead of time. It's a convenient option for families who need pediatric care right away.",
        longDescriptionEs: "Las visitas sin cita previa son bienvenidas en nuestras clínicas para enfermedades comunes, lesiones menores, infecciones, alergias y otras preocupaciones de salud inesperadas. Nuestros pediatras brindan atención rápida y experimentada sin necesidad de programar una cita con anticipación. Es una opción conveniente para familias que necesitan atención pediátrica de inmediato.",
      },
      {
        id: "telehealth",
        name: "Telehealth",
        nameEs: "Telesalud",
        description: "Remote medical consultations from wherever your family is.",
        descriptionEs: "Consultas médicas remotas desde donde se encuentre su familia.",
        longDescription: "Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home. Pediatricians can evaluate concerns, offer medical advice, and provide treatment recommendations with the same care and attention as an in-person visit. It's a flexible option for busy families or when getting to a clinic isn't easy.",
        longDescriptionEs: "Nuestras consultas de telesalud le permiten conectarse con un pediatra certificado de forma remota a través de una plataforma virtual segura, sin necesidad de salir de casa. Los pediatras pueden evaluar inquietudes, ofrecer consejos médicos y brindar recomendaciones de tratamiento con el mismo cuidado y atención que una visita en persona. Es una opción flexible para familias ocupadas o cuando llegar a una clínica no es fácil.",
        imageSrc: "/services/telehealth.jpg",
        imageAlt: "A pediatrician in a white coat taking notes during a video telehealth visit with a patient on a laptop",
        imageAltEs: "Una pediatra con bata blanca tomando notas durante una visita de telesalud por video con un paciente en una computadora portátil",
        imageAspectClass: "aspect-square",
        benefits: [
          {
            title: "Convenience",
            titleEs: "Comodidad",
            description: "Connect with your pediatrician from home, with no commute or waiting room.",
            descriptionEs: "Conéctese con su pediatra desde casa, sin traslados ni sala de espera.",
          },
          {
            title: "Quick Access",
            titleEs: "Acceso Rápido",
            description: "Reach a board-certified pediatrician quickly when your family needs care.",
            descriptionEs: "Comuníquese rápidamente con un pediatra certificado cuando su familia necesite atención.",
          },
          {
            title: "Flexible Scheduling",
            titleEs: "Horarios Flexibles",
            description: "Book visits that fit around school, work, and a busy family day.",
            descriptionEs: "Programe visitas que se ajusten a la escuela, el trabajo y el día ocupado de la familia.",
          },
          {
            title: "Continuity of Care",
            titleEs: "Continuidad en la Atención",
            description: "Stay with the same trusted team that already knows your child's history.",
            descriptionEs: "Continúe con el mismo equipo de confianza que ya conoce el historial de su hijo.",
          },
          {
            title: "Privacy and Comfort",
            titleEs: "Privacidad y Comodidad",
            description: "Talk with your pediatrician from a secure, familiar setting for your child.",
            descriptionEs: "Hable con su pediatra desde un entorno seguro y familiar para su hijo.",
          },
        ],
        howItWorks:
          "Once your visit is scheduled, you will receive instructions to join a secure, user-friendly virtual platform. During the consultation, your pediatrician will listen to your concerns, provide medical advice, offer treatment recommendations, and answer any questions you may have.",
        howItWorksEs:
          "Una vez programada su visita, recibirá instrucciones para unirse a una plataforma virtual segura y fácil de usar. Durante la consulta, su pediatra escuchará sus inquietudes, le dará consejos médicos, ofrecerá recomendaciones de tratamiento y responderá cualquier pregunta que tenga.",
        showSchedule: true,
      },
      {
        id: "pediatric-infectious-disease",
        name: "Pediatric Infectious Disease",
        nameEs: "Enfermedades Infecciosas Pediátricas",
        description: "Diagnosis and treatment of infections in children.",
        descriptionEs: "Diagnóstico y tratamiento de infecciones en niños.",
        longDescription: "Our pediatricians diagnose and treat a range of infectious diseases in children and teens, working closely with families to build a treatment plan suited to their child's needs. Care spans prevention, diagnosis, and treatment, paired with clear education so families understand their child's condition. Compassionate, collaborative care is at the center of how we approach every case.",
        longDescriptionEs: "Nuestros pediatras diagnostican y tratan una variedad de enfermedades infecciosas en niños y adolescentes, trabajando de cerca con las familias para crear un plan de tratamiento adecuado a las necesidades de su hijo. La atención abarca la prevención, el diagnóstico y el tratamiento, junto con educación clara para que las familias comprendan la condición de su hijo. La atención compasiva y colaborativa está en el centro de cómo abordamos cada caso.",
      },
      {
        id: "sports-injuries",
        name: "Sports Injuries",
        nameEs: "Lesiones Deportivas",
        description: "Specialized care to get young athletes back in the game safely.",
        descriptionEs: "Atención especializada para que los jóvenes atletas vuelvan al juego de forma segura.",
        longDescription: "Active kids sometimes get hurt, and our board-certified pediatricians offer prompt evaluation and treatment for pediatric sports injuries. With urgent care available seven days a week, in person, online, or via after-hours telehealth, your young athlete can get back in the game safely. Multiple locations across Greater LA make it easy to find care close to home.",
        longDescriptionEs: "A veces los niños activos se lastiman, y nuestros pediatras certificados ofrecen evaluación y tratamiento oportunos para lesiones deportivas pediátricas. Con atención de urgencia disponible los siete días de la semana, en persona, en línea o mediante telesalud fuera de horario, su joven atleta puede volver al juego de forma segura. Varias ubicaciones en toda el área de Los Ángeles facilitan encontrar atención cerca de casa.",
      },
    ],
  },
  {
    id: "behavioral-developmental",
    name: "Behavioral & Developmental Health",
    nameEs: "Salud Conductual y del Desarrollo",
    services: [
      {
        id: "adhd-behavioral-issues",
        name: "ADHD & Behavioral Issues",
        nameEs: "TDAH y Problemas de Conducta",
        description: "Comprehensive care and support for ADHD and behavioral concerns.",
        descriptionEs: "Atención integral y apoyo para el TDAH y problemas de conducta.",
        longDescription: "We provide comprehensive evaluation, diagnosis, and ongoing management of ADHD and related behavioral concerns in children and teens. Our pediatricians monitor patients regularly, adjusting care as needed, and refer more complex cases to behavioral therapy or psychiatric specialists. Both in-person and telehealth visits are available across our Southern California locations.",
        longDescriptionEs: "Brindamos evaluación integral, diagnóstico y manejo continuo del TDAH y problemas de conducta relacionados en niños y adolescentes. Nuestros pediatras monitorean a los pacientes regularmente, ajustando la atención según sea necesario, y refieren los casos más complejos a terapia conductual o especialistas psiquiátricos. Hay visitas en persona y por telesalud disponibles en todas nuestras ubicaciones del sur de California.",
      },
      {
        id: "autism-developmental-disorders",
        name: "Autism & Developmental Disorders",
        nameEs: "Autismo y Trastornos del Desarrollo",
        description: "Specialized support for children with autism and developmental conditions.",
        descriptionEs: "Apoyo especializado para niños con autismo y condiciones del desarrollo.",
        longDescription: "Our pediatricians offer specialized evaluation and ongoing management for children with autism and other developmental or behavioral disorders. We coordinate with specialists and schools, reviewing educational documents to help guide families toward the right interventions and support services. Monitoring is tailored to each child's needs, from more frequent visits to periodic check-ins.",
        longDescriptionEs: "Nuestros pediatras ofrecen evaluación especializada y manejo continuo para niños con autismo y otros trastornos del desarrollo o de conducta. Coordinamos con especialistas y escuelas, revisando documentos educativos para ayudar a guiar a las familias hacia las intervenciones y servicios de apoyo adecuados. El seguimiento se adapta a las necesidades de cada niño, desde visitas más frecuentes hasta controles periódicos.",
      },
      {
        id: "childhood-obesity-weight-management",
        name: "Childhood Obesity & Weight Management",
        nameEs: "Obesidad Infantil y Manejo de Peso",
        description: "Programs supporting healthy weight and lifestyle habits for the whole family.",
        descriptionEs: "Programas que apoyan un peso saludable y hábitos de vida para toda la familia.",
        longDescription: "Developed in partnership with Children's Hospital Los Angeles, our weight management program supports children and families addressing childhood obesity. The program includes monthly monitoring visits (in-person or via telehealth), periodic lab work based on individual risk factors, and weekly educational classes. It's a comprehensive, judgment-free approach to building healthier habits as a family.",
        longDescriptionEs: "Desarrollado en colaboración con el Children's Hospital Los Angeles, nuestro programa de manejo de peso apoya a niños y familias que enfrentan la obesidad infantil. El programa incluye visitas de seguimiento mensuales (en persona o por telesalud), análisis de laboratorio periódicos según los factores de riesgo individuales, y clases educativas semanales. Es un enfoque integral y sin juicios para construir hábitos más saludables en familia.",
      },
    ],
  },
  {
    id: "specialty-adolescent",
    name: "Specialty & Adolescent Care",
    nameEs: "Atención Especializada y para Adolescentes",
    services: [
      {
        id: "asthma-allergy-center",
        name: "Asthma & Allergy Center",
        nameEs: "Centro de Asma y Alergias",
        description: "Specialized care for respiratory symptoms and allergic conditions.",
        descriptionEs: "Atención especializada para síntomas respiratorios y condiciones alérgicas.",
        longDescription: "Our Asthma & Allergy Center offers ongoing monitoring and personalized care for children living with asthma or allergies. Depending on your child's needs, we may recommend regular check-ins, medication review, a customized asthma action plan, and asthma education to help manage symptoms day to day. If your child is wheezing, coughing, or has chest tightness, our team can help identify triggers and build a treatment plan that works for your family.",
        longDescriptionEs: "Nuestro Centro de Asma y Alergias ofrece seguimiento continuo y atención personalizada para niños que viven con asma o alergias. Según las necesidades de su hijo, podemos recomendar controles regulares, revisión de medicamentos, un plan de acción personalizado para el asma y educación sobre el asma para ayudar a manejar los síntomas día a día. Si su hijo tiene sibilancias, tos o presión en el pecho, nuestro equipo puede ayudar a identificar los desencadenantes y crear un plan de tratamiento adecuado para su familia.",
      },
      {
        id: "allergies",
        name: "Allergies",
        nameEs: "Alergias",
        description: "Treatment for a range of childhood allergic conditions.",
        descriptionEs: "Tratamiento para una variedad de condiciones alérgicas infantiles.",
        longDescription: "Childhood allergies can show up in many ways, from persistent cold-like symptoms to skin reactions and digestive issues. Our board-certified pediatricians offer testing, allergen avoidance guidance, medication management, and immunotherapy options tailored to your child's needs. With multiple locations across Greater LA, expert allergy care is never far away.",
        longDescriptionEs: "Las alergias infantiles pueden manifestarse de muchas formas, desde síntomas persistentes parecidos a un resfriado hasta reacciones en la piel y problemas digestivos. Nuestros pediatras certificados ofrecen pruebas, orientación para evitar alérgenos, manejo de medicamentos y opciones de inmunoterapia adaptadas a las necesidades de su hijo. Con varias ubicaciones en toda el área de Los Ángeles, la atención experta en alergias nunca está lejos.",
      },
      {
        id: "adolescent-medicine",
        name: "Adolescent Medicine",
        nameEs: "Medicina del Adolescente",
        description: "Healthcare tailored specifically to the needs of teenagers.",
        descriptionEs: "Atención médica adaptada específicamente a las necesidades de los adolescentes.",
        longDescription: "Adolescence brings its own physical, emotional, and social changes, and our adolescent medicine services are designed specifically for teens and young adults. Care includes physical exams, behavioral health support, preventive care and vaccinations, nutrition guidance, and reproductive health education. Our providers are trained to address the unique needs of this age group across multiple Greater LA locations.",
        longDescriptionEs: "La adolescencia trae consigo sus propios cambios físicos, emocionales y sociales, y nuestros servicios de medicina del adolescente están diseñados específicamente para adolescentes y adultos jóvenes. La atención incluye exámenes físicos, apoyo de salud conductual, atención preventiva y vacunas, orientación nutricional y educación sobre salud reproductiva. Nuestros proveedores están capacitados para atender las necesidades particulares de este grupo de edad en varias ubicaciones del área de Los Ángeles.",
      },
      {
        id: "teenage-gynecology-menstrual-disorders",
        name: "Teenage Gynecology & Menstrual Disorders",
        nameEs: "Ginecología Adolescente y Trastornos Menstruales",
        description: "Adolescent reproductive health services in a comfortable, confidential setting.",
        descriptionEs: "Servicios de salud reproductiva para adolescentes en un entorno cómodo y confidencial.",
        longDescription: "We offer gynecological care designed specifically for teenagers, including education about puberty and menstruation, routine exams, and treatment for menstrual irregularities. Early, informed care can help young women make confident, educated choices about their health. Appointments are available online, by phone, or via telehealth, in a setting designed to be comfortable and confidential.",
        longDescriptionEs: "Ofrecemos atención ginecológica diseñada específicamente para adolescentes, que incluye educación sobre la pubertad y la menstruación, exámenes de rutina y tratamiento para irregularidades menstruales. La atención temprana e informada puede ayudar a las jóvenes a tomar decisiones seguras e informadas sobre su salud. Las citas están disponibles en línea, por teléfono o por telesalud, en un entorno diseñado para ser cómodo y confidencial.",
      },
    ],
  },
];
