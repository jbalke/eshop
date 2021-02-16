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

// @desc     Delete product
// @route    DELETE /api/product/:id
// @access   Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new FriendlyError(`product with id ${id} not found`);
  }
  res.json(product);
});

// @desc     Create a product
// @route    POST /api/product
// @access   Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user.id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc     Update a product
// @route    PATCH /api/product/:id
// @access   Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new FriendlyError('Product not found');
  }

  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.image = image ?? product.image;
  product.brand = brand ?? product.brand;
  product.category = category ?? product.category;
  product.countInStock = countInStock ?? product.countInStock;
  product.numReviews = numReviews ?? product.numReviews;
  product.description = description ?? product.description;

  const updatedProduct = await product.save();

  res.json(updatedProduct);
});
