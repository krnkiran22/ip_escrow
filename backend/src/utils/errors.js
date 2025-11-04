/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class BlockchainError extends AppError {
  constructor(message = 'Blockchain transaction failed') {
    super(message, 500);
    this.name = 'BlockchainError';
  }
}

export class IPFSError extends AppError {
  constructor(message = 'IPFS operation failed') {
    super(message, 500);
    this.name = 'IPFSError';
  }
}

/**
 * Error response formatter
 */
export const formatErrorResponse = (error) => {
  return {
    status: error.status || 'error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * MongoDB error handler
 */
export const handleMongoError = (error) => {
  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return new ConflictError(`${field} already exists`);
  }
  
  // Validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return new ValidationError(errors.join(', '));
  }
  
  // Cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }
  
  return error;
};
