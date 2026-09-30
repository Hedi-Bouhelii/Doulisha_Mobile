import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Languages, LogOut, Sparkles, UserRound } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-sheet';
import { ListRow, ListSection } from '@/components/ui/list-row';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { isOrganizer, useMe, useSession } from '@/features/auth/session';
import { useLocale, useT } from '@/i18n';
import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/lib/trpc';
import { cn } from '@/lib/cn';
import { initials } from '@/lib/initials';
import { formatPhone } from '@/lib/phone';
import { useColors, useElevation } from '@/theme/theme-provider';

const symbol = require('@/assets/images/symbol.png') as number;

/**
 * Account. Part 3a: who is signed in, the language and sign out. Sign-in
 * methods, privacy and blocked people come in part 3b ("My account").
 */
export default function AccountScreen() {
  const t = useT('App');
  const tAuth = useT('Auth');
  const tNav = useT('Nav');
  const tEvent = useT('Event');
  const tLanguages = useT('Languages');
  const router = useRouter();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const elevation = useElevation('card');
  const { data: session, isPending } = useSession();
  const me = useMe();
  const colors = useColors();
  const trpc = useTRPC();
  const [signingOut, setSigningOut] = useState(false);
  const [sheet, confirm] = useConfirm();

  const member = session && !session.user.isAnonymous;
  const name = me.data?.name ?? session?.user.name ?? '';
  const organizer = isOrganizer(me.data?.roles);
  // An account that verified its code but has no name or password yet (ADR 0016 of the web).
  const status = useQuery({ ...trpc.account.status.queryOptions(), enabled: !!member });
  const letters = initials(name);

  async function signOut() {
    const yes = await confirm({
      title: t('signOutConfirmTitle'),
      body: t('signOutConfirmBody'),
      confirmLabel: tNav('signOut'),
      cancelLabel: t('cancel'),
      icon: LogOut,
      destructive: true,
    });
    if (!yes) return;
    setSigningOut(true);
    await authClient.signOut().finally(() => setSigningOut(false));
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-5"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Text font="display" weight="bold" size="4xl" accessibilityRole="header">
        {t('tabAccount')}
      </Text>

      {isPending ? (
        <View className="flex-row items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <Skeleton className="h-16 w-16 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </View>
        </View>
      ) : member ? (
        <View
          className="flex-row items-center gap-4 rounded-3xl border border-border bg-card p-5"
          style={elevation}
        >
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            {letters ? (
              <Text
                size="2xl"
                weight="bold"
                className="text-primary-foreground"
                maxFontSizeMultiplier={1.2}
              >
                {letters}
              </Text>
            ) : (
              <UserRound size={30} color={colors.primaryForeground} />
            )}
          </View>
          <View className="flex-1 gap-0.5">
            <Text weight="bold" size="xl" numberOfLines={2} testID="account-name">
              {/* Until setup, the account is named after its number: show it once, grouped. */}
              {letters ? name : `\u2066${formatPhone(name)}\u2069`}
            </Text>
            {letters && me.data?.phoneNumber ? (
              <Text size="sm" className="text-muted-foreground">
                {`\u2066${formatPhone(me.data.phoneNumber)}\u2069`}
              </Text>
            ) : null}
            <View className="mt-1.5 flex-row">
              <View
                className={cn(
                  'rounded-full px-2.5 py-1',
                  organizer ? 'bg-highlight-soft' : 'bg-secondary',
                )}
              >
                <Text
                  size="xs"
                  weight="semibold"
                  className={organizer ? 'text-highlight' : 'text-primary'}
                >
                  {organizer ? tEvent('organizer') : t('memberSince')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          className="items-center gap-4 rounded-3xl border border-border bg-card px-5 py-7"
          style={elevation}
        >
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Image source={symbol} style={{ width: 44, height: 30 }} resizeMode="contain" />
          </View>
          <View className="gap-1.5">
            <Text font="display" weight="bold" size="2xl" className="text-center">
              {session ? t('guestTitle') : t('signInToSeeTitle')}
            </Text>
            <Text className="text-center text-muted-foreground">
              {session ? t('guestHint') : t('signInToSeeHint')}
            </Text>
          </View>
          <View className="gap-2.5 self-stretch pt-1">
            <Button
              label={tNav('signIn')}
              size="lg"
              onPress={() => router.push('/sign-in')}
              testID="account-sign-in"
            />
            <Button
              variant="outline"
              label={tNav('signUp')}
              onPress={() => router.push('/sign-up')}
              testID="account-sign-up"
            />
          </View>
        </View>
      )}

      {member && status.data?.needsSetup ? (
        <View className="gap-3 rounded-3xl bg-highlight-soft p-5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-card">
              <Sparkles size={20} color={colors.highlight} />
            </View>
            <Text size="lg" weight="bold" className="flex-1 text-highlight">
              {tAuth('setupTitle')}
            </Text>
          </View>
          <Text className="text-foreground">{tAuth('setupSubtitle')}</Text>
          <Button
            label={tAuth('finishSignUp')}
            onPress={() => router.push('/account-setup')}
            testID="account-finish-setup"
          />
        </View>
      ) : null}

      <ListSection title={t('preferences')}>
        <ListRow
          icon={Languages}
          label={t('languageTitle')}
          value={tLanguages(locale)}
          onPress={() => router.push('/language')}
          testID="account-language"
        />
      </ListSection>

      {member ? (
        <ListSection title={t('accountSection')}>
          <ListRow
            icon={LogOut}
            label={signingOut ? `${tNav('signOut')}…` : tNav('signOut')}
            onPress={() => void signOut()}
            destructive
            testID="account-sign-out"
          />
        </ListSection>
      ) : null}

      <Text size="xs" className="text-center text-muted-foreground">
        {`Doulisha ${Constants.expoConfig?.version ?? ''}`}
      </Text>
      {sheet}
    </ScrollView>
  );
}
