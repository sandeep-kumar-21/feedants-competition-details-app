import { Request, Response, NextFunction } from 'express';
import { CompetitionModel } from '../competition/competition.model.js';
import { NotFoundError, BadRequestError } from '../../common/errors/app-error.js';
import { seedDatabase } from '../../scripts/seed.js';

export class DevController {
  public async setLifecyclePhase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phase } = req.body;
      if (!phase) {
        throw new BadRequestError('Lifecycle phase is required');
      }

      const comp = await CompetitionModel.findOne({ status: 'PUBLISHED' }).sort({ createdAt: -1 });
      if (!comp) {
        throw new NotFoundError('No active competition found');
      }

      const now = new Date();

      switch (phase) {
        case 'REGISTRATION_OPEN':
          comp.dates.registrationOpensAt = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
          comp.dates.registrationClosesAt = new Date(
            now.getTime() + (1 * 24 * 3600 + 6 * 3600 + 28 * 60 + 32) * 1000
          );
          comp.dates.submissionStartsAt = new Date(now.getTime() - 1 * 24 * 3600 * 1000);
          comp.dates.submissionEndsAt = new Date(now.getTime() + 15 * 24 * 3600 * 1000);
          comp.dates.resultDate = new Date(now.getTime() + 20 * 24 * 3600 * 1000);
          comp.spotsBooked = 1;
          comp.maxSpots = 20;
          break;

        case 'SOLD_OUT':
        case 'REGISTRATION_FULL':
          comp.dates.registrationOpensAt = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
          comp.dates.registrationClosesAt = new Date(now.getTime() + 24 * 3600 * 1000);
          comp.dates.submissionStartsAt = new Date(now.getTime() + 2 * 24 * 3600 * 1000);
          comp.dates.submissionEndsAt = new Date(now.getTime() + 15 * 24 * 3600 * 1000);
          comp.dates.resultDate = new Date(now.getTime() + 20 * 24 * 3600 * 1000);
          comp.spotsBooked = 20;
          comp.maxSpots = 20;
          break;

        case 'SUBMISSION_OPEN':
          comp.dates.registrationOpensAt = new Date(now.getTime() - 5 * 24 * 3600 * 1000);
          comp.dates.registrationClosesAt = new Date(now.getTime() - 1 * 3600 * 1000);
          comp.dates.submissionStartsAt = new Date(now.getTime() - 1 * 3600 * 1000);
          comp.dates.submissionEndsAt = new Date(now.getTime() + (3 * 24 * 3600 + 12 * 3600) * 1000);
          comp.dates.resultDate = new Date(now.getTime() + 10 * 24 * 3600 * 1000);
          break;

        case 'JUDGING':
          comp.dates.registrationOpensAt = new Date(now.getTime() - 10 * 24 * 3600 * 1000);
          comp.dates.registrationClosesAt = new Date(now.getTime() - 5 * 24 * 3600 * 1000);
          comp.dates.submissionStartsAt = new Date(now.getTime() - 5 * 24 * 3600 * 1000);
          comp.dates.submissionEndsAt = new Date(now.getTime() - 1 * 3600 * 1000);
          comp.dates.resultDate = new Date(now.getTime() + (2 * 24 * 3600 + 4 * 3600) * 1000);
          break;

        case 'COMPLETED':
          comp.dates.registrationOpensAt = new Date(now.getTime() - 20 * 24 * 3600 * 1000);
          comp.dates.registrationClosesAt = new Date(now.getTime() - 15 * 24 * 3600 * 1000);
          comp.dates.submissionStartsAt = new Date(now.getTime() - 15 * 24 * 3600 * 1000);
          comp.dates.submissionEndsAt = new Date(now.getTime() - 5 * 24 * 3600 * 1000);
          comp.dates.resultDate = new Date(now.getTime() - 1 * 3600 * 1000);
          break;

        default:
          throw new BadRequestError(`Unknown phase: ${phase}`);
      }

      await comp.save();

      res.status(200).json({
        success: true,
        message: `Successfully updated competition lifecycle to ${phase}`,
        data: {
          phase,
          competitionId: comp._id,
          spotsBooked: comp.spotsBooked,
          maxSpots: comp.maxSpots,
          dates: comp.dates,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async reseed(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await seedDatabase(false);
      res.status(200).json({
        success: true,
        message: 'Database reset to default Objective_Page state',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const devController = new DevController();
