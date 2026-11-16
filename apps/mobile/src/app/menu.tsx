import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui';
import { useProfile } from '@/profile/ProfileContext';
import { palette, type } from '@/theme';

/** 21 Menu */
export default function Menu() {
  const insets = useSafeAreaInsets();
  const { signOut } = useProfile();
  const comingSoon = (what: string) => Alert.alert(what, 'This part of the app is coming soon.');

  const items: { label: string; onPress: () => void }[] = [
    { label: 'Start', onPress: () => router.back() },
    { label: 'Helpers', onPress: () => comingSoon('Helpers') },
    { label: 'About', onPress: () => comingSoon('About') },
    { label: 'Privacy', onPress: () => comingSoon('Privacy') },
    {
      label: 'Sign out',
      onPress: async () => {
        await signOut();
        router.dismissAll();
        router.replace('/welcome');
      },
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.closeRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={() => router.back()} hitSlop={10} style={styles.close}>
          <Icon name="close" size={28} />
        </Pressable>
      </View>
      <View style={styles.list}>
        {items.map((item) => (
          <Pressable key={item.label} accessibilityRole="button" onPress={item.onPress} style={styles.item}>
            <Text style={[type.title, { color: palette.surface }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.ink },
  closeRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 14 },
  close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 24, paddingTop: 24 },
  item: { paddingVertical: 18 },
});
