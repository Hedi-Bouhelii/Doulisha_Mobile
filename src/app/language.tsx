import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Alert, Pressable, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useLocale, useT } from '@/i18n';
import { changeLocale } from '@/i18n/direction';
import { getDirection, locales, type Locale } from '@/shared/web/i18n';
import { useColors } from '@/theme/theme-provider';

/**
 * Language switch. Moving to or from Arabic flips the layout, which needs a
 * restart: the person confirms first (React Native limitation).
 */
export default function LanguageScreen() {
  const t = useT('App');
  const tLanguages = useT('Languages');
  const current = useLocale();
  const router = useRouter();
  const colors = useColors();

  function choose(locale: Locale) {
    if (locale === current) return router.back();
    const flips = getDirection(locale) !== getDirection(current);
    if (!flips) {
      void changeLocale(locale, { restart: false });
      return router.back();
    }
    Alert.alert(t('restartTitle'), t('restartBody'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('restartConfirm'), onPress: () => void changeLocale(locale, { restart: true }) },
    ]);
  }

  return (
    <Screen>
      <Text className="text-muted-foreground">{t('languageHint')}</Text>
      <View
        accessibilityRole="radiogroup"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        {locales.map((locale, index) => {
          const selected = locale === current;
          return (
            <View key={locale}>
              {index > 0 ? <View className="h-px bg-border" /> : null}
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => choose(locale)}
                testID={`language-${locale}`}
                className="min-h-14 flex-row items-center justify-between px-4 active:bg-accent"
              >
                {/* Each language's name in its own script (العربية, Français, English). */}
                <Text weight={selected ? 'semibold' : 'regular'}>{tLanguages(locale)}</Text>
                {selected ? <Check size={20} color={colors.primary} /> : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
