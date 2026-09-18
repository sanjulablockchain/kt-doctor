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
};

export const mediaDownloads: MediaDownload[] = [
  {
    id: "media-kit",
    // The client's revision document wrote "Kids & Teens Media Group" here.
    // Corrected to "Medical", which is the practice's actual name and what the
    // same document uses everywhere else.
    title: "Kids & Teens Medical Group | Media Kit",
    titleEs: "Kids & Teens Medical Group | Kit de Prensa",
    description:
      "Inclusive of Press Release, Founder Biography, Services, Network, Foundation, Telehealth",
    descriptionEs:
      "Incluye el Comunicado de Prensa, la Biografía de la Fundadora, los Servicios, la Red, la Fundación y la Telesalud",
    href: "/media/ktmg-media-kit.pdf",
    kind: "pdf",
  },
];

/**
 * The USC partnership flyer, shown as its own section between the media kit and
 * the downloads, per client direction.
 *
 * KNOWN ISSUE with the supplied artwork (`public/media/ktmg-flyer.jpg`): it
 * prints "www.ktddoctor.com" and its QR code encodes the same misspelling.
 * That domain is unregistered, so scanning the code fails rather than reaching
 * anyone else. It is published here regardless because on screen the QR is
 * decorative, and the surrounding page links to the real site. Replace the JPEG
 * once a corrected export arrives; nothing else needs to change.
 *
 * The flyer is a text-heavy image, so `highlights` restates its substance as
 * real text. Screen readers and search engines cannot read a JPEG, and `alt`
 * alone is the wrong place for five separate facts.
 */
export type MediaFeatureHighlight = {
  text: string;
  textEs: string;
};

export type MediaFeature = {
  id: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  altEs: string;
  highlights: MediaFeatureHighlight[];
};

export const uscFlyer: MediaFeature = {
  id: "usc-flyer",
  imageSrc: "/media/ktmg-flyer.jpg",
  imageWidth: 1080,
  imageHeight: 1526,
  alt: "Kids & Teens Medical Group flyer featuring founder Dr. Janesri De Silva, MD, FAAP, marking the practice as a proud USC Pediatrics partner and a recipient of the L.A. Care Social Determinants of Health Award.",
  altEs:
    "Folleto de Kids & Teens Medical Group con la fundadora, la Dra. Janesri De Silva, MD, FAAP, que destaca a la práctica como orgulloso socio de Pediatría de USC y galardonada con el Premio a los Determinantes Sociales de la Salud de L.A. Care.",
  highlights: [
    {
      text: "Proud USC Pediatrics partner of their Health Benefits Plan.",
      textEs: "Orgulloso socio de Pediatría de USC en su Plan de Beneficios de Salud.",
    },
    {
      text: "Recipient of the L.A. Care Social Determinants of Health Award, in recognition of outstanding care.",
      textEs:
        "Galardonada con el Premio a los Determinantes Sociales de la Salud de L.A. Care, en reconocimiento a su atención excepcional.",
    },
    {
      text: "Founded in 2007, Kids & Teens Medical Group is the largest pediatric network in Southern California with 25 clinics, including our Telehealth service.",
      textEs:
        "Fundado en 2007, Kids & Teens Medical Group es la red pediátrica más grande del sur de California, con 25 clínicas, incluido nuestro servicio de Telesalud.",
    },
    {
      text: "Janesri De Silva, MD, FAAP, is the esteemed founder of Kids & Teens Medical Group, and a delegate to the California Medical Association.",
      textEs:
        "Janesri De Silva, MD, FAAP, es la estimada fundadora de Kids & Teens Medical Group y delegada ante la Asociación Médica de California.",
    },
  ],
};
