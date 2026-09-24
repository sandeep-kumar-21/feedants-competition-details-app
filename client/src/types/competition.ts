export type LifecyclePhase =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_FULL'
  | 'REGISTRATION_CLOSED'
  | 'SUBMISSION_OPEN'
  | 'JUDGING'
  | 'COMPLETED';

export interface IJudge {
  name: string;
  title: string;
  experience: string;
  avatarUrl: string;
  introVideoUrl: string;
}

export interface ICompetitionDates {
  registrationOpensAt: string;
  registrationClosesAt: string;
  submissionStartsAt: string;
  submissionEndsAt: string;
  resultDate: string;
}

export interface IPreviousWinner {
  _id?: string;
  name: string;
  position: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface IJudgingParameter {
  _id?: string;
  title: string;
  weightage: number;
  description: string;
}

export interface IRewardTier {
  _id?: string;
  rank: number;
  position: string;
  amount: number;
  iconType: 'trophy_gold' | 'medal_silver' | 'medal_bronze' | 'star';
}

export interface IViewerStatus {
  isAuthenticated: boolean;
  isRegistered: boolean;
  registeredAt?: string | null;
  hasSubmitted: boolean;
  submissionDetails?: {
    submittedAt?: string;
    submissionUrl?: string;
    notes?: string;
  } | null;
}

export interface ICompetitionDetail {
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
    phase: LifecyclePhase;
    isRegistrationOpen: boolean;
    isSubmissionOpen: boolean;
    hasEnded: boolean;
    countdownTarget: string;
    countdownType: 'REGISTRATION_CLOSES' | 'SUBMISSION_ENDS' | 'RESULT_ANNOUNCEMENT' | 'NONE';
  };
  judge: IJudge;
  dates: ICompetitionDates;
  previousWinners: IPreviousWinner[];
  tabs: {
    about: {
      shortDescription: string;
      fullDescription: string;
    };
    judgingParameters: IJudgingParameter[];
    rulesAndEligibility: string[];
  };
  rewards: IRewardTier[];
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
  viewerStatus: IViewerStatus;
}

