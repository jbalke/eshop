import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import { FriendlyError } from '../errors/errors.js';

const TAX_RATE = 15;
const SHIPPING_COST = 100;
const FREE_SHIPPING_THRESHOLD = 100;

const calcOrderPrices = (items) => {
  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const taxPrice = Math.round(itemsPrice * TAX_RATE) / 100;
  const shippingPrice =
    itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: itemsPrice + taxPrice + shippingPrice,
  };
};

const buildOrder = async (clientOrder) => {
  const orderedItems = [];

  for (let i = 0; i < clientOrder.length; i++) {
    const clientItem = clientOrder[i];
    const item = await Product.findById(clientItem.product);

    if (!item) {
      throw new FriendlyError('Unable to fulfill your order');
    }

    item.qty = clientItem.qty;
    orderedItems.push(item);
  }

  return orderedItems;
};

const updateStockQty = async (order) => {
  for (let i = 0; i < order.length; i++) {
    const item = order[i];
    const updatedProduct = await Product.findByIdAndUpdate(
      item._id,
      { $inc: { countInStock: -item.qty } },
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error(
        `unable to update qty of product: ${item.name} (${item._id})`
      );
    }
  }
};

// @desc     Create new order
// @route    POST /api/orders
// @access   Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
  } = req.body;

  if (!orderItems?.length > 0) {
    res.status(400);
    throw new FriendlyError('No order items');
  }

  // check client-side calculations
  const serverOrder = await buildOrder(orderItems);
  const serverPrices = calcOrderPrices(serverOrder);

  if (serverPrices.totalPrice !== itemsPrice + taxPrice + shippingPrice) {
    throw new FriendlyError(
      'Order mismatch, unable to fulfill order. Please try again later.'
    );
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice: serverPrices.itemsPrice,
    taxPrice: serverPrices.taxPrice,
    shippingPrice: serverPrices.shippingPrice,
    totalPrice: serverPrices.totalPrice,
  });

  const newOrder = await order.save();

  res.status(201).json(newOrder);
});

// @desc     Get order by ID
// @route    GET /api/orders/:id
// @access   Private
export const getOrderByID = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id };

  if (!req.user.isAdmin) {
    filter.user = req.user._id;
  }

  const order = await Order.findOne(filter).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new FriendlyError('Order not found');
  }

  res.json(order);
});

// @desc     Update order to paid
// @route    PATCH /api/orders/:id/pay
// @access   Private
export const updatedOrderToPaid = asyncHandler(async (req, res) => {
  const {
    id,
    status,
    update_time,
    payer: { email_address },
  } = req.body;
  const filter = { _id: req.params.id };

  const update = {
    isPaid: true,
    paidAt: Date.now(),
    paymentResult: { id, status, update_time, email_address },
  };

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, update, {
    new: true,
    lean: true,
  });

  if (!updatedOrder) {
    res.status(404);
    throw new FriendlyError('Order not found');
  }

  res.json(updatedOrder);
});
