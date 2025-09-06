import { Stack } from 'expo-router';

// Only for guest users
const GuestLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default GuestLayout;
