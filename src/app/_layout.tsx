import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationTheme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionSync } from '@/features/auth/session';
import { currentLocale, useLocale, useT } from '@/i18n';
import { ensureDirection } from '@/i18n/direction';
import { ApiProvider } from '@/lib/trpc';
import { fontFamily } from '@/theme/fonts';
import { ThemeProvider, useColors, useScheme } from '@/theme/theme-provider';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    ensureDirection(currentLocale());
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ApiProvider>
            <SessionSync />
            <Navigation />
          </ApiProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function Navigation() {
  const scheme = useScheme();
  const colors = useColors();
  const arabic = useLocale() === 'ar';
  const t = useT('Auth');
  const tNav = useT('Nav');
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
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ title: tNav('signIn') }} />
        <Stack.Screen name="sign-up" options={{ title: tNav('signUp') }} />
        <Stack.Screen name="forgot-password" options={{ title: t('resetTitle') }} />
        <Stack.Screen
          name="account-setup"
          options={{ title: t('setupTitle'), headerBackVisible: false }}
        />
        <Stack.Screen
          name="language"
          options={{ title: tApp('languageTitle'), presentation: 'modal' }}
        />
      </Stack>
    </NavigationTheme>
  );
}
