import { colors } from './colors';
import { spacing, radii } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof theme;

