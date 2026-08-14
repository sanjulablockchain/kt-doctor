"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const DIALOG_ID = "season-drawer";
const DIALOG_TITLE_ID = "season-drawer-title";

type Props = {
  onClose: () => void;
};

// Off-canvas panel of seasonal health-awareness banners. Shared by the
// desktop edge tab (SeasonTab) and the mobile quick-actions grid
// (MobileQuickDrawer) so the drawer markup and banners live in one place.
export function SeasonBanners({ onClose }: Props) {
  const t = useTranslations("SeasonTab");

  return (
    <>
      <div
        data-testid="season-drawer-backdrop"
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50"
      />
      <div
        id={DIALOG_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={DIALOG_TITLE_ID}
        className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-surface p-6 shadow-card motion-safe:animate-[slide-in-left_300ms_ease-out] sm:max-w-md"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={DIALOG_TITLE_ID} className="font-display text-xl font-bold text-ink">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeSeason")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-soft">{t("helper")}</p>

        <div className="mt-6 flex flex-col gap-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-soft">
            <Image
              src="/banners/season-iodine-deficiency-day.png"
              alt={t("banner1Alt")}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-soft">
            <Image
              src="/banners/season-back-to-school-immunizations.png"
              alt={t("banner2Alt")}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
