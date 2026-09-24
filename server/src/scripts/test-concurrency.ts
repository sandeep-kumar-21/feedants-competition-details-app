import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { CompetitionModel } from '../modules/competition/competition.model.js';
import { RegistrationModel } from '../modules/registration/registration.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { registrationService } from '../modules/registration/registration.service.js';

async function runConcurrencyStressTest() {
  console.log('Starting High-Concurrency Race Condition Stress Test...');
  await connectDatabase();

  // Create a high-contention competition with only 3 spots remaining
  const maxSpots = 3;
  const competition = await CompetitionModel.create({
    title: 'High Concurrency Stress Test',
    category: 'Dance',
    prizePool: 1000,
    entryFee: 99,
    maxSpots,
    spotsBooked: 0,
    judge: { name: 'Judge', title: 'T', experience: '10y', avatarUrl: 'a' },
    dates: {
      registrationOpensAt: new Date(Date.now() - 10000),
      registrationClosesAt: new Date(Date.now() + 1000000),
      submissionStartsAt: new Date(Date.now() - 5000),
      submissionEndsAt: new Date(Date.now() + 2000000),
      resultDate: new Date(Date.now() + 3000000),
    },
    tabs: { about: { shortDescription: 's', fullDescription: 'f' }, judgingParameters: [], rulesAndEligibility: [] },
    rewards: [{ rank: 1, position: '1st', amount: 500, iconType: 'star' }],
    status: 'PUBLISHED',
  });

  const competitionId = (competition._id as any).toString();
  const CONCURRENT_USERS = 50;

  console.log(`Competition created with ${maxSpots} available spots.`);
  console.log(`Simulating ${CONCURRENT_USERS} simultaneous users registering at the exact same instant...`);

  // Create 50 distinct test users
  const userIds: string[] = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    const user = await UserModel.create({
      name: `Stress User ${i}`,
      email: `stress_${Date.now()}_${i}@example.com`,
      passwordHash: 'dummy',
      referralCode: `STRESS_${Date.now()}_${i}`,
    });
    userIds.push((user._id as any).toString());
  }

  // Fire 50 concurrent requests simultaneously using Promise.all
  const startTime = Date.now();
  const results = await Promise.allSettled(
    userIds.map((uid) => registrationService.registerUserForCompetition(competitionId, uid))
  );
  const duration = Date.now() - startTime;

  const successful = results.filter((r) => r.status === 'fulfilled');
  const rejected = results.filter((r) => r.status === 'rejected');

  console.log(`Completed ${CONCURRENT_USERS} requests in ${duration}ms!`);
  console.log(`Successful registrations: ${successful.length} (Expected: ${maxSpots})`);
  console.log(`Blocked / 409 full responses: ${rejected.length} (Expected: ${CONCURRENT_USERS - maxSpots})`);

  // Verify in MongoDB
  const finalComp = await CompetitionModel.findById(competitionId);
  const actualRegistrations = await RegistrationModel.countDocuments({ competitionId });

  console.log('--- DATABASE INVARIANT VERIFICATION ---');
  console.log(`Spots Booked in DB: ${finalComp?.spotsBooked} / ${maxSpots}`);
  console.log(`Total Registration Documents in DB: ${actualRegistrations}`);

  if (actualRegistrations === maxSpots && finalComp?.spotsBooked === maxSpots) {
    console.log('PASS: Concurrency safety verified! Zero overselling, zero race conditions.');
  } else {
    console.error('FAIL: Race condition detected!');
  }

  // Clean up test records
  await Promise.all([
    CompetitionModel.findByIdAndDelete(competitionId),
    RegistrationModel.deleteMany({ competitionId }),
    UserModel.deleteMany({ _id: { $in: userIds } }),
  ]);

  await disconnectDatabase();
}

runConcurrencyStressTest().catch(console.error);
