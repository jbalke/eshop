import axios from 'axios';
import tokenStorage from '../tokenStorage.js';

const customAxios = axios.create({
  // headers: {
  //   'Content-Type': 'appplication/json',
  // },
});

//request interceptor to add the auth token header to requests
customAxios.interceptors.request.use(
  async (config) => {
    let accessToken = tokenStorage.getToken();
    if (accessToken) {
      if (tokenStorage.isTokenExpired()) {
        try {
          accessToken = await tokenStorage.refreshToken();
        } catch {
          return config;
        }
      }
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor to refresh token on receiving token expired error
customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.endsWith('/token/refresh')) {
      return Promise.reject(error);
    }

    if (
      ((error.response.status === 401 &&
        error.response.data.message.includes('token')) ||
        error.response.status === 400) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      return tokenStorage
        .refreshToken()
        .then((token) => {
          return customAxios(originalRequest);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }

    return Promise.reject(error);
  }
);

export default customAxios;
