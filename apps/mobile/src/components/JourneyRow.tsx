import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { palette, radius, type } from '@/theme';
import { useColors } from '@/theme/ThemeContext';

interface Props {
  time: string;
  mode: 'walk' | 'bus';
  title: string;
  detail: string;
}

/** Figma "Journey row": time, mode icon in a soft circle, title and detail. */
export function JourneyRow({ time, mode, title, detail }: Props) {
  const colors = useColors();
  return (
    <View style={styles.row} accessible accessibilityLabel={`${time}. ${title}. ${detail}`}>
      <Text style={[type.smallBold, styles.time]}>{time}</Text>
      <View style={[styles.iconCircle, { backgroundColor: colors.brandSoft }]}>
        <Icon name={mode} />
      </View>
      <View style={styles.text}>
        <Text style={[type.bodyBold, { color: palette.ink }]}>{title}</Text>
        <Text style={[type.small, { color: palette.inkMuted }]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    borderRadius: 16,
    alignSelf: 'stretch',
  },
  time: { width: 44, color: palette.ink },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
});

export const cardStyle = {
  backgroundColor: palette.surface,
  borderWidth: 1,
  borderColor: palette.borderSoft,
  borderRadius: radius.card,
} as const;
