import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Megaphone } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';

export const AdBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Megaphone size={16} color="#9CA3AF" style={styles.icon} />
      <Text style={styles.text}>{t('adHere')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: theme.radii.sm,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});

