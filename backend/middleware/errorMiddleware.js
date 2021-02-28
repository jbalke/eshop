import {
  sanitizeError,
  DataConstraintError,
  ValidationError,
} from '../errors/errors.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const sanitizedError = sanitizeError(err);

  const statusCode =
    sanitizedError instanceof DataConstraintError ||
    sanitizedError instanceof ValidationError
      ? 400
      : res.statusCode === 200
      ? 500
      : res.statusCode;

  res.status(statusCode).json({
    message: sanitizedError.message,
    stack: process.env.NODE_ENV === 'production' ? null : sanitizedError.stack,
  });
};
