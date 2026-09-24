import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Hourglass, Clock } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownBannerProps {
  targetIsoDate: string;
  serverTimeIso?: string;
  label?: string;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  targetIsoDate,
  serverTimeIso,
  label,
}) => {
  const { t } = useLanguage();
  const countdown = useCountdown(targetIsoDate, serverTimeIso);

  return (
    <View style={styles.container}>
      {/* Left: Hourglass Icon + Label */}
      <View style={styles.leftSection}>
        <Hourglass size={15} color={theme.colors.accentCyan} strokeWidth={2.2} />
        <Text style={styles.labelText}>
          {label || t('registrationClosesIn')}
        </Text>
      </View>

      {/* Center: Live Ticking Countdown */}
      <Text style={styles.timerText}>
        {countdown.formattedString}
      </Text>

      {/* Right: Hurry up badge */}
      <View style={styles.rightSection}>
        <Clock size={14} color={theme.colors.accentCyan} strokeWidth={2.2} />
        <Text style={styles.hurryUpText}>{t('hurryUp')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F7F7',
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#D4F1F1',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#004D54',
    marginLeft: 5,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.accentCyan,
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hurryUpText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accentCyan,
    marginLeft: 3,
  },
});

