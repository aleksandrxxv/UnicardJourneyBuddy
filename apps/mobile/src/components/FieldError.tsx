import { Text } from 'react-native';
import { palette, type } from '@/theme';

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text style={[type.smallBold, { color: palette.danger }]} accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}
