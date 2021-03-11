import users from '../data/users.js';
import products from '../data/products.js';
import config from '../data/config.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Config from '../models/configModel.js';

export const resetTestData = async () => {
  await Order.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  await Config.deleteMany();

  const userData = await users();
  const createdUsers = await User.insertMany(userData);
  const adminUser = createdUsers.find((user) => user.role === 'admin');

  const newProducts = products.map((p) => ({ ...p, user: adminUser }));
  await Product.insertMany(newProducts);

  await Config.create(config);
};
