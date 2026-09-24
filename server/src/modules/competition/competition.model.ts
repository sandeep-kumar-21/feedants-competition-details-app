import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJudge {
  name: string;
  title: string;
  experience: string;
  avatarUrl: string;
  introVideoUrl: string;
}

export interface ICompetitionDates {
  registrationOpensAt: Date;
  registrationClosesAt: Date;
  submissionStartsAt: Date;
  submissionEndsAt: Date;
  resultDate: Date;
}

export interface IPreviousWinner {
  name: string;
  position: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface IJudgingParameter {
  title: string;
  weightage: number;
  description: string;
}

export interface ITabs {
  about: {
    shortDescription: string;
    fullDescription: string;
  };
  judgingParameters: IJudgingParameter[];
  rulesAndEligibility: string[];
}

export interface IRewardTier {
  rank: number;
  position: string;
  amount: number;
  iconType: 'trophy_gold' | 'medal_silver' | 'medal_bronze' | 'star';
}

export interface ITrustAndPayment {
  prizeMoneyVideoUrl: string;
  refundPolicyText: string;
  refundPolicyUrl: string;
  paymentProvider: string;
}

export interface IReferralCampaign {
  rewardPerSignup: number;
  description: string;
}

export interface ICompetition extends Document {
  title: string;
  category: string;
  tags: string[];
  certificateOffered: boolean;
  prizePool: number;
  currency: string;
  entryFee: number;
  maxSpots: number;
  spotsBooked: number;
  judge: IJudge;
  dates: ICompetitionDates;
  previousWinners: IPreviousWinner[];
  tabs: ITabs;
  rewards: IRewardTier[];
  disclaimer: string;
  trustAndPayment: ITrustAndPayment;
  referralCampaign: IReferralCampaign;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionSchema = new Schema<ICompetition>(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Dance',
    },
    tags: {
      type: [String],
      default: ['Dance', 'Multi-Win'],
    },
    certificateOffered: {
      type: Boolean,
      default: true,
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: '₹',
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    maxSpots: {
      type: Number,
      required: true,
      min: 1,
    },
    spotsBooked: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    judge: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      experience: { type: String, required: true },
      avatarUrl: { type: String, required: true },
      introVideoUrl: { type: String, default: '' },
    },
    dates: {
      registrationOpensAt: { type: Date, required: true },
      registrationClosesAt: { type: Date, required: true, index: true },
      submissionStartsAt: { type: Date, required: true },
      submissionEndsAt: { type: Date, required: true },
      resultDate: { type: Date, required: true },
    },
    previousWinners: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        videoUrl: { type: String, default: '' },
      },
    ],
    tabs: {
      about: {
        shortDescription: { type: String, required: true },
        fullDescription: { type: String, required: true },
      },
      judgingParameters: [
        {
          title: { type: String, required: true },
          weightage: { type: Number, required: true },
          description: { type: String, required: true },
        },
      ],
      rulesAndEligibility: [{ type: String, required: true }],
    },
    rewards: [
      {
        rank: { type: Number, required: true },
        position: { type: String, required: true },
        amount: { type: Number, required: true },
        iconType: {
          type: String,
          enum: ['trophy_gold', 'medal_silver', 'medal_bronze', 'star'],
          default: 'star',
        },
      },
    ],
    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.',
    },
    trustAndPayment: {
      prizeMoneyVideoUrl: { type: String, default: '' },
      refundPolicyText: { type: String, default: 'Refund policy' },
      refundPolicyUrl: { type: String, default: 'https://feedants.com/refund-policy' },
      paymentProvider: { type: String, default: 'Razorpay' },
    },
    referralCampaign: {
      rewardPerSignup: { type: Number, default: 10 },
      description: { type: String, default: 'You earn ₹10 for every signup' },
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

CompetitionSchema.index({ status: 1, 'dates.registrationClosesAt': 1 });

export const CompetitionModel: Model<ICompetition> = mongoose.model<ICompetition>(
  'Competition',
  CompetitionSchema
);

