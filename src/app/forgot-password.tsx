import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { Text } from '@/components/ui/text';
import { CodeField, TextField } from '@/components/ui/text-field';
import { parseIdentifier, type Method } from '@/features/auth/identifier';
import { AuthLayout, DevOutboxNote, IdentifierField, MethodSwitch } from '@/features/auth/parts';
import { useT } from '@/i18n';
import { authErrorKey } from '@/i18n/errors';
import { authClient } from '@/lib/auth-client';

const MIN_PASSWORD = 8;

/** New password with a code sent by SMS or email, then signed in (web ADR 0016). */
export default function ForgotPasswordScreen() {
  const t = useT('Auth');
  const tErrors = useT('Errors');
  const router = useRouter();
  const [method, setMethod] = useState<Method>('phone');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode() {
    setError(null);
    const value = parseIdentifier(method, identifier);
    if (!value) return setError(tErrors(method === 'phone' ? 'invalidPhone' : 'invalidEmail'));
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.requestPasswordReset({ phoneNumber: value })
        : await authClient.emailOtp.sendVerificationOtp({ email: value, type: 'forget-password' });
    setBusy(false);
    if (failure) return setError(tErrors(authErrorKey(failure)));
    setSentTo(value);
  }

  async function reset() {
    if (!sentTo) return;
    setError(null);
    if (code.length < 6) return setError(tErrors('invalidCode'));
    if (password.length < MIN_PASSWORD) return setError(tErrors('passwordTooShort'));
    setBusy(true);
    const { error: failure } =
      method === 'phone'
        ? await authClient.phoneNumber.resetPassword({
            phoneNumber: sentTo,
            otp: code,
            newPassword: password,
          })
        : await authClient.emailOtp.resetPassword({ email: sentTo, otp: code, password });
    if (failure) {
      setBusy(false);
      return setError(tErrors(authErrorKey(failure)));
    }
    const { error: signInFailure } =
      method === 'phone'
        ? await authClient.signIn.phoneNumber({ phoneNumber: sentTo, password })
        : await authClient.signIn.email({ email: sentTo, password });
    setBusy(false);
    if (signInFailure) return router.replace('/sign-in');
    router.dismissAll();
  }

  if (sentTo) {
    return (
      <AuthLayout title={t('resetTitle')} subtitle={t('resetSubtitle')}>
        <Text size="sm" className="text-muted-foreground">
          {t('codeSentTo', { phone: `⁦${sentTo}⁩` })}
        </Text>
        <CodeField label={t('codeLabel')} value={code} onChangeText={setCode} />
        <TextField
          label={t('newPassword')}
          hint={t('passwordHint', { min: MIN_PASSWORD })}
          value={password}
          onChangeText={setPassword}
          secret
          showLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          autoComplete="new-password"
          textContentType="newPassword"
          autoCapitalize="none"
        />
        <FormError message={error} />
        <Button label={t('savePassword')} busy={busy} onPress={() => void reset()} />
        <DevOutboxNote />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('resetTitle')} subtitle={t('resetSubtitle')}>
      <MethodSwitch
        value={method}
        onChange={(m) => {
          setMethod(m);
          setIdentifier('');
        }}
      />
      <IdentifierField method={method} value={identifier} onChange={setIdentifier} />
      <FormError message={error} />
      <Button label={t('sendCode')} busy={busy} onPress={() => void sendCode()} />
      <DevOutboxNote />
    </AuthLayout>
  );
}
