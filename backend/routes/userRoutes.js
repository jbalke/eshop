import express from 'express';
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  newUser,
  logoutUser,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(newUser);
router
  .route('/:id')
  .get(requireAuth, getUserProfile)
  .patch(requireAuth, updateUserProfile);
router.post('/login', authUser);
router.post('/logout', logoutUser);

export default router;
