import { factory, oneOf, primaryKey } from '@mswjs/data';

export const mockUsers = [
  {
    _id: '1',
    name: 'Alice',
    email: 'alice@home.net',
    password: '123',
    role: 'user',
  },
  {
    _id: '2',
    name: 'Bob',
    email: 'bob@home.net',
    password: '123',
    role: 'user',
  },
  {
    _id: '3',
    name: 'Dennis',
    email: 'dennis@home.net',
    password: '123',
    role: 'user',
  },
];

export const db = factory({
  user: {
    _id: primaryKey(String),
    name: String,
    email: String,
    password: String,
    role: String,
  },
  product: {
    _id: primaryKey(String),
    user: oneOf('user'),
    image: String,
    brand: String,
    category: String,
    description: String,
    // reviews: [],
    rating: Number,
    numReviews: Number,
    price: Number,
    countInStock: Number,
  },
});

mockUsers.forEach((user) => db.user.create(user));
const user = mockUsers[0];

const mockProducts = [
  {
    _id: '1',
    user: user,
    name: 'Product A',
    image: '/images/product_a.png',
    brand: 'Foo',
    category: 'Home',
    description: 'Product A description',
    // reviews: [],
    rating: 1,
    numReviews: 1,
    price: 1000,
    countInStock: 10,
  },
  {
    _id: '2',
    user: user,
    name: 'Product B',
    image: '/images/product_b.png',
    brand: 'Baz',
    category: 'Home',
    description: 'Product B description',
    // reviews: [],
    rating: 1,
    numReviews: 1,
    price: 1000,
    countInStock: 10,
  },
  {
    _id: '3',
    user: user,
    name: 'Product C',
    image: '/images/product_c.png',
    brand: 'Foo',
    category: 'Electronics',
    description: 'Product C description',
    // reviews: [],
    rating: 1,
    numReviews: 1,
    price: 1000,
    countInStock: 10,
  },
  {
    _id: '4',
    user: user,
    name: 'Product D',
    image: '/images/product_a.png',
    brand: 'Baz',
    category: 'Books',
    description: 'Product D description',
    reviews: [],
    rating: 1,
    numReviews: 1,
    price: 1000,
    countInStock: 10,
  },
];

mockProducts.forEach((product) => db.product.create(product));
