import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { Text } from '@/components/ui/text';
import { CodeField, TextField } from '@/components/ui/text-field';
import { useAfterSignIn } from '@/features/auth/after-sign-in';
import { parseIdentifier, type Method } from '@/features/auth/identifier';
import {
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

type Mode = 'password' | 'code' | 'verify';

/**
 * ACC-01 sign-in (web ADR 0016): phone or email with a password; "Receive a
 * code instead" signs in without it; Google or Facebook (web ADR 0019).
 */
export default function SignInScreen() {
  const t = useT('Auth');
  const tErrors = useT('Errors');
  const afterSignIn = useAfterSignIn();
  const [method, setMethod] = useState<Method>('phone');
  const [mode, setMode] = useState<Mode>('password');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signInWithPassword() {
    setError(null);
    const value = parseIdentifier(method, identifier);
    if (!value) return setError(tErrors(method === 'phone' ? 'invalidPhone' : 'invalidEmail'));
    if (!password) return setError(tErrors('invalidCredentials'));
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.signIn.phoneNumber({ phoneNumber: value, password })
        : await authClient.signIn.email({ email: value, password });
    setBusy(false);
    if (failure) return setError(tErrors(authErrorKey(failure)));
    await afterSignIn({ checkSetup: false });
  }

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
    setMode('verify');
  }

  async function verify() {
    setError(null);
    if (code.length < 6) return setError(tErrors('invalidCode'));
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.verify({ phoneNumber: sentTo, code })
        : await authClient.signIn.emailOtp({ email: sentTo, otp: code });
    setBusy(false);
    if (failure) return setError(tErrors(authErrorKey(failure)));
    // New or older accounts may still need a name or a password.
    await afterSignIn({ checkSetup: true });
  }

  async function social(provider: SocialProvider) {
    setBusy(true);
    setError(null);
    const { error: failure } = await authClient.signIn.social({ provider, callbackURL: '/' });
    setBusy(false);
    if (failure) return setError(tErrors('socialFailed'));
    const { data } = await authClient.getSession();
    if (data) await afterSignIn({ checkSetup: true });
  }

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      footer={
        <View className="flex-row flex-wrap items-center justify-center gap-1">
          <Text size="sm" className="text-muted-foreground">
            {t('noAccount')}
          </Text>
          <Link href="/sign-up" replace className="min-h-11 justify-center" testID="to-sign-up">
            <Text size="sm" weight="semibold" className="text-primary">
              {t('createAccount')}
            </Text>
          </Link>
        </View>
      }
    >
      {mode !== 'verify' ? (
        <MethodSwitch
          value={method}
          onChange={(m) => {
            setMethod(m);
            setIdentifier('');
            setError(null);
          }}
        />
      ) : null}

      {mode === 'password' ? (
        <View className="gap-4">
          <IdentifierField method={method} value={identifier} onChange={setIdentifier} />
          <TextField
            label={t('passwordLabel')}
            value={password}
            onChangeText={setPassword}
            secret
            showLabel={t('showPassword')}
            hideLabel={t('hidePassword')}
            autoComplete="current-password"
            textContentType="password"
            autoCapitalize="none"
            testID="password-field"
          />
          <Link href="/forgot-password" className="min-h-11 justify-center self-end">
            <Text size="sm" weight="medium" className="text-primary">
              {t('forgotPassword')}
            </Text>
          </Link>
          <FormError message={error} />
          <Button
            label={t('signIn')}
            busy={busy}
            onPress={() => void signInWithPassword()}
            testID="sign-in-submit"
          />
          <Button
            variant="link"
            label={t('useCodeInstead')}
            onPress={() => {
              setMode('code');
              setError(null);
            }}
            testID="use-code"
          />
        </View>
      ) : null}

      {mode === 'code' ? (
        <View className="gap-4">
          <IdentifierField method={method} value={identifier} onChange={setIdentifier} />
          <FormError message={error} />
          <Button
            label={t('sendCode')}
            busy={busy}
            onPress={() => void sendCode()}
            testID="send-code"
          />
          <Button
            variant="link"
            label={t('usePasswordInstead')}
            onPress={() => setMode('password')}
          />
        </View>
      ) : null}

      {mode === 'verify' ? (
        <View className="gap-4">
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
            <Button variant="link" label={t('changeNumber')} onPress={() => setMode('code')} />
            <Button
              variant="link"
              label={t('resend')}
              disabled={busy}
              onPress={() => void sendCode()}
            />
          </View>
        </View>
      ) : null}

      {mode !== 'verify' && socialSignInAvailable ? (
        <SocialButtons disabled={busy} onSelect={(provider) => void social(provider)} />
      ) : null}

      <DevOutboxNote />
    </AuthLayout>
  );
}
