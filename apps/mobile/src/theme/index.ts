// Design tokens from the Figma file "Birmingham Bus Navigation (Unicard)".

export const palette = {
  ink: '#0E2A25',
  inkMuted: '#48605A',
  surface: '#FFFFFF',
  canvas: '#F3F7F5',
  border: '#5F7770',
  borderSoft: '#D5E0DC',
  danger: '#B9102B',
  info: '#0B65A8',
};

/** The child picks one of these on "Choose your colour"; it replaces mint across the whole app. */
export const swatches = {
  mint: { label: 'Mint', color: '#38E2AE' },
  amber: { label: 'Amber', color: '#FFC233' },
  coral: { label: 'Coral', color: '#FF8A7A' },
  sky: { label: 'Sky', color: '#6CC6FF' },
  lilac: { label: 'Lilac', color: '#C9A7F5' },
  pink: { label: 'Pink', color: '#FF9CC2' },
} as const;

export type SwatchName = keyof typeof swatches;
export const DEFAULT_SWATCH: SwatchName = 'mint';

/** Pale tint of the brand colour, used behind icons (Figma "mint-soft" is 83% white over mint). */
function soften(hex: string, amount = 0.83): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const [r, g, b] = [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)];
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function themeColors(swatch: SwatchName) {
  const brand = swatches[swatch].color;
  return { ...palette, brand, brandSoft: soften(brand) };
}

export type ThemeColors = ReturnType<typeof themeColors>;

export const fonts = {
  regular: 'Lato_400Regular',
  bold: 'Lato_700Bold',
  black: 'Lato_900Black',
};

/** Figma text styles. */
export const type = {
  display: { fontFamily: fonts.black, fontSize: 32, lineHeight: 38 },
  title: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32 },
  heading: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 26 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  small: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22 },
  smallBold: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { field: 12, button: 16, card: 20 };
