import { Alert, Linking } from 'react-native';
import { useProfile } from '@/profile/ProfileContext';

/** "I need help": asks once to avoid accidental presses, then calls the first helper (US-11, US-12). */
export function useHelp() {
  const { profile } = useProfile();
  return () => {
    const helper = profile?.helpers[0];
    if (!helper) {
      Alert.alert('No helper yet', 'Add a helper from the menu so you can call them.');
      return;
    }
    Alert.alert(`Call ${helper.name} for help?`, 'Stay where you are. You are doing fine.', [
      { text: 'Cancel', style: 'cancel' },
      { text: `Call ${helper.name}`, onPress: () => Linking.openURL(`tel:${helper.phone.replace(/\s/g, '')}`) },
    ]);
  };
}
