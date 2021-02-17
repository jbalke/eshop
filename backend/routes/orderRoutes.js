import express from 'express';
import {
  addOrderItems,
  getOrderByID,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  getUndeliveredOrders,
} from '../controllers/orderController.js';
import { isAdmin, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(requireAuth, addOrderItems)
  .get(requireAuth, isAdmin, getOrders);
router.route('/undelivered').get(requireAuth, isAdmin, getUndeliveredOrders);
router.route('/myorders').get(requireAuth, getMyOrders);
router.route('/:id').get(requireAuth, getOrderByID);
router.route('/:id/pay').patch(requireAuth, updateOrderToPaid);
router
  .route('/:id/deliver')
  .patch(requireAuth, isAdmin, updateOrderToDelivered);

export default router;
