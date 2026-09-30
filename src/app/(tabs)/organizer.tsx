import { LayoutDashboard } from 'lucide-react-native';
import { View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { useT } from '@/i18n';

/** Organizer space (part 3c): dashboard, attendees, payments, wizard and check-in. */
export default function OrganizerScreen() {
  const t = useT('App');
  return (
    <View className="flex-1 justify-center bg-background">
      <EmptyState
        icon={LayoutDashboard}
        title={t('organizerSoonTitle')}
        hint={t('organizerSoonHint')}
      />
    </View>
  );
}
