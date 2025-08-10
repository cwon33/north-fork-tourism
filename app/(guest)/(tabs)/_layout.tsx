import { Tabs } from 'expo-router';
import {
  CalendarDays,
  Compass,
  Map as MapIcon,
  Percent,
  User,
} from 'lucide-react-native';
import { Platform } from 'react-native';

/**
 * Bottom tab navigator for the guest flow.
 * If you also want these tabs after login, you can add the same screen
 * to your (authenticated) stack as needed.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
      initialRouteName="discover">
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MapIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="promo"
        options={{
          title: 'Promo',
          tabBarIcon: ({ color, size }) => (
            <Percent color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
