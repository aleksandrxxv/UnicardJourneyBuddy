import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/ui';
import type { PlaceIcon } from '@/profile/types';
import { palette, type } from '@/theme';

export const placeIconName: Record<PlaceIcon, IconName> = { home: 'home', school: 'school', pool: 'pool', pin: 'pin' };

interface Props {
  label: string;
  icon: IconName;
  onPress: () => void;
  selected?: boolean;
}

/** Figma "Place tile": 76 pt circle with an icon and a label underneath. */
export function PlaceTile({ label, icon, onPress, selected }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} onPress={onPress} style={styles.tile}>
      {({ pressed }) => (
        <>
          <View style={[styles.circle, (pressed || selected) && styles.active]}>
            <Icon name={icon} size={32} />
          </View>
          <Text style={[type.smallBold, styles.label]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: 106, alignItems: 'center', gap: 8 },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: palette.ink,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { borderWidth: 4 },
  label: { color: palette.ink, textAlign: 'center' },
});
