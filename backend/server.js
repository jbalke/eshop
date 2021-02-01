import express from 'express';
import cookieParser from 'cookie-parser';
import connectDatabase from './config/db.js';
import helmet from 'helmet';
import colors from 'colors';
import productsRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

connectDatabase();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//* PUBLIC ROUTES
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth/token_refresh', tokenRoutes);

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
