import express from 'express';
import connectDatabase from './config/db.js';
import helmet from 'helmet';
import colors from 'colors';
import productsRoutes from './routes/productRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

connectDatabase();
const app = express();

// MIDDLEWARE
app.use(helmet());

// ROUTES
app.use('/api/products', productsRoutes);

const PORT = process.env.PORT || 9999;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
