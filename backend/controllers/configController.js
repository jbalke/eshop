import Config from '../models/configModel.js';
import asyncHandler from 'express-async-handler';

export const getPayPalClientId = asyncHandler(async (req, res) => {
  const config = await Config.getSingleton();
  res.send(config.paypalClientId);
});

export const getRates = asyncHandler(async (req, res) => {
  const { taxRate, freeShippingThreshold } = await Config.getSingleton();
  res.json({
    taxRate,
    freeShippingThreshold,
  });
});
