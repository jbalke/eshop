import express from 'express';
import { authUser, getUserProfile } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/profile').get(isAuthenticated, getUserProfile);

export default router;
