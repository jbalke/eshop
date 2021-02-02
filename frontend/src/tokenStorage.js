import axios from './api/customAxios.js';
import jwt_decode from 'jwt-decode';

let token = null;

const tokenStorage = {
  isTokenExpired() {
    if (!this.getToken()) return false;

    const decoded = jwt_decode(this.getToken());

    return decoded.exp * 1000 <= Date.now();
  },

  isAuthenticated() {
    return token !== null;
  },

  getAuthenticationHeader() {
    return {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    };
  },

  refreshToken() {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/auth/token_refresh')
        .then((response) => {
          token = response.data.token;
          this.setToken(token);
          resolve(token);
        })
        .catch((error) => {
          this.clear();
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
