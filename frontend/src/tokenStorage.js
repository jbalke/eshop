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
    return !!this.getToken();
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
          this.clearToken();
          resolve(null);
        });
    });
  },

  getToken() {
    return token;
  },

  setToken(_token) {
    token = _token;
  },

  clearToken() {
    token = null;
  },
};

export default tokenStorage;
