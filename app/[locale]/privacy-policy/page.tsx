import type { Metadata } from "next";
import { LegalPageContent } from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Kids & Teens Medical Group",
  description:
    "How Kids & Teens Medical Group collects, uses, discloses, and protects your personal and health information.",
};

export default function PrivacyPolicyPage() {
  return <LegalPageContent doc="privacy" />;
}
