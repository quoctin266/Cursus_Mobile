import axios from "axios";
import { store } from "../redux/store";
import { getNewToken } from "../services/auth.service";
import { login, logout } from "../redux/slices/auth.slice";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

const instance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const access_token = store?.getState()?.auth?.accessToken;
    config.headers["Authorization"] = "Bearer " + access_token;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response.data ? response.data : response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error.response?.status || 500;
    // we can handle global errors here
    switch (status) {
      // generic api error (server related) unexpected
      case 401: {
        if (error.config.url === "auth/verify-password") {
          if (error.response.data.error === "Incorrect password")
            return error.response.data;
        }

        if (error.config.url !== "auth/login") {
          const refreshToken = store?.getState()?.auth?.refreshToken;
          let res = await getNewToken({ refreshToken });
          if (res.status === 200) {
            const { accessToken } = res.data;

            error.config.headers["Authorization"] = `Bearer ${accessToken}`;

            store.dispatch(login(res.data));

            return Promise.reject(error);
          }
        }

        return error.response?.data ? error.response.data : error;
      }

      case 400: {
        if (error.config.url === "auth/refresh") {
          store.dispatch(logout());
        }
        return error.response?.data ? error.response.data : error;
      }

      default: {
        return error.response?.data ? error.response.data : error;
      }
    }
  }
);

export default instance;
