"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// Reveal once the user has scrolled roughly one screen's worth, so it isn't
// competing with the hero content immediately on page load.
const SHOW_AFTER_PX = 400;

export function BackToTopButton() {
  const t = useTranslations("FloatingContact");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible((wasVisible) => {
        const shouldShow = window.scrollY > SHOW_AFTER_PX;
        return shouldShow === wasVisible ? wasVisible : shouldShow;
      });
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      data-testid="back-to-top"
      aria-label={t("backToTop")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-teal-dark text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal active:scale-90 sm:bottom-8 sm:left-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
        <path
          d="m5 12 7-7 7 7M12 19V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
