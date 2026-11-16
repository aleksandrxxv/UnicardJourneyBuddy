import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/theme';

interface Props {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** Gap between content blocks (Figma uses 16 on forms, 20 on plan trip, 8 on the route list). */
  gap?: number;
}

/** Canvas page: brand header, scrolling content, buttons pinned to the bottom. */
export function Screen({ header, footer, children, gap = 16 }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {header}
      <ScrollView contentContainerStyle={[styles.content, { gap }]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>{footer}</View>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12, gap: 12 },
});
