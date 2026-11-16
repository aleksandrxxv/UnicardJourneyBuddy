import { router } from 'expo-router';
import { Button, HeroScreen, Icon } from '@/components/ui';

/** 02 Welcome */
export default function Welcome() {
  return (
    <HeroScreen
      art={<Icon name="busStopBadgeWelcome" size={120} />}
      title="Find your way by bus, step by step"
      body="Save the places you go, and call someone you trust if you get stuck."
      footer={
        <>
          <Button label="Create profile" onPress={() => router.push('/location')} />
          <Button label="I already have a profile" variant="secondary" onPress={() => router.push('/sign-in')} />
        </>
      }
    />
  );
}
