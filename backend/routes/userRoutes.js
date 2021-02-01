import express from 'express';
import {
  authUser,
  getUserProfile,
  newUser,
  logoutUser,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(newUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(isAuthenticated, getUserProfile);

export default router;
