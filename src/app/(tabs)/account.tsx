import { useRouter } from 'expo-router';
import { Languages, LogOut, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useMe, useSession } from '@/features/auth/session';
import { useLocale, useT } from '@/i18n';
import { authClient } from '@/lib/auth-client';
import { useColors } from '@/theme/theme-provider';

/**
 * Account. Part 3a: who is signed in, the language and sign out. Sign-in
 * methods, privacy and blocked people come in part 3b ("My account").
 */
export default function AccountScreen() {
  const t = useT('App');
  const tNav = useT('Nav');
  const tLanguages = useT('Languages');
  const router = useRouter();
  const locale = useLocale();
  const colors = useColors();
  const { data: session, isPending } = useSession();
  const me = useMe();
  const [signingOut, setSigningOut] = useState(false);

  const member = session && !session.user.isAnonymous;

  function confirmSignOut() {
    Alert.alert(t('signOutConfirmTitle'), t('signOutConfirmBody'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: tNav('signOut'),
        style: 'destructive',
        onPress: () => {
          setSigningOut(true);
          void authClient.signOut().finally(() => setSigningOut(false));
        },
      },
    ]);
  }

  return (
    <Screen>
      {isPending ? (
        <View className="gap-2 rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </View>
      ) : member ? (
        <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <UserRound size={24} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text weight="semibold" size="lg" testID="account-name">
              {me.data?.name ?? session.user.name}
            </Text>
            {me.data?.phoneNumber ? (
              <Text size="sm" className="text-muted-foreground">
                {`⁦${me.data.phoneNumber}⁩`}
              </Text>
            ) : null}
          </View>
        </View>
      ) : (
        <View className="gap-3 rounded-xl border border-border bg-card p-4">
          <Text weight="semibold" size="lg">
            {session ? t('guestTitle') : t('signInToSeeTitle')}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {session ? t('guestHint') : t('signInToSeeHint')}
          </Text>
          <Button
            label={tNav('signIn')}
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
      )}

      <View className="overflow-hidden rounded-xl border border-border bg-card">
        <ListRow
          icon={Languages}
          label={t('languageTitle')}
          value={tLanguages(locale)}
          onPress={() => router.push('/language')}
          testID="account-language"
        />
        {member ? (
          <>
            <View className="h-px bg-border" />
            <ListRow
              icon={LogOut}
              label={signingOut ? `${tNav('signOut')}…` : tNav('signOut')}
              onPress={confirmSignOut}
              destructive
              testID="account-sign-out"
            />
          </>
        ) : null}
      </View>
    </Screen>
  );
}
