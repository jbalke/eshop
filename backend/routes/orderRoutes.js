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
import { authRoles, requireAuth } from '../middleware/authMiddleware.js';
import { ROLE } from '../permissions/roles.js';

const router = express.Router();

router
  .route('/')
  .post(requireAuth, addOrderItems)
  .get(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), getOrders);
router
  .route('/undelivered')
  .get(
    requireAuth,
    authRoles([ROLE.ADMIN, ROLE.MANAGER]),
    getUndeliveredOrders
  );
router.route('/myorders').get(requireAuth, getMyOrders);
router.route('/:id').get(requireAuth, getOrderByID);
router.route('/:id/pay').patch(requireAuth, updateOrderToPaid);
router
  .route('/:id/deliver')
  .patch(
    requireAuth,
    authRoles([ROLE.ADMIN, ROLE.MANAGER]),
    updateOrderToDelivered
  );

export default router;
