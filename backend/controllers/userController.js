import axios from 'axios';
import asyncHandler from 'express-async-handler';
import expressValidator from 'express-validator';
import { FriendlyError } from '../errors/errors.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { ROLE } from '../permissions/roles.js';
import { clearRefreshCookie, setRefreshCookie } from '../utils/tokens.js';

const { validationResult } = expressValidator;

const validateHuman = async (token) => {
  const { data } = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_KEY,
        response: token,
      },
    }
  );
  return data.success;
};

const stringToBinary = (message) => {
  let result = '';
  for (let index = 0; index < message.length; index++) {
    result += message[index].charCodeAt(0).toString(2) + ' ';
  }
  return result;
};

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password, token } = req.body;

  if (!(await validateHuman(token))) {
    res.status(400);
    throw new FriendlyError(stringToBinary('Nice try, bot.'));
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    setRefreshCookie(res, user);

    res.json({
      user,
      token: user.createAccessToken(),
    });
  } else {
    res.status(400);
    throw new FriendlyError('Invalid email and/or password');
  }
});

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new FriendlyError(`User ${id} not found`);
  }

  res.json({
    user,
  });
});

// @desc     Get user by ID
// @route    GET /api/users/:id
// @access   Admin
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new FriendlyError(`User ${id} not found`);
  }

  res.json({
    user,
  });
});

// @desc     Update user profile
// @route    PATCH /api/users/profile
// @access   Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(password))) {
    res.status(400);
    throw new FriendlyError('Incorrect password');
  }

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (newPassword) {
      user.password = newPassword;
    }

    const updatedUser = await user.save();
    // set new refresh token due to token version change
    setRefreshCookie(res, updatedUser);

    req.user = updatedUser;
    res.json({
      user,
      token: updateUser.createAccessToken(),
    });
  } else {
    res.status(404);
    throw new FriendlyError('User not found');
  }
});

// @desc     Update user by ID
// @route    PATCH /api/users/:id
// @access   Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    res.status(403);
    throw new FriendlyError('Changes to self must be made via Profile page');
  }

  const { name, email, role } = req.body;

  const user = await User.findById(id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;

    if (role) {
      user.role = role;
    }

    const updatedUser = await user.save();

    res.json({
      user: updatedUser,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { name, email, password, token } = req.body;

  if (!(await validateHuman(token))) {
    res.status(400);
    throw new FriendlyError('reCaptcha failed, please try again.');
  }

  const user = await User.create({ name, email, password });
  if (user) {
    setRefreshCookie(res, user);

    res.status(201).json({
      user,
      token: user.createAccessToken(),
    });
  } else {
    res.status(400);
    throw new FriendlyError('Invalid user data');
  }
});

// @desc     Get all users
// @route    GET /api/users
// @access   Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// @desc     Get orders for a user
// @route    GET /api/users/:id/orders
// @access   Admin
export const getUserOrders = asyncHandler(async (req, res) => {
  const filter = { user: req.params.id };
  const orders = await Order.find(filter).lean();

  res.json(orders);
});

// @desc     Delete user
// @route    DELETE /api/users/:id
// @access   Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new FriendlyError('User not found');
  }

  if (user.role === ROLE.ADMIN) {
    res.status(403);
    throw new FriendlyError('Unable to delete an Admin');
  }

  const deletedUser = await User.findByIdAndDelete(user._id).lean();

  // await Order.deleteMany({ user: deletedUser._id });
  res.json(deletedUser);
});

// @desc     Logout user
// @route    POST /api/users/logout
// @access   Public
export const logoutUser = (req, res) => {
  clearRefreshCookie(res);
  res.json({ logout: true });
};
