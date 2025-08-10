import { Stack } from 'expo-router';

// Only for guest users
const GuestLayout = () => {
  return (
    // <Stack
    //   screenOptions={{
    //     animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
    //     headerTransparent: true,
    //     statusBarTranslucent: true,
    //     statusBarStyle: Platform.OS === 'ios' ? undefined : 'dark',
    //   }}
    // />
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default GuestLayout;
