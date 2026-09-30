import { Ticket } from 'lucide-react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { TabScreen } from '@/components/ui/tab-screen';
import { SignInPrompt } from '@/features/auth/sign-in-prompt';
import { useSession } from '@/features/auth/session';
import { useT } from '@/i18n';

/** My tickets (part 3b). Guests who booked on this phone will see them too (OPEN_QUESTIONS Q23). */
export default function TicketsScreen() {
  const t = useT('App');
  const { data: session, isPending } = useSession();
  return (
    <TabScreen title={t('tabTickets')}>
      {!isPending && !session ? (
        <SignInPrompt />
      ) : (
        <EmptyState icon={Ticket} title={t('comingSoonTitle')} hint={t('comingSoonHint')} />
      )}
    </TabScreen>
  );
}
