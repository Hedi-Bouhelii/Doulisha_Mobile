/**
 * Initials for an avatar: "Yasmine Ayari" → "YA", "سامي بن علي" → "سب".
 * Empty when the name has no letters (a new account is named after its phone
 * number until setup), so the avatar shows an icon instead.
 */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => /\p{L}/u.test(part))
    .slice(0, 2)
    .map((part) => [...part].find((char) => /\p{L}/u.test(char))?.toUpperCase() ?? '')
    .join('');
}
