import { CompetitionModel, ICompetition } from './competition.model.js';

export class CompetitionRepository {
  public async findById(id: string): Promise<ICompetition | null> {
    return CompetitionModel.findById(id).lean<ICompetition>();
  }

  public async findDefaultActive(): Promise<ICompetition | null> {
    return CompetitionModel.findOne({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).lean<ICompetition>();
  }

  public async incrementSpotsBookedAtomic(
    competitionId: string,
    maxSpots: number
  ): Promise<ICompetition | null> {
    return CompetitionModel.findOneAndUpdate(
      {
        _id: competitionId,
        spotsBooked: { $lt: maxSpots },
      },
      {
        $inc: { spotsBooked: 1 },
      },
      {
        returnDocument: 'after',
      }
    );
  }

  public async rollbackSpotsBookedAtomic(competitionId: string): Promise<void> {
    await CompetitionModel.updateOne(
      { _id: competitionId },
      { $inc: { spotsBooked: -1 } }
    );
  }
}

export const competitionRepository = new CompetitionRepository();
