import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { categoryAccents, radii } from './src/shared/web/ui-tokens/tokens';
import { tailwindColors, themeVariables } from './src/theme/colors';

// eslint-disable-next-line @typescript-eslint/no-require-imports -- NativeWind ships its preset as CommonJS.
const nativewindPreset = require('nativewind/preset');

/** Category accents as `cat-outdoor`, `cat-outdoor-bg`, `cat-outdoor-fg` (UX_GUIDELINES). */
const categoryColors = Object.fromEntries(
  Object.entries(categoryAccents).flatMap(([name, accent]) => [
    [`cat-${name}`, accent.solid],
    [`cat-${name}-bg`, accent.bg],
    [`cat-${name}-fg`, accent.fg],
  ]),
);

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: { ...tailwindColors(), ...categoryColors },
      borderRadius: radii,
    },
  },
  plugins: [
    // Light values by default; <ThemeProvider> swaps them for the dark theme.
    plugin(({ addBase }) => addBase({ ':root': themeVariables('light') })),
  ],
} satisfies Config;
