import type { SavedDestination } from '@journeybuddy/shared';
import { Pressable, StyleSheet, Text } from 'react-native';
import { destinationIcon } from '@/constants/destinationIcons';
import { colors, fontSize, radius, spacing } from '@/theme';

interface Props {
  destination: SavedDestination;
  onPress: () => void;
}

/** Large tile for one parent-approved place (US-01, US-02). */
export function DestinationButton({ destination, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Go to ${destination.label}`}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <Text style={styles.icon} accessibilityElementsHidden importantForAccessibility="no">
        {destinationIcon(destination.icon)}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {destination.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  pressed: { borderColor: colors.primary, backgroundColor: '#EAF0FF' },
  icon: { fontSize: 56 },
  label: { fontSize: fontSize.large, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
