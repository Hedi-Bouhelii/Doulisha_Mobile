import * as SystemUI from 'expo-system-ui';
import { useColorScheme, vars } from 'nativewind';
import { useEffect, type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

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

/**
 * Soft, layered shadows for cards in the light theme (warm ink, not grey);
 * the dark theme separates surfaces by colour and borders instead.
 */
const elevations = {
  card: '0px 1px 2px rgba(42, 36, 32, 0.06), 0px 8px 24px rgba(42, 36, 32, 0.08)',
  raised: '0px 2px 4px rgba(42, 36, 32, 0.08), 0px 16px 40px rgba(42, 36, 32, 0.14)',
} as const;

export function useElevation(level: keyof typeof elevations): ViewStyle {
  return useScheme() === 'dark' ? {} : { boxShadow: elevations[level] };
}

/**
 * Sets the theme's CSS variables for every Tailwind class below it, and paints
 * the window behind the app (seen under Android's navigation bar, edge to edge).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useScheme();
  const background = themeColors(scheme).background;
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(background);
  }, [background]);
  return (
    <View style={[{ flex: 1, backgroundColor: background }, variables[scheme]]}>{children}</View>
  );
}
