import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { errorHandler } from './common/errors/error-handler.js';
import { NotFoundError } from './common/errors/app-error.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { competitionRouter } from './modules/competition/competition.routes.js';
import { registrationRouter } from './modules/registration/registration.routes.js';
import { userRouter } from './modules/user/user.routes.js';

export const createApp = (): Application => {
  const app: Application = express();

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root & Healthcheck
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'Feedants Competition API',
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  // Feature Modules
  app.use('/api/auth', authRouter);
  app.use('/api/competitions', competitionRouter);
  app.use('/api/competitions', registrationRouter);
  app.use('/api/users', userRouter);

  // 404 Handler for undefined routes
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('The requested endpoint does not exist.'));
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
