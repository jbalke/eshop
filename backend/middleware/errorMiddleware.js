import { convertToFriendlyError } from '../errors/errors.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  const friendlyError = convertToFriendlyError(err);

  res.json({
    message: friendlyError.message,
    stack: process.env.NODE_ENV === 'production' ? null : friendlyError.stack,
  });
};
