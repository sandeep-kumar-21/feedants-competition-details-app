import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../common/middleware/validate.middleware.js';
import { RegisterAuthSchema, LoginAuthSchema } from './dto/auth.dto.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest({ body: RegisterAuthSchema }), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validateRequest({ body: LoginAuthSchema }), (req, res, next) =>
  authController.login(req, res, next)
);

router.get('/me', requireAuth, (req, res, next) =>
  authController.getMe(req, res, next)
);

export const authRouter = router;

