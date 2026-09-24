import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ISubmission {
  submitted: boolean;
  submissionUrl?: string;
  submittedAt?: Date;
  notes?: string;
}

export interface IRegistration extends Document {
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'REGISTERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentReference: string;
  submission: ISubmission;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
      required: [true, 'Competition ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'CANCELLED'],
      default: 'REGISTERED',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'COMPLETED',
    },
    paymentReference: {
      type: String,
      default: () => `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
    submission: {
      submitted: { type: Boolean, default: false },
      submissionUrl: { type: String, default: '' },
      submittedAt: { type: Date },
      notes: { type: String, default: '' },
    },
    registeredAt: {
      type: Date,
      default: Date.now,
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

// High concurrency guarantee: Compound unique index prevents duplicate registration
RegistrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const RegistrationModel: Model<IRegistration> = mongoose.model<IRegistration>(
  'Registration',
  RegistrationSchema
);

