import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DestinationButton } from '@/components/DestinationButton';
import { StatusMessage } from '@/components/StatusMessage';
import { DEMO_CHILD_ID, DEMO_CHILD_NAME } from '@/constants/demo';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services/api';
import { colors, fontSize, spacing } from '@/theme';

/** Home: only the places a parent approved, as big buttons. No typing needed (US-01, US-02). */
export default function HomeScreen() {
  const destinations = useAsync(() => api.approvedDestinations(DEMO_CHILD_ID), []);

  if (!destinations.data) {
    return destinations.status === 'error' ? (
      <StatusMessage message="We couldn't load your places." onRetry={destinations.reload} />
    ) : (
      <StatusMessage loading message="Loading your places…" />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting} accessibilityRole="header">
        Hi {DEMO_CHILD_NAME}! 👋
      </Text>
      <Text style={styles.question}>Where are you going?</Text>

      {destinations.data.length === 0 ? (
        <Text style={styles.empty}>Ask your parent to add some places for you.</Text>
      ) : (
        <View style={styles.grid}>
          {destinations.data.map((d) => (
            <DestinationButton
              key={d.id}
              destination={d}
              onPress={() => router.push({ pathname: '/trip/[destinationId]', params: { destinationId: d.id } })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md },
  greeting: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  question: { fontSize: fontSize.large, color: colors.textMuted, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  empty: { fontSize: fontSize.body, color: colors.textMuted },
});
