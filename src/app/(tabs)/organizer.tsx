import { LayoutDashboard } from 'lucide-react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { TabScreen } from '@/components/ui/tab-screen';
import { useT } from '@/i18n';

/** Organizer space (part 3c): dashboard, attendees, payments, wizard and check-in. */
export default function OrganizerScreen() {
  const t = useT('App');
  return (
    <TabScreen title={t('tabOrganizer')}>
      <EmptyState
        icon={LayoutDashboard}
        title={t('organizerSoonTitle')}
        hint={t('organizerSoonHint')}
      />
    </TabScreen>
  );
}
