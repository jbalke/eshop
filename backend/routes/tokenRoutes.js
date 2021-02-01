import express from 'express';
import { refreshTokenHandler } from '../controllers/tokenHandlers.js';

const router = express.Router();

router.route('/').post(refreshTokenHandler);

export default router;
