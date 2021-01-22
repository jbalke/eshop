const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const productsRoutes = require('./routes/products');

const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(cors());

// ROUTES
app.use('/api/products', productsRoutes);

app.listen(5000, console.log(`Server listening on port: 5000`));
