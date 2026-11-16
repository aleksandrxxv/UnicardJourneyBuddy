import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { FieldError } from '@/components/FieldError';
import { Button, Header, Screen, TextField } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { normalisePhone, useProfile } from '@/profile/ProfileContext';
import { palette, type } from '@/theme';

/** 04 Your details — step 1 */
export default function Details() {
  const { draft, updateDraft, hasProfile } = useProfile();
  const [name, setName] = useState(draft.name);
  const [phone, setPhone] = useState(draft.phone);
  const [error, setError] = useState<string>();

  const next = () => {
    if (!name.trim()) return setError('Type your name.');
    if (normalisePhone(phone).length < 10) return setError('Type your whole phone number.');
    if (hasProfile(phone)) return setError('There is already a profile with this number. Go back and sign in.');
    updateDraft({ name: name.trim(), phone: phone.trim() });
    router.push({ pathname: '/onboarding/code', params: { phone: phone.trim(), mode: 'signup' } });
  };

  return (
    <Screen
      header={<Header title="Your details" step={{ step: 1, of: ONBOARDING_STEPS }} />}
      footer={<Button label="Next" onPress={next} />}
    >
      <TextField label="Your name" value={name} onChangeText={setName} autoComplete="given-name" textContentType="givenName" returnKeyType="next" />
      <TextField label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
      <Text style={[type.small, { color: palette.inkMuted }]}>We will text you a 6-digit code to check this is your phone.</Text>
      <FieldError message={error} />
    </Screen>
  );
}
