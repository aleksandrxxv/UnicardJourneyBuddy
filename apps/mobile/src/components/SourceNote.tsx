import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { JourneySource } from '@/hooks/useJourney';
import { palette, type } from '@/theme';

/** Tells testers whether times are real timetables or the sample journey. */
interface Props {
  source: JourneySource;
  loading: boolean;
  startsFromHome?: boolean;
}

export function SourceNote({ source, loading, startsFromHome }: Props) {
  const away = startsFromHome ? (
    <Text style={[type.small, styles.text]}>You are not in Birmingham, so this trip starts from Home.</Text>
  ) : null;
  if (loading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator color={palette.inkMuted} />
        <Text style={[type.small, styles.text]}>Finding buses…</Text>
      </View>
    );
  }
  if (source === 'live') return away;
  return (
    <>
      {away}
      <Text style={[type.small, styles.text]}>Sample times — live bus times are not available right now.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { color: palette.inkMuted, textAlign: 'center' },
});
