import { ICompetitionDates } from './competition.model.js';

export type CompetitionLifecyclePhase =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_FULL'
  | 'REGISTRATION_CLOSED'
  | 'SUBMISSION_OPEN'
  | 'JUDGING'
  | 'COMPLETED';

export interface LifecycleEvaluationResult {
  phase: CompetitionLifecyclePhase;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  hasEnded: boolean;
}

export function evaluateCompetitionLifecycle(
  dates: ICompetitionDates,
  spotsBooked: number,
  maxSpots: number,
  currentDate: Date = new Date()
): LifecycleEvaluationResult {
  const now = currentDate.getTime();
  const regOpen = new Date(dates.registrationOpensAt).getTime();
  const regClose = new Date(dates.registrationClosesAt).getTime();
  const subStart = new Date(dates.submissionStartsAt).getTime();
  const subEnd = new Date(dates.submissionEndsAt).getTime();
  const resDate = new Date(dates.resultDate).getTime();

  if (now < regOpen) {
    return {
      phase: 'UPCOMING',
      isRegistrationOpen: false,
      isSubmissionOpen: false,
      hasEnded: false,
    };
  }

  if (now >= resDate) {
    return {
      phase: 'COMPLETED',
      isRegistrationOpen: false,
      isSubmissionOpen: false,
      hasEnded: true,
    };
  }

  if (now >= subEnd && now < resDate) {
    return {
      phase: 'JUDGING',
      isRegistrationOpen: false,
      isSubmissionOpen: false,
      hasEnded: false,
    };
  }

  if (now >= subStart && now < subEnd) {
    // If registration is also still open during submission window
    if (now < regClose) {
      if (spotsBooked >= maxSpots) {
        return {
          phase: 'REGISTRATION_FULL',
          isRegistrationOpen: false,
          isSubmissionOpen: true,
          hasEnded: false,
        };
      }
      return {
        phase: 'REGISTRATION_OPEN',
        isRegistrationOpen: true,
        isSubmissionOpen: true,
        hasEnded: false,
      };
    }

    return {
      phase: 'SUBMISSION_OPEN',
      isRegistrationOpen: false,
      isSubmissionOpen: true,
      hasEnded: false,
    };
  }

  if (now < regClose) {
    if (spotsBooked >= maxSpots) {
      return {
        phase: 'REGISTRATION_FULL',
        isRegistrationOpen: false,
        isSubmissionOpen: false,
        hasEnded: false,
      };
    }
    return {
      phase: 'REGISTRATION_OPEN',
      isRegistrationOpen: true,
      isSubmissionOpen: false,
      hasEnded: false,
    };
  }

  return {
    phase: 'REGISTRATION_CLOSED',
    isRegistrationOpen: false,
    isSubmissionOpen: false,
    hasEnded: false,
  };
}

