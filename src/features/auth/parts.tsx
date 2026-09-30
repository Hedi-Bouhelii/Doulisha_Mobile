import * as WebBrowser from 'expo-web-browser';
import { CalendarPlus, Mail, Phone, Ticket, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { API_URL, isDevelopment } from '@/lib/config';
import { useColors } from '@/theme/theme-provider';

import type { AccountType, Method } from './identifier';

const symbol = require('@/assets/images/splash-icon.png') as number;

/** Every auth screen: the logo, a title, a subtitle, then the form (like the web's AuthCard). */
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
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow justify-center px-4 py-8"
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-6 rounded-xl border border-border bg-card p-6">
        <View className="items-center gap-2">
          <Image
            source={symbol}
            className="h-14 w-24"
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text
            font="display"
            weight="bold"
            size="3xl"
            className="text-center"
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text size="sm" className="text-center text-muted-foreground">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {children}
      </View>
      {footer ? <View className="mt-5 items-center">{footer}</View> : null}
    </ScrollView>
  );
}

/** Phone or email, as a two-button switch. */
export function MethodSwitch({
  value,
  onChange,
}: {
  value: Method;
  onChange: (m: Method) => void;
}) {
  const t = useT('Auth');
  const colors = useColors();
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
              'min-h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full',
              selected && 'bg-card',
            )}
          >
            <Icon size={16} color={selected ? colors.foreground : colors.mutedForeground} />
            <Text
              size="sm"
              weight="medium"
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
}: {
  method: Method;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const t = useT('Auth');
  return method === 'phone' ? (
    <TextField
      label={t('phoneLabel')}
      hint={t('phoneHint')}
      value={value}
      onChangeText={onChange}
      keyboardType="phone-pad"
      autoComplete="tel"
      textContentType="telephoneNumber"
      placeholder="20 123 456"
      invalid={invalid}
      testID="phone-field"
    />
  ) : (
    <TextField
      label={t('emailLabel')}
      value={value}
      onChangeText={onChange}
      keyboardType="email-address"
      autoComplete="email"
      textContentType="emailAddress"
      autoCapitalize="none"
      autoCorrect={false}
      invalid={invalid}
      testID="email-field"
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
    <View className="gap-2">
      <Text size="sm" weight="medium">
        {t('accountTypeLabel')}
      </Text>
      <View accessibilityRole="radiogroup" className="flex-row gap-2">
        {options.map(({ type, icon: Icon, title, hint }) => {
          const selected = value === type;
          return (
            <Pressable
              key={type}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${title}. ${hint}`}
              onPress={() => onChange(type)}
              testID={`account-type-${type}`}
              className={cn(
                'flex-1 gap-1.5 rounded-lg border p-3',
                selected ? 'border-primary bg-primary/5' : 'border-border',
              )}
            >
              <Icon size={20} color={selected ? colors.primary : colors.mutedForeground} />
              <Text size="sm" weight="semibold">
                {title}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {hint}
              </Text>
            </Pressable>
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

/** "Continue with Google / Facebook" below the code form (UX_GUIDELINES, ADR 0019 of the web). */
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
      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1 bg-border" />
        <Text size="xs" className="text-muted-foreground">
          {t('orContinueWith')}
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>
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

/** Development builds: codes are in the web's dev outbox, opened in the in-app browser. */
export function DevOutboxNote() {
  const t = useT('Auth');
  const tApp = useT('App');
  const locale = useLocale();
  if (!isDevelopment) return null;
  return (
    <View className="gap-1 rounded-md border border-dashed border-border p-3">
      <Text size="xs" className="text-center text-muted-foreground">
        {t('devOutbox')}
      </Text>
      <Button
        variant="link"
        label={tApp('devOutboxLink')}
        onPress={() => void WebBrowser.openBrowserAsync(`${API_URL}/${locale}/dev/outbox`)}
        testID="dev-outbox"
      />
    </View>
  );
}
