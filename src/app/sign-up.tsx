import { useLocalSearchParams, useRouter } from 'expo-router';
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
  AuthFooter,
  AuthLayout,
  DevOutboxNote,
  IdentifierField,
  MethodSwitch,
  SocialButtons,
  type SocialProvider,
} from '@/features/auth/parts';
import { useT } from '@/i18n';
import { authErrorKey } from '@/i18n/errors';
import { formatPhone } from '@/lib/phone';
import { authClient, socialSignInAvailable } from '@/lib/auth-client';

type Field = 'identifier' | 'code' | null;

/**
 * ACC-01 sign-up (web ADR 0016, ADR 0019): what you mainly do, then a phone or
 * email code, or Google / Facebook. Name, city and password come next, on
 * the setup screen.
 */
export default function SignUpScreen() {
  const t = useT('Auth');
  const tErrors = useT('Errors');
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const afterSignIn = useAfterSignIn();
  const [type, setType] = useState<AccountType>(
    params.type === 'organizer' ? 'organizer' : 'participant',
  );
  const [method, setMethod] = useState<Method>('phone');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<{ message: string; field: Field } | null>(null);
  const [busy, setBusy] = useState(false);

  const fail = (message: string, field: Field = null) => setError({ message, field });

  async function sendCode() {
    setError(null);
    const value = parseIdentifier(method, identifier);
    if (!value)
      return fail(tErrors(method === 'phone' ? 'invalidPhone' : 'invalidEmail'), 'identifier');
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.sendOtp({ phoneNumber: value })
        : await authClient.emailOtp.sendVerificationOtp({ email: value, type: 'sign-in' });
    setBusy(false);
    if (failure) return fail(tErrors(authErrorKey(failure)), 'identifier');
    setSentTo(value);
    setCode('');
  }

  async function verify(entered: string = code) {
    if (!sentTo) return;
    setError(null);
    if (entered.length < 6) return fail(tErrors('invalidCode'), 'code');
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.verify({ phoneNumber: sentTo, code: entered })
        : await authClient.signIn.emailOtp({ email: sentTo, otp: entered });
    setBusy(false);
    if (failure) return fail(tErrors(authErrorKey(failure)), 'code');
    // An existing account that verified again skips setup, as on the web.
    await afterSignIn({ checkSetup: true, accountType: type });
  }

  /** Google or Facebook: setup then asks the city and participant or organizer. */
  async function social(provider: SocialProvider) {
    setBusy(true);
    setError(null);
    const { error: failure } = await authClient.signIn.social({ provider, callbackURL: '/' });
    setBusy(false);
    if (failure) return fail(tErrors('socialFailed'));
    const { data } = await authClient.getSession();
    if (data) await afterSignIn({ checkSetup: true, welcome: true, accountType: type });
  }

  const footer = (
    <AuthFooter
      question={t('haveAccount')}
      action={t('signIn')}
      onPress={() => router.replace('/sign-in')}
      testID="to-sign-in"
    />
  );

  if (sentTo) {
    return (
      <AuthLayout
        title={t('codeLabel')}
        // LRI…PDI keeps "+216…" in order inside Arabic text.
        subtitle={t('codeSentTo', { phone: `\u2066${formatPhone(sentTo)}\u2069` })}
      >
        <CodeField
          labelHidden
          label={t('codeLabel')}
          value={code}
          onChangeText={setCode}
          invalid={error?.field === 'code'}
          onComplete={(entered) => void verify(entered)}
        />
        <FormError message={error?.message ?? null} />
        <Button
          label={t('verify')}
          size="lg"
          busy={busy}
          onPress={() => void verify()}
          testID="verify-code"
        />
        <View className="flex-row flex-wrap justify-between gap-2">
          <Button
            variant="link"
            size="sm"
            block={false}
            label={t('changeNumber')}
            onPress={() => setSentTo(null)}
          />
          <Button
            variant="link"
            size="sm"
            block={false}
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
      <IdentifierField
        method={method}
        value={identifier}
        onChange={setIdentifier}
        invalid={error?.field === 'identifier'}
        last
        onSubmit={() => void sendCode()}
      />
      <FormError message={error?.message ?? null} />
      <View className="gap-2">
        <Button
          label={t('sendCode')}
          size="lg"
          busy={busy}
          onPress={() => void sendCode()}
          testID="send-code"
        />
        <Text size="xs" className="text-center text-muted-foreground">
          {t('codeExplainer')}
        </Text>
      </View>
      {socialSignInAvailable ? (
        <SocialButtons disabled={busy} onSelect={(provider) => void social(provider)} />
      ) : null}
      <DevOutboxNote />
    </AuthLayout>
  );
}
