import axios from './customAxios.js';

export const createOrder = async (order) => {
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

export const updateOrderToPaid = async ({ id, paymentResult }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      `/api/orders/${id}/pay`,
      paymentResult,
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

export const getMyOrders = async () => {
  try {
    const { data } = await axios.get(`/api/orders/myorders`);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log({ error: error.response.data });
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};
