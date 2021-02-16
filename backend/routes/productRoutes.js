import express from 'express';
import {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(requireAuth, isAdmin, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .patch(requireAuth, isAdmin, updateProduct)
  .delete(requireAuth, isAdmin, deleteProduct);

export default router;
