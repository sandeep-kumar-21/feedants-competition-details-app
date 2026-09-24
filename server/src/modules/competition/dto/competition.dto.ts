import { z } from 'zod';
import { CompetitionLifecyclePhase } from '../competition.lifecycle.js';

export const CompetitionIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competition ID format'),
});

export interface ViewerStatusDTO {
  isAuthenticated: boolean;
  isRegistered: boolean;
  registeredAt?: Date | null;
  hasSubmitted: boolean;
  submissionDetails?: {
    submittedAt?: Date;
    submissionUrl?: string;
    notes?: string;
  } | null;
}

export interface CompetitionDetailResponseDTO {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  certificateOffered: boolean;
  prizePool: number;
  currency: string;
  entryFee: number;
  maxSpots: number;
  spotsBooked: number;
  spotsRemaining: number;
  percentBooked: number;
  isFastFilling: boolean;
  isSoldOut: boolean;
  serverTime: string;
  lifecycle: {
    phase: CompetitionLifecyclePhase;
    isRegistrationOpen: boolean;
    isSubmissionOpen: boolean;
    hasEnded: boolean;
    countdownTarget: string; // ISO date target for timer
    countdownType: 'REGISTRATION_CLOSES' | 'SUBMISSION_ENDS' | 'RESULT_ANNOUNCEMENT' | 'NONE';
  };
  judge: {
    name: string;
    title: string;
    experience: string;
    avatarUrl: string;
    introVideoUrl: string;
  };
  dates: {
    registrationOpensAt: string;
    registrationClosesAt: string;
    submissionStartsAt: string;
    submissionEndsAt: string;
    resultDate: string;
  };
  previousWinners: Array<{
    name: string;
    position: string;
    thumbnailUrl: string;
    videoUrl: string;
  }>;
  tabs: {
    about: {
      shortDescription: string;
      fullDescription: string;
    };
    judgingParameters: Array<{
      title: string;
      weightage: number;
      description: string;
    }>;
    rulesAndEligibility: string[];
  };
  rewards: Array<{
    rank: number;
    position: string;
    amount: number;
    iconType: string;
  }>;
  disclaimer: string;
  trustAndPayment: {
    prizeMoneyVideoUrl: string;
    refundPolicyText: string;
    refundPolicyUrl: string;
    paymentProvider: string;
  };
  referralCampaign: {
    rewardPerSignup: number;
    description: string;
  };
  viewerStatus: ViewerStatusDTO;
}

