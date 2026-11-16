import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BigButton } from '@/components/BigButton';
import { StatusMessage } from '@/components/StatusMessage';
import { DEMO_CHILD_ID } from '@/constants/demo';
import { destinationIcon } from '@/constants/destinationIcons';
import { useAsync } from '@/hooks/useAsync';
import { useNow } from '@/hooks/useNow';
import { api } from '@/services/api';
import { getStartLocation } from '@/services/location';
import { colors, fontSize, radius, spacing } from '@/theme';
import { formatClock, leaveText, minutesUntil } from '@/utils/time';

const REPLAN_INTERVAL_MS = 60_000;

/** Trip overview: when to leave, when you'll arrive and how long it takes (US-03). */
export default function TripScreen() {
  const { destinationId } = useLocalSearchParams<{ destinationId: string }>();
  const now = useNow();

  const destinations = useAsync(() => api.approvedDestinations(DEMO_CHILD_ID), []);
  const destination = destinations.data?.find((d) => d.id === destinationId);

  const journey = useAsync(async () => {
    const from = await getStartLocation();
    return api.planJourney({ childId: DEMO_CHILD_ID, destinationId, from });
  }, [destinationId]);

  // Re-plan regularly so a changed departure time shows up on screen.
  const { reload } = journey;
  useEffect(() => {
    const id = setInterval(reload, REPLAN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reload]);

  const title = destination ? `To ${destination.label}` : 'Your trip';

  if (!journey.data) {
    return (
      <>
        <Stack.Screen options={{ title }} />
        {journey.status === 'error' ? (
          <StatusMessage message="We couldn't plan your trip." onRetry={journey.reload} />
        ) : (
          <StatusMessage loading message="Planning your trip…" />
        )}
      </>
    );
  }

  const { startTime, arrivalTime } = journey.data;
  const totalMinutes = minutesUntil(arrivalTime, new Date(startTime));
  const leaveNow = minutesUntil(startTime, now) <= 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />

      <View style={styles.hero} accessible accessibilityLabel={`${leaveText(startTime, now)}. Arrive at ${formatClock(arrivalTime)}.`}>
        <Text style={styles.icon}>{destinationIcon(destination?.icon)}</Text>
        <Text style={[styles.leave, leaveNow && styles.leaveNow]}>{leaveText(startTime, now)}</Text>
        <Text style={styles.leaveAt}>at {formatClock(startTime)}</Text>
      </View>

      <View style={styles.row}>
        <InfoCard label="You arrive at" value={formatClock(arrivalTime)} />
        <InfoCard label="Trip takes" value={`${totalMinutes} min`} />
      </View>

      <View style={styles.spacer} />
      <BigButton label="Start my trip" onPress={() => {}} disabled />
      <Text style={styles.note}>Step-by-step directions are coming soon.</Text>
    </View>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label} ${value}`}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: { fontSize: 56 },
  leave: { fontSize: fontSize.hero, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  leaveNow: { color: colors.warning },
  leaveAt: { fontSize: fontSize.large, color: colors.textMuted },
  row: { flexDirection: 'row', gap: spacing.md },
  card: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs },
  cardLabel: { fontSize: fontSize.body, color: colors.textMuted },
  cardValue: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  spacer: { flex: 1 },
  note: { fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center' },
});
