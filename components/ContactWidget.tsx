"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MAIN_PHONE, TEXT_PHONE, TEXT_PHONE_ES } from "@/lib/constants";

// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437" — matches components/Footer.tsx's formatting.
function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

const APPOINTMENT_MESSAGE_EN = "Hi, I'd like to inquire about an appointment";
const APPOINTMENT_MESSAGE_ES = "Hola, me gustaría preguntar sobre una cita";

const optionRowClass =
  "flex items-center gap-3 rounded-xl p-3 transition-colors";

export function ContactWidget() {
  const t = useTranslations("FloatingContact");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(toE164(MAIN_PHONE));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — the
      // tel: link and visible number below are still usable either way.
    }
  }

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-20 sm:bottom-8 sm:right-8">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-72 rounded-2xl border border-border bg-white p-4 shadow-card">
          <h4 className="font-display text-sm font-bold text-ink">{t("title")}</h4>
          <p className="mb-3 mt-1 text-xs text-ink-soft">{t("helper")}</p>

          <div className="flex flex-col gap-2">
            <a
              href={`https://wa.me/${toE164(TEXT_PHONE).slice(1)}?text=${encodeURIComponent(APPOINTMENT_MESSAGE_EN)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${optionRowClass} bg-[#25D366]/10 hover:bg-[#25D366]/20`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                </svg>
              </span>
              <span>
                <span className="block font-display text-xs font-bold text-ink">{t("whatsapp")}</span>
                <span className="block text-[11px] text-ink-soft">{TEXT_PHONE}</span>
              </span>
            </a>

            <a
              href={`sms:${toE164(TEXT_PHONE)}?body=${encodeURIComponent(APPOINTMENT_MESSAGE_EN)}`}
              className={`${optionRowClass} bg-teal-tint hover:bg-teal-tint/60`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 text-white">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block font-display text-xs font-bold text-ink">Text (English)</span>
                <span className="block text-[11px] text-ink-soft">{TEXT_PHONE}</span>
              </span>
            </a>

            <a
              href={`sms:${toE164(TEXT_PHONE_ES)}?body=${encodeURIComponent(APPOINTMENT_MESSAGE_ES)}`}
              className={`${optionRowClass} bg-gold-tint hover:bg-gold-tint/60`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 text-white">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block font-display text-xs font-bold text-ink">Texto (Español)</span>
                <span className="block text-[11px] text-ink-soft">{TEXT_PHONE_ES}</span>
              </span>
            </a>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${toE164(MAIN_PHONE)}`}
                className={`${optionRowClass} flex-1 bg-ivory-deep hover:bg-border/60`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-soft">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 text-white">
                    <path
                      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="block font-display text-xs font-bold text-ink">{t("callUs")}</span>
                  <span className="block text-[11px] text-ink-soft">{MAIN_PHONE}</span>
                </span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                title={t("copyPhone")}
                aria-label={copied ? t("copied") : t("copyPhone")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ivory-deep text-ink-soft transition-colors hover:bg-border/60"
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 text-teal-dark">
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
                    <rect x="8" y="8" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? t("closeContact") : t("openContact")}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-dark active:scale-90"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
