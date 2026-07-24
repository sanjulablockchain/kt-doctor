// Escapes the five HTML-significant characters so user-supplied text is safe to
// embed in an HTML email body. Shared by the contact and careers server actions.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
