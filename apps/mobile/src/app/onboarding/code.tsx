import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { CodeInput } from '@/components/CodeInput';
import { FieldError } from '@/components/FieldError';
import { Button, Header, Screen } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { useProfile } from '@/profile/ProfileContext';
import { palette, type } from '@/theme';

/**
 * 05 Enter your code — step 2 (also used after "Sign in").
 * MOCK: no text message is sent yet; any 6 digits are accepted.
 */
export default function Code() {
  const { phone, mode } = useLocalSearchParams<{ phone: string; mode: 'signup' | 'signin' }>();
  const { signIn } = useProfile();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  const next = async () => {
    if (code.length !== 6) return setError('Type all 6 numbers.');
    if (mode === 'signin') {
      await signIn(phone);
      router.dismissAll();
      router.replace('/home');
    } else {
      router.push('/onboarding/avatar');
    }
  };

  return (
    <Screen
      header={<Header title="Enter your code" step={mode === 'signup' ? { step: 2, of: ONBOARDING_STEPS } : undefined} />}
      footer={<Button label="Next" onPress={next} />}
    >
      <Text style={[type.body, { color: palette.ink }]}>Type the 6-digit code we sent to {phone}.</Text>
      <CodeInput value={code} onChange={setCode} />
      <Pressable accessibilityRole="button" onPress={() => Alert.alert('New code sent', `We sent a new code to ${phone}.`)}>
        <Text style={[type.bodyBold, { color: palette.info }]}>Send a new code</Text>
      </Pressable>
      <FieldError message={error} />
    </Screen>
  );
}
