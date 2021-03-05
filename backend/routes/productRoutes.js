import express from 'express';
import {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getStockLevels,
} from '../controllers/productController.js';
import { requireAuth, authRoles } from '../middleware/authMiddleware.js';
import { ROLE } from '../permissions/roles.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), createProduct);
router.route('/top').get(getTopProducts);
router
  .route('/stock')
  .get(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), getStockLevels);
router
  .route('/:id')
  .get(getProductById)
  .patch(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), updateProduct)
  .delete(requireAuth, authRoles([ROLE.ADMIN, ROLE.MANAGER]), deleteProduct);
router.route('/:id/reviews').post(requireAuth, createProductReview);

export default router;
