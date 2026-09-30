import { TIME_ZONE, type Locale } from '@/shared/web/i18n';

/** Same BCP 47 tags as the web's formatters: Latin digits in Arabic, as in Tunisia. */
const tags: Record<Locale, string> = { ar: 'ar-TN-u-nu-latn', fr: 'fr-TN', en: 'en-GB' };

const cache = new Map<string, Intl.DateTimeFormat>();
function format(locale: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(tags[locale], { timeZone: TIME_ZONE, ...options });
    cache.set(key, formatter);
  }
  return formatter;
}

/** The calendar badge on event cards: "3" and "oct." in Tunisia time. */
export function dateBadge(date: Date, locale: Locale): { day: string; month: string } {
  return {
    day: format(locale, { day: 'numeric' }).format(date),
    month: format(locale, { month: 'short' }).format(date).replace('.', ''),
  };
}
