import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const Heading: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.heading, style]} {...props}>
    {children}
  </Text>
);

export const Subheading: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.subheading, style]} {...props}>
    {children}
  </Text>
);

export const BodyText: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.body, style]} {...props}>
    {children}
  </Text>
);

export const CaptionText: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.caption, style]} {...props}>
    {children}
  </Text>
);

export const CurrencyText: React.FC<{
  amount: number | string;
  currency?: string;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
  style?: any;
}> = ({ amount, currency = '₹', size = 'md', color = theme.colors.textPrimary, style }) => (
  <Text
    style={[
      styles.currencyBase,
      size === 'lg' && styles.currencyLg,
      size === 'md' && styles.currencyMd,
      size === 'sm' && styles.currencySm,
      { color },
      style,
    ]}
  >
    {currency} {typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    ...theme.typography.titleLg,
  },
  subheading: {
    ...theme.typography.titleMd,
  },
  body: {
    ...theme.typography.body,
  },
  caption: {
    ...theme.typography.caption,
  },
  currencyBase: {
    fontWeight: '800',
  },
  currencyLg: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  currencyMd: {
    fontSize: 17,
  },
  currencySm: {
    fontSize: 14,
  },
});

