import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, UserCheck } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

interface HeaderBarProps {
  onGoBack?: () => void;
  onOpenAccountSwitcher?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onGoBack,
  onOpenAccountSwitcher,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Go Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onGoBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('goBack')}
      >
        <ArrowLeft size={20} color={theme.colors.textPrimary} strokeWidth={2.2} />
        <Text style={styles.backText}>{t('goBack')}</Text>
      </TouchableOpacity>

      {/* Right controls: Demo User Switcher & Language Switcher */}
      <View style={styles.rightControls}>
        {onOpenAccountSwitcher && (
          <TouchableOpacity
            style={styles.accountBadge}
            onPress={onOpenAccountSwitcher}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Switch Account"
          >
            <UserCheck size={14} color={user ? theme.colors.accentGreen : theme.colors.textMuted} />
            <Text style={styles.accountName}>
              {user ? user.name.split(' ')[0] : 'Guest'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Language Pill Switcher */}
        <View style={styles.languagePill}>
          <TouchableOpacity
            style={[styles.langOption, language === 'ENG' && styles.langSelected]}
            onPress={() => setLanguage('ENG')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, language === 'ENG' && styles.langTextSelected]}>
              ENG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langOption, language === 'HIN' && styles.langSelected]}
            onPress={() => setLanguage('HIN')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, language === 'HIN' && styles.langTextSelected]}>
              हिंदी
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.xs + 2,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: theme.radii.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountName: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 2,
  },
  langOption: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radii.full,
  },
  langSelected: {
    backgroundColor: theme.colors.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  langTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

