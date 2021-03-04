import express from 'express';
import {
  getPayPalClientId,
  getRates,
} from '../controllers/configController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/paypal', requireAuth, getPayPalClientId);
router.get('/rates', getRates);

export default router;
