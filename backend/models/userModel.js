import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
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
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await argon2.hash(this.password);
});

const User = mongoose.model('User', userSchema);

export default User;
