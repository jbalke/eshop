import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import { FriendlyError } from '../errors/errors.js';

const MAX_REVIEW_RATING = 5;

// @desc     Fetch all products
// @route    GET /api/products
// @access   Public
export const getProducts = asyncHandler(async (req, res) => {
  const filter = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const products = await Product.find(filter, null, {
    lean: true,
  }).populate('reviews.user', 'name');

  res.json(products);
});

// @desc     Fetch single product
// @route    GET /api/product/:id
// @access   Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id, null, {
    lean: true,
  }).populate('reviews.user', 'name');

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

// @desc     Create a new product review
// @route    POST /api/product/:id/reviews
// @access   Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { comment, rating } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new FriendlyError('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user.id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new FriendlyError('Product already reviewed');
  }

  if (rating > MAX_REVIEW_RATING || rating <= 0) {
    res.status(400);
    throw new FriendlyError(
      `Rating must be between 1 and ${MAX_REVIEW_RATING}`
    );
  }

  const existingOrder = await Order.findOne({
    user: req.user.id,
    isPaid: true,
    isDelivered: true,
    'orderItems.product': id,
  });

  if (!existingOrder) {
    res.status(400);
    throw new FriendlyError('Can only review bought items');
  }

  const review = {
    rating: Number(rating),
    comment,
    user: req.user.id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.numReviews;

  await product.save();

  res.status(201).json({ message: 'Review added' });
});
