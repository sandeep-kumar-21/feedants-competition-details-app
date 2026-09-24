import { Router } from 'express';
import { competitionController } from './competition.controller.js';
import { optionalAuth } from '../../common/middleware/optional-auth.middleware.js';
import { validateRequest } from '../../common/middleware/validate.middleware.js';
import { CompetitionIdParamSchema } from './dto/competition.dto.js';

const router = Router();

// GET active competition (default)
router.get('/active', optionalAuth, (req, res, next) =>
  competitionController.getDefaultActive(req, res, next)
);

// GET specific competition by ID
router.get('/:id', optionalAuth, validateRequest({ params: CompetitionIdParamSchema }), (req, res, next) =>
  competitionController.getDetails(req, res, next)
);

export const competitionRouter = router;

