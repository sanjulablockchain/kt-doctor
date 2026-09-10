// Formats a US display number like "(818) 361-5437" into E.164 for tel:/sms:
// links, e.g. "+18183615437". The display strings in lib/constants.ts are
// written for humans; every dialable link has to strip them back down.
export function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}
