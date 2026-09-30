import Constants from 'expo-constants';

export type Variant = 'development' | 'preview' | 'production';

/** Set by app.config.ts from APP_VARIANT. */
export const variant: Variant = (Constants.expoConfig?.extra?.variant as Variant) ?? 'development';

/**
 * Where the API lives. The Android emulator reaches the computer's
 * localhost as 10.0.2.2; a real phone needs the computer's LAN address in
 * EXPO_PUBLIC_API_URL (.env.local, see .env.example).
 */
const defaultApiUrl: Record<Variant, string> = {
  development: 'http://10.0.2.2:3000',
  preview: 'https://doulisha.vercel.app',
  production: 'https://doulisha.vercel.app',
};

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || defaultApiUrl[variant]).replace(
  /\/$/,
  '',
);

/** Development helpers (dev outbox link) only outside production builds. */
export const isDevelopment = variant === 'development';
