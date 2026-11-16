import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette, radius, type } from '@/theme';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'help';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

/** Figma "Button" (Primary / Secondary) and "Help button". */
export function Button({ label, onPress, variant = 'primary', disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], (pressed || disabled) && styles.dimmed]}
    >
      <View style={styles.row}>
        {variant === 'help' && <Icon name="help" />}
        <Text style={[type.bodyBold, variant === 'secondary' ? styles.inkText : styles.lightText]}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function HelpButton({ onPress }: { onPress: () => void }) {
  return <Button label="I need help" variant="help" onPress={onPress} />;
}

const styles = StyleSheet.create({
  base: { height: 56, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, alignSelf: 'stretch' },
  primary: { backgroundColor: palette.ink },
  secondary: { backgroundColor: palette.surface, borderWidth: 2, borderColor: palette.ink },
  help: { backgroundColor: palette.danger, height: 60 },
  dimmed: { opacity: 0.55 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lightText: { color: palette.surface },
  inkText: { color: palette.ink },
});
