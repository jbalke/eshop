import mongoose from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import Order from './orderModel.js';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 5,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (plainPassword) {
  return await argon2.verify(this.password, plainPassword);
};

userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { sub: this._id, tokenVersion: this.tokenVersion },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { sub: this._id, tokenVersion: this.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokenVersion;

  return userObject;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Increment token version to invalidate existing tokens
  this.tokenVersion += 1;
  this.password = await argon2.hash(this.password);

  next();
});

userSchema.pre('remove', async function (next) {
  // delete unpaid orders
  await Order.deleteMany({ user: this._id, isPaid: false });

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
