import type { Metadata } from "next";
import { BlogPageContent } from "@/components/BlogPageContent";

export const metadata: Metadata = {
  title: "Blog | Kids & Teens Medical Group",
  description:
    "Parent-friendly stories and tips from Kids & Teens Medical Group, from seasonal health advice to guidance on choosing the right care.",
};

export default function BlogPage() {
  return <BlogPageContent />;
}
