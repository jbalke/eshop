import express from 'express';
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  newUser,
  logoutUser,
  getUsers,
  getUserOrders,
} from '../controllers/userController.js';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(requireAuth, isAdmin, getUsers).post(newUser);
router
  .route('/:id')
  .get(requireAuth, getUserProfile)
  .patch(requireAuth, updateUserProfile);
router.route('/:id/orders').get(requireAuth, isAdmin, getUserOrders);
router.post('/login', authUser);
router.post('/logout', logoutUser);

export default router;
