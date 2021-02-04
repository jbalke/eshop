import axios from 'axios';
import jwt_decode from 'jwt-decode';

let token = null;

const tokenStorage = {
  isTokenExpired() {
    if (!this.getToken()) return true;

    const decoded = jwt_decode(this.getToken());
    return decoded.exp * 1000 <= Date.now();
  },

  isAuthenticated() {
    return token !== null;
  },

  refreshToken() {
    return new Promise((resolve) => {
      axios
        .post('/api/auth/token/refresh')
        .then((response) => {
          token = response.data.token;
          this.setToken(token);
          resolve(token);
        })
        .catch((error) => {
          this.setToken(null);
          resolve(null);
        });
    });
  },

  getToken() {
    return token;
  },

  setToken(_token) {
    token = _token;
    console.info(`token set to ${token}`);
  },

  clearToken() {
    token = null;
    console.info(`token set to ${token}`);
  },
};

export default tokenStorage;
