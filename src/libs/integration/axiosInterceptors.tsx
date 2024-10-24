/* eslint-disable import/named */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { REQ } from "../constants";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
const axiosInterceptors = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInterceptors.interceptors.request.use(
  // @ts-ignore
  async (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInterceptors.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config as CustomAxiosRequestConfig;
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
          Cookies.remove("uid");
          Cookies.remove("user");
          Cookies.remove("theme", { path: "/" });
          Cookies.remove("theme_system", { path: "/" });
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          const navigate = useNavigate();
          navigate("/");
        }
        return axiosInterceptors(originalConfig as AxiosRequestConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error.response);
  }
);

export default axiosInterceptors;
