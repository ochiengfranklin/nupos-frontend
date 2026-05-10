import api from './axios'
import type {ApiResponse, User} from '../types';

export const userApi = {
    getAll: () =>
        api.get<ApiResponse<User[]>>('/users'),

    getById: (id: string) =>
        api.get<ApiResponse<User>>(`/users/${id}`),

    create: (data: { name: string; email: string; password: string; role: string }) =>
        api.post<ApiResponse<User>>('/users', data),

    update: (id: string, data: { name?: string; role?: string }) =>
        api.put<ApiResponse<User>>(`/users/${id}`, data),

    deactivate: (id: string) =>
        api.patch(`/users/${id}/deactivate`),

    reactivate: (id: string) =>
        api.patch(`/users/${id}/reactivate`),

    resetPassword: (id: string, newPassword: string) =>
        api.patch(`/users/${id}/reset-password`, { newPassword }),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.patch('/users/me/password', data),
}