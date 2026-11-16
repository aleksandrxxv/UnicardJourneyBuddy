import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Header, Icon, Screen } from '@/components/ui';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { useProfile } from '@/profile/ProfileContext';
import { palette, swatches, type, type SwatchName } from '@/theme';

/** 07 Choose your colour — step 4. Tapping a swatch re-themes the whole app at once. */
export default function ChooseColour() {
  const { draft, updateDraft } = useProfile();
  const names = Object.keys(swatches) as SwatchName[];

  return (
    <Screen
      header={<Header title="Choose your colour" step={{ step: 4, of: ONBOARDING_STEPS }} />}
      footer={<Button label="Next" onPress={() => router.push('/onboarding/helper')} />}
    >
      <Text style={[type.body, { color: palette.ink }]}>Tap a colour to try it. The whole app changes straight away.</Text>
      <View style={styles.grid}>
        {names.map((name) => {
          const selected = draft.colour === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={swatches[name].label}
              onPress={() => updateDraft({ colour: name })}
              style={styles.swatch}
            >
              <View style={[styles.circle, { backgroundColor: swatches[name].color }]}>{selected && <Icon name="checkSwatch" size={36} />}</View>
              <Text style={[type.smallBold, { color: palette.ink }]}>{swatches[name].label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 20 },
  swatch: { width: '33%', alignItems: 'center', gap: 8 },
  circle: { width: 84, height: 84, borderRadius: 42, borderWidth: 2, borderColor: palette.ink, alignItems: 'center', justifyContent: 'center' },
});
