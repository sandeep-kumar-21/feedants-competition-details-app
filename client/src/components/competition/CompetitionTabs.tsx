import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { ICompetitionDetail } from '../../types/competition';

interface CompetitionTabsProps {
  competition: ICompetitionDetail;
}

type TabKey = 'about' | 'judging' | 'rules';

export const CompetitionTabs: React.FC<CompetitionTabsProps> = ({ competition }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const tabs = competition.tabs;

  return (
    <Card style={styles.card}>
      {/* Tab Headers */}
      <View style={styles.tabHeadersRow}>
        {/* About Competition Tab */}
        <TouchableOpacity
          style={[styles.tabHeader, activeTab === 'about' && styles.activeTabHeader]}
          onPress={() => setActiveTab('about')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'about' && styles.activeTabTitle]}>
            {t('aboutTab')}
          </Text>
          {activeTab === 'about' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Judging Parameters Tab */}
        <TouchableOpacity
          style={[styles.tabHeader, activeTab === 'judging' && styles.activeTabHeader]}
          onPress={() => setActiveTab('judging')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'judging' && styles.activeTabTitle]}>
            {t('judgingTab')}
          </Text>
          {activeTab === 'judging' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Rules & Eligibility Tab */}
        <TouchableOpacity
          style={[styles.tabHeader, activeTab === 'rules' && styles.activeTabHeader]}
          onPress={() => setActiveTab('rules')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'rules' && styles.activeTabTitle]}>
            {t('rulesTab')}
          </Text>
          {activeTab === 'rules' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'about' && (
          <View>
            <Text style={styles.paragraphText}>{tabs.about.shortDescription}</Text>
            {isExpanded && (
              <Text style={[styles.paragraphText, styles.expandedText]}>
                {tabs.about.fullDescription}
              </Text>
            )}

            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.expandText}>
                {isExpanded ? t('viewLess') : t('viewMore')}
              </Text>
              {isExpanded ? (
                <ChevronUp size={16} color={theme.colors.accentCyan} />
              ) : (
                <ChevronDown size={16} color={theme.colors.accentCyan} />
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'judging' && (
          <View style={styles.judgingContainer}>
            {tabs.judgingParameters.map((param, index) => (
              <View key={param._id || index} style={styles.judgingItem}>
                <View style={styles.judgingHeader}>
                  <Text style={styles.judgingCriterion}>{param.title}</Text>
                  <Text style={styles.judgingWeightage}>{param.weightage}%</Text>
                </View>
                <Text style={styles.judgingDesc}>{param.description}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'rules' && (
          <View style={styles.rulesContainer}>
            {tabs.rulesAndEligibility.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
  },
  tabHeadersRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  tabHeader: {
    paddingBottom: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.xs,
    position: 'relative',
    alignItems: 'center',
  },
  activeTabHeader: {},
  tabTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabTitle: {
    color: theme.colors.accentCyan,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: theme.colors.accentCyan,
    borderRadius: 2,
  },
  contentContainer: {
    paddingTop: theme.spacing.md,
  },
  paragraphText: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  expandedText: {
    marginTop: theme.spacing.xs,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  expandText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.accentCyan,
    marginRight: 2,
  },
  judgingContainer: {
    paddingTop: 2,
  },
  judgingItem: {
    marginBottom: theme.spacing.sm + 2,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  judgingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  judgingCriterion: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  judgingWeightage: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accentCyan,
  },
  judgingDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  rulesContainer: {
    paddingTop: 2,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    fontSize: 14,
    color: theme.colors.accentCyan,
    marginRight: 6,
    lineHeight: 18,
  },
  ruleText: {
    flex: 1,
    fontSize: 12.5,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});

