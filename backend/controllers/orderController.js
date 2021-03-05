import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Config from '../models/configModel.js';
import asyncHandler from 'express-async-handler';
import { FriendlyError } from '../errors/errors.js';
import { ROLE, hasRoles } from '../permissions/roles.js';
import currency from 'currency.js';

const SHIPPING_COST = 10000;

const calcOrderPrices = async (items) => {
  const { taxRate, freeShippingThreshold } = await Config.getSingleton();

  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const taxPrice = (itemsPrice * taxRate) / 100;
  const shippingPrice = itemsPrice >= freeShippingThreshold ? 0 : SHIPPING_COST;

  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: itemsPrice + taxPrice + shippingPrice,
  };
};

const buildOrder = async (clientOrder) => {
  const orderedItems = [];

  for (const orderItem of clientOrder) {
    const item = await Product.findById(orderItem.product).lean();

    if (!item) {
      throw new FriendlyError('Unable to fulfill your order');
    }

    item.qty = orderItem.qty;
    orderedItems.push(item);
  }

  return orderedItems;
};

const updateStockQty = async (orderItems) => {
  const results = await Promise.allSettled(
    orderItems.map((item) => {
      return Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: -item.qty } },
        { new: true, rawResult: true }
      );
    })
  );

  results.forEach(
    (result) =>
      result.status === 'rejected' &&
      console.error(`Stock Update Rejected: ${result.reason}`)
  );
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
  const serverPrices = await calcOrderPrices(serverOrder);

  if (serverPrices.totalPrice !== itemsPrice + taxPrice + shippingPrice) {
    console.log({
      serverTotal: serverPrices.totalPrice,
      itemsPrice,
      taxPrice,
      shippingPrice,
    });
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
    totalPrice: currency(serverPrices.totalPrice).intValue,
  });

  const newOrder = await order.save();

  res.status(201).json(newOrder);
});

// @desc     Get order by ID
// @route    GET /api/orders/:id
// @access   Private
export const getOrderByID = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id };

  if (!hasRoles(req.user, [ROLE.ADMIN, ROLE.MANAGER])) {
    filter.user = req.user._id;
  }

  const order = await Order.findOne(filter).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new FriendlyError('Order not found');
  }

  res.json(order);
});

// @desc     Get orders for user
// @route    GET /api/orders/myorders
// @access   Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };

  const orders = await Order.find(filter);

  res.json(orders);
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user');

  res.json(orders);
});

// @desc     Get undelivered orders
// @route    GET /api/orders/undelivered
// @access   Admin
export const getUndeliveredOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isDelivered: false }).populate('user');

  res.json(orders);
});

// @desc     Update order to paid
// @route    PATCH /api/orders/:id/pay
// @access   Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const {
    id,
    status,
    update_time,
    payer: { email_address },
  } = req.body;

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

  updateStockQty(updatedOrder.orderItems);

  res.json(updatedOrder);
});

// @desc     Update order to delivered
// @route    PATCH /api/orders/:id/deliver
// @access   Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deliverDate = Date.now() } = req.body;

  if (deliverDate > Date.now()) {
    res.status(400);
    throw new FriendlyError('Deliver date can not be in the future');
  }

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new FriendlyError('Order not found');
  }

  if (deliverDate < order.paidAt) {
    res.status(400);
    throw new FriendlyError('Deliver date can not be before paid date');
  }

  order.isDelivered = true;
  order.deliveredAt = deliverDate;

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});
