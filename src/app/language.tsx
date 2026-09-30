import { useRouter } from 'expo-router';
import { Languages } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { useConfirm } from '@/components/ui/confirm-sheet';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { useLocale, useT } from '@/i18n';
import { changeLocale } from '@/i18n/direction';
import { cn } from '@/lib/cn';
import { getDirection, locales, type Locale } from '@/shared/web/i18n';
import { fontFamily } from '@/theme/fonts';

/** A short sample in each language, in its own script, so the choice is recognisable at a glance. */
const samples: Record<Locale, string> = {
  ar: 'مرحبًا بك في دوليشة',
  fr: 'Bienvenue sur Doulisha',
  en: 'Welcome to Doulisha',
};

/**
 * Language switch. Moving to or from Arabic flips the layout, which needs a
 * restart: the person confirms first (React Native limitation).
 */
export default function LanguageScreen() {
  const t = useT('App');
  const tLanguages = useT('Languages');
  const current = useLocale();
  const router = useRouter();
  const [sheet, confirm] = useConfirm();

  async function choose(locale: Locale) {
    if (locale === current) return router.back();
    const flips = getDirection(locale) !== getDirection(current);
    if (!flips) {
      await changeLocale(locale, { restart: false });
      return router.back();
    }
    const yes = await confirm({
      title: t('restartTitle'),
      body: t('restartBody'),
      confirmLabel: t('restartConfirm'),
      cancelLabel: t('cancel'),
      icon: Languages,
    });
    if (yes) await changeLocale(locale, { restart: true });
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 px-5 pb-8 pt-2">
      <Text className="text-muted-foreground">{t('languageHint')}</Text>
      <View accessibilityRole="radiogroup" className="gap-3">
        {locales.map((locale) => {
          const selected = locale === current;
          const script = locale === 'ar' ? 'arabic' : 'latin';
          return (
            <PressableScale
              key={locale}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={tLanguages(locale)}
              onPress={() => void choose(locale)}
              testID={`language-${locale}`}
              scaleTo={0.98}
              className={cn(
                'min-h-[72px] flex-row items-center gap-4 rounded-2xl border-[1.5px] px-4 py-3',
                selected ? 'border-primary bg-primary/10' : 'border-border bg-card',
              )}
            >
              <View className="flex-1 gap-0.5">
                {/* Each language is written in its own script, whatever the interface language. */}
                <Text
                  size="lg"
                  weight="bold"
                  style={{ fontFamily: fontFamily(script, 'body', 'bold') }}
                >
                  {tLanguages(locale)}
                </Text>
                <Text
                  size="sm"
                  className="text-muted-foreground"
                  style={{ fontFamily: fontFamily(script, 'body', 'regular') }}
                >
                  {samples[locale]}
                </Text>
              </View>
              <View
                className={cn(
                  'h-6 w-6 items-center justify-center rounded-full border-2',
                  selected ? 'border-primary' : 'border-input',
                )}
              >
                {selected ? <View className="h-3 w-3 rounded-full bg-primary" /> : null}
              </View>
            </PressableScale>
          );
        })}
      </View>
      <Text size="xs" className="text-muted-foreground">
        {t('languageSubtitle')}
      </Text>
      {sheet}
    </ScrollView>
  );
}
