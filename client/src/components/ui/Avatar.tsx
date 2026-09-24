import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  ringBorderColor?: string;
  ringWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = 'User',
  size = 54,
  ringBorderColor,
  ringWidth = 2,
  style,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const containerSize = ringBorderColor ? size + ringWidth * 4 : size;

  return (
    <View
      style={[
        styles.ringContainer,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          borderColor: ringBorderColor || 'transparent',
          borderWidth: ringBorderColor ? ringWidth : 0,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: '#E5E7EB',
  },
  fallback: {
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

