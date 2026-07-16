export type ParentResource = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  href?: string;
  external?: boolean;
};

export const parentResources: ParentResource[] = [
  {
    id: "our-doctors",
    name: "Our Doctors",
    description: "Meet our board-certified pediatricians and find the right fit for your family.",
    available: true,
    href: "/doctors",
  },
  {
    id: "vaccine-schedule",
    name: "Vaccine Schedule",
    description: "The recommended immunization schedule for ages 0 to 21.",
    available: true,
    href: "/vaccine-schedule.jpg",
    external: true,
  },
  {
    id: "patient-forms",
    name: "Patient Forms",
    description: "New patient intake forms and sports physical paperwork.",
    available: true,
    href: "https://healow.com/apps/jsp/webview/signIn.jsp",
    external: true,
  },
  {
    id: "developmental-milestones",
    name: "Developmental Milestone Guides",
    description: "What to expect at each stage of your child's development.",
    available: false,
  },
  {
    id: "must-watch-videos",
    name: "Must Watch Videos",
    description: "Pediatric health tips and guidance from our team, straight from our YouTube channel.",
    available: true,
    href: "https://www.youtube.com/channel/UC5pMXGZ_F2OZUFdfy6YbIew",
    external: true,
  },
];
