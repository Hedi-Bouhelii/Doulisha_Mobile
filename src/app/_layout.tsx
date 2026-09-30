import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationTheme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionSync } from '@/features/auth/session';
import { currentLocale, useLocale, useT } from '@/i18n';
import { ensureDirection } from '@/i18n/direction';
import { ApiProvider } from '@/lib/trpc';
import { fontFamily } from '@/theme/fonts';
import { ThemeProvider, useColors, useScheme } from '@/theme/theme-provider';

void SplashScreen.preventAutoHideAsync();

/** The tabs are always under any other screen, so "back" never leaves the app by surprise. */
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  useEffect(() => {
    ensureDirection(currentLocale());
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <ApiProvider>
              <SessionSync />
              <Navigation />
            </ApiProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function Navigation() {
  const scheme = useScheme();
  const colors = useColors();
  const arabic = useLocale() === 'ar';
  const tApp = useT('App');

  // Navigation bars and screen backgrounds use the Doulisha palette.
  const theme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.foreground,
        border: colors.border,
        notification: colors.highlight,
      },
    };
  }, [scheme, colors]);

  return (
    <NavigationTheme value={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontFamily: fontFamily(arabic ? 'arabic' : 'latin', 'body', 'semibold'),
          },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Auth screens carry their own large title; the bar only holds "back". */}
        <Stack.Screen name="sign-in" options={{ title: '' }} />
        <Stack.Screen name="sign-up" options={{ title: '' }} />
        <Stack.Screen name="forgot-password" options={{ title: '' }} />
        <Stack.Screen name="account-setup" options={{ title: '', headerBackVisible: false }} />
        <Stack.Screen name="language" options={{ title: tApp('languageTitle') }} />
      </Stack>
    </NavigationTheme>
  );
}
