import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_SWATCH, themeColors, type SwatchName, type ThemeColors } from './index';

const ThemeContext = createContext<ThemeColors>(themeColors(DEFAULT_SWATCH));

export function ThemeProvider({ swatch, children }: { swatch: SwatchName; children: ReactNode }) {
  return <ThemeContext.Provider value={themeColors(swatch)}>{children}</ThemeContext.Provider>;
}

export function useColors(): ThemeColors {
  return useContext(ThemeContext);
}
