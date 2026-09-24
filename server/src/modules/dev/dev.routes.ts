import { Router } from 'express';
import { devController } from './dev.controller.js';

const router = Router();

// POST /api/dev/lifecycle
router.post('/lifecycle', (req, res, next) =>
  devController.setLifecyclePhase(req, res, next)
);

// POST /api/dev/reseed
router.post('/reseed', (req, res, next) =>
  devController.reseed(req, res, next)
);

export const devRouter = router;
