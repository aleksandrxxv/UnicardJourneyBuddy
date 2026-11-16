import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, type } from '@/theme';
import { useColors } from '@/theme/ThemeContext';
import { Icon } from './Icon';

interface Props {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  /** Onboarding progress, e.g. { step: 2, of: 7 }. */
  step?: { step: number; of: number };
  children?: React.ReactNode;
}

/** Brand-coloured block with the Figma "Top bar", optional step progress and extra content. */
export function Header({ title = '', showBack = true, showMenu = false, step, children }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.brand, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <IconSlot visible={showBack} icon="back" label="Back" onPress={() => router.back()} />
        <Text style={[type.heading, styles.title]} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        <IconSlot visible={showMenu} icon="menu" label="Menu" onPress={() => router.push('/menu')} />
      </View>
      {step && (
        <View style={styles.progress}>
          <Text style={[type.caption, styles.ink]}>
            Step {step.step} of {step.of}
          </Text>
          <View style={styles.bars} accessibilityLabel={`Step ${step.step} of ${step.of}`}>
            {Array.from({ length: step.of }, (_, i) => (
              <View key={i} style={[styles.bar, { backgroundColor: i < step.step ? palette.ink : palette.surface }]} />
            ))}
          </View>
        </View>
      )}
      {children}
    </View>
  );
}

function IconSlot({ visible, icon, label, onPress }: { visible: boolean; icon: 'back' | 'menu'; label: string; onPress: () => void }) {
  if (!visible) return <View style={styles.slot} />;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.slot} hitSlop={8}>
      <Icon name={icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 16, gap: 6 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  slot: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', color: palette.ink },
  progress: { paddingHorizontal: 24, gap: 8 },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
  ink: { color: palette.ink },
});
