// The KTMG media kit, re-pointed at this website.
//
// The kit the client supplied (KTDoctor-MediaKit.pdf) is a single cover page
// whose six "tabs" are not internal page jumps: each one is an external Box
// share link to a separate PDF. Shipping that as-is would mean every tab click
// leaves the site for a third-party file viewer, with no branding, no
// analytics, and a dependency on share links living in an account we do not
// control. If those links are revoked or rotated, the kit breaks silently.
//
// So the tabs are reproduced here as on-site routes:
//   - Press release and biography go to the HTML pages built for them, which
//     is content the site did not previously have.
//   - Services, Network, Foundation and Telehealth are print restatements of
//     pages the site already has, so they go to those pages. Republishing them
//     would compete with the originals in search.
// Each section also keeps a self-hosted copy of its original PDF for anyone
// who wants the file itself.

import { pressReleases } from "@/data/pressReleases";
import { pressBios } from "@/data/pressBios";

export type MediaKitSection = {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  /** Route on this site, passed to the locale-aware <Link>. */
  href: string;
  /** Self-hosted copy of this section's original PDF. */
  pdfHref: string;
};

export const mediaKitSections: MediaKitSection[] = [
  {
    id: "press-release",
    title: "Press Release",
    titleEs: "Comunicado de Prensa",
    description:
      "Recognition from L.A. Care and USC Health Benefits, and the growth of the network to 25 clinics across Los Angeles County.",
    descriptionEs:
      "El reconocimiento de L.A. Care y USC Health Benefits, y el crecimiento de la red a 25 clínicas en el condado de Los Ángeles.",
    href: `/media/press/${pressReleases[0].id}`,
    pdfHref: "/media/ktmg-press-release.pdf",
  },
  {
    id: "biography",
    title: "Founder Biography",
    titleEs: "Biografía de la Fundadora",
    description:
      "Dr. Janesri De Silva, MD, FAAP: board-certified pediatrician, California Medical Association delegate, and founder of the practice.",
    descriptionEs:
      "Dra. Janesri De Silva, MD, FAAP: pediatra certificada por la junta, delegada ante la Asociación Médica de California y fundadora de la práctica.",
    href: `/media/leadership/${pressBios[0].id}`,
    pdfHref: "/media/ktmg-janesri-de-silva-biography.pdf",
  },
  {
    id: "services",
    title: "Services",
    titleEs: "Servicios",
    description:
      "The full range of pediatric care, from well-child visits and immunizations to same-day sick visits and specialty care.",
    descriptionEs:
      "Toda la gama de atención pediátrica, desde visitas de control e inmunizaciones hasta consultas por enfermedad el mismo día y atención especializada.",
    href: "/services",
    pdfHref: "/media/ktmg-services.pdf",
  },
  {
    id: "network",
    title: "Network",
    titleEs: "Red",
    description:
      "Southern California's largest independent pediatric network, and the family of sister companies and partners around it.",
    descriptionEs:
      "La red pediátrica independiente más grande del sur de California y la familia de empresas afiliadas y socios que la rodean.",
    href: "/network",
    pdfHref: "/media/ktmg-network.pdf",
  },
  {
    id: "foundation",
    title: "Foundation",
    titleEs: "Fundación",
    description:
      "Free clinic days, continued care for families with little or no coverage, and programs supporting the next generation of clinicians.",
    descriptionEs:
      "Jornadas de clínica gratuita, atención continua para familias con poca o ninguna cobertura y programas que apoyan a la próxima generación de médicos.",
    href: "/foundation",
    pdfHref: "/media/ktmg-foundation.pdf",
  },
  {
    id: "telehealth",
    title: "Telehealth",
    titleEs: "Telesalud",
    description:
      "Remote consultations with board-certified pediatricians, wherever the family happens to be.",
    descriptionEs:
      "Consultas a distancia con pediatras certificados por la junta, dondequiera que se encuentre la familia.",
    href: "/services/telehealth",
    pdfHref: "/media/ktmg-telehealth.pdf",
  },
];

export type MediaDownload = {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  href: string;
  kind: "pdf" | "image";
  /** Rendered only when true, so a piece can be staged before it is publishable. */
  available: boolean;
  /** Why an unavailable piece is held back. Internal only, never rendered. */
  unavailableReason?: string;
};

export const mediaDownloads: MediaDownload[] = [
  {
    id: "media-kit",
    title: "Complete Media Kit",
    titleEs: "Kit de Prensa Completo",
    description:
      "The full Kids & Teens Medical Group media kit as a single PDF, covering the press release, founder biography, services, network, foundation and telehealth.",
    descriptionEs:
      "El kit de prensa completo de Kids & Teens Medical Group en un solo PDF, que abarca el comunicado de prensa, la biografía de la fundadora, los servicios, la red, la fundación y la telesalud.",
    href: "/media/ktmg-media-kit.pdf",
    kind: "pdf",
    available: true,
  },
  {
    id: "flyer",
    title: "Practice Flyer",
    titleEs: "Folleto de la Práctica",
    description:
      "A one-page flyer covering the USC pediatrics partnership, the L.A. Care award, and how to reach the practice.",
    descriptionEs:
      "Un folleto de una página sobre la alianza pediátrica con USC, el premio de L.A. Care y cómo comunicarse con la práctica.",
    href: "/media/ktmg-flyer.jpg",
    kind: "image",
    available: false,
    unavailableReason:
      "The supplied flyer prints www.ktddoctor.com and its QR code encodes the same misspelling, so scanning it sends families to a domain the practice does not own. Set available to true once a corrected export replaces public/media/ktmg-flyer.jpg.",
  },
];
