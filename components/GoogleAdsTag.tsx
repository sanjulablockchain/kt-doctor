import Script from "next/script";
import { googleAdsId, gtagInitScript } from "@/lib/gtag";

/**
 * The Google Ads base tag (gtag.js).
 *
 * Google's own instructions say to paste this immediately after <head>, which
 * is advice for hand-written HTML. In the App Router, next/script with the
 * default afterInteractive strategy is the supported equivalent: the tag still
 * verifies in Google Ads and loads once per document, including across
 * client-side navigations.
 *
 * Renders nothing when NEXT_PUBLIC_GOOGLE_ADS_ID is unset, which keeps local
 * development and preview builds out of the live conversion data.
 */
export function GoogleAdsTag() {
  const adsId = googleAdsId();
  if (!adsId) return null;

  return (
    <>
      <Script
        id="google-ads-gtag"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`}
      />
      <Script id="google-ads-gtag-init">{gtagInitScript(adsId)}</Script>
    </>
  );
}
