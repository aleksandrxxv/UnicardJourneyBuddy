import { router } from 'expo-router';
import { usePlaceForm } from '@/components/PlaceForm';
import { Button, Header, Screen } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { useProfile } from '@/profile/ProfileContext';

/** 10 A place you go often — step 7 */
export default function FavouritePlace() {
  const { draft, updateDraft } = useProfile();
  const existing = draft.places.find((p) => p.icon !== 'home');
  const form = usePlaceForm(existing);

  const next = () => {
    const place = form.submit();
    if (!place) return;
    updateDraft({ places: [...draft.places.filter((p) => p.id !== place.id), place] });
    router.push('/onboarding/ready');
  };

  return (
    <Screen header={<Header title="A place you go often" step={{ step: 7, of: ONBOARDING_STEPS }} />} footer={<Button label="Next" onPress={next} />}>
      {form.fields('Save a place so you can pick it without typing the address every time.')}
    </Screen>
  );
}
