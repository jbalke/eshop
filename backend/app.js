import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDatabase from './config/db.js';
import helmet from 'helmet';
import colors from 'colors';
import productsRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import configRoutes from './routes/configRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

connectDatabase();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          'https://www.paypal.com',
          'https://www.sandbox.paypal.com',
        ],
        scriptSrc: [
          "'self'",
          'https://www.paypal.com',
          'https://www.google.com',
        ],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        frameSrc: 'https://www.sandbox.paypal.com',
        baseUri: ["'self'"],
      },
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* ROUTES
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth/token', tokenRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/config', configRoutes);

// __dirname is not defined when using es modules with nodejs
// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag/51118243#51118243
const __dirname = (() => {
  let x = path.dirname(decodeURI(new URL(import.meta.url).pathname));
  return path.resolve(process.platform == 'win32' ? x.substr(1) : x);
})();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    const indexFile = path.resolve(__dirname, '../frontend/build/index.html');
    res.sendFile(indexFile);
  });
} else {
  app.get('*', (req, res) => {
    res.send('API is running...');
  });
}

//* ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

export default app;
