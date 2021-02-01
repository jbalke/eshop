import axios from 'axios';

let token = null;

const tokenStorage = {
  isAuthenticated() {
    return token !== null;
  },

  refreshToken() {
    return new Promise((resolve, reject) => {
      axios
        .post('/token_refresh')
        .then((response) => {
          token = response.data.token;
          resolve(token);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getToken() {
    return token;
  },

  setToken(_token) {
    token = _token;
  },

  clear() {
    token = null;
  },
};

export default tokenStorage;
