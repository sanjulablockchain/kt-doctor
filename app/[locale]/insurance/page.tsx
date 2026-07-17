import type { Metadata } from "next";
import { InsurancePageContent } from "@/components/InsurancePageContent";

export const metadata: Metadata = {
  title: "Insurance | Kids & Teens Medical Group",
  description:
    "Kids & Teens Medical Group accepts HMO, PPO, and Medi-Cal plans, plus Serendib Healthways HMO/IPA. Call to verify your plan is accepted.",
};

export default function InsurancePage() {
  return <InsurancePageContent />;
}
