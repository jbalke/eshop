import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const COOKIE_OPTIONS = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
};

export const setRefreshCookie = (res, user) => {
  res.cookie(
    process.env.COOKIE_NAME,
    user.createRefreshToken(),
    COOKIE_OPTIONS
  );
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
