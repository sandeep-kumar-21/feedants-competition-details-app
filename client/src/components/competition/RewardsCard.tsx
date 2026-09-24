import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Medal, Star, Info } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { IRewardTier } from '../../types/competition';

interface RewardsCardProps {
  rewards: IRewardTier[];
  disclaimer?: string;
  currency?: string;
}

export const RewardsCard: React.FC<RewardsCardProps> = ({
  rewards,
  disclaimer,
  currency = '₹',
}) => {
  const { t } = useLanguage();

  const renderIcon = (type: string, rank: number) => {
    switch (type) {
      case 'trophy_gold':
        return <Trophy size={16} color="#F59E0B" fill="#F59E0B" />;
      case 'medal_silver':
        return <Medal size={16} color="#9CA3AF" />;
      case 'medal_bronze':
        return <Medal size={16} color="#D97706" />;
      case 'star':
      default:
        return <Star size={16} color={theme.colors.accentCyan} />;
    }
  };

  return (
    <View>
      <Card style={styles.card}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{t('rewardsTitle')}</Text>
          <Text style={styles.subtitle}> {t('allPositions')}</Text>
        </View>

        {/* Tiers List */}
        <View style={styles.list}>
          {rewards.map((reward) => (
            <View key={reward._id || reward.rank} style={styles.rewardRow}>
              <View style={styles.left}>
                {renderIcon(reward.iconType, reward.rank)}
                <Text style={styles.positionText}>{reward.position}</Text>
              </View>
              <Text style={styles.amountText}>
                {currency} {reward.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Disclaimer Banner */}
      <View style={styles.disclaimerContainer}>
        <Info size={14} color="#00838F" style={styles.infoIcon} />
        <Text style={styles.disclaimerText}>
          {disclaimer || t('disclaimer')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
    marginBottom: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  list: {
    marginTop: theme.spacing.xs,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs + 3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.accentCyan,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F7F8',
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  infoIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#00626B',
    lineHeight: 16,
    fontWeight: '500',
  },
});

