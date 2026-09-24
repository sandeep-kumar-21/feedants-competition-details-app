import { Request, Response, NextFunction } from 'express';
import { competitionService } from './competition.service.js';

export class CompetitionController {
  public async getDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = req.params.id;
      const competitionId = Array.isArray(rawId) ? rawId[0] : rawId;
      const userId = req.user?.userId;

      const details = await competitionService.getCompetitionDetails(competitionId, userId);
      res.status(200).json({
        success: true,
        data: details,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getDefaultActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const details = await competitionService.getCompetitionDetails(undefined, userId);
      res.status(200).json({
        success: true,
        data: details,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const competitionController = new CompetitionController();
