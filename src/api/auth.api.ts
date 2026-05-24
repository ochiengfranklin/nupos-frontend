import api from './axios'
import type {ApiResponse, User, Shop} from '../types'

interface LoginPayload {
    email:    string
    password: string
    shopSlug: string
}

interface AuthResponse {
    accessToken:  string
    refreshToken: string
    user:         User
    shop:         Shop
}

export const authApi = {
    login: (data: LoginPayload) =>
        api.post<ApiResponse<AuthResponse>>('/auth/login', data),

    loginDemo: () =>
        api.post<ApiResponse<AuthResponse>>('/auth/login', {
            email:    'demo@nupos.app',
            password: 'Demo1234',
            shopSlug: 'demo-minimart',
        }),

    register: (data: {
        shopName:  string
        shopPhone?: string
        name:      string
        email:     string
        password:  string
    }) => api.post<ApiResponse<AuthResponse>>('/auth/register', data),

    getMe: () =>
        api.get<ApiResponse<User>>('/auth/me'),

    forgotPassword: (data: { shopSlug: string; email: string }) =>
        api.post('/auth/forgot-password', data),

    resetPassword: (data: { token: string; newPassword: string }) =>
        api.post('/auth/reset-password', data),

    logout: () =>
        api.post('/auth/logout'),
}