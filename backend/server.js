import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import connectDatabase from './config/db.js';
import helmet from 'helmet';
import colors from 'colors';
import productsRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

connectDatabase();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//* ROUTES
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth/token', tokenRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// __dirname is not defined when using es modules with nodejs
// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag/51118243#51118243
const __dirname = (() => {
  let x = path.dirname(decodeURI(new URL(import.meta.url).pathname));
  return path.resolve(process.platform == 'win32' ? x.substr(1) : x);
})();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//* ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 9999;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
