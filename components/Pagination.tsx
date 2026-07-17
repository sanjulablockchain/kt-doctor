"use client";

import { useTranslations } from "next-intl";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Build the list of page slots to render. Small totals show every page; large
// totals collapse to first / last / a window around the current page, with
// "ellipsis" markers for the gaps, so the control stays compact as the list grows.
function getPageItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) items.push("ellipsis");
  for (let page = left; page <= right; page++) items.push(page);
  if (right < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
}

const arrowClass =
  "flex items-center gap-1 rounded-full border border-border bg-ivory px-4 py-2 text-sm text-ink transition-colors hover:border-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("Pagination");

  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label={t("label")}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={arrowClass}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
          <path
            d="m15 18-6-6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("previous")}
      </button>

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="px-1 text-sm text-ink-soft"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={t("goToPage", { page: item })}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`min-w-[2.5rem] rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
              item === currentPage
                ? "border-teal bg-teal text-white"
                : "border-border bg-ivory text-ink hover:border-teal hover:text-teal-dark"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={arrowClass}
      >
        {t("next")}
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
          <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
