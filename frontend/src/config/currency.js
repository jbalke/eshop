import currency from 'currency.js';

export const GBP = (value) =>
  currency(value, {
    symbol: '£',
    separator: ',',
    decimal: '.',
    fromCents: true,
  });
