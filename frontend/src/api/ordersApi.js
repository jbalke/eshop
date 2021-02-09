import axios from './customAxios.js';

export const createOrder = (order) => async () => {
  try {
    const { data } = await axios.post('/api/orders', order);
    return data;
  } catch (error) {
    if (error?.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};
