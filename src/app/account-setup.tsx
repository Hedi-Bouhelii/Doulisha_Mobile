import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock, MapPin, UserRound, WifiOff } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, View, type TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FormError } from '@/components/ui/form-error';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import type { AccountType } from '@/features/auth/identifier';
import { AccountTypeCards, AuthLayout } from '@/features/auth/parts';
import { useT } from '@/i18n';
import { useErrorMessage } from '@/i18n/errors';
import type { RouterOutputs } from '@/shared/web/api-types';
import { useTRPC } from '@/lib/trpc';

const MIN_PASSWORD = 8;

/**
 * Last step of sign-up (web ADR 0016): name, city, password, participant or
 * organizer. Google or Facebook accounts skip the password (web ADR 0019).
 */
export default function AccountSetupScreen() {
  const t = useT('Auth');
  const tStates = useT('States');
  const params = useLocalSearchParams<{ type?: string }>();
  const trpc = useTRPC();
  const errorMessage = useErrorMessage();
  const status = useQuery({ ...trpc.account.status.queryOptions(), staleTime: 0 });

  if (status.isPending) {
    return (
      <AuthLayout title={t('setupTitle')} subtitle={t('setupSubtitle')}>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </AuthLayout>
    );
  }

  if (status.isError) {
    return (
      <View className="flex-1 justify-center bg-background">
        <EmptyState
          icon={WifiOff}
          tone="alert"
          title={tStates('errorTitle')}
          hint={errorMessage(status.error)}
          actionLabel={tStates('retry')}
          onAction={() => void status.refetch()}
        />
      </View>
    );
  }

  return (
    <SetupForm
      status={status.data}
      initialType={params.type === 'organizer' ? 'organizer' : 'participant'}
    />
  );
}

/** The form, filled once from the account (a Google name, an older account's city). */
function SetupForm({
  status,
  initialType,
}: {
  status: RouterOutputs['account']['status'];
  initialType: AccountType;
}) {
  const t = useT('Auth');
  const router = useRouter();
  const trpc = useTRPC();
  const errorMessage = useErrorMessage();
  const cities = useQuery(trpc.catalog.cities.queryOptions());
  const complete = useMutation(trpc.account.completeSignUp.mutationOptions());
  const queryClient = useQueryClient();

  const { isOrganizer, hasPassword, hasSocial } = status;
  const needsPassword = !hasPassword && !hasSocial;
  const [name, setName] = useState(status.name);
  const [city, setCity] = useState(status.city ?? '');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<AccountType>(isOrganizer ? 'organizer' : initialType);
  const [error, setError] = useState<string | null>(null);
  const cityInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);

  const nameOk = name.trim().length >= 2;
  const passwordOk = !needsPassword || password.length >= MIN_PASSWORD;
  const typed = city.trim().toLowerCase();
  const suggestions = typed
    ? (cities.data ?? []).filter((c) => c.toLowerCase().startsWith(typed) && c !== city).slice(0, 6)
    : [];

  async function submit() {
    setError(null);
    // "Never a silent disabled button": say what is missing.
    if (!nameOk) return setError(t('needName'));
    if (!passwordOk) return setError(t('passwordHint', { min: MIN_PASSWORD }));
    try {
      await complete.mutateAsync({
        name: name.trim(),
        city: city.trim() || null,
        accountType: type,
        ...(needsPassword ? { password } : {}),
      });
      // The organizer tab appears once `me.get` shows the new role.
      // New name and, for organizers, the new role: refresh everything that shows them.
      await queryClient.invalidateQueries();
      router.dismissAll();
      router.replace(type === 'organizer' ? '/organizer' : '/');
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <AuthLayout title={t('setupTitle')} subtitle={t('setupSubtitle')}>
      <TextField
        label={t('nameLabel')}
        hint={t('nameHint')}
        value={name}
        onChangeText={setName}
        maxLength={80}
        icon={UserRound}
        autoComplete="name"
        textContentType="name"
        invalid={!!error && !nameOk}
        testID="setup-name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => cityInput.current?.focus()}
      />
      <View className="gap-2">
        <TextField
          label={t('cityLabel')}
          value={city}
          onChangeText={setCity}
          maxLength={60}
          icon={MapPin}
          autoComplete="postal-address-locality"
          testID="setup-city"
          ref={cityInput}
          returnKeyType={needsPassword ? 'next' : 'done'}
          submitBehavior={needsPassword ? 'submit' : 'blurAndSubmit'}
          onSubmitEditing={() => (needsPassword ? passwordInput.current?.focus() : undefined)}
        />
        {suggestions.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {suggestions.map((c) => (
              <Pressable
                key={c}
                accessibilityRole="button"
                onPress={() => setCity(c)}
                className="min-h-11 flex-row items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 active:bg-accent"
              >
                <Text size="sm">{c}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
      {needsPassword ? (
        <TextField
          label={t('choosePassword')}
          hint={t('passwordHint', { min: MIN_PASSWORD })}
          value={password}
          onChangeText={setPassword}
          secret
          showLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          icon={Lock}
          ltr
          autoComplete="new-password"
          textContentType="newPassword"
          autoCapitalize="none"
          invalid={!!error && !passwordOk}
          testID="setup-password"
          ref={passwordInput}
          returnKeyType="done"
        />
      ) : null}
      {!isOrganizer ? <AccountTypeCards value={type} onChange={setType} /> : null}
      <FormError message={error} />
      <Button
        label={type === 'organizer' && !isOrganizer ? t('continueToOrganizer') : t('finishSignUp')}
        size="lg"
        busy={complete.isPending}
        onPress={() => void submit()}
        testID="setup-submit"
      />
    </AuthLayout>
  );
}
