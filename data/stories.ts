import { AFTER_HOURS_PHONE } from "@/lib/constants";

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

// Shared closing note for medical posts. Section bodies may hold several
// short paragraphs separated by a blank line ("\n\n").
const NOT_MEDICAL_ADVICE =
  "This article is general information, not medical advice. If you are worried about your child, contact your pediatrician.";
const NOT_MEDICAL_ADVICE_ES =
  "Este artículo ofrece información general, no consejo médico. Si le preocupa la salud de su hijo, comuníquese con su pediatra.";

// Newest first: the homepage shows the first four, /blog shows all.
export const stories: Story[] = [
  // DRAFT – needs review by a KT pediatrician before publishing
  {
    id: "cold-flu-rsv-season-2026",
    title: "Flu, RSV and COVID Season: When to Bring Your Child In",
    titleEs: "Temporada de Gripe, VRS y COVID: Cuándo Traer a su Hijo a Consulta",
    date: "November 13, 2026",
    imageSrc: "/blog-cold-flu-rsv-season-2026-placeholder.png",
    excerpt:
      "Coughs, fevers and runny noses are everywhere this time of year. Here is how to tell when your child can rest at home, when to see a pediatrician, and when to get emergency care.",
    excerptEs:
      "La tos, la fiebre y la congestión están en todas partes en esta época del año. Aquí le explicamos cuándo su hijo puede descansar en casa, cuándo ver al pediatra y cuándo buscar atención de emergencia.",
    sections: [
      {
        heading: "Three Viruses, One Season",
        headingEs: "Tres Virus, Una Temporada",
        body: "Every fall and winter, flu, RSV (respiratory syncytial virus) and COVID-19 spread at the same time. All three can cause fever, cough, congestion and tiredness, so it is often hard to tell them apart at home.\n\nMost children recover with rest and fluids. But babies, young children and kids with conditions like asthma, heart disease or a weakened immune system are more likely to get seriously sick, so it helps to know the warning signs.",
        bodyEs: "Cada otoño e invierno, la gripe, el VRS (virus respiratorio sincitial) y el COVID-19 circulan al mismo tiempo. Los tres pueden causar fiebre, tos, congestión y cansancio, por lo que muchas veces es difícil distinguirlos en casa.\n\nLa mayoría de los niños se recuperan con descanso y líquidos. Pero los bebés, los niños pequeños y los niños con condiciones como asma, enfermedades del corazón o un sistema inmunitario debilitado tienen más probabilidades de enfermarse gravemente, así que conviene conocer las señales de alerta.",
      },
      {
        heading: "Caring for a Mild Illness at Home",
        headingEs: "Cómo Cuidar una Enfermedad Leve en Casa",
        body: "If your child is drinking well, peeing normally and still has moments of playing or acting like themselves, home care is often enough. Offer plenty of fluids, encourage rest, and try a cool-mist humidifier or saline drops for a stuffy nose.\n\nAsk your pediatrician before giving any over-the-counter medicine, including cough and cold products, and never give aspirin to children or teens. Keep your child home from school or daycare until their symptoms are improving and they have been fever-free for at least 24 hours without fever-reducing medicine.",
        bodyEs: "Si su hijo está tomando bien los líquidos, orina con normalidad y todavía tiene momentos en que juega o se comporta como siempre, el cuidado en casa suele ser suficiente. Ofrézcale muchos líquidos, anímelo a descansar y pruebe con un humidificador de vapor frío o gotas salinas para la nariz congestionada.\n\nConsulte con su pediatra antes de darle cualquier medicamento de venta libre, incluidos los productos para la tos y el resfriado, y nunca les dé aspirina a niños ni adolescentes. Mantenga a su hijo en casa, sin ir a la escuela ni a la guardería, hasta que sus síntomas estén mejorando y lleve al menos 24 horas sin fiebre sin usar medicamentos para bajarla.",
      },
      {
        heading: "When to Call or Book a Visit",
        headingEs: "Cuándo Llamar o Programar una Consulta",
        body: "Reach out to your pediatrician the same day if your child has a fever that lasts more than two or three days, ear pain, a cough that keeps getting worse, or signs of drinking less, like fewer wet diapers or peeing less than usual.\n\nAlso call if your child starts to get better and then gets worse again, since that can be a sign of a second infection. If your child has asthma or another long-term health condition, check in early rather than waiting.",
        bodyEs: "Comuníquese con su pediatra el mismo día si su hijo tiene fiebre que dura más de dos o tres días, dolor de oído, una tos que sigue empeorando o señales de que está tomando menos líquidos, como menos pañales mojados u orinar menos de lo normal.\n\nLlame también si su hijo empieza a mejorar y luego vuelve a empeorar, ya que puede ser señal de una segunda infección. Si su hijo tiene asma u otra condición de salud a largo plazo, consulte pronto en lugar de esperar.",
      },
      {
        heading: "Babies Need Extra Attention",
        headingEs: "Los Bebés Necesitan Atención Especial",
        body: "For babies younger than 3 months, a temperature of 100.4°F (38°C) or higher needs a call to your pediatrician right away, day or night. Young infants can get sick quickly, and RSV is a leading cause of hospital stays for babies.\n\nAt any age under one, watch for trouble feeding, fewer wet diapers, unusual sleepiness or pauses in breathing, and call us if you notice any of them.",
        bodyEs: "En bebés menores de 3 meses, una temperatura de 100.4°F (38°C) o más requiere llamar a su pediatra de inmediato, de día o de noche. Los bebés pequeños pueden enfermarse rápidamente, y el VRS es una de las principales causas de hospitalización en bebés.\n\nEn cualquier bebé menor de un año, esté atento a dificultad para alimentarse, menos pañales mojados, somnolencia inusual o pausas en la respiración, y llámenos si nota cualquiera de ellas.",
      },
      {
        heading: "Call 911 or Go to the ER for Emergencies",
        headingEs: "Llame al 911 o Vaya a la Sala de Emergencias en Caso de Emergencia",
        body: "Call 911 or go to the nearest emergency room if your child is struggling to breathe or breathing very fast, if the skin between the ribs pulls in with each breath, or if their lips or face look blue or gray.\n\nGet emergency care right away, too, if your child is very hard to wake or not responding, has a seizure, has chest pain, or shows signs of severe dehydration, such as no pee in 8 hours, a very dry mouth or no tears when crying. Trust your instincts. If something feels seriously wrong, get help.",
        bodyEs: "Llame al 911 o vaya a la sala de emergencias más cercana si su hijo tiene dificultad para respirar o respira muy rápido, si la piel entre las costillas se hunde con cada respiración, o si sus labios o su cara se ven azulados o grises.\n\nBusque atención de emergencia de inmediato también si su hijo está muy difícil de despertar o no responde, tiene una convulsión, tiene dolor de pecho o muestra señales de deshidratación grave, como no orinar en 8 horas, la boca muy seca o no tener lágrimas al llorar. Confíe en su instinto. Si siente que algo está muy mal, busque ayuda.",
      },
      {
        heading: "Prevention Still Matters Most",
        headingEs: "La Prevención Sigue Siendo lo Más Importante",
        body: "The flu vaccine is recommended every year for everyone 6 months and older, and it is not too late to get one in November. Ask your pediatrician which COVID-19 vaccine and RSV protection options are right for your child, especially for newborns and babies heading into their first RSV season.\n\nFrequent handwashing, covering coughs and keeping sick kids home also help protect siblings, grandparents and classmates.",
        bodyEs: "Se recomienda la vacuna contra la gripe cada año para todas las personas de 6 meses en adelante, y en noviembre todavía no es tarde para ponérsela. Pregunte a su pediatra qué opciones de vacuna contra el COVID-19 y de protección contra el VRS son adecuadas para su hijo, especialmente para recién nacidos y bebés que enfrentan su primera temporada de VRS.\n\nLavarse las manos con frecuencia, cubrirse al toser y mantener en casa a los niños enfermos también ayuda a proteger a hermanos, abuelos y compañeros de clase.",
      },
      {
        heading: "We're Here When Your Child Needs Care",
        headingEs: "Estamos Aquí Cuando su Hijo Necesita Atención",
        body: `Same-day sick visits are available at our 25 clinics across Greater Los Angeles, and telehealth is available 24/7. For evenings and weekends, our After-Hours Pediatric Urgent Care is open weeknights 6pm to 11pm and all day on weekends. Call ${AFTER_HOURS_PHONE}.\n\n${NOT_MEDICAL_ADVICE}`,
        bodyEs: `Ofrecemos consultas por enfermedad el mismo día en nuestras 25 clínicas en el área metropolitana de Los Ángeles, y telesalud disponible 24/7. Para las noches y los fines de semana, nuestra Atención de Urgencia Pediátrica Fuera de Horario abre entre semana de 6pm a 11pm y todo el día los fines de semana. Llame al ${AFTER_HOURS_PHONE}.\n\n${NOT_MEDICAL_ADVICE_ES}`,
      },
    ],
  },
  // DRAFT – needs review by a KT pediatrician before publishing
  {
    id: "holiday-travel-health-checklist",
    title: "Traveling With Kids This Holiday Season: A Parent's Health Checklist",
    titleEs: "Viajar con Niños Esta Temporada Navideña: Una Lista de Salud para Padres",
    date: "November 13, 2026",
    imageSrc: "/blog-holiday-travel-health-checklist-placeholder.png",
    excerpt:
      "Holiday trips mean new places, long days and lots of people. A little planning before you leave can keep your family healthy and help you handle the bumps along the way.",
    excerptEs:
      "Los viajes de fin de año traen lugares nuevos, días largos y mucha gente. Un poco de planificación antes de salir puede ayudar a mantener sana a su familia y a manejar los imprevistos del camino.",
    sections: [
      {
        heading: "Before You Go: Check In on Vaccines",
        headingEs: "Antes de Salir: Revise las Vacunas",
        body: "Make sure your child is up to date on routine vaccines, including this year's flu shot. The flu vaccine takes about two weeks to build protection, so the sooner the better.\n\nIf you are traveling outside the U.S., schedule a visit at least a month before your trip. Some destinations call for extra vaccines, or for getting certain routine vaccines earlier than usual, and your pediatrician can check the current CDC travel advice for where you are going.",
        bodyEs: "Asegúrese de que su hijo tenga al día sus vacunas de rutina, incluida la vacuna contra la gripe de este año. La vacuna contra la gripe tarda unas dos semanas en dar protección, así que mientras antes, mejor.\n\nSi va a viajar fuera de los Estados Unidos, programe una consulta al menos un mes antes del viaje. Algunos destinos requieren vacunas adicionales, o aplicar ciertas vacunas de rutina antes de lo habitual, y su pediatra puede revisar las recomendaciones de viaje actuales de los CDC para su destino.",
      },
      {
        heading: "Pack a Kid Health Kit",
        headingEs: "Prepare un Botiquín para los Niños",
        body: "Bring any daily medicines your child takes in their original labeled containers, plus a few extra days' supply in case of delays. Keep them in your carry-on, not in checked luggage. Add a thermometer, bandages, hand sanitizer, sunscreen and anything from your child's care plan, such as an inhaler and spacer or an epinephrine auto-injector.\n\nTake a photo of your insurance card and your child's vaccine record, and save your pediatrician's phone number in your phone.",
        bodyEs: "Lleve los medicamentos diarios de su hijo en sus envases originales con etiqueta, además de algunos días extra por si hay retrasos. Llévelos en el equipaje de mano, no en el documentado. Agregue un termómetro, curitas, desinfectante de manos, protector solar y todo lo que indique el plan de cuidado de su hijo, como un inhalador con espaciador o un autoinyector de epinefrina.\n\nTome una foto de su tarjeta del seguro y del registro de vacunas de su hijo, y guarde el número de su pediatra en su teléfono.",
      },
      {
        heading: "Car Seats and Safe Travel",
        headingEs: "Asientos de Seguridad y Viajes Seguros",
        body: "Use a car seat or booster on every car ride, including rentals, rideshares and short trips to see relatives. The American Academy of Pediatrics recommends keeping children rear-facing as long as possible, until they reach the top height or weight limit of their seat.\n\nOn planes, a child under 40 pounds is safest in an FAA-approved car seat in their own seat, not on a lap. On long drives, plan a stop every couple of hours to stretch, use the bathroom and refuel everyone.",
        bodyEs: "Use un asiento de seguridad o elevador en cada viaje en auto, incluidos autos de alquiler, viajes compartidos y trayectos cortos para visitar a familiares. La Academia Americana de Pediatría recomienda que los niños viajen mirando hacia atrás el mayor tiempo posible, hasta que alcancen el límite máximo de altura o peso de su asiento.\n\nEn el avión, un niño de menos de 40 libras va más seguro en un asiento de seguridad aprobado por la FAA y en su propio asiento, no en brazos. En viajes largos por carretera, planee una parada cada par de horas para estirarse, ir al baño y comer algo.",
      },
      {
        heading: "Keep Germs in Check",
        headingEs: "Mantenga los Gérmenes a Raya",
        body: "Airports, stores and family gatherings are easy places to pick up colds and flu. Wash hands often, especially before eating, and carry hand sanitizer for times when soap is not around. Remind kids to keep their hands away from their eyes, nose and mouth.\n\nIf a relative is sick, it is okay to keep some distance, especially around newborns and anyone with a weakened immune system.",
        bodyEs: "Los aeropuertos, las tiendas y las reuniones familiares son lugares donde es fácil contagiarse de resfriados y gripe. Lávense las manos con frecuencia, sobre todo antes de comer, y lleve desinfectante de manos para cuando no haya jabón. Recuérdeles a los niños que no se toquen los ojos, la nariz ni la boca.\n\nSi un familiar está enfermo, está bien mantener cierta distancia, especialmente cerca de recién nacidos y de personas con un sistema inmunitario debilitado.",
      },
      {
        heading: "Food, Sleep and Routines",
        headingEs: "Comida, Sueño y Rutinas",
        body: "Holiday food is part of the fun, but keep water and safe snacks on hand, and tell hosts about any food allergies ahead of time. For young children, watch for choking hazards like whole nuts, hard candy and whole grapes.\n\nTry to keep naps and bedtimes close to normal. Well-rested kids handle travel, new places and big crowds much better.",
        bodyEs: "La comida de las fiestas es parte de la diversión, pero tenga a mano agua y bocadillos seguros, y avise con anticipación a los anfitriones sobre cualquier alergia alimentaria. Con los niños pequeños, tenga cuidado con los alimentos que pueden causar asfixia, como nueces enteras, dulces duros y uvas enteras.\n\nTrate de mantener las siestas y la hora de dormir lo más normales posible. Los niños bien descansados manejan mucho mejor los viajes, los lugares nuevos y las multitudes.",
      },
      {
        heading: "When to Get Help on the Road",
        headingEs: "Cuándo Buscar Ayuda Durante el Viaje",
        body: "Most travel bumps, like a mild cold or an upset stomach, get better with rest and fluids. Call a doctor if your child has a fever that will not go away, is not drinking, or seems unusually tired or unwell.\n\nCall 911 (or the local emergency number if you are abroad) or go to the nearest emergency room for emergencies, such as trouble breathing, a serious injury, signs of a severe allergic reaction, or a child who is very hard to wake. It helps to look up the closest ER when you arrive.",
        bodyEs: "La mayoría de los contratiempos del viaje, como un resfriado leve o malestar estomacal, mejoran con descanso y líquidos. Llame a un médico si su hijo tiene fiebre que no se quita, no está tomando líquidos o se ve inusualmente cansado o enfermo.\n\nLlame al 911 (o al número de emergencias local si está en el extranjero) o vaya a la sala de emergencias más cercana en caso de emergencia, como dificultad para respirar, una lesión grave, señales de una reacción alérgica grave o un niño que está muy difícil de despertar. Es útil ubicar la sala de emergencias más cercana al llegar.",
      },
      {
        heading: "Here for You Before and After the Trip",
        headingEs: "Aquí para Usted Antes y Después del Viaje",
        body: `Need a checkup before you leave or a sick visit when you get back? Same-day visits are available at our 25 clinics across Greater Los Angeles, and telehealth is available 24/7. For evenings and weekends, our After-Hours Pediatric Urgent Care is open weeknights 6pm to 11pm and all day on weekends. Call ${AFTER_HOURS_PHONE}.\n\n${NOT_MEDICAL_ADVICE}`,
        bodyEs: `¿Necesita un chequeo antes de salir o una consulta por enfermedad al regresar? Ofrecemos consultas el mismo día en nuestras 25 clínicas en el área metropolitana de Los Ángeles, y telesalud disponible 24/7. Para las noches y los fines de semana, nuestra Atención de Urgencia Pediátrica Fuera de Horario abre entre semana de 6pm a 11pm y todo el día los fines de semana. Llame al ${AFTER_HOURS_PHONE}.\n\n${NOT_MEDICAL_ADVICE_ES}`,
      },
    ],
  },
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
