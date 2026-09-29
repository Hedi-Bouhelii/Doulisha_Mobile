import { MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { SignInPrompt } from '@/features/auth/sign-in-prompt';
import { useSession } from '@/features/auth/session';
import { useT } from '@/i18n';

/** Messages (part 3b): organizer threads and private-event group chats (ADR 0021 of the web). */
export default function MessagesScreen() {
  const t = useT('App');
  const { data: session, isPending } = useSession();
  if (!isPending && !session) return <SignInPrompt />;
  return (
    <View className="flex-1 justify-center bg-background">
      <EmptyState icon={MessageCircle} title={t('comingSoonTitle')} hint={t('comingSoonHint')} />
    </View>
  );
}
