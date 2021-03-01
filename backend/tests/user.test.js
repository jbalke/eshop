import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { resetTestData } from './test-seeder';
import { jest } from '@jest/globals';

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '654321',
};
const userOneToken = jwt.sign(
  { user: { _id: userOneId, isAdmin: false }, tokenVersion: 0 },
  process.env.ACCESS_TOKEN_SECRET
);

beforeAll(async () => {
  await resetTestData();
  await new User(userOne).save();
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe('a new user', () => {
  test('should sign up and get access and refresh tokens', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        name: 'test user 1',
        password: '654321',
        email: 'user1@test.com',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect(
        'set-cookie',
        new RegExp(`^${process.env.COOKIE_NAME}=.*Expires=`)
      );

    // Assert that a user object and token is returned
    expect(response.body).toMatchObject({
      user: {
        name: 'test user 1',
        email: 'user1@test.com',
      },
      token: expect.any(String),
    });

    // Assert that new user is saved to the DB
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
  });

  test('should not signup with existing email address', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        name: 'test user 2',
        password: '654321',
        email: 'user1@test.com',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message: expect.any(String),
    });
  });

  test('should not signup without an email address', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        name: 'test user 2',
        password: '654321',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message: expect.any(String),
    });
  });

  test('should not signup without a password', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        name: 'test user 2',
        email: 'user2@test.com',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message: expect.any(String),
    });
  });
});

describe('an existing user', () => {
  test('should log in and and get access and refresh tokens', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(
        'set-cookie',
        new RegExp(`^${process.env.COOKIE_NAME}=.*Expires=`)
      );

    // Assert that a user object and token is returned
    expect(response.body).toMatchObject({
      user: {
        name: userOne.name,
        email: userOne.email,
      },
      token: expect.any(String),
    });
  });

  test('should fail to log in with wrong password', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: userOne.email,
        password: 'bad password',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message: expect.any(String),
    });
  });

  test('should get profile', async () => {
    await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userOneToken}`)
      .set('Accept', 'application/json')
      .send()
      .expect(200);
  });

  test('should not get profile if unauthenticated', async () => {
    await request(app).get('/api/users/profile').send().expect(401);
  });

  test('should get list of products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${userOneToken}`)
      .set('Accept', 'application/json')
      .send()
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      matchedProducts: expect.any(Number),
      pages: expect.any(Number),
      products: expect.any(Array),
    });
  });

  test('should be able to place an order', async () => {
    const itemToOrder = await Product.findOne(
      { countInStock: { $gt: 0 }, price: { $lt: 100 } },
      null,
      { lean: true }
    );

    const taxPrice = Math.round(itemToOrder.price * 15) / 100;
    const shippingPrice = 100;

    const order = {
      orderItems: [
        {
          name: itemToOrder.name,
          image: itemToOrder.image,
          price: itemToOrder.price,
          product: itemToOrder._id.toString(),
          qty: 1,
        },
      ],
      shippingAddress: {
        name: 'Mike',
        address: '10 Holland Drive',
        city: 'Brisbane',
        postCode: '4160',
        country: 'Australia',
      },
      paymentMethod: 'paypal',
      itemsPrice: itemToOrder.price,
      taxPrice,
      shippingPrice,
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userOneToken}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(order)
      .expect(201)
      .expect('Content-Type', /json/);

    const savedOrder = await Order.findById(response.body._id).lean();
    expect(savedOrder).not.toBeNull();

    delete order.itemsPrice;

    const expectedOrder = {
      ...order,
      user: userOneId.toString(),
      totalPrice: itemToOrder.price + shippingPrice + taxPrice,
    };
    expect(response.body).toMatchObject(expectedOrder);
  });

  test('should not be able to place an order if unauthenticated', async () => {
    const order = {};

    const response = await request(app)
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(order)
      .expect(401);
  });
});
