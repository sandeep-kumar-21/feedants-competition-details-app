import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { evaluateCompetitionLifecycle } from '../modules/competition/competition.lifecycle.js';
import { CompetitionModel } from '../modules/competition/competition.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { RegistrationModel } from '../modules/registration/registration.model.js';

describe('Competition Lifecycle Evaluation Unit Tests', () => {
  const baseDates = {
    registrationOpensAt: new Date('2026-08-01T00:00:00Z'),
    registrationClosesAt: new Date('2026-08-10T23:50:00Z'),
    submissionStartsAt: new Date('2026-08-06T04:00:00Z'),
    submissionEndsAt: new Date('2026-08-30T23:55:00Z'),
    resultDate: new Date('2026-09-01T23:50:00Z'),
  };

  it('should return UPCOMING if now is before registrationOpensAt', () => {
    const res = evaluateCompetitionLifecycle(baseDates, 0, 20, new Date('2026-07-31T23:59:59Z'));
    expect(res.phase).toBe('UPCOMING');
    expect(res.isRegistrationOpen).toBe(false);
  });

  it('should return REGISTRATION_OPEN when between opens and closes with spots available', () => {
    const res = evaluateCompetitionLifecycle(baseDates, 5, 20, new Date('2026-08-03T12:00:00Z'));
    expect(res.phase).toBe('REGISTRATION_OPEN');
    expect(res.isRegistrationOpen).toBe(true);
  });

  it('should return REGISTRATION_FULL when capacity reached', () => {
    const res = evaluateCompetitionLifecycle(baseDates, 20, 20, new Date('2026-08-03T12:00:00Z'));
    expect(res.phase).toBe('REGISTRATION_FULL');
    expect(res.isRegistrationOpen).toBe(false);
  });

  it('should return SUBMISSION_OPEN when registration closed but submission window active', () => {
    const res = evaluateCompetitionLifecycle(baseDates, 10, 20, new Date('2026-08-15T12:00:00Z'));
    expect(res.phase).toBe('SUBMISSION_OPEN');
    expect(res.isSubmissionOpen).toBe(true);
    expect(res.isRegistrationOpen).toBe(false);
  });

  it('should return JUDGING when submission ended but results not yet declared', () => {
    const res = evaluateCompetitionLifecycle(baseDates, 10, 20, new Date('2026-08-31T12:00:00Z'));
    expect(res.phase).toBe('JUDGING');
    expect(res.isSubmissionOpen).toBe(false);
    expect(res.hasEnded).toBe(false);
  });

  it('should return COMPLETED when past resultDate', () => {
    const res = evaluateCompetitionLifecycle(baseDates, 10, 20, new Date('2026-09-02T00:00:00Z'));
    expect(res.phase).toBe('COMPLETED');
    expect(res.hasEnded).toBe(true);
  });
});

describe('Competition Detail API Integration Tests', () => {
  const app = createApp();
  let competitionId: string;
  let testUserToken: string;
  let registeredUserId: string;

  beforeAll(async () => {
    await connectDatabase();

    // Create a competition document
    const comp = await CompetitionModel.create({
      title: 'Feedants Classical Dance Test',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win'],
      certificateOffered: true,
      prizePool: 1500,
      currency: '₹',
      entryFee: 99,
      maxSpots: 20,
      spotsBooked: 1,
      judge: {
        name: 'Manju Dubey',
        title: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        avatarUrl: 'https://example.com/avatar.jpg',
        introVideoUrl: 'https://example.com/video.mp4',
      },
      dates: {
        registrationOpensAt: new Date(Date.now() - 100000),
        registrationClosesAt: new Date(Date.now() + 1000000),
        submissionStartsAt: new Date(Date.now() - 50000),
        submissionEndsAt: new Date(Date.now() + 2000000),
        resultDate: new Date(Date.now() + 3000000),
      },
      previousWinners: [],
      tabs: {
        about: {
          shortDescription: 'Short about text',
          fullDescription: 'Full about text',
        },
        judgingParameters: [],
        rulesAndEligibility: ['Rule 1'],
      },
      rewards: [{ rank: 1, position: '1st Winner', amount: 550, iconType: 'trophy_gold' }],
      disclaimer: 'Disclaimer text',
      trustAndPayment: {
        prizeMoneyVideoUrl: '',
        refundPolicyText: 'Refund policy',
        refundPolicyUrl: 'https://feedants.com/refund',
        paymentProvider: 'Razorpay',
      },
      referralCampaign: { rewardPerSignup: 10, description: 'Referral desc' },
      status: 'PUBLISHED',
    });

    competitionId = (comp._id as any).toString();

    // Register a user
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Viewer Tester',
        email: `viewer_${Date.now()}@example.com`,
        password: 'password123',
      });

    testUserToken = regRes.body.data.token;
    registeredUserId = regRes.body.data.user._id;

    // Create a registration for this user
    await RegistrationModel.create({
      competitionId: comp._id,
      userId: registeredUserId,
      status: 'REGISTERED',
    });
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('GET /api/competitions/active should return 200 with full competition payload as guest', async () => {
    const res = await request(app).get('/api/competitions/active');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBeDefined();
    expect(res.body.data.serverTime).toBeDefined();
    expect(res.body.data.spotsRemaining).toBeDefined();
    expect(res.body.data.viewerStatus.isRegistered).toBe(false);
  });

  it('GET /api/competitions/:id with valid JWT should return viewerStatus.isRegistered = true', async () => {
    const res = await request(app)
      .get(`/api/competitions/${competitionId}`)
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.viewerStatus.isAuthenticated).toBe(true);
    expect(res.body.data.viewerStatus.isRegistered).toBe(true);
  });

  it('GET /api/competitions/:id with non-existent ID should return 404', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/competitions/${nonExistentId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

