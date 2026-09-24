import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import { Megaphone, Check } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

interface ReferralCardProps {
  referralCode?: string;
  onPressReferNow?: () => void;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode = 'referral123',
  onPressReferNow,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  const activeCode = user?.referralCode ? user.referralCode.toLowerCase() : referralCode;
  const referralLink = `https://feedants.com/r/${activeCode}`;

  const handleCopy = () => {
    try {
      Clipboard.setString(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
  };

  return (
    <Card variant="mint" style={styles.card}>
      {/* Top Row: Megaphone & Title */}
      <View style={styles.topRow}>
        <View style={styles.megaphoneIcon}>
          <Megaphone size={28} color="#00838F" strokeWidth={1.8} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('referAndEarn')}</Text>
        </View>

        {/* Refer Now Button */}
        <TouchableOpacity
          style={styles.referButton}
          onPress={onPressReferNow || handleCopy}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={t('referNow')}
        >
          <Text style={styles.referButtonText}>{t('referNow')}</Text>
        </TouchableOpacity>
      </View>

      {/* Link Row & Reward Subtitle */}
      <View style={styles.bottomRow}>
        {/* Link Input Box */}
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>
            {referralLink}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            {copied ? (
              <View style={styles.copiedRow}>
                <Check size={12} color="#059669" />
                <Text style={styles.copiedText}>{t('copied')}</Text>
              </View>
            ) : (
              <Text style={styles.copyText}>{t('copyLink')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Earning subtitle */}
        <Text style={styles.rewardText}>{t('referEarnDesc')}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
    backgroundColor: '#EAF8F4',
    borderColor: '#C6EFE4',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  megaphoneIcon: {
    marginRight: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  referButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 7,
    borderRadius: theme.radii.sm,
  },
  referButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomRow: {
    marginTop: 2,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: '#CFEDE4',
    paddingLeft: theme.spacing.sm,
    paddingRight: 4,
    paddingVertical: 3,
    marginBottom: 4,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  copyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  copyText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  copiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 3,
  },
  rewardText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
});

