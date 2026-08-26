import { describe, it, expect, vi, afterEach } from "vitest";
import {
  CONVERSION_LABELS,
  conversionActionForLink,
  googleAdsId,
  gtagInitScript,
  sendConversion,
  trackConversion,
  type ConversionAction,
} from "./gtag";

const ADS_ID = "AW-18411557639";

function stubGtag() {
  const gtag = vi.fn();
  Object.assign(window, { gtag });
  return gtag;
}

afterEach(() => {
  vi.unstubAllEnvs();
  delete (window as { gtag?: unknown }).gtag;
});

describe("googleAdsId", () => {
  it("is empty when the env var is unset, so no tag renders", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", "");
    expect(googleAdsId()).toBe("");
  });

  it("reads the conversion ID from the env var", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);
    expect(googleAdsId()).toBe(ADS_ID);
  });
});

describe("gtagInitScript", () => {
  it("configures gtag for the given conversion ID", () => {
    const script = gtagInitScript(ADS_ID);
    expect(script).toContain("window.dataLayer = window.dataLayer || []");
    expect(script).toContain(`gtag('config', '${ADS_ID}')`);
  });

  it("cannot break out of the script element via the ID", () => {
    expect(gtagInitScript("AW-1</script><script>alert(1)")).not.toContain("</script>");
  });
});

describe("conversionActionForLink", () => {
  it("treats a tel: link as a phone call", () => {
    expect(conversionActionForLink("tel:+18183615437")).toBe("phone_call");
  });

  it("treats an sms: link as a text", () => {
    expect(conversionActionForLink("sms:+16262987121")).toBe("sms_click");
  });

  it("treats a wa.me link as WhatsApp", () => {
    expect(conversionActionForLink("https://wa.me/16262987121?text=Hi")).toBe("whatsapp_click");
  });

  it("treats a healow.com link as a booking click", () => {
    expect(
      conversionActionForLink(
        "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
      )
    ).toBe("booking_click");
  });

  it("ignores healowpay.com, which is a payment and not a new appointment", () => {
    expect(conversionActionForLink("https://healowpay.com")).toBeNull();
  });

  it("ignores the patient portal, which existing patients use to log in", () => {
    expect(
      conversionActionForLink("https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp")
    ).toBeNull();
  });

  it("ignores internal links, mailto links, and empty hrefs", () => {
    expect(conversionActionForLink("/en/locations")).toBeNull();
    expect(conversionActionForLink("mailto:customerservice@ktdoctor.com")).toBeNull();
    expect(conversionActionForLink("")).toBeNull();
  });
});

describe("sendConversion", () => {
  it("sends the conversion event with the account-qualified label", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);
    const gtag = stubGtag();

    sendConversion("AbC-D_efGhIjKlMnOp");

    expect(gtag).toHaveBeenCalledWith("event", "conversion", {
      send_to: `${ADS_ID}/AbC-D_efGhIjKlMnOp`,
    });
  });

  it("does nothing when the label is not configured yet", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);
    const gtag = stubGtag();

    sendConversion("");

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does nothing when the conversion ID is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", "");
    const gtag = stubGtag();

    sendConversion("AbC-D_efGhIjKlMnOp");

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not throw when the tag never loaded", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);
    expect(() => sendConversion("AbC-D_efGhIjKlMnOp")).not.toThrow();
  });
});

describe("trackConversion", () => {
  it("stays silent for every action whose label is still unconfigured", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);
    const gtag = stubGtag();

    for (const action of Object.keys(CONVERSION_LABELS) as ConversionAction[]) {
      if (CONVERSION_LABELS[action] === "") trackConversion(action);
    }

    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends a configured label as a conversion", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", ADS_ID);
    const gtag = stubGtag();
    const configured = (Object.keys(CONVERSION_LABELS) as ConversionAction[]).filter(
      (action) => CONVERSION_LABELS[action] !== ""
    );

    for (const action of configured) {
      trackConversion(action);
      expect(gtag).toHaveBeenCalledWith("event", "conversion", {
        send_to: `${ADS_ID}/${CONVERSION_LABELS[action]}`,
      });
    }

    expect(gtag).toHaveBeenCalledTimes(configured.length);
  });
});

describe("CONVERSION_LABELS", () => {
  // Pasting the whole "AW-123/AbCdEf" send_to string into a label is an easy
  // mistake and would silently break every conversion for that action.
  it("holds bare labels, never a full send_to string", () => {
    for (const [action, label] of Object.entries(CONVERSION_LABELS)) {
      expect(label, `${action} label must not contain the account ID or a slash`).not.toMatch(
        /[/\s]|^AW-/
      );
    }
  });
});
