"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type BackLinkProps = {
  href: string;
  messageKey: "backToServices" | "backToBlog";
  namespace: "Services" | "Blog";
};

export function BackLink({ href, messageKey, namespace }: BackLinkProps) {
  const t = useTranslations(namespace);
  return (
    <Link
      href={href}
      className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
    >
      ← {t(messageKey)}
    </Link>
  );
}
