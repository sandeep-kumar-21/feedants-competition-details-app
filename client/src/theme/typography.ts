import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  titleLg: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  } as TextStyle,
  titleMd: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  } as TextStyle,
  titleSm: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  } as TextStyle,
  metricLg: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  } as TextStyle,
  metricMd: {
    fontSize: 18,
    fontWeight: '700',
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
  } as TextStyle,
  bodyBold: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.textPrimary,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textSecondary,
  } as TextStyle,
  captionBold: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: colors.textPrimary,
  } as TextStyle,
  badge: {
    fontSize: 11,
    fontWeight: '600',
  } as TextStyle,
  timer: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.primary,
  } as TextStyle,
} as const;

