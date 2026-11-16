import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { JourneySource } from '@/hooks/useJourney';
import { palette, type } from '@/theme';

/** Tells testers whether times are real timetables or the sample journey. */
export function SourceNote({ source, loading }: { source: JourneySource; loading: boolean }) {
  if (loading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator color={palette.inkMuted} />
        <Text style={[type.small, styles.text]}>Finding buses…</Text>
      </View>
    );
  }
  if (source === 'live') return null;
  return <Text style={[type.small, styles.text]}>Sample times — live bus times are not available right now.</Text>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { color: palette.inkMuted, textAlign: 'center' },
});
