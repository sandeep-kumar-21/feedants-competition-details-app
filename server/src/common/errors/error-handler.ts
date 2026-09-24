import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error.js';
import { env } from '../../config/env.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details || null,
      },
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern || {})[0] || 'field';
    res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_KEY_ERROR',
        message: `An entry with this ${field} already exists.`,
      },
    });
    return;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
    });
    return;
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Your authentication token is invalid or expired. Please sign in again.',
      },
    });
    return;
  }

  // Unhandled / Unexpected Server Errors
  console.error('Unhandled Exception:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'An unexpected internal error occurred.' : err.message,
    },
  });
};

