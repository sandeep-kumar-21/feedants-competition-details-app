import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { UserModel } from './user.model.js';
import { NotFoundError } from '../../common/errors/app-error.js';

const router = Router();

router.get('/me/referral', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.user!.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralLink: `https://feedants.com/r/${user.referralCode.toLowerCase()}`,
        rewardPerSignup: 10,
        currency: '₹',
        totalEarnings: user.referralEarnings,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const userRouter = router;

