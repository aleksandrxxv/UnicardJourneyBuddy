import { StyleSheet, Text, View } from 'react-native';
import type { PlaceIcon } from '@/profile/types';
import { palette, type } from '@/theme';
import { PlaceTile, placeIconName } from './PlaceTile';

const options: { icon: PlaceIcon; label: string }[] = [
  { icon: 'school', label: 'School' },
  { icon: 'pool', label: 'Sport' },
  { icon: 'home', label: 'House' },
  { icon: 'pin', label: 'Other' },
];

/** Shown after "Choose an icon" is tapped. */
export function PlaceIconPicker({ value, onChange }: { value: PlaceIcon; onChange: (icon: PlaceIcon) => void }) {
  return (
    <View style={styles.container}>
      <Text style={[type.smallBold, { color: palette.ink }]}>Icon</Text>
      <View style={styles.row}>
        {options.map((o) => (
          <PlaceTile key={o.icon} label={o.label} icon={placeIconName[o.icon]} selected={value === o.icon} onPress={() => onChange(o.icon)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, alignSelf: 'stretch' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -16 },
});
