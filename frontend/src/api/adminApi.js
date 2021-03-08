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

export const updateUser = (id) => async ({ name, email, role }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      `/api/users/${id}`,
      { name, email, role },
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

export const getOrders = async () => {
  try {
    const { data } = await axios.get(`/api/orders`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const getUndeliveredOrders = async () => {
  try {
    const { data } = await axios.get(`/api/orders/undelivered`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const upDateOrderToDelivered = async ({ id, deliverDate }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      `/api/orders/${id}/deliver`,
      { deliverDate },
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

export const getStockLevels = async ({ queryKey }) => {
  // eslint-disable-next-line
  const [_key, { keyword = '', page = 1, limit = '12' }] = queryKey;
  try {
    const { data } = await axios.get(`/api/products/stock`, {
      params: { keyword, page, limit },
    });
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};
