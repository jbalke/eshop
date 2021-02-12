import axios from './customAxios.js';

const loginUser = async ({ email, password }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

const registerUser = async ({ name, email, password }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

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
