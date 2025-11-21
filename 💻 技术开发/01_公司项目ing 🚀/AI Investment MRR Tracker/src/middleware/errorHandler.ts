import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code || 'INTERNAL_ERROR';

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        code = 'DUPLICATE_RESOURCE';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        code = 'RESOURCE_NOT_FOUND';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        code = 'FOREIGN_KEY_CONSTRAINT';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid data provided';
        code = 'INVALID_DATA';
        break;
      default:
        statusCode = 500;
        message = 'Database operation failed';
        code = 'DATABASE_ERROR';
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data format';
    code = 'VALIDATION_ERROR';
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        validation_errors: validationErrors
      },
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Log error for debugging
  if (statusCode >= 500) {
    console.error('🚨 Server Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      timestamp: new Date().toISOString()
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error
      })
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create standardized error responses
export const createError = {
  badRequest: (message: string = 'Bad Request', code?: string) => 
    new AppError(message, 400, true, code || 'BAD_REQUEST'),
    
  unauthorized: (message: string = 'Unauthorized', code?: string) => 
    new AppError(message, 401, true, code || 'UNAUTHORIZED'),
    
  forbidden: (message: string = 'Forbidden', code?: string) => 
    new AppError(message, 403, true, code || 'FORBIDDEN'),
    
  notFound: (message: string = 'Resource not found', code?: string) => 
    new AppError(message, 404, true, code || 'NOT_FOUND'),
    
  conflict: (message: string = 'Resource conflict', code?: string) => 
    new AppError(message, 409, true, code || 'CONFLICT'),
    
  tooManyRequests: (message: string = 'Too many requests', code?: string) => 
    new AppError(message, 429, true, code || 'TOO_MANY_REQUESTS'),
    
  internal: (message: string = 'Internal server error', code?: string) => 
    new AppError(message, 500, true, code || 'INTERNAL_ERROR')
};