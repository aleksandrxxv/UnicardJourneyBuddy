import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cardStyle } from '@/components/JourneyRow';
import { PlaceGrid } from '@/components/PlaceGrid';
import { PlaceTile, placeIconName } from '@/components/PlaceTile';
import { Avatar, Header, HelpButton, Icon, Screen } from '@/components/ui';
import { useHelp } from '@/hooks/useHelp';
import { useProfile } from '@/profile/ProfileContext';
import type { Place } from '@/profile/types';
import { palette, type } from '@/theme';
import { useColors } from '@/theme/ThemeContext';

/** 20 Home */
export default function Home() {
  const { profile } = useProfile();
  const help = useHelp();
  if (!profile) return null;

  const openPlace = (place: Place) => router.push({ pathname: '/trip/[placeId]', params: { placeId: place.id } });
  const recent = profile.recentTrips.map((id) => profile.places.find((p) => p.id === id)).filter((p): p is Place => !!p);

  return (
    <Screen
      gap={12}
      header={
        <Header showBack={false} showMenu>
          <View style={styles.greeting}>
            <Avatar uri={profile.avatarUri} size={72} />
            <Text style={[type.title, styles.center]}>Hi {profile.name}</Text>
            <Text style={[type.body, styles.center]}>Where are you going?</Text>
          </View>
        </Header>
      }
      footer={<HelpButton onPress={help} />}
    >
      <Text style={[type.heading, styles.ink]} accessibilityRole="header">
        Your places
      </Text>
      <PlaceGrid>
        {profile.places.map((p) => (
          <PlaceTile key={p.id} label={p.label} icon={placeIconName[p.icon]} onPress={() => openPlace(p)} />
        ))}
        <PlaceTile label="Add" icon="plus" onPress={() => router.push('/place/new')} />
        {/* Keep the last row left-aligned. */}
        {Array.from({ length: (3 - ((profile.places.length + 1) % 3)) % 3 }, (_, i) => (
          <View key={i} style={{ width: 106 }} />
        ))}
      </PlaceGrid>

      {recent.length > 0 && (
        <>
          <Text style={[type.heading, styles.ink]} accessibilityRole="header">
            Go again
          </Text>
          {recent.map((p) => (
            <QuickTrip key={p.id} place={p} summary={profile.tripSummaries?.[p.id]} onPress={() => openPlace(p)} />
          ))}
        </>
      )}
    </Screen>
  );
}

function QuickTrip({ place, summary = place.area ?? place.postcode, onPress }: { place: Place; summary?: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${place.label}, ${summary}`} onPress={onPress} style={[cardStyle, styles.quickTrip]}>
      <View style={[styles.quickIcon, { backgroundColor: colors.brandSoft }]}>
        <Icon name={placeIconName[place.icon]} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.bodyBold, styles.ink]}>{place.label}</Text>
        <Text style={[type.small, { color: palette.inkMuted }]}>{summary}</Text>
      </View>
      <Icon name="chevronRight" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greeting: { alignItems: 'center', gap: 4, paddingHorizontal: 24 },
  center: { color: palette.ink, textAlign: 'center' },
  ink: { color: palette.ink },
  quickTrip: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  quickIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
});
