const express = require('express');
const router = express.Router();

const products = require('../data/products');

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

module.exports = router;
