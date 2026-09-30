import './intl-polyfills';

import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import ICU from 'i18next-icu';
import { useCallback } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';

import { preferences } from '@/lib/storage';
import { defaultLocale, isLocale, type Locale } from '@/shared/web/i18n';
import webAr from '@/shared/web/i18n/messages/ar.json';
import webEn from '@/shared/web/i18n/messages/en.json';
import webFr from '@/shared/web/i18n/messages/fr.json';

import appAr from './messages/ar.json';
import appEn from './messages/en.json';
import appFr from './messages/fr.json';

/**
 * Interface text (ADR 0002): the web's messages, unchanged and in ICU format,
 * plus the app-only `App` namespace kept in this repository.
 */
export type Messages = typeof webEn & { App: typeof appEn };
export type Namespace = keyof Messages;

/** Dotted keys of a namespace, e.g. `'title'` or `'fields.distance'`. */
type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey<N extends Namespace> = Leaves<Messages[N]>;
export type MessageValues = Record<string, string | number | Date>;

const resources = {
  ar: { translation: { ...webAr, App: appAr } },
  fr: { translation: { ...webFr, App: appFr } },
  en: { translation: { ...webEn, App: appEn } },
};

/** The saved choice, else the phone's first supported language, else French (OPEN_QUESTIONS Q4). */
export function initialLocale(): Locale {
  const saved = preferences.get('locale');
  if (saved && isLocale(saved)) return saved;
  for (const locale of getLocales()) {
    if (isLocale(locale.languageCode ?? '')) return locale.languageCode as Locale;
  }
  return defaultLocale;
}

export const i18n = createInstance();

void i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLocale(),
    fallbackLng: defaultLocale,
    interpolation: { escapeValue: false },
    returnNull: false,
    // Resources are bundled, so i18next is ready before the first render.
    initAsync: false,
  });

export function currentLocale(): Locale {
  return isLocale(i18n.language) ? i18n.language : defaultLocale;
}

/** Translations of one namespace, typed from the English messages. */
export function useT<N extends Namespace>(namespace: N) {
  const { t } = useTranslation();
  return useCallback(
    (key: MessageKey<N>, values?: MessageValues): string => t(`${namespace}.${key}`, values),
    [t, namespace],
  );
}

/** The interface language, re-rendering when it changes. */
export function useLocale(): Locale {
  const { i18n: instance } = useTranslation();
  return isLocale(instance.language) ? instance.language : defaultLocale;
}

/** Whether a key exists, e.g. for API error keys (`errors.soldOut` → `Errors.soldOut`). */
export function hasMessage(key: string): boolean {
  return i18n.exists(key);
}
