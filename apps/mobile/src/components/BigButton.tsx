import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, minTouchSize, radius, spacing } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function BigButton({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchSize,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dimmed: { opacity: 0.6 },
  label: { color: colors.primaryText, fontSize: fontSize.large, fontWeight: '700' },
});
