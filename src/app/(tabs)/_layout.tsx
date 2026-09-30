import { Tabs } from 'expo-router/js-tabs';
import {
  Compass,
  LayoutDashboard,
  MessageCircle,
  Ticket,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isOrganizer, useMe } from '@/features/auth/session';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { fontFamily } from '@/theme/fonts';
import { useColors } from '@/theme/theme-provider';

/** The tab icon; the selected tab sits on a soft green pill (Material 3 style). */
function TabIcon({
  icon: Icon,
  focused,
  color,
}: {
  icon: LucideIcon;
  focused: boolean;
  color: ColorValue;
}) {
  return (
    <View
      className={cn(
        'h-8 w-16 items-center justify-center rounded-full',
        focused && 'bg-primary/15',
      )}
    >
      <Icon color={color as string} size={22} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}

export default function TabsLayout() {
  const t = useT('App');
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const arabic = useLocale() === 'ar';
  const { data: me } = useMe();
  const organizer = isOrganizer(me?.roles);
  const label = fontFamily(arabic ? 'arabic' : 'latin', 'body', 'semibold');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        // Sized from the safe area so labels never sit under Android's navigation bar.
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
        },
        tabBarLabelStyle: { fontFamily: label, fontSize: 12, marginTop: 2 },
        tabBarAllowFontScaling: false,
        // Each tab draws its own large title (TabScreen).
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabDiscover'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Compass} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: t('tabTickets'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Ticket} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabMessages'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={MessageCircle} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="organizer"
        options={{
          title: t('tabOrganizer'),
          href: organizer ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={LayoutDashboard} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabAccount'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={UserRound} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
