import { Tabs } from 'expo-router';
import { User } from 'lucide-react-native';
import { Platform } from 'react-native';

// Only for authenticated users
const AuthenticatedLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#EAEAEA',
        tabBarStyle: {
          backgroundColor: '#00638D',
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
      initialRouteName="index">
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Log out',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create-promo"
        options={{
          title: 'Promo',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default AuthenticatedLayout;
