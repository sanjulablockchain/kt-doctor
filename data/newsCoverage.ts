// Third-party coverage of the practice: pieces other outlets published about
// Kids & Teens Medical Group, as opposed to the press releases the practice
// issues itself (see pressReleases.ts).
//
// Each item links out to the outlet's own page rather than republishing the
// article here. The copy is theirs, so the site carries only a short summary
// in our words plus the one sentence that names the practice, quoted exactly.
// No images are copied from the outlet for the same reason.
//
// Newest first. The Media page renders the whole list.

export type NewsCoverage = {
  id: string;
  /** The publication, as it names itself. */
  outlet: string;
  /** ISO date the piece was published, for <time dateTime>. */
  date: string;
  displayDate: string;
  displayDateEs: string;
  /** The article's headline, exactly as published (not translated). */
  title: string;
  /** Canonical URL of the article on the outlet's site. */
  url: string;
  /** Our own one-paragraph summary of the piece and where KTMG appears in it. */
  summary: string;
  summaryEs: string;
  /** The sentence from the article that names the practice, quoted verbatim. */
  quote: string;
  /** Spanish rendering of `quote`, shown in place of it on the es site. */
  quoteEs: string;
};

export const newsCoverage: NewsCoverage[] = [
  {
    id: "usc-campus-health-benefits-fair-2026",
    outlet: "USC Campus Health News",
    date: "2026-10-23",
    displayDate: "October 23, 2026",
    displayDateEs: "23 de octubre de 2026",
    title:
      "USC Employees Connect With Health Plans Resources at the Employee Health Benefits Fair",
    url: "https://campushealth.usc.edu/employee-health-benefits-fair-2026",
    summary:
      "USC Campus Health's coverage of the 2026 Employee Health Benefits Fairs names Kids & Teens Medical Group among the pediatric care partners USC employees met at the Health Sciences Campus fair on October 6. The photo gallery below the article includes the Kids & Teens Medical Group table.",
    summaryEs:
      "La cobertura de USC Campus Health sobre las Ferias de Beneficios de Salud para Empleados de 2026 menciona a Kids & Teens Medical Group entre los socios de atención pediátrica que los empleados de USC conocieron en la feria del Campus de Ciencias de la Salud el 6 de octubre. La galería de fotos debajo del artículo incluye la mesa de Kids & Teens Medical Group.",
    quote:
      "Employees could also meet with Exer Urgent Care and pediatric care partners Kids & Teens Medical Group, which operates 25 clinics across the Greater Los Angeles area, and Coastal Kids.",
    quoteEs:
      "Los empleados también pudieron reunirse con Exer Urgent Care y con los socios de atención pediátrica Kids & Teens Medical Group, que opera 25 clínicas en el área metropolitana de Los Ángeles, y Coastal Kids.",
  },
];
