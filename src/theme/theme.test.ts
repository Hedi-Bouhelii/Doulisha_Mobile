import { describe, expect, it } from 'vitest';

import { fontFiles } from '../../app.config';
import { contrastRatio } from '../shared/web/ui-tokens/contrast';
import { themes } from '../shared/web/ui-tokens/tokens';

import { hexToRgbChannels, tailwindColors, themeVariables, toKebab } from './colors';
import { allFamilies } from './fonts';

describe('theme colours', () => {
  it('converts hex colours to Tailwind channels', () => {
    expect(hexToRgbChannels('#2D5A27')).toBe('45 90 39');
    expect(() => hexToRgbChannels('red')).toThrow();
  });

  it('defines a variable for every Tailwind colour, in both themes', () => {
    const names = Object.keys(tailwindColors());
    for (const scheme of ['light', 'dark'] as const) {
      const variables = Object.keys(themeVariables(scheme));
      expect(variables).toEqual(names.map((name) => `--color-${name}`));
    }
    expect(toKebab('primaryForeground')).toBe('primary-foreground');
  });

  it('keeps body text readable (WCAG AA) in both themes', () => {
    for (const theme of [themes.light, themes.dark]) {
      expect(contrastRatio(theme.foreground, theme.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.mutedForeground, theme.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.primaryForeground, theme.primary)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('fonts', () => {
  it('embeds every font family the app uses', () => {
    const embedded = fontFiles.map((file) => file.split('/').pop()?.replace('.ttf', ''));
    for (const family of allFamilies) expect(embedded).toContain(family);
  });
});
