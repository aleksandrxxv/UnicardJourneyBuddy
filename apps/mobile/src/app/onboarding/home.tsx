import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Text } from 'react-native';
import { FieldError } from '@/components/FieldError';
import { Button, Header, Screen, TextField } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { buildPlace, validatePlace } from '@/profile/buildPlace';
import { useProfile } from '@/profile/ProfileContext';
import { pickPhoto } from '@/services/photos';
import { palette, type } from '@/theme';

/** 09 Your home — step 6 */
export default function YourHome() {
  const { draft, updateDraft } = useProfile();
  const existing = draft.places.find((p) => p.icon === 'home');
  const [city, setCity] = useState(existing?.city ?? 'Birmingham');
  const [postcode, setPostcode] = useState(existing?.postcode ?? '');
  const [photoUri, setPhotoUri] = useState(existing?.photoUri);
  const [error, setError] = useState<string>();

  const next = () => {
    const problem = validatePlace('Home', postcode);
    if (problem) return setError(problem);
    const home = buildPlace({ id: existing?.id, label: 'Home', icon: 'home', postcode, city: city.trim(), photoUri });
    updateDraft({ places: [home, ...draft.places.filter((p) => p.id !== home.id)] });
    router.push('/onboarding/favourite');
  };

  return (
    <Screen header={<Header title="Your home" step={{ step: 6, of: ONBOARDING_STEPS }} />} footer={<Button label="Next" onPress={next} />}>
      <Text style={[type.body, { color: palette.ink }]}>Save your home so you can always find your way back.</Text>
      <TextField label="City" value={city} onChangeText={setCity} autoComplete="postal-address-locality" />
      <TextField label="Postcode" value={postcode} onChangeText={setPostcode} autoCapitalize="characters" autoComplete="postal-code" />
      {photoUri && <Image source={{ uri: photoUri }} style={{ width: '100%', height: 160, borderRadius: 16 }} />}
      <Button
        label={photoUri ? 'Change the picture' : 'Add a picture of your home'}
        variant="secondary"
        onPress={async () => setPhotoUri((await pickPhoto('library')) ?? photoUri)}
      />
      <FieldError message={error} />
    </Screen>
  );
}
