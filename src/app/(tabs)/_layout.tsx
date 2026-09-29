import { Tabs } from 'expo-router/js-tabs';
import { Compass, LayoutDashboard, MessageCircle, Ticket, UserRound } from 'lucide-react-native';

import { isOrganizer, useMe } from '@/features/auth/session';
import { useLocale, useT } from '@/i18n';
import { fontFamily } from '@/theme/fonts';
import { useColors } from '@/theme/theme-provider';

export default function TabsLayout() {
  const t = useT('App');
  const colors = useColors();
  const arabic = useLocale() === 'ar';
  const { data: me } = useMe();
  const organizer = isOrganizer(me?.roles);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fontFamily(arabic ? 'arabic' : 'latin', 'body', 'medium') },
        headerTitleStyle: {
          fontFamily: fontFamily(arabic ? 'arabic' : 'latin', 'body', 'semibold'),
        },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabDiscover'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: t('tabTickets'),
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabMessages'),
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="organizer"
        options={{
          title: t('tabOrganizer'),
          href: organizer ? undefined : null,
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabAccount'),
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
