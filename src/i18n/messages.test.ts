import { IntlMessageFormat } from 'intl-messageformat';
import { describe, expect, it } from 'vitest';

import webAr from '@/shared/web/i18n/messages/ar.json';
import webEn from '@/shared/web/i18n/messages/en.json';
import webFr from '@/shared/web/i18n/messages/fr.json';

import appAr from './messages/ar.json';
import appEn from './messages/en.json';
import appFr from './messages/fr.json';

type Tree = { [key: string]: string | Tree };

function leaves(tree: Tree, prefix = ''): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [[`${prefix}${key}`, value]] : leaves(value, `${prefix}${key}.`),
  );
}

const app = { ar: appAr, fr: appFr, en: appEn };
const web = { ar: webAr as Tree, fr: webFr as Tree, en: webEn as Tree };

describe('app messages', () => {
  it('have the same keys in every language (English is the reference)', () => {
    const reference = Object.keys(appEn).sort();
    expect(Object.keys(appAr).sort()).toEqual(reference);
    expect(Object.keys(appFr).sort()).toEqual(reference);
  });
});

describe('messages with i18next-icu', () => {
  // The web renders these with next-intl; the app uses intl-messageformat
  // through i18next-icu. Every message must parse there too.
  for (const locale of ['ar', 'fr', 'en'] as const) {
    it(`parses every ${locale} message`, () => {
      const all = [...leaves(web[locale]), ...leaves(app[locale] as Tree, 'App.')];
      const broken = all.filter(([, message]) => {
        try {
          new IntlMessageFormat(message, locale);
          return false;
        } catch {
          return true;
        }
      });
      expect(broken.map(([key]) => key)).toEqual([]);
    });
  }

  it('uses Arabic plural forms', () => {
    const placesLeft = (locale: 'ar' | 'fr' | 'en', count: number) =>
      new IntlMessageFormat((web[locale].Event as Tree).placesLeft as string, locale).format({
        count,
      });
    expect(placesLeft('en', 1)).toBe('1 place left');
    expect(placesLeft('en', 0)).toBe('Full');
    expect(placesLeft('fr', 3)).toContain('3');
    expect(placesLeft('ar', 2)).not.toEqual(placesLeft('ar', 11));
  });

  it('agrees counts on event cards (found on the phone: "1 participants")', () => {
    const going = (locale: 'ar' | 'fr' | 'en', count: number) =>
      new IntlMessageFormat((web[locale].Event as Tree).going as string, locale).format({ count });
    expect(going('fr', 1)).toBe('1 participant');
    expect(going('fr', 16)).toBe('16 participants');
    expect(going('ar', 1)).toBe('مشارك واحد');
    expect(going('ar', 16)).toBe('16 مشاركًا');
  });
});
