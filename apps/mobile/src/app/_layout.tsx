import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, fontSize } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontSize: fontSize.large, fontWeight: '700', color: colors.text },
          headerTintColor: colors.primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Journey Buddy' }} />
        <Stack.Screen name="trip/[destinationId]" options={{ title: 'Your trip' }} />
      </Stack>
    </>
  );
}
