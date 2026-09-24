import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat' | 'mint' | 'cyanLight';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'flat' && styles.flat,
        variant === 'mint' && styles.mint,
        variant === 'cyanLight' && styles.cyanLight,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  elevated: {
    ...theme.shadows.card,
  },
  outlined: {
    borderColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  flat: {
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  mint: {
    backgroundColor: theme.colors.surfaceMint,
    borderColor: '#D1FAE5',
  },
  cyanLight: {
    backgroundColor: theme.colors.surfaceCyanLight,
    borderColor: '#CFFAFE',
  },
});

