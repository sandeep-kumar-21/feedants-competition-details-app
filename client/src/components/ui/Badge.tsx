import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

export type BadgeVariant = 'registered' | 'success' | 'warning' | 'neutral' | 'transparent';

interface BadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = 'registered',
  style,
  textStyle,
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'registered' && styles.registered,
        variant === 'success' && styles.success,
        variant === 'warning' && styles.warning,
        variant === 'neutral' && styles.neutral,
        variant === 'transparent' && styles.transparent,
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          variant === 'registered' && styles.registeredText,
          variant === 'success' && styles.successText,
          variant === 'warning' && styles.warningText,
          variant === 'neutral' && styles.neutralText,
          variant === 'transparent' && styles.transparentText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radii.full,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: theme.spacing.xs + 1,
  },
  text: {
    ...theme.typography.badge,
  },
  registered: {
    backgroundColor: theme.colors.primaryLight,
  },
  registeredText: {
    color: theme.colors.accentCyan,
    fontWeight: '700',
  },
  success: {
    backgroundColor: '#DEF7EC',
  },
  successText: {
    color: '#03543F',
    fontWeight: '700',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  warningText: {
    color: '#92400E',
    fontWeight: '700',
  },
  neutral: {
    backgroundColor: theme.colors.surfaceTertiary,
  },
  neutralText: {
    color: theme.colors.textSecondary,
  },
  transparent: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  transparentText: {
    color: theme.colors.accentCyan,
    fontWeight: '600',
    fontSize: 12,
  },
});

