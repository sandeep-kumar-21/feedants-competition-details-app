import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageSquare, ChevronRight } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';

interface UserFeedbackCardProps {
  onPress?: () => void;
}

export const UserFeedbackCard: React.FC<UserFeedbackCardProps> = ({ onPress }) => {
  const { t } = useLanguage();

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('hearFromUsers')}
      >
        <MessageSquare size={20} color={theme.colors.textPrimary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('hearFromUsers')}</Text>
          <Text style={styles.subtitle}>{t('hearUsersDesc')}</Text>
        </View>
        <ChevronRight size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

