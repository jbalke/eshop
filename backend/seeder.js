import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDatabase from './config/db.js';

dotenv.config();
connectDatabase();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const usersData = await users();
    const createdUsers = await User.insertMany(usersData);
    const adminUser = await createdUsers.find((user) => user.role === 'admin');

    const newProducts = products.map((p) => ({ ...p, user: adminUser }));
    await Product.insertMany(newProducts);

    console.log(`Data Imported!`.green);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
  }
};

const purgeData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log(`Data Purged!`.red);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
  }
};

if (process.argv[2] === '-p') {
  purgeData();
} else {
  importData();
}
