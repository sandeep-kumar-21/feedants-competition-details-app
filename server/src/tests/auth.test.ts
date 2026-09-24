import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';

describe('Auth Module & API Endpoints', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/register should register a new user with token and referral code', async () => {
    const email = `auth_test_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Arjun Das',
        email,
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.referralCode).toBeDefined();
  });

  it('POST /api/auth/register should return 409 for duplicate email', async () => {
    const email = `auth_test_dup_${Date.now()}@example.com`;
    await UserModel.create({
      name: 'Existing User',
      email,
      passwordHash: 'hash',
      referralCode: `REF_${Date.now()}`,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Attempt',
        email,
        password: 'password123',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('POST /api/auth/login should return 200 and token for valid credentials', async () => {
    const email = `auth_login_${Date.now()}@example.com`;
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login Tester',
        email,
        password: 'mysecurepassword',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'mysecurepassword',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('GET /api/auth/me should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

