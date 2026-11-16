import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, type } from '@/theme';
import { useColors } from '@/theme/ThemeContext';

interface Props {
  art: ReactNode;
  title: string;
  body?: string;
  footer?: ReactNode;
}

/** Full brand-colour page with centred art, title and text (Welcome, Allow location, Ready, Arrived). */
export function HeroScreen({ art, title, body, footer }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.brand, paddingTop: insets.top }]}>
      <View style={styles.center}>
        {art}
        <Text style={[type.display, styles.text]} accessibilityRole="header">
          {title}
        </Text>
        {body && <Text style={[type.body, styles.text]}>{body}</Text>}
      </View>
      {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>{footer}</View>}
    </View>
  );
}

/** 120 pt white circle holding an icon, as on Allow location / Ready. */
export function IconBadge({ children }: { children: ReactNode }) {
  return <View style={styles.badge}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  text: { color: palette.ink, textAlign: 'center' },
  footer: { paddingHorizontal: 24, paddingTop: 12, gap: 12 },
  badge: { width: 120, height: 120, borderRadius: 60, backgroundColor: palette.surface, alignItems: 'center', justifyContent: 'center' },
});
