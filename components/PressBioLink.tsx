"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type PressBioLinkProps = {
  /** Slug of the press biography, which matches the doctor's own id. */
  bioId: string;
};

/**
 * Link from a doctor's patient-facing page to their formal press biography.
 * A client component because the surrounding doctor page is a server component
 * that carries no translation context of its own.
 */
export function PressBioLink({ bioId }: PressBioLinkProps) {
  const t = useTranslations("Media");
  return (
    <Link
      href={`/media/leadership/${bioId}`}
      className="mt-4 inline-block font-display text-sm font-semibold text-teal-dark hover:text-teal"
    >
      {t("pressProfile")}
    </Link>
  );
}
