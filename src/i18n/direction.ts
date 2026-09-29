import * as Updates from 'expo-updates';
import { DevSettings, I18nManager } from 'react-native';

import { preferences } from '@/lib/storage';
import { getDirection, type Locale } from '@/shared/web/i18n';

import { i18n } from './index';

/** Whether the layout direction differs from the one this language needs. */
export function directionMismatch(locale: Locale): boolean {
  return (getDirection(locale) === 'rtl') !== I18nManager.isRTL;
}

/**
 * Switches the interface language. Arabic flips the layout, which React
 * Native only applies after a restart, so the caller asks first and passes
 * `restart: true` when the direction changes.
 */
export async function changeLocale(locale: Locale, { restart }: { restart: boolean }) {
  preferences.set('locale', locale);
  await i18n.changeLanguage(locale);
  const rtl = getDirection(locale) === 'rtl';
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  if (restart) await reloadApp();
}

/**
 * Keeps the layout direction in step with the language at startup, e.g. an
 * Arabic phone where the person chose French. Reloads at most once in a row.
 */
export function ensureDirection(locale: Locale): void {
  if (!directionMismatch(locale)) {
    preferences.set('directionReload', '');
    return;
  }
  if (preferences.get('directionReload') === locale) return;
  preferences.set('directionReload', locale);
  const rtl = getDirection(locale) === 'rtl';
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  void reloadApp();
}

async function reloadApp() {
  try {
    await Updates.reloadAsync();
  } catch {
    // Development builds without expo-updates enabled.
    DevSettings.reload();
  }
}
