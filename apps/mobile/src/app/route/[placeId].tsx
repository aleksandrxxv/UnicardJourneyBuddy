import type { JourneyLeg } from '@journeybuddy/shared';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Text } from 'react-native';
import { JourneyRow } from '@/components/JourneyRow';
import { SourceNote } from '@/components/SourceNote';
import { Button, Header, HelpButton, Screen } from '@/components/ui';
import { useHelp } from '@/hooks/useHelp';
import { useJourney } from '@/hooks/useJourney';
import { useProfile } from '@/profile/ProfileContext';
import type { Place } from '@/profile/types';
import { busSummary, routeSummary } from '@/services/journeySummary';
import { palette, type } from '@/theme';
import { minutesBetween, shortTime } from '@/utils/time';

function legDetail(leg: JourneyLeg, isLast: boolean): string {
  const minutes = minutesBetween(leg.departureTime, leg.arrivalTime);
  if (leg.mode === 'walk') return isLast || !leg.stopName ? `${minutes} min` : `${leg.stopName}, ${minutes} min`;
  const towards = leg.towards ? `To ${leg.towards}, ` : `Get off at ${leg.stopName}, `;
  return `${towards}${leg.stopsCount} ${leg.stopsCount === 1 ? 'stop' : 'stops'}`;
}

/** 24 Route */
export default function Route() {
  const { placeId, time, mode } = useLocalSearchParams<{ placeId: string; time: string; mode: 'leaveAt' | 'arriveBy' }>();
  const { profile } = useProfile();
  const place = profile?.places.find((p) => p.id === placeId);
  if (!place) return null;
  return <RouteList place={place} time={new Date(time)} mode={mode} />;
}

function RouteList({ place, time, mode }: { place: Place; time: Date; mode: 'leaveAt' | 'arriveBy' }) {
  const { recordTrip } = useProfile();
  const help = useHelp();
  const { journey, source, loading } = useJourney(place, time, mode);

  const start = async () => {
    await recordTrip(place.id, busSummary(journey));
    Alert.alert('Coming soon', 'Step-by-step directions are the next part we are building.');
  };

  return (
    <Screen
      gap={8}
      header={
        <Header title={`Your route to ${place.label}`}>
          <Text style={[type.bodyBold, { color: palette.ink, textAlign: 'center', paddingHorizontal: 24 }]}>{routeSummary(journey)}</Text>
        </Header>
      }
      footer={
        <>
          <Button label="Start journey" onPress={start} />
          <HelpButton onPress={help} />
        </>
      }
    >
      {journey.legs.map((leg, i) => (
        <JourneyRow
          key={i}
          time={shortTime(leg.departureTime)}
          mode={leg.mode === 'walk' ? 'walk' : 'bus'}
          title={leg.instruction}
          detail={legDetail(leg, i === journey.legs.length - 1)}
        />
      ))}
      <SourceNote source={source} loading={loading} />
    </Screen>
  );
}
