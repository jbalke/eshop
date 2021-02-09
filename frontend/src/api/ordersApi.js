import axios from './customAxios.js';

export const createOrder = (order) => async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const { data } = await axios.post('/api/orders', order, config);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const getOrderDetails = (id) => async () => {
  try {
    const { data } = await axios.get(`/api/orders/${id}`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};
