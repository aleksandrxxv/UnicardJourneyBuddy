import { useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { palette, radius, type } from '@/theme';

const LENGTH = 6;

/** Six boxes from the Figma "Enter your code" screen, backed by one hidden numeric input. */
export function CodeInput({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  return (
    <Pressable onPress={() => input.current?.focus()} accessibilityLabel={`Code, ${value.length} of 6 numbers typed`}>
      <View style={styles.row}>
        {Array.from({ length: LENGTH }, (_, i) => {
          const digit = value[i];
          return (
            <View key={i} style={[styles.box, { borderColor: digit || i === value.length ? palette.ink : palette.border }]}>
              <Text style={[type.title, { color: palette.ink }]}>{digit ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        maxLength={LENGTH}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  box: {
    flex: 1,
    height: 64,
    borderWidth: 2,
    borderRadius: radius.field,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
