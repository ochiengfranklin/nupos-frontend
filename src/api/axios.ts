import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/auth.store'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

// Request interceptor — attach access token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor — handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        // If 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = useAuthStore.getState().refreshToken

            if (refreshToken) {
                try {
                    // Attempt to get a new access token
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh`,
                        { refreshToken }
                    )

                    const { accessToken, refreshToken: newRefreshToken } =
                        response.data.data

                    // Save new tokens
                    useAuthStore.getState().setTokens(accessToken, newRefreshToken)

                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return api(originalRequest)
                } catch {
                    // Refresh failed — log out
                    useAuthStore.getState().logout()
                    window.location.href = '/login'
                }
            } else {
                useAuthStore.getState().logout()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default api