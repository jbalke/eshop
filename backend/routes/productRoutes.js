import express from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @desc     Fetch all products
// @route    GET /api/products
// @access   Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const allProducts = await Product.find({}, null, { lean: true });
    res.json(allProducts);
  })
);

// @desc     Fetch single product
// @route    GET /api/product/:id
// @access   Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id, null, { lean: true });

    if (!product) {
      res.status(404);
      throw new Error(`product with id ${id} not found`);
    }
    res.json(product);
  })
);

export default router;
