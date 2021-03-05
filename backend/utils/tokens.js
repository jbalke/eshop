import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const COOKIE_OPTIONS = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
};

export const createAccessToken = (user) => {
  const { _id, tokenVersion } = user;
  return jwt.sign({ sub: _id, tokenVersion }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user) => {
  const { _id, tokenVersion } = user;
  return jwt.sign(
    { sub: _id, tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export const setRefreshCookie = (res, user) => {
  res.cookie(process.env.COOKIE_NAME, createRefreshToken(user), COOKIE_OPTIONS);
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(process.env.COOKIE_NAME, COOKIE_OPTIONS);
};

export const verifyRefeshToken = async (req) => {
  const refreshToken = req.cookies[process.env.COOKIE_NAME];

  if (!refreshToken) {
    return null;
  }

  try {
    const { sub, tokenVersion } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    return await User.findOne({ _id: sub, tokenVersion });
  } catch (error) {
    return null;
  }
};
