import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { Text } from '@/components/ui/text';
import { CodeField } from '@/components/ui/text-field';
import { useAfterSignIn } from '@/features/auth/after-sign-in';
import { parseIdentifier, type AccountType, type Method } from '@/features/auth/identifier';
import {
  AccountTypeCards,
  AuthLayout,
  DevOutboxNote,
  IdentifierField,
  MethodSwitch,
  SocialButtons,
  type SocialProvider,
} from '@/features/auth/parts';
import { useT } from '@/i18n';
import { authErrorKey } from '@/i18n/errors';
import { authClient, socialSignInAvailable } from '@/lib/auth-client';

/**
 * ACC-01 sign-up (web ADR 0016, ADR 0019): what you mainly do, then a phone or
 * email code, or Google / Facebook. Name, city and password come next, on
 * the setup screen.
 */
export default function SignUpScreen() {
  const t = useT('Auth');
  const tErrors = useT('Errors');
  const params = useLocalSearchParams<{ type?: string }>();
  const afterSignIn = useAfterSignIn();
  const [type, setType] = useState<AccountType>(
    params.type === 'organizer' ? 'organizer' : 'participant',
  );
  const [method, setMethod] = useState<Method>('phone');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode() {
    setError(null);
    const value = parseIdentifier(method, identifier);
    if (!value) return setError(tErrors(method === 'phone' ? 'invalidPhone' : 'invalidEmail'));
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.sendOtp({ phoneNumber: value })
        : await authClient.emailOtp.sendVerificationOtp({ email: value, type: 'sign-in' });
    setBusy(false);
    if (failure) return setError(tErrors(authErrorKey(failure)));
    setSentTo(value);
    setCode('');
  }

  async function verify() {
    if (!sentTo) return;
    setError(null);
    if (code.length < 6) return setError(tErrors('invalidCode'));
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.verify({ phoneNumber: sentTo, code })
        : await authClient.signIn.emailOtp({ email: sentTo, otp: code });
    setBusy(false);
    if (failure) return setError(tErrors(authErrorKey(failure)));
    // An existing account that verified again skips setup, as on the web.
    await afterSignIn({ checkSetup: true, accountType: type });
  }

  /** Google or Facebook: setup then asks the city and participant or organizer. */
  async function social(provider: SocialProvider) {
    setBusy(true);
    setError(null);
    const { error: failure } = await authClient.signIn.social({ provider, callbackURL: '/' });
    setBusy(false);
    if (failure) return setError(tErrors('socialFailed'));
    const { data } = await authClient.getSession();
    if (data) await afterSignIn({ checkSetup: true, welcome: true, accountType: type });
  }

  const footer = (
    <View className="flex-row flex-wrap items-center justify-center gap-1">
      <Text size="sm" className="text-muted-foreground">
        {t('haveAccount')}
      </Text>
      <Link href="/sign-in" replace className="min-h-11 justify-center" testID="to-sign-in">
        <Text size="sm" weight="semibold" className="text-primary">
          {t('signIn')}
        </Text>
      </Link>
    </View>
  );

  if (sentTo) {
    return (
      <AuthLayout title={t('signUpTitle')} subtitle={t('signUpSubtitle')} footer={footer}>
        <Text size="sm" className="text-muted-foreground">
          {/* LRI…PDI keeps "+216…" in order inside Arabic text. */}
          {t('codeSentTo', { phone: `⁦${sentTo}⁩` })}
        </Text>
        <CodeField label={t('codeLabel')} value={code} onChangeText={setCode} />
        <FormError message={error} />
        <Button
          label={t('verify')}
          busy={busy}
          onPress={() => void verify()}
          testID="verify-code"
        />
        <View className="flex-row justify-between gap-2">
          <Button variant="link" label={t('changeNumber')} onPress={() => setSentTo(null)} />
          <Button
            variant="link"
            label={t('resend')}
            disabled={busy}
            onPress={() => void sendCode()}
          />
        </View>
        <DevOutboxNote />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('signUpTitle')} subtitle={t('signUpSubtitle')} footer={footer}>
      <AccountTypeCards value={type} onChange={setType} />
      <MethodSwitch
        value={method}
        onChange={(m) => {
          setMethod(m);
          setIdentifier('');
          setError(null);
        }}
      />
      <IdentifierField method={method} value={identifier} onChange={setIdentifier} />
      <FormError message={error} />
      <Button
        label={t('sendCode')}
        busy={busy}
        onPress={() => void sendCode()}
        testID="send-code"
      />
      <Text size="xs" className="text-center text-muted-foreground">
        {t('codeExplainer')}
      </Text>
      {socialSignInAvailable ? (
        <SocialButtons disabled={busy} onSelect={(provider) => void social(provider)} />
      ) : null}
      <DevOutboxNote />
    </AuthLayout>
  );
}
