import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
  const { _id, isAdmin, tokenVersion } = user;
  return jwt.sign(
    { user: _id, tokenVersion },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

export const createRefreshToken = (user) => {
  const { _id, tokenVersion } = user;
  return jwt.sign(
    { user: _id, tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export const setRefreshCookie = (res, token) => {
  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
};
