import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../../theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'pill' | 'darkTeal';

interface ButtonProps {
  label: string;
  subLabel?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  subLabel,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  labelStyle,
  accessibilityLabel,
}) => {
  const isClickable = !disabled && !loading;

  return (
    <TouchableOpacity
      onPress={isClickable ? onPress : undefined}
      activeOpacity={0.8}
      disabled={!isClickable}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'darkTeal' && styles.darkTeal,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'pill' && styles.pill,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
          <View style={styles.textColumn}>
            <Text
              style={[
                styles.label,
                variant === 'outline' && styles.outlineLabel,
                disabled && styles.disabledLabel,
                labelStyle,
              ]}
            >
              {label}
            </Text>
            {subLabel ? (
              <Text
                style={[
                  styles.subLabel,
                  variant === 'outline' && styles.outlineSubLabel,
                  disabled && styles.disabledLabel,
                ]}
              >
                {subLabel}
              </Text>
            ) : null}
          </View>
          {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.accentCyan,
  },
  darkTeal: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.primaryLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pill: {
    backgroundColor: theme.colors.accentCyan,
    borderRadius: theme.radii.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  disabled: {
    backgroundColor: '#D1D5DB',
    borderColor: '#D1D5DB',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  subLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  outlineLabel: {
    color: theme.colors.textPrimary,
  },
  outlineSubLabel: {
    color: theme.colors.textSecondary,
  },
  disabledLabel: {
    color: '#9CA3AF',
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  },
});

