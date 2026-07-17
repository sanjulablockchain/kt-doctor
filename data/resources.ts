export type ParentResource = {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  available: boolean;
  href?: string;
  external?: boolean;
};

export const parentResources: ParentResource[] = [
  {
    id: "our-doctors",
    name: "Our Doctors",
    nameEs: "Nuestros Doctores",
    description: "Meet our board-certified pediatricians and find the right fit for your family.",
    descriptionEs:
      "Conozca a nuestros pediatras certificados y encuentre el más adecuado para su familia.",
    available: true,
    href: "/doctors",
  },
  {
    id: "vaccine-schedule",
    name: "Vaccine Schedule",
    nameEs: "Calendario de Vacunación",
    description: "The recommended immunization schedule for ages 0 to 21.",
    descriptionEs: "El calendario de vacunación recomendado para edades de 0 a 21 años.",
    available: true,
    href: "/vaccine-schedule.jpg",
    external: true,
  },
  {
    id: "patient-forms",
    name: "Patient Forms",
    nameEs: "Formularios para Pacientes",
    description: "New patient intake forms and sports physical paperwork.",
    descriptionEs:
      "Formularios de admisión para nuevos pacientes y documentación de exámenes físicos deportivos.",
    available: true,
    href: "https://healow.com/apps/jsp/webview/signIn.jsp",
    external: true,
  },
  {
    id: "developmental-milestones",
    name: "Developmental Milestone Guides",
    nameEs: "Guías de Hitos del Desarrollo",
    description: "What to expect at each stage of your child's development.",
    descriptionEs: "Qué esperar en cada etapa del desarrollo de su hijo.",
    available: false,
  },
  {
    id: "must-watch-videos",
    name: "Must Watch Videos",
    nameEs: "Videos Imperdibles",
    description: "Pediatric health tips and guidance from our team, straight from our YouTube channel.",
    descriptionEs:
      "Consejos y orientación de salud pediátrica de nuestro equipo, directamente de nuestro canal de YouTube.",
    available: true,
    href: "https://www.youtube.com/channel/UC5pMXGZ_F2OZUFdfy6YbIew",
    external: true,
  },
];
