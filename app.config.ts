import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Fonts embedded at build time (src/theme/fonts.ts names the families). Listed
 * here because the config loader cannot import other TypeScript files.
 */
export const fontFiles = [
  'inter/400Regular/Inter_400Regular.ttf',
  'inter/500Medium/Inter_500Medium.ttf',
  'inter/600SemiBold/Inter_600SemiBold.ttf',
  'inter/700Bold/Inter_700Bold.ttf',
  'playfair-display/600SemiBold/PlayfairDisplay_600SemiBold.ttf',
  'playfair-display/700Bold/PlayfairDisplay_700Bold.ttf',
  'amiri/400Regular/Amiri_400Regular.ttf',
  'amiri/700Bold/Amiri_700Bold.ttf',
  'ibm-plex-sans-arabic/400Regular/IBMPlexSansArabic_400Regular.ttf',
  'ibm-plex-sans-arabic/500Medium/IBMPlexSansArabic_500Medium.ttf',
  'ibm-plex-sans-arabic/600SemiBold/IBMPlexSansArabic_600SemiBold.ttf',
  'ibm-plex-sans-arabic/700Bold/IBMPlexSansArabic_700Bold.ttf',
].map((file) => `./node_modules/@expo-google-fonts/${file}`);

/**
 * Build variants (ADR 0001): `development` (dev client), `preview` (installable
 * test build) and `production` (Play Store). Chosen by APP_VARIANT, set in
 * eas.json per build profile; local runs default to development.
 */
type Variant = 'development' | 'preview' | 'production';

const variant: Variant = (() => {
  const value = process.env.APP_VARIANT;
  return value === 'preview' || value === 'production' ? value : 'development';
})();

/** Android package per variant, so test builds install next to the store app (OPEN_QUESTIONS Q2). */
const androidPackage = {
  development: 'tn.doulisha.app.dev',
  preview: 'tn.doulisha.app.preview',
  production: 'tn.doulisha.app',
}[variant];

const name = { development: 'Doulisha (dev)', preview: 'Doulisha (test)', production: 'Doulisha' }[
  variant
];

const cream = '#F5F0E8';
const darkBackground = '#15120F';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name,
  slug: 'doulisha',
  version: '0.1.0',
  platforms: ['android', 'ios'],
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'doulisha',
  userInterfaceStyle: 'automatic',
  backgroundColor: cream,
  ios: {
    bundleIdentifier: 'tn.doulisha.app',
    supportsTablet: false,
  },
  android: {
    package: androidPackage,
    adaptiveIcon: {
      backgroundColor: cream,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: cream,
        image: './assets/images/splash-icon.png',
        imageWidth: 180,
        dark: { backgroundColor: darkBackground },
      },
    ],
    ['expo-font', { fonts: fontFiles }],
    'expo-localization',
    'expo-secure-store',
    'expo-sqlite',
    'expo-web-browser',
    'expo-image',
    './plugins/with-shared-ndk.js',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    variant,
  },
});
