import { MessageCircle } from 'lucide-react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { TabScreen } from '@/components/ui/tab-screen';
import { SignInPrompt } from '@/features/auth/sign-in-prompt';
import { useSession } from '@/features/auth/session';
import { useT } from '@/i18n';

/** Messages (part 3b): organizer threads and private-event group chats (web ADR 0021). */
export default function MessagesScreen() {
  const t = useT('App');
  const { data: session, isPending } = useSession();
  return (
    <TabScreen title={t('tabMessages')}>
      {!isPending && !session ? (
        <SignInPrompt />
      ) : (
        <EmptyState icon={MessageCircle} title={t('comingSoonTitle')} hint={t('comingSoonHint')} />
      )}
    </TabScreen>
  );
}
