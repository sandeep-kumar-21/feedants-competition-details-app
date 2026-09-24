export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden action') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', errorCode = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

export class CompetitionFullError extends AppError {
  constructor(message = 'This competition has reached its maximum participant capacity') {
    super(message, 409, 'COMPETITION_FULL');
  }
}

export class AlreadyRegisteredError extends AppError {
  constructor(message = 'You have already registered for this competition') {
    super(message, 409, 'ALREADY_REGISTERED');
  }
}

export class RegistrationClosedError extends AppError {
  constructor(message = 'Registration for this competition has officially closed') {
    super(message, 410, 'REGISTRATION_CLOSED');
  }
}

export class SubmissionWindowClosedError extends AppError {
  constructor(message = 'Submissions are not currently open for this competition') {
    super(message, 400, 'SUBMISSION_WINDOW_CLOSED');
  }
}

