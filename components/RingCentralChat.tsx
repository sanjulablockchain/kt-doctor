import Script from "next/script";

/**
 * Loader for the RingCentral (RCX) web chat widget, as supplied by the
 * Newbridge implementation team. The account and channel IDs in the URL are
 * public by design: any page that shows the widget exposes them.
 */
export const RINGCENTRAL_CHAT_LOADER_URL =
  "https://iarsqi57f9.chat.digital.ringcentral.com/chat/f359113ead55f52bd7016f18/loader.js";

/**
 * RingCentral's snippet is a hand-written async loader that inserts a script
 * tag before the first one on the page. next/script with the default
 * afterInteractive strategy is the App Router equivalent: it loads the same
 * URL asynchronously, once per document.
 *
 * The widget renders its own launcher outside React, so it stays on screen
 * after a client-side navigation away from the page that loaded it.
 */
export function RingCentralChat() {
  return <Script id="ringcentral-chat" async src={RINGCENTRAL_CHAT_LOADER_URL} />;
}
