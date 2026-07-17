import type { Metadata } from "next";
import { FoundationPageContent } from "@/components/FoundationPageContent";

export const metadata: Metadata = {
  title: "Kids and Teens Foundation | Kids & Teens Medical Group",
  description:
    "The Kids and Teens Foundation provides free clinic days, medical missions, mentorship, scholarships, community outreach, and a school wellness initiative in Negombo, Sri Lanka, alongside Kids & Teens Medical Group.",
};

export default function FoundationPage() {
  return <FoundationPageContent />;
}
