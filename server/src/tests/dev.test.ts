import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { CompetitionModel } from '../modules/competition/competition.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { RegistrationModel } from '../modules/registration/registration.model.js';

describe('Dev Lifecycle & Reseed API Tests', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectDatabase();
    await seedDatabase(false);
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('POST /api/dev/lifecycle should switch to SOLD_OUT state', async () => {
    const res = await request(app)
      .post('/api/dev/lifecycle')
      .send({ phase: 'SOLD_OUT' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.spotsBooked).toBe(20);

    const activeRes = await request(app).get('/api/competitions/active');
    expect(activeRes.body.data.isSoldOut).toBe(true);
    expect(activeRes.body.data.spotsRemaining).toBe(0);
  });

  it('POST /api/dev/lifecycle should switch to JUDGING state', async () => {
    const res = await request(app)
      .post('/api/dev/lifecycle')
      .send({ phase: 'JUDGING' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const activeRes = await request(app).get('/api/competitions/active');
    expect(activeRes.body.data.lifecycle.phase).toBe('JUDGING');
    expect(activeRes.body.data.lifecycle.isRegistrationOpen).toBe(false);
  });

  it('POST /api/dev/lifecycle should reject invalid phase', async () => {
    const res = await request(app)
      .post('/api/dev/lifecycle')
      .send({ phase: 'INVALID_PHASE' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/dev/reseed should reset database to default Objective_Page state', async () => {
    const res = await request(app).post('/api/dev/reseed');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const activeRes = await request(app).get('/api/competitions/active');
    expect(activeRes.status).toBe(200);
    expect(activeRes.body.data.title).toBe('Feedants Classical Dance');
    expect(activeRes.body.data.spotsBooked).toBe(1);
    expect(activeRes.body.data.spotsRemaining).toBe(19);
  });
});
