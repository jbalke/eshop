import express from 'express';
import {
  addOrderItems,
  getOrderByID,
  updatedOrderToPaid,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(requireAuth, addOrderItems);
router.route('/:id').get(requireAuth, getOrderByID);
router.route('/:id/pay').patch(requireAuth, updatedOrderToPaid);

export default router;
