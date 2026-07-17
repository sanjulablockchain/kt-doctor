import type { Metadata } from "next";
import { CareersPageContent } from "@/components/CareersPageContent";

export const metadata: Metadata = {
  title: "Careers | Kids & Teens Medical Group",
  description:
    "Join Kids & Teens Medical Group's pediatric network. Email your resume, and check our social media, company sites, or Indeed for current openings.",
};

export default function CareersPage() {
  return <CareersPageContent />;
}
