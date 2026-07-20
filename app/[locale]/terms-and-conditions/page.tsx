import type { Metadata } from "next";
import { LegalPageContent } from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Terms and Conditions | Kids & Teens Medical Group",
  description:
    "The terms and conditions governing your use of the Kids & Teens Medical Group website and services.",
};

export default function TermsAndConditionsPage() {
  return <LegalPageContent doc="terms" />;
}
