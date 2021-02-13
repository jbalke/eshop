import axios from './customAxios.js';

export const getUsers = async () => {
  try {
    const { data } = await axios.get('/api/users');

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const getUserDetails = (id) => async () => {
  try {
    const { data } = await axios.get(`/api/users/${id}`);

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const getUserOrders = (id) => async () => {
  try {
    const { data } = await axios.get(`/api/users/${id}/orders`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};
