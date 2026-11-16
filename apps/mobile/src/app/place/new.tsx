import { router } from 'expo-router';
import { usePlaceForm } from '@/components/PlaceForm';
import { Button, Header, Screen } from '@/components/ui';
import { useProfile } from '@/profile/ProfileContext';

/** 26 New place */
export default function NewPlace() {
  const { addPlace } = useProfile();
  const form = usePlaceForm();

  const save = async () => {
    const place = form.submit();
    if (!place) return;
    await addPlace(place);
    router.back();
  };

  return (
    <Screen header={<Header title="New place" />} footer={<Button label="Save" onPress={save} />}>
      {form.fields('Save a place so you can pick it from your start screen.')}
    </Screen>
  );
}
