import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Button, HeroScreen, Icon, IconBadge } from '@/components/ui';

/** 03 Location */
export default function AllowLocation() {
  const allow = async () => {
    // Continue either way: the app falls back to a demo start point without permission.
    await Location.requestForegroundPermissionsAsync().catch(() => undefined);
    router.push('/onboarding/details');
  };
  return (
    <HeroScreen
      art={
        <IconBadge>
          <Icon name="pin" size={56} />
        </IconBadge>
      }
      title="Allow location"
      body="We use your location to show your bus stop and tell your helper where you are."
      footer={<Button label="Allow location" onPress={allow} />}
    />
  );
}
