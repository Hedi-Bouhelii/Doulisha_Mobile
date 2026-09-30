import * as WebBrowser from 'expo-web-browser';
import {
  CalendarPlus,
  Check,
  ExternalLink,
  Mail,
  Phone,
  Ticket,
  type LucideIcon,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/ui/button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { API_URL, isDevelopment } from '@/lib/config';
import { useColors, useElevation } from '@/theme/theme-provider';

import type { AccountType, Method } from './identifier';

const symbol = require('@/assets/images/symbol.png') as number;

/**
 * Every auth screen: the Doulisha mark, a large title and subtitle, the form,
 * and a footer that stays clear of the navigation bar. The page moves up with
 * the keyboard so the field being typed in stays visible.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  return (
    <KeyboardAwareScrollView
      // Scrolls the field being typed in above the keyboard (Android edge to edge).
      bottomOffset={32}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: insets.bottom + 24,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(250)} className="gap-3 pb-8">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Image
            source={symbol}
            style={{ width: 44, height: 30 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
        <Text font="display" weight="bold" size="4xl" accessibilityRole="header" className="pt-2">
          {title}
        </Text>
        {subtitle ? <Text className="text-muted-foreground">{subtitle}</Text> : null}
      </Animated.View>
      <View className="gap-5">{children}</View>
      {footer ? <View className="mt-auto items-center pt-8">{footer}</View> : null}
    </KeyboardAwareScrollView>
  );
}

/** "Already have an account? Sign in" under the form. */
export function AuthFooter({
  question,
  action,
  onPress,
  testID,
}: {
  question: string;
  action: string;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-x-1">
      <Text size="sm" className="text-muted-foreground">
        {question}
      </Text>
      <Pressable
        accessibilityRole="link"
        onPress={onPress}
        hitSlop={8}
        className="min-h-11 justify-center"
        testID={testID}
      >
        <Text size="sm" weight="bold" className="text-primary">
          {action}
        </Text>
      </Pressable>
    </View>
  );
}

/** Phone or email, as a two-segment switch. */
export function MethodSwitch({
  value,
  onChange,
}: {
  value: Method;
  onChange: (m: Method) => void;
}) {
  const t = useT('Auth');
  const colors = useColors();
  const raised = useElevation('card');
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('methodLabel')}
      className="flex-row gap-1 rounded-full bg-muted p-1"
    >
      {(['phone', 'email'] as const).map((m) => {
        const Icon = m === 'phone' ? Phone : Mail;
        const selected = value === m;
        return (
          <Pressable
            key={m}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(m)}
            testID={`method-${m}`}
            className={cn(
              'min-h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full px-3',
              selected && 'bg-card',
            )}
            style={selected ? raised : undefined}
          >
            <Icon size={17} color={selected ? colors.primary : colors.mutedForeground} />
            <Text
              size="sm"
              weight="semibold"
              numberOfLines={1}
              className={selected ? 'text-foreground' : 'text-muted-foreground'}
            >
              {t(m === 'phone' ? 'phoneTab' : 'emailTab')}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Phone number or email address, depending on the method. */
export function IdentifierField({
  method,
  value,
  onChange,
  invalid,
  onSubmit,
  last = false,
}: {
  method: Method;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  /** The keyboard's action key: the next field, or the form's main action. */
  onSubmit?: () => void;
  /** No field after this one: the key says "done" / "go". */
  last?: boolean;
}) {
  const t = useT('Auth');
  const keyboard = {
    returnKeyType: last ? ('go' as const) : ('next' as const),
    submitBehavior: last ? ('blurAndSubmit' as const) : ('submit' as const),
    onSubmitEditing: onSubmit,
  };
  return method === 'phone' ? (
    <TextField
      label={t('phoneLabel')}
      hint={t('phoneHint')}
      icon={Phone}
      ltr
      value={value}
      onChangeText={onChange}
      keyboardType="phone-pad"
      autoComplete="tel"
      textContentType="telephoneNumber"
      placeholder="20 123 456"
      invalid={invalid}
      testID="phone-field"
      {...keyboard}
    />
  ) : (
    <TextField
      label={t('emailLabel')}
      icon={Mail}
      ltr
      value={value}
      onChangeText={onChange}
      keyboardType="email-address"
      autoComplete="email"
      textContentType="emailAddress"
      autoCapitalize="none"
      autoCorrect={false}
      invalid={invalid}
      testID="email-field"
      {...keyboard}
    />
  );
}

/** "I join events" / "I organize events" (ACC-05: the same account can do both later). */
export function AccountTypeCards({
  value,
  onChange,
}: {
  value: AccountType;
  onChange: (type: AccountType) => void;
}) {
  const t = useT('Auth');
  const colors = useColors();
  const options: { type: AccountType; icon: LucideIcon; title: string; hint: string }[] = [
    {
      type: 'participant',
      icon: Ticket,
      title: t('typeParticipant'),
      hint: t('typeParticipantHint'),
    },
    {
      type: 'organizer',
      icon: CalendarPlus,
      title: t('typeOrganizer'),
      hint: t('typeOrganizerHint'),
    },
  ];
  return (
    <View className="gap-3">
      <Text size="sm" weight="semibold">
        {t('accountTypeLabel')}
      </Text>
      <View accessibilityRole="radiogroup" className="flex-row gap-3">
        {options.map(({ type, icon: Icon, title, hint }) => {
          const selected = value === type;
          return (
            <PressableScale
              key={type}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${title}. ${hint}`}
              onPress={() => onChange(type)}
              testID={`account-type-${type}`}
              containerStyle={{ flex: 1 }}
              className={cn(
                'min-h-[148px] gap-2 rounded-xl border-[1.5px] p-4',
                selected ? 'border-primary bg-primary/10' : 'border-border bg-card',
              )}
            >
              <View className="flex-row items-start justify-between">
                <View
                  className={cn(
                    'h-11 w-11 items-center justify-center rounded-full',
                    selected ? 'bg-primary' : 'bg-secondary',
                  )}
                >
                  <Icon size={21} color={selected ? colors.primaryForeground : colors.primary} />
                </View>
                <View
                  className={cn(
                    'h-6 w-6 items-center justify-center rounded-full border-[1.5px]',
                    selected ? 'border-primary bg-primary' : 'border-input',
                  )}
                >
                  {selected ? (
                    <Check size={14} color={colors.primaryForeground} strokeWidth={3} />
                  ) : null}
                </View>
              </View>
              <Text weight="bold">{title}</Text>
              <Text size="xs" className="text-muted-foreground">
                {hint}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

export type SocialProvider = 'google' | 'facebook';

function ProviderLogo({ provider }: { provider: SocialProvider }) {
  if (provider === 'google') {
    return (
      <Svg viewBox="0 0 24 24" width={20} height={20}>
        <Path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"
        />
        <Path
          fill="#34A853"
          d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"
        />
        <Path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
        <Path
          fill="#EA4335"
          d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"
        />
      </Svg>
    );
  }
  return (
    <Svg viewBox="0 0 24 24" width={20} height={20}>
      <Circle cx={12} cy={12} r={12} fill="#1877F2" />
      <Path
        fill="#fff"
        d="M16.7 15.5l.5-3.5h-3.3V9.8c0-1 .5-1.9 2-1.9h1.5v-3s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.7V12H7v3.5h3.1V24h3.8v-8.5h2.8z"
      />
    </Svg>
  );
}

/** "Continue with Google / Facebook" below the code form (UX_GUIDELINES, web ADR 0019). */
export function SocialButtons({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (provider: SocialProvider) => void;
}) {
  const t = useT('Auth');
  return (
    <View className="gap-3">
      <Divider label={t('orContinueWith')} />
      {(['google', 'facebook'] as const).map((provider) => (
        <Button
          key={provider}
          variant="outline"
          label={t(provider)}
          icon={<ProviderLogo provider={provider} />}
          disabled={disabled}
          onPress={() => onSelect(provider)}
          testID={`social-${provider}`}
        />
      ))}
    </View>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 py-1">
      <View className="h-px flex-1 bg-border" />
      <Text size="xs" weight="medium" className="text-muted-foreground">
        {label}
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

/** Development builds: codes are in the web's dev outbox, opened in the in-app browser. */
export function DevOutboxNote() {
  const t = useT('Auth');
  const tApp = useT('App');
  const locale = useLocale();
  const colors = useColors();
  if (!isDevelopment) return null;
  return (
    <View className="gap-1 rounded-lg border border-dashed border-border px-4 py-3">
      <Text size="xs" className="text-center text-muted-foreground">
        {t('devOutbox')}
      </Text>
      <Button
        variant="link"
        size="sm"
        label={tApp('devOutboxLink')}
        icon={<ExternalLink size={15} color={colors.primary} />}
        onPress={() => void WebBrowser.openBrowserAsync(`${API_URL}/${locale}/dev/outbox`)}
        testID="dev-outbox"
      />
    </View>
  );
}
