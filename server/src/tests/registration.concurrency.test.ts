import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { CompetitionModel } from '../modules/competition/competition.model.js';
import { RegistrationModel } from '../modules/registration/registration.model.js';

describe('High Concurrency Registration & Race Condition Verification', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('CONCURRENCY TEST: Exactly 2 users should win the last 2 spots out of 20 concurrent requests', async () => {
    // 1. Create a competition with exactly 2 spots available
    const comp = await CompetitionModel.create({
      title: 'High Concurrency Stress Test Dance',
      category: 'Dance',
      tags: ['Dance'],
      prizePool: 1000,
      entryFee: 50,
      maxSpots: 2,
      spotsBooked: 0, // 2 spots available
      judge: {
        name: 'Judge',
        title: 'Title',
        experience: '10y',
        avatarUrl: 'https://example.com/a.jpg',
      },
      dates: {
        registrationOpensAt: new Date(Date.now() - 100000),
        registrationClosesAt: new Date(Date.now() + 1000000),
        submissionStartsAt: new Date(Date.now() - 50000),
        submissionEndsAt: new Date(Date.now() + 2000000),
        resultDate: new Date(Date.now() + 3000000),
      },
      tabs: {
        about: { shortDescription: 's', fullDescription: 'f' },
        judgingParameters: [],
        rulesAndEligibility: ['Rule'],
      },
      rewards: [{ rank: 1, position: '1st', amount: 500, iconType: 'trophy_gold' }],
      status: 'PUBLISHED',
    });

    const compId = (comp._id as any).toString();

    // 2. Pre-generate 20 distinct users and auth tokens
    const userCount = 20;
    const tokens: string[] = [];

    for (let i = 0; i < userCount; i++) {
      const email = `concurrency_user_${Date.now()}_${i}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: `User ${i}`,
          email,
          password: 'password123',
        });
      tokens.push(res.body.data.token);
    }

    expect(tokens.length).toBe(20);

    // 3. Fire all 20 registration requests simultaneously via Promise.all
    const responses = await Promise.all(
      tokens.map((token) =>
        request(app)
          .post(`/api/competitions/${compId}/register`)
          .set('Authorization', `Bearer ${token}`)
      )
    );

    // 4. Assert results
    const successResponses = responses.filter((r) => r.status === 201);
    const fullResponses = responses.filter((r) => r.status === 409 && r.body.error?.code === 'COMPETITION_FULL');

    expect(successResponses.length).toBe(2);
    expect(fullResponses.length).toBe(18);

    // 5. Verify database source of truth
    const finalComp = await CompetitionModel.findById(compId);
    expect(finalComp?.spotsBooked).toBe(2);

    const regCount = await RegistrationModel.countDocuments({ competitionId: compId });
    expect(regCount).toBe(2);
  });

  it('IDEMPOTENCY & ROLLBACK: Same user firing 2 parallel requests gets 1 success, 1 duplicate error, spotsBooked = 1', async () => {
    const comp = await CompetitionModel.create({
      title: 'Duplicate Prevention Test',
      category: 'Dance',
      prizePool: 500,
      entryFee: 10,
      maxSpots: 10,
      spotsBooked: 0,
      judge: { name: 'J', title: 'T', experience: '5y', avatarUrl: 'a' },
      dates: {
        registrationOpensAt: new Date(Date.now() - 10000),
        registrationClosesAt: new Date(Date.now() + 100000),
        submissionStartsAt: new Date(Date.now() - 5000),
        submissionEndsAt: new Date(Date.now() + 200000),
        resultDate: new Date(Date.now() + 300000),
      },
      tabs: { about: { shortDescription: 's', fullDescription: 'f' }, judgingParameters: [], rulesAndEligibility: [] },
      rewards: [{ rank: 1, position: '1st', amount: 500, iconType: 'star' }],
      status: 'PUBLISHED',
    });

    const compId = (comp._id as any).toString();

    // Register user
    const authRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Idempotent User',
        email: `idempotent_${Date.now()}@example.com`,
        password: 'password123',
      });
    const token = authRes.body.data.token;

    // Fire 2 concurrent requests with SAME user
    const [res1, res2] = await Promise.all([
      request(app).post(`/api/competitions/${compId}/register`).set('Authorization', `Bearer ${token}`),
      request(app).post(`/api/competitions/${compId}/register`).set('Authorization', `Bearer ${token}`),
    ]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 409]);

    // Check compensating rollback ensured spotsBooked is exactly 1
    const updatedComp = await CompetitionModel.findById(compId);
    expect(updatedComp?.spotsBooked).toBe(1);

    const regCount = await RegistrationModel.countDocuments({ competitionId: compId });
    expect(regCount).toBe(1);
  });
});

