import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/theme';
import { BigButton } from './BigButton';

interface Props {
  loading?: boolean;
  message: string;
  onRetry?: () => void;
}

/** Full-screen loading or error state, worded for children. */
export function StatusMessage({ loading, message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      <Text style={styles.message}>{message}</Text>
      {onRetry && <BigButton label="Try again" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  message: { fontSize: fontSize.large, color: colors.text, textAlign: 'center' },
});
