import express from 'express';
import {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(requireAuth, isAdmin, createProduct);
router.route('/top').get(getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .patch(requireAuth, isAdmin, updateProduct)
  .delete(requireAuth, isAdmin, deleteProduct);
router.route('/:id/reviews').post(requireAuth, createProductReview);

export default router;
