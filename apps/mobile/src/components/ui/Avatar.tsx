import { Image, StyleSheet, View } from 'react-native';
import { palette } from '@/theme';
import { Icon } from './Icon';

/** The child's photo in a white circle, or the default Figma avatar. */
export function Avatar({ uri, size }: { uri?: string; size: 72 | 160 }) {
  if (!uri) return <Icon name={size === 160 ? 'avatar' : 'avatarSmall'} size={size} />;
  const inner = size * 0.85;
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={{ uri }} style={{ width: inner, height: inner, borderRadius: inner / 2 }} accessibilityIgnoresInvertColors />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { backgroundColor: palette.surface, alignItems: 'center', justifyContent: 'center' },
});
