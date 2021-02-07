import axios from './customAxios.js';

export const loginUser = async ({ email, password }) => {
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

    throw error;
  }
};

export const registerUser = async ({ name, email, password }) => {
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

    throw error;
  }
};

export const userProfile = async () => {
  try {
    const { data } = await axios.get('/api/users/profile');

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const updateUserProfile = async ({ name, email, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      '/api/users/profile',
      { name, email, password },
      config
    );

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const authPing = async () => {
  try {
    const { data } = await axios.get('/api/users/me');

    return data;
  } catch (error) {
    // return { user: null };
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await axios.post('/api/users/logout');

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};
