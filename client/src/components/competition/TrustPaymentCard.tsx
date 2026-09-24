import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, ShieldCheck } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';

interface TrustPaymentCardProps {
  onPressPrizeVideo?: () => void;
  onPressRefundPolicy?: () => void;
}

export const TrustPaymentCard: React.FC<TrustPaymentCardProps> = ({
  onPressPrizeVideo,
  onPressRefundPolicy,
}) => {
  const { t } = useLanguage();

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        {/* Left Side: Video Info */}
        <TouchableOpacity
          style={styles.leftSection}
          onPress={onPressPrizeVideo}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('howReceivePrize')}
        >
          <View style={styles.playCircle}>
            <Play size={16} color={theme.colors.accentCyan} fill={theme.colors.accentCyan} style={styles.playIcon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{t('howReceivePrize')}</Text>
            <Text style={styles.subText}>{t('watchVideoMore')}</Text>
          </View>
        </TouchableOpacity>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* Right Side: Trust & Razorpay Badges */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.trustRow}
            onPress={onPressRefundPolicy}
            activeOpacity={0.7}
          >
            <ShieldCheck size={16} color="#005B64" strokeWidth={2.2} />
            <Text style={styles.trustText}>{t('refundPolicy')}</Text>
          </TouchableOpacity>

          <View style={[styles.trustRow, styles.paymentRow]}>
            <ShieldCheck size={16} color="#005B64" strokeWidth={2.2} />
            <View style={styles.paymentTextGroup}>
              <Text style={styles.paymentLabel}>{t('securePayments')}</Text>
              <Text style={styles.razorpayBrand}>Razorpay</Text>
            </View>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DEF7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  playIcon: {
    marginLeft: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },
  subText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#EBF1F4',
    marginHorizontal: theme.spacing.sm,
  },
  rightSection: {
    flex: 1.1,
    justifyContent: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentRow: {
    marginBottom: 0,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: 6,
  },
  paymentTextGroup: {
    marginLeft: 6,
  },
  paymentLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  razorpayBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C2340',
    fontStyle: 'italic',
  },
});

