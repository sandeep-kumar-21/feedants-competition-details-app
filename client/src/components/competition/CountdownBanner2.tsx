import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Hourglass, Clock } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownBanner2Props {
  targetIsoDate: string;
  serverTimeIso?: string;
  label?: string;
}

export const CountdownBanner2: React.FC<CountdownBanner2Props> = ({
  targetIsoDate,
  serverTimeIso,
  label,
}) => {
  const { t } = useLanguage();
  const countdown = useCountdown(targetIsoDate, serverTimeIso);

  return (
    <View style={styles.container}>
      {/* Line 1: Context & Urgency Row */}
      <View style={styles.topRow}>
        <View style={styles.labelSection}>
          <Hourglass size={14} color="#005B64" strokeWidth={2.2} />
          <Text style={styles.labelText} numberOfLines={1} ellipsizeMode="tail">
            {label || t('registrationClosesIn')}
          </Text>
        </View>

        <View style={styles.hurryBadge}>
          <Clock size={12} color="#007A87" strokeWidth={2.2} />
          <Text style={styles.hurryUpText}>{t('hurryUp')}</Text>
        </View>
      </View>

      {/* Line 2: Prominent Countdown Time Digits */}
      <View style={styles.timerRow}>
        <Text style={styles.timerText}>
          {countdown.formattedString}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F7F7',
    borderRadius: theme.radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#D4F1F1',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  labelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#004D54',
    marginLeft: 6,
    flexShrink: 1,
  },
  hurryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 135, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 135, 0.25)',
    flexShrink: 0,
  },
  hurryUpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007A87',
    marginLeft: 4,
  },
  timerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 2,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#005B64',
    letterSpacing: 0.6,
  },
});
