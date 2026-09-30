/**
 * Font families embedded at build time by the expo-font plugin (app.config.ts).
 * On Android a family name is the file name, and each weight is its own family,
 * so text picks a family instead of using `fontWeight`.
 *
 * Latin: Playfair Display (headlines), Inter (body).
 * Arabic: Amiri (headlines), IBM Plex Sans Arabic (body). ADR 0009 (web).
 */
export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type FontRole = 'body' | 'display';
export type Script = 'latin' | 'arabic';

const families: Record<Script, Record<FontRole, Record<FontWeight, string>>> = {
  latin: {
    body: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
      bold: 'Inter_700Bold',
    },
    display: {
      regular: 'PlayfairDisplay_600SemiBold',
      medium: 'PlayfairDisplay_600SemiBold',
      semibold: 'PlayfairDisplay_600SemiBold',
      bold: 'PlayfairDisplay_700Bold',
    },
  },
  arabic: {
    body: {
      regular: 'IBMPlexSansArabic_400Regular',
      medium: 'IBMPlexSansArabic_500Medium',
      semibold: 'IBMPlexSansArabic_600SemiBold',
      bold: 'IBMPlexSansArabic_700Bold',
    },
    display: {
      regular: 'Amiri_400Regular',
      medium: 'Amiri_700Bold',
      semibold: 'Amiri_700Bold',
      bold: 'Amiri_700Bold',
    },
  },
};

export function fontFamily(script: Script, role: FontRole, weight: FontWeight): string {
  return families[script][role][weight];
}

/** Arabic body text needs more room between lines (UX_GUIDELINES). */
export const ARABIC_LINE_HEIGHT = 1.7;

/** Every family above; each must be embedded by app.config.ts (checked by fonts.test.ts). */
export const allFamilies = [
  ...new Set(
    Object.values(families).flatMap((roles) =>
      Object.values(roles).flatMap((weights) => Object.values(weights)),
    ),
  ),
];
