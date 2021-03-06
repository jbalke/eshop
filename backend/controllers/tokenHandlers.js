import { verifyRefeshToken, setRefreshCookie } from '../utils/tokens.js';
import asyncHandler from 'express-async-handler';

export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const user = await verifyRefeshToken(req);

  if (!user) {
    res.status(400);
    throw new Error('invalid/expired refresh token');
  }
  setRefreshCookie(res, user);
  res.status(201).json({ token: user.createAccessToken() });
});
