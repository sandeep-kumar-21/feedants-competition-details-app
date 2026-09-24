import { RegistrationModel, IRegistration } from './registration.model.js';
import { Types } from 'mongoose';

export class RegistrationRepository {
  public async findUserRegistration(
    competitionId: string,
    userId: string
  ): Promise<IRegistration | null> {
    return RegistrationModel.findOne({
      competitionId: new Types.ObjectId(competitionId),
      userId: new Types.ObjectId(userId),
    }).lean<IRegistration>();
  }

  public async createRegistration(data: {
    competitionId: string;
    userId: string;
    paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
  }): Promise<IRegistration> {
    return RegistrationModel.create({
      competitionId: new Types.ObjectId(data.competitionId),
      userId: new Types.ObjectId(data.userId),
      status: 'REGISTERED',
      paymentStatus: data.paymentStatus || 'COMPLETED',
      registeredAt: new Date(),
    });
  }

  public async updateSubmission(
    competitionId: string,
    userId: string,
    submissionData: {
      submissionUrl: string;
      notes?: string;
    }
  ): Promise<IRegistration | null> {
    return RegistrationModel.findOneAndUpdate(
      {
        competitionId: new Types.ObjectId(competitionId),
        userId: new Types.ObjectId(userId),
        status: 'REGISTERED',
      },
      {
        $set: {
          submission: {
            submitted: true,
            submissionUrl: submissionData.submissionUrl,
            submittedAt: new Date(),
            notes: submissionData.notes || '',
          },
        },
      },
      { returnDocument: 'after' }
    );
  }
}

export const registrationRepository = new RegistrationRepository();
