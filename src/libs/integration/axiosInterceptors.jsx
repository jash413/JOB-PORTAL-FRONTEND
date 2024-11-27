import axios from "axios";
import { navigate } from "gatsby";
import Cookies from "js-cookie";
import { REQ } from "../constants";

const axiosInterceptors = axios.create({
  baseURL: process.env.GATSBY_API_URL,
});

axiosInterceptors.interceptors.request.use(
  async (config) => {
    let token =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptors.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalConfig = error.config;
    const accessToken = Cookies.get("refreshToken");
    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig._retry &&
      localStorage.getItem("token")
    ) {
      originalConfig._retry = true;
      try {
        const response = await axiosInterceptors.post(`${REQ.REFRESH_TOKEN}`, {
          refreshToken: accessToken,
        });
        if (response.status) {
          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;
          Cookies.set("token", newAccessToken, { expires: 60 });
          Cookies.set("refreshToken", newRefreshToken, { expires: 60 });
        }
        if (response.status === 417) {
          localStorage.setItem("authToken", null);
          localStorage.setItem("user", null);
          navigate("/");
        }
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/");
        }
        return axiosInterceptors(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "Invalid token"
    ) {
      localStorage.setItem("authToken", null);
      localStorage.setItem("user", null);
      navigate("/");
    }
    return Promise.reject(error.response);
  }
);

export default axiosInterceptors;
