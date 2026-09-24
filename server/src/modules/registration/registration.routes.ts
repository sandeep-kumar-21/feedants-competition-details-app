import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { registrationController } from './registration.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { validateRequest } from '../../common/middleware/validate.middleware.js';
import { CompetitionIdParamSchema } from '../competition/dto/competition.dto.js';
import { SubmitEntrySchema } from './dto/registration.dto.js';

const router = Router();

// Rate limiter for registration writes: max 30 requests per minute per IP
const registerRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many registration requests. Please slow down.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/competitions/:id/register
router.post(
  '/:id/register',
  requireAuth,
  registerRateLimiter,
  validateRequest({ params: CompetitionIdParamSchema }),
  (req, res, next) => registrationController.register(req, res, next)
);

// GET /api/competitions/:id/registration
router.get(
  '/:id/registration',
  requireAuth,
  validateRequest({ params: CompetitionIdParamSchema }),
  (req, res, next) => registrationController.getMyRegistration(req, res, next)
);

// POST /api/competitions/:id/submission
router.post(
  '/:id/submission',
  requireAuth,
  validateRequest({ params: CompetitionIdParamSchema, body: SubmitEntrySchema }),
  (req, res, next) => registrationController.submitEntry(req, res, next)
);

export const registrationRouter = router;

