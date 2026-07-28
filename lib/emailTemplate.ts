import { escapeHtml } from "@/lib/escapeHtml";
import { SITE_NAME } from "@/lib/constants";

const FONT = "Arial,Helvetica,sans-serif";
const COLOR_TEAL = "#0e8fa0";
const COLOR_TEAL_DARK = "#0b6e7c";
const COLOR_TEAL_LIGHT = "#e4f5f6";
const COLOR_BG = "#f4f7fa";
const COLOR_BORDER = "#dde3ea";
const COLOR_TEXT_MUTED = "#56606e";
const COLOR_TEXT = "#12181f";

export type EmailRow = { label: string; valueHtml: string };

// Wraps an already-escaped value in a mailto:/tel: link. Callers must pass
// values through lib/escapeHtml.ts first; these functions only lay out markup.
export function mailtoLink(escapedEmail: string): string {
  return `<a href="mailto:${escapedEmail}" style="color:${COLOR_TEAL_DARK};text-decoration:none;">${escapedEmail}</a>`;
}

export function telLink(escapedPhone: string): string {
  const digits = escapedPhone.replace(/&(?:amp|lt|gt|quot|#39);/g, "").replace(/[^+\d]/g, "");
  return `<a href="tel:${digits}" style="color:${COLOR_TEAL_DARK};text-decoration:none;">${escapedPhone}</a>`;
}

function emailRow(label: string, valueHtml: string): string {
  return `
            <tr>
              <td style="padding:10px 0 0;width:90px;font-size:13px;color:${COLOR_TEXT_MUTED};vertical-align:top;font-family:${FONT};">${label}</td>
              <td style="padding:10px 0 0;font-size:14px;color:${COLOR_TEXT};font-family:${FONT};">${valueHtml}</td>
            </tr>`;
}

export function emailRowTable(rows: EmailRow[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid ${COLOR_BORDER};">${rows
    .map((r) => emailRow(r.label, r.valueHtml))
    .join("")}</table>`;
}

export function emailBadge(label: string, valueHtml: string): string {
  return `<p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${COLOR_TEXT_MUTED};font-family:${FONT};">${label}</p>
<p style="margin:6px 0 0;display:inline-block;background-color:${COLOR_TEAL_LIGHT};color:${COLOR_TEAL_DARK};font-size:14px;font-weight:700;padding:6px 14px;border-radius:999px;font-family:${FONT};">${valueHtml}</p>`;
}

export function emailMessageBlock(label: string, html: string): string {
  return `<div style="margin-top:20px;padding:16px 18px;background-color:${COLOR_BG};border-left:3px solid ${COLOR_TEAL};border-radius:0 10px 10px 0;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${COLOR_TEXT_MUTED};font-family:${FONT};">${label}</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:${COLOR_TEXT};font-family:${FONT};">${html}</p>
        </div>`;
}

export function emailShell(options: { title: string; bodyHtml: string; footerText: string }): string {
  const { title, bodyHtml, footerText } = options;
  return `<div style="background-color:${COLOR_BG};padding:32px 16px;font-family:${FONT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:16px;border:1px solid ${COLOR_BORDER};">
    <tr>
      <td style="background-color:${COLOR_TEAL};padding:24px 28px;border-radius:16px 16px 0 0;">
        <p style="margin:0;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;font-family:${FONT};">${escapeHtml(SITE_NAME)}</p>
        <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:700;font-family:${FONT};">${title}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        ${bodyHtml}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background-color:${COLOR_BG};border-top:1px solid ${COLOR_BORDER};border-radius:0 0 16px 16px;">
        <p style="margin:0;font-size:12px;color:${COLOR_TEXT_MUTED};font-family:${FONT};">${footerText}</p>
      </td>
    </tr>
  </table>
</div>`;
}
