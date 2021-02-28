import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401);
    throw new Error('missing authorization header');
  }

  if (!authHeader.startsWith('Bearer')) {
    res.status(401);
    throw new Error('missing Bearer token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { user, tokenVersion } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const existUser = await User.findOne({ _id: user, tokenVersion }).select(
      '-password'
    );

    if (!existUser) {
      res.status(401);
      throw new Error('invalid token');
    }

    req.user = existUser;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('missing or expired token');
  }
});

export const isAdmin = (req, res, next) => {
  if (req?.user?.isAdmin) {
    return next();
  }

  res.status(403);
  throw new Error('admin access only');
};
