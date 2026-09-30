/**
 * An E.164 number grouped for reading: Tunisian numbers as "+216 50 000 001",
 * as people say them; other countries' numbers are left as stored.
 */
export function formatPhone(e164: string): string {
  const tunisian = /^\+216(\d{2})(\d{3})(\d{3})$/.exec(e164);
  return tunisian ? `+216 ${tunisian[1]} ${tunisian[2]} ${tunisian[3]}` : e164;
}
