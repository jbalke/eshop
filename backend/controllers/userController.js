import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import {
  createAccessToken,
  setRefreshCookie,
  clearRefreshCookie,
} from '../utils/tokens.js';
import { FriendlyError } from '../errors/errors.js';

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    setRefreshCookie(res, user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: createAccessToken(user),
    });
  } else {
    res.status(401);
    throw new FriendlyError('Invalid email and/or password');
  }
});

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
export const authPing = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// @desc     Get user profile
// @route    GET /api/users/:id
// @access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id !== 'profile' && !req.user.isAdmin) {
    res.status(403);
    throw new FriendlyError('Access denied');
  }

  const idToFind = id === 'profile' ? req.user.id : id;
  const user = await User.findById(idToFind);

  if (!user) {
    res.status(404);
    throw new FriendlyError(`User ${id} not found`);
  }

  const { _id, name, email, isAdmin } = user;
  res.json({
    user: {
      _id,
      name,
      email,
      isAdmin,
    },
  });
});

// @desc     Update user profile
// @route    PATCH /api/users/profile
// @access   Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    req.user = updatedUser;
    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } else {
    res.status(404);
    throw new FriendlyError('User not found');
  }
});

// @desc     Register a new user
// @route    POST /api/users
// @access   Public
export const newUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  if (user) {
    setRefreshCookie(res, user);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: createAccessToken(user),
    });
  } else {
    res.status(400);
    throw new FriendlyError('Invalid user data');
  }
});

// @desc     Logout user
// @route    POST /api/users/logout
// @access   Public
export const logoutUser = (req, res) => {
  clearRefreshCookie(res);
  res.json({ logout: true });
};
