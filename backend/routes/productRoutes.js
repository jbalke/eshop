import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.find({}, null, { lean: true });
    res.json(allProducts);
  } catch (error) {
    return res.status(500).json({ error: `cannot retrieve products` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id, null, { lean: true });

    if (!product) {
      return res.status(404).json({ error: `product with id ${id} not found` });
    }
    res.json(product);
  } catch (error) {
    return res.status(400).json({ error: `invalid product id: ${id}` });
  }
});

export default router;
