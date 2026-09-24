import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sliders } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { HeaderBar } from '../components/competition/HeaderBar';
import { HeroCard } from '../components/competition/HeroCard';
import { JudgeCard } from '../components/competition/JudgeCard';
import { CountdownBanner } from '../components/competition/CountdownBanner';
import { ImportantDatesCard } from '../components/competition/ImportantDatesCard';
import { PreviousWinnersCarousel } from '../components/competition/PreviousWinnersCarousel';
import { CompetitionTabs } from '../components/competition/CompetitionTabs';
import { RewardsCard } from '../components/competition/RewardsCard';
import { TrustPaymentCard } from '../components/competition/TrustPaymentCard';
import { ReferralCard } from '../components/competition/ReferralCard';
import { UserFeedbackCard } from '../components/competition/UserFeedbackCard';
import { AdBanner } from '../components/competition/AdBanner';
import { BottomActionBar } from '../components/competition/BottomActionBar';
import { BottomNavBar } from '../components/competition/BottomNavBar';
import { RegistrationModal } from '../components/competition/RegistrationModal';
import { SubmissionModal } from '../components/competition/SubmissionModal';
import { AccountSwitcherModal } from '../components/competition/AccountSwitcherModal';
import { VideoPlayerModal } from '../components/competition/VideoPlayerModal';
import { RefundPolicyModal } from '../components/competition/RefundPolicyModal';
import { PrizePayoutModal } from '../components/competition/PrizePayoutModal';
import { UserFeedbackModal } from '../components/competition/UserFeedbackModal';
import { DevLifecycleModal } from '../components/competition/DevLifecycleModal';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Button } from '../components/ui/Button';
import { useCompetition, useRegisterMutation, useSubmissionMutation } from '../hooks/useCompetition';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export const CompetitionDetailsScreen: React.FC = () => {
  const { data: competition, isLoading, isError, error, refetch } = useCompetition();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Modal Visibility States
  const [regModalVisible, setRegModalVisible] = useState<boolean>(false);
  const [subModalVisible, setSubModalVisible] = useState<boolean>(false);
  const [accountSwitcherVisible, setAccountSwitcherVisible] = useState<boolean>(false);
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [prizeModalVisible, setPrizeModalVisible] = useState<boolean>(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState<boolean>(false);
  const [devModalVisible, setDevModalVisible] = useState<boolean>(false);

  // Video Player Modal State
  const [videoModal, setVideoModal] = useState<{
    visible: boolean;
    videoUrl: string;
    title: string;
    subtitle?: string;
  }>({
    visible: false,
    videoUrl: '',
    title: '',
    subtitle: '',
  });

  const registerMutation = useRegisterMutation(competition?._id || '');
  const submissionMutation = useSubmissionMutation(competition?._id || '');

  const handleBottomBarAction = () => {
    if (!competition) return;

    if (!competition.viewerStatus.isRegistered) {
      if (!user) {
        Alert.alert(
          'Sign in Required',
          'Please select a demo persona from the user switcher to register.',
          [
            { text: 'Switch Persona', onPress: () => setAccountSwitcherVisible(true) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }
      setRegModalVisible(true);
    } else {
      setSubModalVisible(true);
    }
  };

  const handleConfirmRegistration = async () => {
    await registerMutation.mutateAsync();
  };

  const handleConfirmSubmission = async (data: { submissionUrl: string; notes?: string }) => {
    await submissionMutation.mutateAsync(data);
  };

  // Loading State with Skeletons
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7F9" />
        <HeaderBar />
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.skeletonCard}>
            <SkeletonLoader height={24} width="70%" borderRadius={6} style={{ marginBottom: 12 }} />
            <SkeletonLoader height={18} width="40%" borderRadius={4} style={{ marginBottom: 20 }} />
            <SkeletonLoader height={40} width="100%" borderRadius={8} />
          </View>
          <View style={styles.skeletonCard}>
            <SkeletonLoader height={70} width="100%" borderRadius={12} />
          </View>
          <View style={styles.skeletonCard}>
            <SkeletonLoader height={140} width="100%" borderRadius={12} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Error State with Retry
  if (isError || !competition) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7F9" />
        <HeaderBar onOpenAccountSwitcher={() => setAccountSwitcherVisible(true)} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Competition</Text>
          <Text style={styles.errorDescription}>
            {error?.message || 'Failed to connect to the backend API. Please make sure the server is running.'}
          </Text>
          <Button
            label="Retry Connection"
            onPress={() => refetch()}
            variant="darkTeal"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F9" />

      {/* Top Header Bar */}
      <HeaderBar
        onGoBack={() => {
          Alert.alert(
            'Leave Competition?',
            'Are you sure you want to go back to the competitions catalog?',
            [
              { text: 'Stay', style: 'cancel' },
              { text: 'Go Back', style: 'default' },
            ]
          );
        }}
        onOpenAccountSwitcher={() => setAccountSwitcherVisible(true)}
      />

      {/* Scrollable Competition Details */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Card */}
        <HeroCard competition={competition} />

        {/* 2. Judge Card */}
        <JudgeCard
          judge={competition.judge}
          onPressIntroVideo={() =>
            setVideoModal({
              visible: true,
              videoUrl: competition.judge.introVideoUrl || 'https://www.youtube.com/watch?v=kYI9g_Yf8-4',
              title: `${competition.judge.name} - Guru Intro`,
              subtitle: competition.judge.title,
            })
          }
        />

        {/* 3. Urgency Countdown Banner */}
        <CountdownBanner
          targetIsoDate={competition.lifecycle.countdownTarget}
          serverTimeIso={competition.serverTime}
          label={
            competition.lifecycle.countdownType === 'REGISTRATION_CLOSES'
              ? t('registrationClosesIn')
              : competition.lifecycle.countdownType === 'SUBMISSION_ENDS'
              ? 'Submission window ends in'
              : 'Result announcement in'
          }
        />

        {/* 4. Important Dates Grid */}
        <ImportantDatesCard dates={competition.dates} />

        {/* 5. Previous Winners Carousel */}
        <PreviousWinnersCarousel
          winners={competition.previousWinners}
          onPressWinner={(w) =>
            setVideoModal({
              visible: true,
              videoUrl: w.videoUrl || 'https://www.youtube.com/watch?v=2r1T212hCj8',
              title: `${w.name} - Winning Performance`,
              subtitle: `${w.position} • Feedants Classical Dance`,
            })
          }
        />

        {/* 6. Tabs Section (About / Judging / Rules) */}
        <CompetitionTabs competition={competition} />

        {/* 7. Rewards Table & Disclaimer */}
        <RewardsCard
          rewards={competition.rewards}
          disclaimer={competition.disclaimer}
          currency={competition.currency}
        />

        {/* 8. Trust & Payment Row */}
        <TrustPaymentCard
          onPressPrizeVideo={() => setPrizeModalVisible(true)}
          onPressRefundPolicy={() => setRefundModalVisible(true)}
        />

        {/* 9. Refer & Earn Card */}
        <ReferralCard
          referralCode={competition.referralCampaign ? 'referral123' : undefined}
          onPressReferNow={() => {}}
        />

        {/* 10. User Feedback Card */}
        <UserFeedbackCard
          onPress={() => setFeedbackModalVisible(true)}
        />

        {/* 11. Ad Placeholder */}
        <AdBanner />

        {/* Spacer before sticky bottom bar */}
        <View style={styles.scrollSpacer} />
      </ScrollView>

      {/* Floating Developer States Button */}
      <TouchableOpacity
        style={styles.devFloatingBtn}
        onPress={() => setDevModalVisible(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Developer State Switcher"
      >
        <Sliders size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
        <Text style={styles.devFloatingText}>Dev States</Text>
      </TouchableOpacity>

      {/* 12. Dynamic Sticky Bottom Action Bar */}
      <BottomActionBar
        competition={competition}
        onPressAction={handleBottomBarAction}
        loading={registerMutation.isPending || submissionMutation.isPending}
      />

      {/* 13. Bottom Navigation Bar */}
      <BottomNavBar
        activeTab="competitions"
        onTabPress={(tab) => {
          if (tab === 'profile') {
            setAccountSwitcherVisible(true);
          }
        }}
      />

      {/* Registration Modal */}
      <RegistrationModal
        visible={regModalVisible}
        competition={competition}
        onClose={() => setRegModalVisible(false)}
        onRegister={handleConfirmRegistration}
      />

      {/* Submission Modal */}
      <SubmissionModal
        visible={subModalVisible}
        competition={competition}
        onClose={() => setSubModalVisible(false)}
        onSubmit={handleConfirmSubmission}
      />

      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        visible={accountSwitcherVisible}
        onClose={() => setAccountSwitcherVisible(false)}
      />

      {/* Video Player Modal (Supports YouTube and Direct MP4) */}
      <VideoPlayerModal
        visible={videoModal.visible}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
        subtitle={videoModal.subtitle}
        onClose={() => setVideoModal((prev) => ({ ...prev, visible: false }))}
      />

      {/* Refund Policy Modal */}
      <RefundPolicyModal
        visible={refundModalVisible}
        onClose={() => setRefundModalVisible(false)}
      />

      {/* Prize Payout Modal */}
      <PrizePayoutModal
        visible={prizeModalVisible}
        onClose={() => setPrizeModalVisible(false)}
      />

      {/* User Feedback & Testimonials Modal */}
      <UserFeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
      />

      {/* Dev Lifecycle Switcher Modal */}
      <DevLifecycleModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.md,
  },
  scrollSpacer: {
    height: 16,
  },
  devFloatingBtn: {
    position: 'absolute',
    bottom: 128,
    right: 14,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 99,
  },
  devFloatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.xl,
  },
});
