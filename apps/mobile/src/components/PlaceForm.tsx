import { useState } from 'react';
import { Text } from 'react-native';
import { FieldError } from '@/components/FieldError';
import { PlaceIconPicker } from '@/components/PlaceIconPicker';
import { Button, TextField } from '@/components/ui';
import { buildPlace, validatePlace } from '@/profile/buildPlace';
import type { Place, PlaceIcon } from '@/profile/types';
import { palette, type } from '@/theme';

export interface PlaceFormState {
  label: string;
  postcode: string;
  icon: PlaceIcon;
}

/** "Name of the place" + "Postcode" + "Choose an icon" (Figma 10 and 26). */
export function usePlaceForm(initial?: Place) {
  const [state, setState] = useState<PlaceFormState>({
    label: initial?.label ?? '',
    postcode: initial?.postcode ?? '',
    icon: initial?.icon ?? 'school',
  });
  const [showIcons, setShowIcons] = useState(false);
  const [error, setError] = useState<string>();

  const submit = (): Place | undefined => {
    const problem = validatePlace(state.label, state.postcode);
    setError(problem);
    return problem ? undefined : buildPlace({ id: initial?.id, ...state });
  };

  const fields = (intro: string) => (
    <>
      <Text style={[type.body, { color: palette.ink }]}>{intro}</Text>
      <TextField label="Name of the place" value={state.label} onChangeText={(label) => setState((s) => ({ ...s, label }))} />
      <TextField
        label="Postcode"
        value={state.postcode}
        onChangeText={(postcode) => setState((s) => ({ ...s, postcode }))}
        autoCapitalize="characters"
        autoComplete="postal-code"
      />
      {showIcons ? (
        <PlaceIconPicker value={state.icon} onChange={(icon) => setState((s) => ({ ...s, icon }))} />
      ) : (
        <Button label="Choose an icon" variant="secondary" onPress={() => setShowIcons(true)} />
      )}
      <FieldError message={error} />
    </>
  );

  return { fields, submit };
}
