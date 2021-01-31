import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
} from '../utils/tokens.js';

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    setRefreshCookie(res, createRefreshToken(user));

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: createAccessToken(user),
    });
  } else {
    res.status(401);
    throw new Error('invalid email and/or password');
  }
});

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email, isAdmin } = await User.findById(req.user.id);
  res.json({
    _id,
    name,
    email,
    isAdmin,
  });
});
