import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(requireAuth, addOrderItems);

export default router;
