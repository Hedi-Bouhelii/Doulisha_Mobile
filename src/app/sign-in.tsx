import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View, type TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { CodeField, TextField } from '@/components/ui/text-field';
import { useAfterSignIn } from '@/features/auth/after-sign-in';
import { parseIdentifier, type Method } from '@/features/auth/identifier';
import {
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

type Mode = 'password' | 'code' | 'verify';
type Field = 'identifier' | 'password' | 'code' | null;

/**
 * ACC-01 sign-in (web ADR 0016): phone or email with a password; "Receive a
 * code instead" signs in without it; Google or Facebook (web ADR 0019).
 */
export default function SignInScreen() {
  const t = useT('Auth');
  const tErrors = useT('Errors');
  const router = useRouter();
  const afterSignIn = useAfterSignIn();
  const [method, setMethod] = useState<Method>('phone');
  const [mode, setMode] = useState<Mode>('password');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<{ message: string; field: Field } | null>(null);
  const [busy, setBusy] = useState(false);
  const passwordInput = useRef<TextInput>(null);

  const fail = (message: string, field: Field = null) => setError({ message, field });

  async function signInWithPassword() {
    setError(null);
    const value = parseIdentifier(method, identifier);
    if (!value)
      return fail(tErrors(method === 'phone' ? 'invalidPhone' : 'invalidEmail'), 'identifier');
    if (!password) return fail(tErrors('invalidCredentials'), 'password');
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.signIn.phoneNumber({ phoneNumber: value, password })
        : await authClient.signIn.email({ email: value, password });
    setBusy(false);
    if (failure) return fail(tErrors(authErrorKey(failure)), 'password');
    await afterSignIn({ checkSetup: false });
  }

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
    setMode('verify');
  }

  async function verify(entered: string = code) {
    setError(null);
    if (entered.length < 6) return fail(tErrors('invalidCode'), 'code');
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.verify({ phoneNumber: sentTo, code: entered })
        : await authClient.signIn.emailOtp({ email: sentTo, otp: entered });
    setBusy(false);
    if (failure) return fail(tErrors(authErrorKey(failure)), 'code');
    // New or older accounts may still need a name or a password.
    await afterSignIn({ checkSetup: true });
  }

  async function social(provider: SocialProvider) {
    setBusy(true);
    setError(null);
    const { error: failure } = await authClient.signIn.social({ provider, callbackURL: '/' });
    setBusy(false);
    if (failure) return fail(tErrors('socialFailed'));
    const { data } = await authClient.getSession();
    if (data) await afterSignIn({ checkSetup: true });
  }

  return (
    <AuthLayout
      title={mode === 'verify' ? t('codeLabel') : t('title')}
      subtitle={
        mode === 'verify'
          ? // LRI…PDI keeps "+216…" in order inside Arabic text.
            t('codeSentTo', { phone: `\u2066${formatPhone(sentTo)}\u2069` })
          : t('subtitle')
      }
      footer={
        mode !== 'verify' ? (
          <AuthFooter
            question={t('noAccount')}
            action={t('createAccount')}
            onPress={() => router.replace('/sign-up')}
            testID="to-sign-up"
          />
        ) : null
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
        <>
          <IdentifierField
            method={method}
            value={identifier}
            onChange={setIdentifier}
            invalid={error?.field === 'identifier'}
            onSubmit={() => passwordInput.current?.focus()}
          />
          <View className="gap-1">
            <TextField
              label={t('passwordLabel')}
              icon={Lock}
              ltr
              value={password}
              onChangeText={setPassword}
              secret
              showLabel={t('showPassword')}
              hideLabel={t('hidePassword')}
              autoComplete="current-password"
              textContentType="password"
              autoCapitalize="none"
              invalid={error?.field === 'password'}
              testID="password-field"
              ref={passwordInput}
              returnKeyType="go"
              onSubmitEditing={() => void signInWithPassword()}
            />
            <View className="items-end">
              <Button
                variant="link"
                size="sm"
                block={false}
                label={t('forgotPassword')}
                onPress={() => router.push('/forgot-password')}
              />
            </View>
          </View>
          <FormError message={error?.message ?? null} />
          <Button
            label={t('signIn')}
            size="lg"
            busy={busy}
            onPress={() => void signInWithPassword()}
            testID="sign-in-submit"
          />
          <Button
            variant="secondary"
            label={t('useCodeInstead')}
            onPress={() => {
              setMode('code');
              setError(null);
            }}
            testID="use-code"
          />
        </>
      ) : null}

      {mode === 'code' ? (
        <>
          <IdentifierField
            method={method}
            value={identifier}
            onChange={setIdentifier}
            invalid={error?.field === 'identifier'}
            last
            onSubmit={() => void sendCode()}
          />
          <FormError message={error?.message ?? null} />
          <Button
            label={t('sendCode')}
            size="lg"
            busy={busy}
            onPress={() => void sendCode()}
            testID="send-code"
          />
          <Button
            variant="secondary"
            label={t('usePasswordInstead')}
            onPress={() => setMode('password')}
          />
        </>
      ) : null}

      {mode === 'verify' ? (
        <>
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
              onPress={() => setMode('code')}
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
        </>
      ) : null}

      {mode !== 'verify' && socialSignInAvailable ? (
        <SocialButtons disabled={busy} onSelect={(provider) => void social(provider)} />
      ) : null}

      <DevOutboxNote />
    </AuthLayout>
  );
}
