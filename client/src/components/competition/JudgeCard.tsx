import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { IJudge } from '../../types/competition';

interface JudgeCardProps {
  judge: IJudge;
  onPressIntroVideo?: () => void;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ judge, onPressIntroVideo }) => {
  const { t } = useLanguage();

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {/* Left: Judge Avatar with gradient/colorful ring */}
        <Avatar
          uri={judge.avatarUrl}
          name={judge.name}
          size={56}
          ringBorderColor="#F59E0B"
          ringWidth={2}
          style={styles.avatar}
        />

        {/* Middle: Details */}
        <View style={styles.detailsColumn}>
          <Text style={styles.roleLabel}>{t('judge')}</Text>
          <Text style={styles.judgeName}>{judge.name}</Text>
          <Text style={styles.subtitle}>{judge.title}</Text>
          <Text style={styles.experience}>{judge.experience}</Text>
        </View>

        {/* Right: Intro Video Trigger */}
        <TouchableOpacity
          style={styles.videoColumn}
          onPress={onPressIntroVideo}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('introVideo')}
        >
          <View style={styles.playCircle}>
            <Play size={18} color={theme.colors.accentCyan} fill={theme.colors.accentCyan} style={styles.playIcon} />
          </View>
          <Text style={styles.videoLabel}>{t('introVideo')}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing.md,
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  experience: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  videoColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing.sm,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceCyanLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playIcon: {
    marginLeft: 2, // optical center for play triangle
  },
  videoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
});

