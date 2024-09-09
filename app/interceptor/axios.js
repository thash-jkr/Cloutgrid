import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

let refresh = false;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(
          `http://192.168.1.106:8001/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const { access, refresh: newRefreshToken } = response.data;
          await SecureStore.setItemAsync('access', access);
          await SecureStore.setItemAsync('refresh', newRefreshToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);

