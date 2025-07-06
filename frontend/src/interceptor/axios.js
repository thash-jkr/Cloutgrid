import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const { response: errorResponse, config } = error;

    const skipRefreshEndpoints = [
      "/login/creator/",
      "/login/business/",
      "/register/creator/",
      "/register/business/",
      "/token/refresh/",
    ];
    if (skipRefreshEndpoints.some((url) => config.url.endsWith(url))) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (errorResponse?.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              config.headers["Authorization"] = "Bearer " + token;
              resolve(axios(config));
            },
            reject: (err) => reject(err),
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { access: newAccessToken, refresh: newRefreshToken } = refreshResponse.data;

        localStorage.setItem("access", newAccessToken);
        localStorage.setItem("refresh", newRefreshToken);

        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(config);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
