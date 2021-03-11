import axios from './customAxios.js';

export const loginUser = async ({ email, password, token }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/login',
      { email, password, token },
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

export const registerUser = async ({ name, email, password, token }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users',
      { name, email, password, token },
      config
    );

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error?.response?.data?.errors) {
      console.log(error.response.data.errors);
      throw new Error(errorsObjToString(error.response.data.errors));
    }

    throw new Error(error);
  }
};

export const getUserProfile = async () => {
  try {
    const { data } = await axios.get('/api/users/profile');

    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error);
  }
};

export const updateUserProfile = async ({
  name,
  email,
  password,
  newPassword,
}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const { data } = await axios.patch(
      '/api/users/profile',
      { name, email, password, newPassword },
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

function errorsObjToString(error) {
  if (typeof error === 'string') return error;

  if (typeof error === 'object') {
    let message = '';

    for (const field in error) {
      message += `${field}: ${error[field].msg}\n`;
    }

    return message;
  }

  throw new Error('invalid parameter');
}
