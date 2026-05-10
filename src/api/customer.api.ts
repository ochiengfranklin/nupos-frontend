import api from './axios'
import type {ApiResponse, Customer} from '../types';

export const customerApi = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
        api.get<ApiResponse<Customer[]>>('/customers', { params }),

    getById: (id: string) =>
        api.get<ApiResponse<Customer>>(`/customers/${id}`),

    getWithHistory: (id: string) =>
        api.get<ApiResponse<any>>(`/customers/${id}/history`),

    create: (data: { name: string; phone?: string; email?: string }) =>
        api.post<ApiResponse<Customer>>('/customers', data),

    update: (id: string, data: { name?: string; phone?: string; email?: string }) =>
        api.put<ApiResponse<Customer>>(`/customers/${id}`, data),

    deactivate: (id: string) =>
        api.patch(`/customers/${id}/deactivate`),
}