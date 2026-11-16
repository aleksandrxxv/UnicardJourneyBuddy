import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { palette, radius, type } from '@/theme';

interface Props extends TextInputProps {
  label: string;
}

/** Figma "Input": label above a 56 pt field; thicker ink border while focused. */
export function TextField({ label, style, onFocus, onBlur, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={[type.smallBold, styles.label]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={palette.inkMuted}
        {...input}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[type.body, styles.field, focused && styles.focused, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, alignSelf: 'stretch' },
  label: { color: palette.ink },
  field: {
    height: 56,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.field,
    paddingHorizontal: 16,
    color: palette.ink,
  },
  focused: { borderWidth: 3, borderColor: palette.ink, paddingHorizontal: 15 },
});
