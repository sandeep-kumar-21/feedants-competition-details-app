import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';

interface RulesAndEligibilityCard2Props {
  rules: string[];
}

export const RulesAndEligibilityCard2: React.FC<RulesAndEligibilityCard2Props> = ({ rules }) => {
  const { t } = useLanguage();

  if (!rules || rules.length === 0) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <ShieldAlert size={16} color={theme.colors.accentCyan} strokeWidth={2.2} />
          </View>
          <Text style={styles.titleText}>{t('rulesTab')}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{rules.length} Rules</Text>
        </View>
      </View>

      <View style={styles.rulesList}>
        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <View style={styles.bulletNumber}>
              <Text style={styles.bulletText}>{index + 1}</Text>
            </View>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs + 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: theme.spacing.sm + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DEF7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  rulesList: {
    paddingTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm + 2,
  },
  bulletNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 135, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.accentCyan,
  },
  ruleText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#374151',
  },
});
