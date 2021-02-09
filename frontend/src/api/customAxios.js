import axios from 'axios';
import tokenStorage from '../tokenStorage.js';

const customAxios = axios.create();

let isFetchingAccessToken = false;

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [];

//request interceptor to add the auth token header to requests
customAxios.interceptors.request.use(
  async (config) => {
    let accessToken = tokenStorage.getToken();
    if (accessToken) {
      if (tokenStorage.isTokenExpired()) {
        accessToken = await tokenStorage.refreshToken();
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
    if (isTokenError(error)) {
      return refreshTokenAndRetry(error);
    }

    return Promise.reject(error);
  }
);

// Check error reponses for access token related failures
function isTokenError(error) {
  return (
    ((error.response.status === 401 &&
      error.response.data.message.includes('token')) ||
      error.response.status === 400) &&
    !error.config.url.endsWith('/auth/token/refresh') &&
    !error.config._retry
  );
}

async function refreshTokenAndRetry(error) {
  try {
    const { response: errorResponse } = error;
    // mark operation as being tried so we can prevent infinite loops
    errorResponse.config._retry = true;

    // new promise that will resolve with a retry request once we have a new access token (injected via request interceptor)
    const retryOriginalRequest = new Promise((resolve, reject) => {
      // queue request
      addSubscriber((token) => {
        // if we get a new access token, resolve with new axios request
        // else access is denied
        if (token) {
          resolve(customAxios(errorResponse.config));
        } else {
          reject('access denied');
        }
      });
    });

    // first retry request will attempt to refresh access token and execute subscriber callbacks
    if (!isFetchingAccessToken) {
      isFetchingAccessToken = true;
      const token = await tokenStorage.refreshToken();
      isFetchingAccessToken = false;

      // here we resolve/reject new request promises
      onAccessTokenFetched(token);
    }

    // this promise will either resolve with a new request or reject if we fail to refresh the access token
    return retryOriginalRequest;
  } catch (error) {
    return Promise.reject(error);
  }
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

function onAccessTokenFetched(token) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

export default customAxios;
