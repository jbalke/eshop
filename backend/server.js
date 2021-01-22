import express from 'express';
import helmet from 'helmet';
import productsRoutes from './routes/products.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(helmet());

// ROUTES
app.use('/api/products', productsRoutes);

const PORT = process.env.PORT || 9999;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
