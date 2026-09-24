export const colors = {
  // Brand Deep Teal
  primary: '#005B64',
  primaryDark: '#00454D',
  primaryLight: '#E3F5F5',
  primaryMuted: '#B2DFDB',

  // Accents
  accentCyan: '#007A87',
  accentGreen: '#10B981',
  accentGold: '#F59E0B',
  accentSilver: '#9CA3AF',
  accentBronze: '#D97706',
  accentStar: '#007A87',

  // Surface & Background
  background: '#F5F7F9',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',
  surfaceTertiary: '#F3F4F6',
  surfaceMint: '#EBF7F4',
  surfaceCyanLight: '#E3F5F5',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textWhite: '#FFFFFF',
  textTeal: '#005B64',
  textCyan: '#007A87',

  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F0F2F5',
  borderTeal: '#B2DFDB',

  // State colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export type ColorType = typeof colors;

