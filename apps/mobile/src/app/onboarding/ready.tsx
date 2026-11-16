import { router } from 'expo-router';
import { Button, HeroScreen, Icon, IconBadge } from '@/components/ui';
import { useProfile } from '@/profile/ProfileContext';

/** 11 Ready */
export default function Ready() {
  const { completeOnboarding } = useProfile();
  const start = async () => {
    await completeOnboarding();
    router.dismissAll();
    router.replace('/home');
  };
  return (
    <HeroScreen
      art={
        <IconBadge>
          <Icon name="checkLarge" size={64} />
        </IconBadge>
      }
      title="You are ready to go!"
      body="You can change your helpers and places any time from the menu."
      footer={<Button label="Start" onPress={start} />}
    />
  );
}
