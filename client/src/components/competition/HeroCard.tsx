import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Trophy, Users } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { ICompetitionDetail } from '../../types/competition';

interface HeroCardProps {
  competition: ICompetitionDetail;
}

export const HeroCard: React.FC<HeroCardProps> = ({ competition }) => {
  const { t } = useLanguage();

  const isRegistered = competition.viewerStatus.isRegistered;
  const spotsLeft = competition.spotsRemaining;
  const bookedCount = competition.spotsBooked;
  const maxCount = competition.maxSpots;
  const progressRatio = maxCount > 0 ? bookedCount / maxCount : 0;

  return (
    <Card style={styles.card}>
      {/* Title & Registration Status */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {competition.title}
        </Text>
        {isRegistered ? (
          <Badge
            label={t('registeredBadge')}
            icon={<Check size={14} color={theme.colors.accentCyan} strokeWidth={2.6} />}
            variant="registered"
          />
        ) : (
          competition.isSoldOut ? (
            <Badge label={t('competitionFull')} variant="warning" />
          ) : null
        )}
      </View>

      {/* Tags & Certificate Row */}
      <View style={styles.tagsRow}>
        {competition.tags.map((tag, idx) => (
          <Chip key={`${tag}-${idx}`} label={tag} />
        ))}
        {competition.certificateOffered && (
          <View style={styles.certContainer}>
            <Trophy size={14} color={theme.colors.accentCyan} style={styles.certIcon} />
            <Text style={styles.certText}>{t('winnersGetCert')}</Text>
          </View>
        )}
      </View>

      {/* Metrics Row: Prize Pool, Entry Fee, Spots Booked */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>{t('prizePool')}</Text>
          <Text style={styles.prizePoolValue}>
            {competition.currency} {competition.prizePool.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>{t('entryFee')}</Text>
          <Text style={styles.entryFeeValue}>
            {competition.currency} {competition.entryFee}
          </Text>
        </View>

        {/* Spots Left & Progress */}
        <View style={styles.spotsColumn}>
          <View style={styles.spotsHeader}>
            <Users size={14} color={theme.colors.accentCyan} style={styles.spotsIcon} />
            <Text style={styles.spotsLeftText}>
              {spotsLeft === 0 ? t('competitionFull') : t('spotsLeft', { count: spotsLeft })}
            </Text>
          </View>

          <ProgressBar
            progress={progressRatio}
            color={theme.colors.accentCyan}
            trackColor="#E5E7EB"
            height={5}
            style={styles.progressBar}
          />

          <Text style={styles.bookedText}>
            {t('booked', { booked: bookedCount, total: maxCount })}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
    ...theme.typography.titleLg,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  certContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  certIcon: {
    marginRight: 4,
  },
  certText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.accentCyan,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xs,
  },
  metricColumn: {
    flex: 1,
  },
  spotsColumn: {
    flex: 1.3,
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  prizePoolValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  entryFeeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  spotsIcon: {
    marginRight: 4,
  },
  spotsLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accentCyan,
  },
  progressBar: {
    marginVertical: 3,
  },
  bookedText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

