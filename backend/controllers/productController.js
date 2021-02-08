import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import { FriendlyError } from '../errors/errors.js';

// @desc     Fetch all products
// @route    GET /api/products
// @access   Public
export const getProducts = asyncHandler(async (req, res) => {
  const allProducts = await Product.find({}, null, { lean: true });
  res.json(allProducts);
});

// @desc     Fetch single product
// @route    GET /api/product/:id
// @access   Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id, null, { lean: true });

  if (!product) {
    res.status(404);
    throw new FriendlyError(`product with id ${id} not found`);
  }
  res.json(product);
});
