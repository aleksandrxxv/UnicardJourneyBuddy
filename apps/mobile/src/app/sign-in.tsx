import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { FieldError } from '@/components/FieldError';
import { Button, Header, Screen, TextField } from '@/components/ui';
import { normalisePhone, useProfile } from '@/profile/ProfileContext';
import { palette, type } from '@/theme';

/** 12 Sign in */
export default function SignIn() {
  const { hasProfile } = useProfile();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();

  const next = () => {
    if (normalisePhone(phone).length < 10) return setError('Type your whole phone number.');
    if (!hasProfile(phone)) return setError('We can’t find a profile with this number on this phone. Go back and create one.');
    router.push({ pathname: '/onboarding/code', params: { phone: phone.trim(), mode: 'signin' } });
  };

  return (
    <Screen header={<Header title="Sign in" />} footer={<Button label="Sign in" onPress={next} />}>
      <TextField label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" autoFocus />
      <Text style={[type.small, { color: palette.inkMuted }]}>We will text you a code to sign in.</Text>
      <FieldError message={error} />
    </Screen>
  );
}
