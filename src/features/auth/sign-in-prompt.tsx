import { useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useT } from '@/i18n';

/** Shown on member-only tabs to visitors: sign in or create an account. */
export function SignInPrompt() {
  const t = useT('App');
  const tNav = useT('Nav');
  const router = useRouter();
  return (
    <View className="flex-1 justify-center bg-background px-4">
      <EmptyState icon={LogIn} title={t('signInToSeeTitle')} hint={t('signInToSeeHint')} />
      <View className="gap-3">
        <Button
          label={tNav('signIn')}
          onPress={() => router.push('/sign-in')}
          testID="prompt-sign-in"
        />
        <Button
          variant="outline"
          label={tNav('signUp')}
          onPress={() => router.push('/sign-up')}
          testID="prompt-sign-up"
        />
      </View>
    </View>
  );
}
