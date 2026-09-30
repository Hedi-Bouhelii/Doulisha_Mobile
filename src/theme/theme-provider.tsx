import { useColorScheme, vars } from 'nativewind';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { ThemeColors } from '@/shared/web/ui-tokens/tokens';

import { themeColors, themeVariables, type Scheme } from './colors';

const variables = {
  light: vars(themeVariables('light')),
  dark: vars(themeVariables('dark')),
};

/** Light or dark, following the phone's setting (UX_GUIDELINES). */
export function useScheme(): Scheme {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}

/** Plain colour values of the current theme, for props that take a colour. */
export function useColors(): ThemeColors {
  return themeColors(useScheme());
}

/** Sets the theme's CSS variables for every Tailwind class below it. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useScheme();
  return <View style={[{ flex: 1 }, variables[scheme]]}>{children}</View>;
}
