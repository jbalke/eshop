import axios from 'axios';
import tokenStorage from '../tokenStorage.js';

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
    console.log(originalRequest);

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/users/login'
    ) {
      originalRequest._rety = true;

      return axios
        .post(`/api/auth/token_refresh`)
        .then((res) => {
          if (res.status === 201) {
            tokenStorage.setToken(res.data.token);
            customAxios.defaults.headers[
              'Authorization'
            ] = `Bearer ${tokenStorage.getToken()}`;
            console.log('Tokens refreshed');
            return axios(originalRequest);
          }
        })
        .catch((error) => {
          tokenStorage.clear();
          return Promise.reject(error);
        });
    }

    return Promise.reject(error);
  }
);

export default customAxios;
