import axios from 'axios';

export const getProducts = async () => {
  try {
    const { data } = await axios.get('/api/products');
    return data;
  } catch (error) {
    if (error?.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
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

    throw error;
  }
};
