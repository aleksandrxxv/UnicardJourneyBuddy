// Child-friendly design tokens: large type, big tap targets, high contrast (US-14).

export const colors = {
  background: '#F5F8FF',
  surface: '#FFFFFF',
  primary: '#1F5BD8',
  primaryText: '#FFFFFF',
  text: '#14213D',
  textMuted: '#4A5670',
  success: '#167A3E',
  warning: '#B25E00',
  danger: '#C62828',
  border: '#D5DDEE',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { md: 12, lg: 20 };

export const fontSize = { body: 18, large: 22, title: 28, hero: 40 };

/** Minimum tap target in dp; well above the 48 dp guideline for small hands. */
export const minTouchSize = 64;
