import { competitionRepository, CompetitionRepository } from './competition.repository.js';
import { RegistrationModel } from '../registration/registration.model.js';
import { NotFoundError } from '../../common/errors/app-error.js';
import { evaluateCompetitionLifecycle } from './competition.lifecycle.js';
import { CompetitionDetailResponseDTO, ViewerStatusDTO } from './dto/competition.dto.js';
import { ICompetition } from './competition.model.js';

export class CompetitionService {
  constructor(private repo: CompetitionRepository = competitionRepository) {}

  public async getCompetitionDetails(
    id?: string,
    userId?: string
  ): Promise<CompetitionDetailResponseDTO> {
    let competition: ICompetition | null = null;

    if (id) {
      competition = await this.repo.findById(id);
    } else {
      competition = await this.repo.findDefaultActive();
    }

    if (!competition) {
      throw new NotFoundError('Competition not found.');
    }

    const now = new Date();
    const lifecycleResult = evaluateCompetitionLifecycle(
      competition.dates,
      competition.spotsBooked,
      competition.maxSpots,
      now
    );

    // Compute countdown target and type
    let countdownTarget = competition.dates.registrationClosesAt.toISOString();
    let countdownType: 'REGISTRATION_CLOSES' | 'SUBMISSION_ENDS' | 'RESULT_ANNOUNCEMENT' | 'NONE' =
      'REGISTRATION_CLOSES';

    if (lifecycleResult.phase === 'SUBMISSION_OPEN') {
      countdownTarget = competition.dates.submissionEndsAt.toISOString();
      countdownType = 'SUBMISSION_ENDS';
    } else if (lifecycleResult.phase === 'JUDGING') {
      countdownTarget = competition.dates.resultDate.toISOString();
      countdownType = 'RESULT_ANNOUNCEMENT';
    } else if (lifecycleResult.phase === 'COMPLETED') {
      countdownType = 'NONE';
    }

    const spotsRemaining = Math.max(0, competition.maxSpots - competition.spotsBooked);
    const percentBooked = Math.min(100, Math.round((competition.spotsBooked / competition.maxSpots) * 100));
    const isFastFilling = spotsRemaining > 0 && spotsRemaining / competition.maxSpots <= 0.2;
    const isSoldOut = spotsRemaining === 0;

    // Check viewer status if user is authenticated
    let viewerStatus: ViewerStatusDTO = {
      isAuthenticated: false,
      isRegistered: false,
      hasSubmitted: false,
      submissionDetails: null,
    };

    if (userId) {
      viewerStatus.isAuthenticated = true;
      const registration = await RegistrationModel.findOne({
        competitionId: competition._id,
        userId,
        status: 'REGISTERED',
      }).lean();

      if (registration) {
        viewerStatus.isRegistered = true;
        viewerStatus.registeredAt = registration.registeredAt;
        viewerStatus.hasSubmitted = registration.submission?.submitted || false;
        viewerStatus.submissionDetails = registration.submission?.submitted
          ? {
              submittedAt: registration.submission.submittedAt,
              submissionUrl: registration.submission.submissionUrl,
              notes: registration.submission.notes,
            }
          : null;
      }
    }

    return {
      _id: (competition as any)._id.toString(),
      title: competition.title,
      category: competition.category,
      tags: competition.tags,
      certificateOffered: competition.certificateOffered,
      prizePool: competition.prizePool,
      currency: competition.currency,
      entryFee: competition.entryFee,
      maxSpots: competition.maxSpots,
      spotsBooked: competition.spotsBooked,
      spotsRemaining,
      percentBooked,
      isFastFilling,
      isSoldOut,
      serverTime: now.toISOString(),
      lifecycle: {
        phase: lifecycleResult.phase,
        isRegistrationOpen: lifecycleResult.isRegistrationOpen,
        isSubmissionOpen: lifecycleResult.isSubmissionOpen,
        hasEnded: lifecycleResult.hasEnded,
        countdownTarget,
        countdownType,
      },
      judge: competition.judge,
      dates: {
        registrationOpensAt: competition.dates.registrationOpensAt.toISOString(),
        registrationClosesAt: competition.dates.registrationClosesAt.toISOString(),
        submissionStartsAt: competition.dates.submissionStartsAt.toISOString(),
        submissionEndsAt: competition.dates.submissionEndsAt.toISOString(),
        resultDate: competition.dates.resultDate.toISOString(),
      },
      previousWinners: competition.previousWinners,
      tabs: competition.tabs,
      rewards: competition.rewards,
      disclaimer: competition.disclaimer,
      trustAndPayment: competition.trustAndPayment,
      referralCampaign: competition.referralCampaign,
      viewerStatus,
    };
  }
}

export const competitionService = new CompetitionService();

