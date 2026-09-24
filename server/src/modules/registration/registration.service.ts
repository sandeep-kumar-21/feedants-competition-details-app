import { registrationRepository, RegistrationRepository } from './registration.repository.js';
import { competitionRepository, CompetitionRepository } from '../competition/competition.repository.js';
import {
  NotFoundError,
  CompetitionFullError,
  AlreadyRegisteredError,
  RegistrationClosedError,
  ForbiddenError,
  SubmissionWindowClosedError,
} from '../../common/errors/app-error.js';
import { IRegistration } from './registration.model.js';
import { SubmitEntryDto } from './dto/registration.dto.js';

export class RegistrationService {
  constructor(
    private regRepo: RegistrationRepository = registrationRepository,
    private compRepo: CompetitionRepository = competitionRepository
  ) {}

  public async registerUserForCompetition(
    competitionId: string,
    userId: string
  ): Promise<IRegistration> {
    const competition = await this.compRepo.findById(competitionId);
    if (!competition) {
      throw new NotFoundError('Competition not found.');
    }

    const now = new Date();
    if (now > new Date(competition.dates.registrationClosesAt)) {
      throw new RegistrationClosedError();
    }

    // Fast-path application check (optimization)
    const existingRegistration = await this.regRepo.findUserRegistration(competitionId, userId);
    if (existingRegistration && existingRegistration.status === 'REGISTERED') {
      throw new AlreadyRegisteredError();
    }

    // ATOMIC CONDITIONAL CONCURRENCY PRIMITIVE:
    // Only increments spotsBooked if current spotsBooked < maxSpots
    const updatedComp = await this.compRepo.incrementSpotsBookedAtomic(
      competitionId,
      competition.maxSpots
    );

    if (!updatedComp) {
      throw new CompetitionFullError();
    }

    // Attempt to insert registration record
    try {
      const registration = await this.regRepo.createRegistration({
        competitionId,
        userId,
        paymentStatus: 'COMPLETED',
      });
      return registration;
    } catch (insertError: any) {
      // Compensating transaction / rollback in case of duplicate key collision or DB failure
      await this.compRepo.rollbackSpotsBookedAtomic(competitionId);

      if (insertError.code === 11000) {
        throw new AlreadyRegisteredError();
      }
      throw insertError;
    }
  }

  public async getUserRegistration(
    competitionId: string,
    userId: string
  ): Promise<IRegistration> {
    const registration = await this.regRepo.findUserRegistration(competitionId, userId);
    if (!registration) {
      throw new NotFoundError('You are not registered for this competition.');
    }
    return registration;
  }

  public async submitEntry(
    competitionId: string,
    userId: string,
    dto: SubmitEntryDto
  ): Promise<IRegistration> {
    const competition = await this.compRepo.findById(competitionId);
    if (!competition) {
      throw new NotFoundError('Competition not found.');
    }

    const registration = await this.regRepo.findUserRegistration(competitionId, userId);
    if (!registration || registration.status !== 'REGISTERED') {
      throw new ForbiddenError('You must be a paid and registered participant to submit an entry.');
    }

    const now = new Date();
    const submissionStart = new Date(competition.dates.submissionStartsAt);
    const submissionEnd = new Date(competition.dates.submissionEndsAt);

    if (now < submissionStart || now > submissionEnd) {
      throw new SubmissionWindowClosedError(
        `Submissions are only accepted between ${submissionStart.toLocaleString()} and ${submissionEnd.toLocaleString()}`
      );
    }

    const updated = await this.regRepo.updateSubmission(competitionId, userId, dto);
    if (!updated) {
      throw new NotFoundError('Failed to record submission.');
    }

    return updated;
  }
}

export const registrationService = new RegistrationService();

