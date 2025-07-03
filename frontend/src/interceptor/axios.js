import axios from "axios";

let isRefreshing = false;

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const {response: errorResponse, config} = error

    if (config.url.endsWith('/login/creator/') ||
        config.url.endsWith('/login/business/') ||
        config.url.endsWith('/register/creator/') ||
        config.url.endsWith('/register/business/') ||
        config.url.endsWith('/token/refresh/')) {
      return Promise.reject(error);
    }


    if (errorResponse?.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/token/refresh/`,
          {
            refresh: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (refreshResponse.status === 200) {
          const { access: accessNew, refresh: refreshNew } = refreshResponse.data;

          localStorage.setItem("access", accessNew);
          localStorage.setItem("refresh", refreshNew);
          axios.defaults.headers.common.Authorization = `Bearer ${accessNew}`;

          return axios({
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${accessNew}`,
            },
          });
        }
      } catch (refreshError) {
        console.error("Token Refresh Failed:", refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
