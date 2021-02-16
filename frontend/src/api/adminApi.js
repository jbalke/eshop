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

export const deleteUser = async ({ id }) => {
  try {
    const { data } = await axios.delete(`/api/users/${id}`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const updateUser = (id) => async ({ name, email, isAdmin }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      `/api/users/${id}`,
      { name, email, isAdmin },
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

export const deleteProduct = async ({ id }) => {
  try {
    const { data } = await axios.delete(`/api/products/${id}`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const createProduct = async () => {
  try {
    const { data } = await axios.post(`/api/products`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const updateProduct = (id) => async ({
  name,
  price,
  image,
  brand,
  category,
  countInStock,
  numReviews,
  description,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      `/api/products/${id}`,
      {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        numReviews,
        description,
      },
      config
    );
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};
