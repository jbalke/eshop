import express from 'express';
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  newUser,
  logoutUser,
  authPing,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(newUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(requireAuth, getUserProfile)
  .patch(requireAuth, updateUserProfile);
router.route('/me').get(requireAuth, authPing);

export default router;
