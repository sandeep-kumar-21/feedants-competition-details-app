import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color = theme.colors.borderLight,
  vertical = false,
}) => {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: color },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  vertical: {
    width: 1,
    height: '100%',
    marginHorizontal: theme.spacing.md,
  },
});

