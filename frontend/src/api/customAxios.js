import axios from 'axios';
import tokenStorage from '../tokenStorage.js';
import history from 'history/browser';

const customAxios = axios.create({
  // headers: {
  //   'Content-Type': 'appplication/json',
  // },
});

//request interceptor to add the auth token header to requests
customAxios.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getToken();
    if (accessToken) {
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
    // if (
    //   (error.response.status === 401 &&
    //     originalRequest.url.endsWith('/token_refresh')) ||
    //   error.response.status === 400
    // ) {
    //   return Promise.reject(error);
    // }

    if (
      error.response.status === 401 &&
      error.response.data.message.includes('token') &&
      !originalRequest._retry
    ) {
      originalRequest._rety = true;

      return tokenStorage
        .refreshToken()
        .then((token) => {
          console.log(`new token: ${token}`);
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
