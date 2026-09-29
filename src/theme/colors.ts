/**
 * Theme colours from the web's design tokens (ADR 0003). Tailwind classes use
 * CSS variables (`bg-primary` → `rgb(var(--color-primary))`), and the root
 * <ThemeProvider> sets them for the light or dark theme.
 *
 * Relative imports only: tailwind.config.ts loads this file outside Metro.
 */
import { themes, type ThemeColors } from '../shared/web/ui-tokens/tokens';

export type ColorName = keyof ThemeColors;
export type Scheme = 'light' | 'dark';

export const colorNames = Object.keys(themes.light) as ColorName[];

/** `primaryForeground` → `primary-foreground`, the Tailwind class suffix. */
export function toKebab(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** `#2D5A27` → `45 90 39`, the form Tailwind's `<alpha-value>` needs. */
export function hexToRgbChannels(hex: string): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) throw new Error(`Expected a #RRGGBB colour, got ${hex}`);
  const value = parseInt(match[1], 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

/** CSS variables of one theme, e.g. `{ '--color-primary': '45 90 39' }`. */
export function themeVariables(scheme: Scheme): Record<string, string> {
  return Object.fromEntries(
    colorNames.map((name) => [`--color-${toKebab(name)}`, hexToRgbChannels(themes[scheme][name])]),
  );
}

/** Tailwind colour definitions: `{ 'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)' }`. */
export function tailwindColors(): Record<string, string> {
  return Object.fromEntries(
    colorNames.map((name) => [toKebab(name), `rgb(var(--color-${toKebab(name)}) / <alpha-value>)`]),
  );
}

/** Plain colour values, for props that take a colour instead of a class (icons, status bar). */
export function themeColors(scheme: Scheme): ThemeColors {
  return themes[scheme];
}
