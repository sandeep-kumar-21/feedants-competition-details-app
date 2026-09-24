import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp, Info, Scale, ShieldAlert } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { ICompetitionDetail } from '../../types/competition';

interface CompetitionTabs2Props {
  competition: ICompetitionDetail;
}

type TabKey = 'about' | 'judging' | 'rules';

export const CompetitionTabs2: React.FC<CompetitionTabs2Props> = ({ competition }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  const tabs = competition.tabs;

  const handleSelectTab = (tab: TabKey, index: number) => {
    setActiveTab(tab);
    // Smoothly slide selected tab into view
    scrollRef.current?.scrollTo({ x: Math.max(0, index * 125 - 40), animated: true });
  };

  return (
    <Card style={styles.card}>
      {/* Horizontally Slidable Tab Headers Navigation */}
      <View style={styles.scrollWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabHeadersScroll}
        >
          {/* 1. About Competition Tab */}
          <TouchableOpacity
            style={[styles.tabHeader, activeTab === 'about' && styles.activeTabHeader]}
            onPress={() => handleSelectTab('about', 0)}
            activeOpacity={0.7}
          >
            <View style={styles.tabTitleRow}>
              <Info
                size={14}
                color={activeTab === 'about' ? theme.colors.accentCyan : '#9CA3AF'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.tabTitle, activeTab === 'about' && styles.activeTabTitle]}
                numberOfLines={1}
              >
                {t('aboutTab')}
              </Text>
            </View>
            {activeTab === 'about' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          {/* 2. Judging Parameters Tab */}
          <TouchableOpacity
            style={[styles.tabHeader, activeTab === 'judging' && styles.activeTabHeader]}
            onPress={() => handleSelectTab('judging', 1)}
            activeOpacity={0.7}
          >
            <View style={styles.tabTitleRow}>
              <Scale
                size={14}
                color={activeTab === 'judging' ? theme.colors.accentCyan : '#9CA3AF'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.tabTitle, activeTab === 'judging' && styles.activeTabTitle]}
                numberOfLines={1}
              >
                {t('judgingTab')}
              </Text>
            </View>
            {activeTab === 'judging' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          {/* 3. Rules & Eligibility Tab (Horizontally Slidable, No Text Wrapping) */}
          <TouchableOpacity
            style={[styles.tabHeader, activeTab === 'rules' && styles.activeTabHeader]}
            onPress={() => handleSelectTab('rules', 2)}
            activeOpacity={0.7}
          >
            <View style={styles.tabTitleRow}>
              <ShieldAlert
                size={14}
                color={activeTab === 'rules' ? theme.colors.accentCyan : '#9CA3AF'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.tabTitle, activeTab === 'rules' && styles.activeTabTitle]}
                numberOfLines={1}
              >
                {t('rulesTab')}
              </Text>
            </View>
            {activeTab === 'rules' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Body Content */}
      <View style={styles.contentContainer}>
        {/* About Section */}
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

        {/* Judging Parameters Section */}
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

        {/* Rules & Eligibility Section */}
        {activeTab === 'rules' && (
          <View style={styles.rulesContainer}>
            {tabs.rulesAndEligibility.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <View style={styles.bulletDot} />
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
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs + 2,
  },
  scrollWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  tabHeadersScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing.lg,
  },
  tabHeader: {
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    marginRight: 6,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabHeader: {},
  tabTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabTitle: {
    color: theme.colors.accentCyan,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: theme.spacing.sm,
    right: theme.spacing.sm,
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
    paddingTop: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accentCyan,
    marginRight: 10,
    marginTop: 6,
  },
  ruleText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#374151',
  },
});
