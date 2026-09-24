import { Request, Response, NextFunction } from 'express';
import { registrationService } from './registration.service.js';

export class RegistrationController {
  private getId(req: Request): string {
    const rawId = req.params.id;
    return Array.isArray(rawId) ? rawId[0] : (rawId as string);
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitionId = this.getId(req);
      const userId = req.user!.userId;

      const registration = await registrationService.registerUserForCompetition(
        competitionId,
        userId
      );

      res.status(201).json({
        success: true,
        message: 'Successfully registered for the competition!',
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMyRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitionId = this.getId(req);
      const userId = req.user!.userId;

      const registration = await registrationService.getUserRegistration(competitionId, userId);

      res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  public async submitEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitionId = this.getId(req);
      const userId = req.user!.userId;

      const updated = await registrationService.submitEntry(competitionId, userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Submission successfully received!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const registrationController = new RegistrationController();

