import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AppError } from './error';
import { ApiResponse, GenericError } from '@wl-apps/types';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  next
): void => {
  // Default error response structure
  let apiResponse: ApiResponse<GenericError> = {
    success: false,
    data: {
      message: err.message || 'Internal server error'
    }
  };

  // Add stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    apiResponse.data.stack = err.stack;
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json(apiResponse);
    return;
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    apiResponse.data.message = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
    apiResponse.data.code = 'VALIDATION_ERROR';
    res.status(400).json(apiResponse);
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    apiResponse.data.message = 'Invalid ID format';
    apiResponse.data.code = 'INVALID_ID';
    res.status(400).json(apiResponse);
    return;
  }

  // Handle MongoDB duplicate key error
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    apiResponse.data.message = 'Duplicate field value';
    apiResponse.data.code = 'DUPLICATE_FIELD';
    res.status(400).json(apiResponse);
    return;
  }

  // Handle JWT errors
  if (err instanceof JsonWebTokenError) {
    apiResponse.data.message = 'Invalid token';
    apiResponse.data.code = 'INVALID_TOKEN';
    res.status(401).json(apiResponse);
    return;
  }

  // Handle unknown errors
  console.error('Unhandled error:', err);
  apiResponse.data.message = 'Internal server error';
  apiResponse.data.code = 'INTERNAL_SERVER_ERROR';
  res.status(500).json(apiResponse);
}