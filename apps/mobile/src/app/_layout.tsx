import { Lato_400Regular, Lato_700Bold, Lato_900Black, useFonts } from '@expo-google-fonts/lato';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ProfileProvider, useProfile } from '@/profile/ProfileContext';
import { palette } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Lato_400Regular, Lato_700Bold, Lato_900Black });
  return (
    <ProfileProvider>
      <StatusBar style="dark" />
      <AppStack fontsLoaded={fontsLoaded} />
    </ProfileProvider>
  );
}

function AppStack({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready } = useProfile();
  const loaded = fontsLoaded && ready;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.canvas } }}>
      <Stack.Screen name="menu" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
    </Stack>
  );
}
