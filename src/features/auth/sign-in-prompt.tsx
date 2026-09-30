import { useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { useT } from '@/i18n';

/** Shown on member-only tabs to visitors: sign in or create an account. */
export function SignInPrompt() {
  const t = useT('App');
  const tNav = useT('Nav');
  const router = useRouter();
  return (
    <EmptyState
      icon={LogIn}
      title={t('signInToSeeTitle')}
      hint={t('signInToSeeHint')}
      actionLabel={tNav('signIn')}
      onAction={() => router.push('/sign-in')}
      secondaryLabel={tNav('signUp')}
      onSecondary={() => router.push('/sign-up')}
    />
  );
}
