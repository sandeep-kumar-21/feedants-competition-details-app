import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { CompetitionModel } from '../modules/competition/competition.model.js';
import { RegistrationModel } from '../modules/registration/registration.model.js';

describe('MongoDB Models & Schema Invariants', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should enforce unique email on User model', async () => {
    const email = `test_${Date.now()}@example.com`;
    await UserModel.create({
      name: 'Test User 1',
      email,
      passwordHash: 'hash1',
      referralCode: `REF_${Date.now()}_1`,
    });

    // Attempting to insert duplicate email must throw duplicate key error (code 11000)
    let duplicateError: any = null;
    try {
      await UserModel.create({
        name: 'Test User 2',
        email,
        passwordHash: 'hash2',
        referralCode: `REF_${Date.now()}_2`,
      });
    } catch (err) {
      duplicateError = err;
    }

    expect(duplicateError).toBeDefined();
    expect(duplicateError.code).toBe(11000);
  });

  it('should enforce compound unique index on Registration (competitionId + userId)', async () => {
    const dummyCompId = new mongoose.Types.ObjectId();
    const dummyUserId = new mongoose.Types.ObjectId();

    await RegistrationModel.create({
      competitionId: dummyCompId,
      userId: dummyUserId,
      status: 'REGISTERED',
    });

    let duplicateRegError: any = null;
    try {
      await RegistrationModel.create({
        competitionId: dummyCompId,
        userId: dummyUserId,
        status: 'REGISTERED',
      });
    } catch (err) {
      duplicateRegError = err;
    }

    expect(duplicateRegError).toBeDefined();
    expect(duplicateRegError.code).toBe(11000);
  });

  it('should validate required fields on Competition model', async () => {
    let validationError: any = null;
    try {
      await CompetitionModel.create({
        title: '', // empty title should fail
      });
    } catch (err) {
      validationError = err;
    }

    expect(validationError).toBeDefined();
    expect(validationError.name).toBe('ValidationError');
  });
});

