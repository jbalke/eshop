import express from 'express';
import {
  authUser,
  getUserProfile,
  newUser,
  logoutUser,
  authPing,
} from '../controllers/userController.js';
import { isAuthenticated, auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(newUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(isAuthenticated, getUserProfile);
router.route('/me').get(isAuthenticated, authPing);

export default router;
