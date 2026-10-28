export type Partner = {
  id: string;
  name: string;
  logoSrc: string;
  // The same logo cropped to its visible ink (the originals carry about 50%
  // transparent padding), for places that size logos by their visible height.
  markSrc: string;
  // Dark-mode copy of markSrc with dark lettering lightened (brand colours
  // kept), swapped in via .logo-light/.logo-dark in globals.css. Omitted for
  // a mark that already reads on both light and dark strips.
  markDarkSrc?: string;
};

export const partners: Partner[] = [
  {
    id: "childrens-hospital-la",
    name: "Children's Hospital Los Angeles",
    logoSrc: "/partner-childrens-hospital-la.png",
    markSrc: "/partners/childrens-hospital-la.png",
    markDarkSrc: "/partners/dark/childrens-hospital-la.png",
  },
  {
    id: "cedars-sinai",
    name: "Cedars-Sinai",
    logoSrc: "/partner-cedars-sinai.png",
    markSrc: "/partners/cedars-sinai.png",
    markDarkSrc: "/partners/dark/cedars-sinai.png",
  },
  {
    id: "la-care-health-plan",
    name: "LA Care Health Plan",
    logoSrc: "/partner-la-care.png",
    markSrc: "/partners/la-care-health-plan.png",
    markDarkSrc: "/partners/dark/la-care-health-plan.png",
  },
  {
    id: "optum",
    name: "Optum",
    logoSrc: "/partner-optum.png",
    markSrc: "/partners/optum.png",
  },
  {
    id: "molina-healthcare",
    name: "Molina Healthcare",
    logoSrc: "/partner-molina.png",
    markSrc: "/partners/molina-healthcare.png",
    markDarkSrc: "/partners/dark/molina-healthcare.png",
  },
  {
    id: "regal-medical-group",
    name: "Regal Medical Group",
    logoSrc: "/partner-regal.png",
    markSrc: "/partners/regal-medical-group.png",
    markDarkSrc: "/partners/dark/regal-medical-group.png",
  },
  {
    id: "providence",
    name: "Providence",
    logoSrc: "/partner-providence.png",
    markSrc: "/partners/providence.png",
    markDarkSrc: "/partners/dark/providence.png",
  },
  {
    id: "usc",
    name: "University of Southern California",
    // Cut from the USC Health Benefits Fair flyer artwork; USC only releases
    // its logo files to usc.edu accounts. The gold badge reads on light and
    // dark strips alike, so it needs no dark variant.
    logoSrc: "/partner-usc.png",
    markSrc: "/partners/usc.png",
  },
];
