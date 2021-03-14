import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { FriendlyError } from '../errors/errors.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401);
    throw new FriendlyError('missing authorization header');
  }

  if (!authHeader.startsWith('Bearer')) {
    res.status(401);
    throw new FriendlyError('missing Bearer token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { sub, tokenVersion } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const existUser = await User.findOne({ _id: sub, tokenVersion });

    if (!existUser) {
      res.status(401);
      throw new FriendlyError('invalid token');
    }

    req.user = existUser;
    next();
  } catch (error) {
    res.status(401);
    throw new FriendlyError('missing or expired token');
  }
});

export const authRoles = (roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return (req, res, next) => {
    if (roles.some((role) => role === req?.user?.role)) {
      return next();
    }

    res.status(403);
    throw new FriendlyError('forbidden');
  };
};

// export const isAdmin = (req, res, next) => {
//   if (req?.user?.isAdmin) {
//     return next();
//   }

//   res.status(403);
//   throw new Error('admin access only');
// };
