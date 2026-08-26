/**
 * Google Ads (gtag.js) conversion tracking.
 *
 * The account's conversion ID lives in NEXT_PUBLIC_GOOGLE_ADS_ID rather than in
 * lib/constants.ts on purpose: with it unset, no tag renders and no event
 * fires, so local development and any preview build stay out of the live
 * conversion data. NEXT_PUBLIC_ values are inlined at build time, so the server
 * image has to be rebuilt after changing it (see the Dockerfile build arg).
 */

/** The visitor actions worth reporting to Google Ads as conversions. */
export type ConversionAction =
  | "phone_call"
  | "sms_click"
  | "whatsapp_click"
  | "booking_click"
  | "contact_form";

/**
 * The conversion label Google Ads issues for each conversion action, e.g. the
 * "AbC-D_efGhIjKlMnOp" half of a "AW-18411557639/AbC-D_efGhIjKlMnOp" send_to.
 * Labels are public identifiers, not secrets, and never differ per
 * environment, so they live here instead of in env vars.
 *
 * Create the conversion action in Google Ads, then paste its label here. An
 * empty label means "not set up yet" and sends nothing at all, so partially
 * configured tracking never reports bogus conversions.
 */
export const CONVERSION_LABELS: Record<ConversionAction, string> = {
  phone_call: "",
  sms_click: "",
  whatsapp_click: "",
  booking_click: "",
  contact_form: "",
};

/** The Google Ads conversion ID, or "" when tracking is switched off. */
export function googleAdsId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
}

/**
 * The inline gtag bootstrap that Google Ads hands out with the base tag. `<` is
 * escaped so the ID can never close the script element early.
 */
export function gtagInitScript(adsId: string): string {
  const safeId = adsId.replace(/</g, "\\u003c").replace(/'/g, "\\'");
  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js', new Date());",
    `gtag('config', '${safeId}');`,
  ].join("\n");
}

/**
 * Classifies an anchor's href as a conversion action, or null when the link is
 * not one of the actions we report. Keeping this a pure function of the href
 * lets a single delegated click listener cover every contact and booking link
 * on the site without any component needing to know about ads tracking.
 */
export function conversionActionForLink(href: string): ConversionAction | null {
  if (href.startsWith("tel:")) return "phone_call";
  if (href.startsWith("sms:")) return "sms_click";
  if (href.startsWith("https://wa.me/")) return "whatsapp_click";
  // Appointment booking only. healowpay.com (paying a bill) and the
  // ecwcloud.com patient portal (existing patients logging in) are different
  // hosts and deliberately do not match.
  if (href.startsWith("https://healow.com/")) return "booking_click";
  return null;
}

/** Reports one conversion label to Google Ads. A no-op unless fully set up. */
export function sendConversion(label: string): void {
  const adsId = googleAdsId();
  if (!adsId || !label) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: `${adsId}/${label}` });
}

/** Reports a visitor action to Google Ads. A no-op until its label is set. */
export function trackConversion(action: ConversionAction): void {
  sendConversion(CONVERSION_LABELS[action]);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
