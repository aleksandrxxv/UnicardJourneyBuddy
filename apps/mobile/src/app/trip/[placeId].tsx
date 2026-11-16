import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cardStyle } from '@/components/JourneyRow';
import { SourceNote } from '@/components/SourceNote';
import { Button, Header, Screen } from '@/components/ui';
import { useNow } from '@/hooks/useNow';
import { useJourney } from '@/hooks/useJourney';
import { useProfile } from '@/profile/ProfileContext';
import type { Place } from '@/profile/types';
import { palette, radius, type } from '@/theme';
import { addMinutes, shortTime } from '@/utils/time';

type When = 'now' | 'leaveAt' | 'arriveBy';
const options: { value: When; label: string }[] = [
  { value: 'now', label: 'Leave now' },
  { value: 'leaveAt', label: 'Leave at' },
  { value: 'arriveBy', label: 'Arrive by' },
];

function roundUpTo5(date: Date): Date {
  const ms = 5 * 60_000;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

/** 23 Plan trip (US-03) */
export default function PlanTrip() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { profile } = useProfile();
  const place = profile?.places.find((p) => p.id === placeId);
  if (!place) return null;
  return <PlanTripForm place={place} />;
}

function PlanTripForm({ place }: { place: Place }) {
  const now = useNow();
  const [when, setWhen] = useState<When>('now');
  const [chosen, setChosen] = useState(() => roundUpTo5(addMinutes(new Date(), 15)));

  const time = when === 'now' ? now : chosen;
  const mode = when === 'arriveBy' ? 'arriveBy' : 'leaveAt';
  const { journey, source, loading, startsFromHome } = useJourney(place, time, mode);

  return (
    <Screen
      gap={20}
      header={
        <Header title={place.label} showMenu>
          <Text style={[type.small, styles.subtitle]}>{place.area ?? place.postcode}</Text>
        </Header>
      }
      footer={
        <Button
          label="Show my route"
          onPress={() =>
            router.push({
              pathname: '/route/[placeId]',
              params: { placeId: place.id, time: time.toISOString(), mode },
            })
          }
        />
      }
    >
      <Text style={[type.heading, styles.ink]}>When do you want to go?</Text>

      <View style={styles.segmented} accessibilityRole="radiogroup">
        {options.map((o) => {
          const selected = o.value === when;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setWhen(o.value)}
              style={[styles.segment, selected && styles.segmentSelected]}
            >
              <Text style={[type.smallBold, { color: selected ? palette.surface : palette.ink }]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {when !== 'now' && (
        <View style={styles.stepper}>
          <StepButton label="−" a11y="5 minutes earlier" onPress={() => setChosen((d) => addMinutes(d, -5))} />
          <Text style={[type.title, styles.ink]}>{shortTime(chosen)}</Text>
          <StepButton label="+" a11y="5 minutes later" onPress={() => setChosen((d) => addMinutes(d, 5))} />
        </View>
      )}

      <View style={[cardStyle, styles.result]} accessible accessibilityLabel={`Leaving at ${shortTime(journey.startTime)}. You will arrive at about ${shortTime(journey.arrivalTime)}.`}>
        <Text style={[type.small, { color: palette.inkMuted }]}>Leaving at</Text>
        <Text style={[type.display, styles.ink]}>{shortTime(journey.startTime)}</Text>
        <Text style={[type.bodyBold, styles.ink]}>You will arrive at about {shortTime(journey.arrivalTime)}</Text>
      </View>
      <SourceNote source={source} loading={loading} startsFromHome={startsFromHome} />
    </Screen>
  );
}

function StepButton({ label, a11y, onPress }: { label: string; a11y: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y} onPress={onPress} style={styles.stepButton}>
      <Text style={[type.title, styles.ink]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ink: { color: palette.ink },
  subtitle: { color: palette.ink, textAlign: 'center', paddingHorizontal: 24 },
  segmented: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.button,
  },
  segment: { flex: 1, height: 48, borderRadius: radius.field, alignItems: 'center', justifyContent: 'center' },
  segmentSelected: { backgroundColor: palette.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  stepButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: palette.ink,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  result: { alignItems: 'center', gap: 4, paddingVertical: 24 },
});
