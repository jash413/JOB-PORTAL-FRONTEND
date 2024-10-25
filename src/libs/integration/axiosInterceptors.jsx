import axios from "axios"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { REQ } from "../constants";

const axiosInterceptors = axios.create({
    baseURL: process.env.GATSBY_API_URL
})

axiosInterceptors.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInterceptors.interceptors.response.use(
    (response) => {
        return response.data
    },
    async (error) => {
        const originalConfig = error.config
        const accessToken = Cookies.get("refreshToken")
        if (error.response && error.response.status === 401 && !originalConfig._retry && localStorage.getItem("token")) {
            originalConfig._retry = true
            try {
                const response = await axiosInterceptors.post(`${REQ.REFRESH_TOKEN}`, {
                    refreshToken: accessToken,
                })
                if (response.status) {
                    const newAccessToken = response.data.token
                    const newRefreshToken = response.data.refreshToken
                    Cookies.set("token", newAccessToken, { expires: 60 })
                    Cookies.set("refreshToken", newRefreshToken, { expires: 60 })
                }
                if (response.status === 417) {
                    Cookies.remove("uid")
                    Cookies.remove("user")
                    Cookies.remove("theme", { path: "/" })
                    Cookies.remove("theme_system", { path: "/" })
                    Cookies.remove("token")
                    Cookies.remove("refreshToken")
                    const navigate = useNavigate()
                    navigate("/")
                }
                return axiosInterceptors(originalConfig)
            } catch (_error) {
                return Promise.reject(_error)
            }
        }
        return Promise.reject(error.response)
    }
)

export default axiosInterceptors
