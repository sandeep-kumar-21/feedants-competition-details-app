import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

interface ChipProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export const Chip: React.FC<ChipProps> = ({ label, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
});

