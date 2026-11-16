import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Text } from 'react-native';
import { FieldError } from '@/components/FieldError';
import { Button, Header, Screen, TextField } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { newId, normalisePhone, useProfile } from '@/profile/ProfileContext';
import { pickPhoto } from '@/services/photos';
import { palette, type } from '@/theme';

/** 08 Add a helper — step 5 */
export default function AddHelper() {
  const { draft, updateDraft } = useProfile();
  const existing = draft.helpers[0];
  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [photoUri, setPhotoUri] = useState(existing?.photoUri);
  const [error, setError] = useState<string>();

  const next = () => {
    if (!name.trim()) return setError('Type your helper’s name.');
    if (normalisePhone(phone).length < 10) return setError('Type their whole phone number.');
    updateDraft({ helpers: [{ id: existing?.id ?? newId(), name: name.trim(), phone: phone.trim(), photoUri }] });
    router.push('/onboarding/home');
  };

  return (
    <Screen header={<Header title="Add a helper" step={{ step: 5, of: ONBOARDING_STEPS }} />} footer={<Button label="Next" onPress={next} />}>
      <Text style={[type.body, { color: palette.ink }]}>A helper is someone you trust who you can call if you are unsure where to go.</Text>
      <TextField label="Their name" value={name} onChangeText={setName} />
      <TextField label="Their phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      {photoUri && <Image source={{ uri: photoUri }} style={{ width: 72, height: 72, borderRadius: 36 }} />}
      <Button
        label={photoUri ? 'Change photo' : 'Add a photo'}
        variant="secondary"
        onPress={async () => setPhotoUri((await pickPhoto('library')) ?? photoUri)}
      />
      <FieldError message={error} />
    </Screen>
  );
}
