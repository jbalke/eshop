import axios from './customAxios.js';

export const getProducts = async () => {
  try {
    const { data } = await axios.get('/api/products');
    return data;
  } catch (error) {
    if (error?.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const getProduct = (id) => async () => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  } catch (error) {
    if (error?.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const reviewProduct = (id) => async ({ rating, comment }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.post(
      `/api/products/${id}/reviews`,
      { rating, comment },
      config
    );
    return data;
  } catch (error) {
    if (error?.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};
