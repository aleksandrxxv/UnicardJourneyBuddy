import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Avatar, Button, Header, Screen } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { useProfile } from '@/profile/ProfileContext';
import { pickPhoto } from '@/services/photos';
import { palette, type } from '@/theme';

/** 06 Choose your picture — step 3 */
export default function ChooseAvatar() {
  const { draft, updateDraft } = useProfile();
  const pick = async (source: 'camera' | 'library') => {
    const uri = await pickPhoto(source);
    if (uri) updateDraft({ avatarUri: uri });
  };

  return (
    <Screen
      header={<Header title="Choose your picture" step={{ step: 3, of: ONBOARDING_STEPS }} />}
      footer={<Button label="Next" onPress={() => router.push('/onboarding/colour')} />}
    >
      <View style={{ alignItems: 'center' }}>
        <Avatar uri={draft.avatarUri} size={160} />
      </View>
      <Button label="Take a selfie" variant="secondary" onPress={() => pick('camera')} />
      <Button label="Choose from my photos" variant="secondary" onPress={() => pick('library')} />
      <Text style={[type.small, { color: palette.inkMuted, textAlign: 'center' }]}>Your helpers will see this picture.</Text>
    </Screen>
  );
}
