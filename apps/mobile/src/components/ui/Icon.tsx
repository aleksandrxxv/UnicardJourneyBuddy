import { SvgXml } from 'react-native-svg';
import * as icons from '@/assets/figmaIcons';

export type IconName = keyof typeof icons;

/** Renders an icon exported from the Figma file at the size used in the design. */
export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return <SvgXml xml={icons[name]} width={size} height={size} />;
}
