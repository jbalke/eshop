import express from 'express';
const router = express.Router();

import products from '../data/products.js';

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: `product with id ${id} not found` });
  }

  res.json(product);
});

export default router;
