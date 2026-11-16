import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { HeroScreen, Icon } from '@/components/ui';
import { useProfile } from '@/profile/ProfileContext';
import { palette, type } from '@/theme';

/** 01 Splash, then on to Home (signed in) or Welcome. */
export default function Splash() {
  const { profile } = useProfile();

  useEffect(() => {
    const id = setTimeout(() => router.replace(profile ? '/home' : '/welcome'), 1200);
    return () => clearTimeout(id);
  }, [profile]);

  return (
    <HeroScreen
      art={<Icon name="busStopBadge" size={160} />}
      title="Birmingham Bus Navigation"
      footer={<Text style={[type.bodyBold, { color: palette.ink, textAlign: 'center', marginBottom: '40%' }]}>Unicard</Text>}
    />
  );
}
