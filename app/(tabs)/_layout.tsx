import { Tabs } from 'expo-router';
import {
  CalendarDays,
  Compass,
  Map as MapIcon,
  Tag,
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
        tabBarInactiveTintColor: '#EAEAEA',
        tabBarActiveTintColor: '#EAEAEA',
        tabBarStyle: {
          backgroundColor: "#00638D",
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingHorizontal: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Montserrat',
        },
        tabBarItemStyle: {
          marginHorizontal: 10,
        },
      }}
      initialRouteName="discover">
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
            <Compass color="#ffffffff" fill="#ffffffa3" size={size} />
          ) : (
            <Compass color={color} size={size}/>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size, focused }) =>
          focused ? (
            <MapIcon color="#ffffffff" fill="#ffffffa3" size={size} />
          ) : (
            <MapIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size, focused }) =>
          focused ? (
            <CalendarDays color="#ffffffff" fill="#ffffffa3" size={size} />
          ) : (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="promo"
        options={{
          title: 'Promo',
          tabBarIcon: ({ color, size, focused }) =>
          focused ? (
            <Tag color="#ffffffff" fill="#ffffffa3" size={size} />
          ) : (
            <Tag color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size, focused }) =>
          focused ? (
            <Tag color="#ffffffff" fill="#ffffffa3" size={size} />
          ) : (
          <User color={color} size={size} />),
        }}
      />
    </Tabs>
  );
}
