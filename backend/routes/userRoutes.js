import express from 'express';
import expressValidator from 'express-validator';
import {
  authUser,
  deleteUser,
  getUserById,
  getUserOrders,
  getUserProfile,
  getUsers,
  logoutUser,
  newUser,
  updateUser,
  updateUserProfile,
} from '../controllers/userController.js';
import { authRoles, requireAuth } from '../middleware/authMiddleware.js';
import { ROLE } from '../permissions/roles.js';

const { body, check } = expressValidator;

const router = express.Router();

router
  .route('/')
  .get(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), getUsers)
  .post(
    check('name')
      .trim()
      .isLength({ min: 5 })
      .withMessage('must be at least 5 characters long'),
    body('email').isEmail().normalizeEmail(),
    check('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('must be at least 6 characters long')
      .matches(/[a-z]/)
      .withMessage('must contain a lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('must contain a uppercae letter')
      .matches(/[0-9]/)
      .withMessage('must contain a number')
      .matches(/[^a-zA-Z0-9\s]/)
      .withMessage('must contain a special character'),
    newUser
  );
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
