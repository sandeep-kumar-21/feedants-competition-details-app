import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { CompetitionModel } from '../modules/competition/competition.model.js';
import { RegistrationModel } from '../modules/registration/registration.model.js';

export async function seedDatabase(shouldDisconnect = false) {
  console.log('Starting database seed with exact Objective_Page.png data...');
  await connectDatabase();

  // Clear existing collections
  await Promise.all([
    UserModel.deleteMany({}),
    CompetitionModel.deleteMany({}),
    RegistrationModel.deleteMany({}),
  ]);
  console.log('Cleaned existing database records.');

  // Create Users
  const passwordHash = await bcrypt.hash('feedants123', 10);

  const registeredUser = await UserModel.create({
    name: 'Rohan Sharma',
    email: 'rohan@example.com',
    passwordHash,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    referralCode: 'ROHAN10',
    referralEarnings: 30,
  });

  const newUser = await UserModel.create({
    name: 'Priya Patel',
    email: 'priya@example.com',
    passwordHash,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    referralCode: 'REFERRAL123',
    referralEarnings: 0,
  });

  console.log(`Seeded 2 demo users:
  1. ${registeredUser.name} (${registeredUser.email}) - Already Registered (matches screenshot)
  2. ${newUser.name} (${newUser.email}) - Fresh user (ready to register)`);

  // Target relative dates to show active countdown (1 day, 6 hours, 28 mins from now)
  const now = new Date();
  const registrationClosesAt = new Date(now.getTime() + (1 * 24 * 60 + 6 * 60 + 28) * 60 * 1000 + 32 * 1000);
  const registrationOpensAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const submissionStartsAt = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // submission is open!
  const submissionEndsAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const resultDate = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);

  const competition = await CompetitionModel.create({
    title: 'Feedants Classical Dance',
    category: 'Dance',
    tags: ['Dance', 'Multi-Win'],
    certificateOffered: true,
    prizePool: 1500,
    currency: '₹',
    entryFee: 99,
    maxSpots: 20,
    spotsBooked: 1, // 1/20 Booked -> Only 19 spots left
    judge: {
      name: 'Manju Dubey',
      title: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    dates: {
      registrationOpensAt,
      registrationClosesAt,
      submissionStartsAt,
      submissionEndsAt,
      resultDate,
    },
    previousWinners: [
      {
        name: 'Riya Shah',
        position: '1st Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=300',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      },
      {
        name: 'Aarav Mehta',
        position: '1st Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      {
        name: 'Neha Verma',
        position: '2nd Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      },
      {
        name: 'Ishita Choi',
        position: '3rd Winner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
    ],
    tabs: {
      about: {
        shortDescription:
          'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
        fullDescription:
          'Whether you specialize in Kathak, Bharatnatyam, Odissi, Mohiniyattam, or Kuchipudi, Feedants offers an equitable national arena to present your devotion to Indian classical arts. Each submission is independently assessed by seasoned gurus on foundational mastery, artistic grace, and rhythmic precision.',
      },
      judgingParameters: [
        {
          title: 'Taal & Rhythm',
          weightage: 30,
          description: 'Adherence to tempo, intricate footwork (tatkar), and synchronization with rhythmic cycles.',
        },
        {
          title: 'Abhinaya (Expressions)',
          weightage: 35,
          description: 'Depth of facial expressions (bhav), eye movements, and evocative storytelling of the narrative.',
        },
        {
          title: 'Angashuddhi (Postures & Grace)',
          weightage: 20,
          description: 'Body posture, alignment of mudras (hand gestures), stamina, and stage elegance.',
        },
        {
          title: 'Aharya (Costume & Tradition)',
          weightage: 15,
          description: 'Authenticity of classical attire, ghungroos, makeup, and stage aesthetic presentation.',
        },
      ],
      rulesAndEligibility: [
        'Open to solo classical dancers of any age, gender, or nationality.',
        'Performance duration must be between 2:00 to 5:00 minutes.',
        'Recording must show full body from head to feet in horizontal/landscape view with uninterrupted single-take framing.',
        'Authentic classical music/tala accompaniment required (pre-recorded or live).',
        'Submissions must be uploaded before the submission end deadline.',
      ],
    },
    rewards: [
      { rank: 1, position: '1st Winner', amount: 550, iconType: 'trophy_gold' },
      { rank: 2, position: '2nd Winner', amount: 300, iconType: 'medal_silver' },
      { rank: 3, position: '3rd Winner', amount: 240, iconType: 'medal_bronze' },
      { rank: 4, position: '4th Winner', amount: 200, iconType: 'star' },
      { rank: 5, position: '5th Winner', amount: 130, iconType: 'star' },
      { rank: 6, position: '6th Winner', amount: 80, iconType: 'star' },
    ],
    disclaimer: 'Disclaimer: Only contributions from paid participants will be considered for judging.',
    trustAndPayment: {
      prizeMoneyVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      refundPolicyText: 'Refund policy',
      refundPolicyUrl: 'https://feedants.com/refund-policy',
      paymentProvider: 'Razorpay',
    },
    referralCampaign: {
      rewardPerSignup: 10,
      description: 'You earn ₹10 for every signup',
    },
    status: 'PUBLISHED',
  });

  console.log(`Seeded Competition: "${competition.title}" (ID: ${competition._id})`);

  // Create the 1 initial registration for Rohan Sharma (making it 1/20 Booked)
  const initialRegistration = await RegistrationModel.create({
    competitionId: competition._id,
    userId: registeredUser._id,
    status: 'REGISTERED',
    paymentStatus: 'COMPLETED',
    paymentReference: 'PAY_INITIAL_DEMO_001',
    submission: {
      submitted: false,
    },
  });

  console.log(`Seeded 1 initial registration for ${registeredUser.name} (Reg ID: ${initialRegistration._id})`);
  console.log('Seed complete! All collections populated.');

  if (shouldDisconnect) {
    await disconnectDatabase();
  }
}

// Execute if run directly
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase(true).catch((err) => {
    console.error('Seed script error:', err);
    process.exit(1);
  });
}

