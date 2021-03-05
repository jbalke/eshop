import express from 'express';
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  newUser,
  logoutUser,
  getUsers,
  getUserOrders,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { requireAuth, authRoles } from '../middleware/authMiddleware.js';
import { ROLE } from '../permissions/roles.js';

const router = express.Router();

router
  .route('/')
  .get(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), getUsers)
  .post(newUser);
router
  .route('/profile')
  .get(requireAuth, getUserProfile)
  .patch(requireAuth, updateUserProfile);
router
  .route('/:id')
  .get(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), getUserById)
  .patch(requireAuth, authRoles(ROLE.ADMIN), updateUser)
  .delete(requireAuth, authRoles(ROLE.ADMIN), deleteUser);
router
  .route('/:id/orders')
  .get(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), getUserOrders);
router.post('/login', authUser);
router.post('/logout', logoutUser);

export default router;
