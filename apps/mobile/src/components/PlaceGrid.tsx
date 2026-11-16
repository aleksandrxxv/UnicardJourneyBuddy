import { StyleSheet, View } from 'react-native';

/** Three tiles per row, as on the Figma home screen. */
export function PlaceGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
});
