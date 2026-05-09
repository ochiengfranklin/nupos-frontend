import api from './axios'
import type {ApiResponse, Product, Category} from '../types'

export const productApi = {
    getAll: (params?: {
        page?: number
        limit?: number
        search?: string
        categoryId?: string
        lowStock?: boolean
    }) => api.get<ApiResponse<Product[]>>('/products', { params }),

    getById: (id: string) =>
        api.get<ApiResponse<Product>>(`/products/${id}`),

    create: (data: Partial<Product> & { price: number; costPrice: number }) =>
        api.post<ApiResponse<Product>>('/products', data),

    update: (id: string, data: Partial<Product>) =>
        api.put<ApiResponse<Product>>(`/products/${id}`, data),

    delete: (id: string) =>
        api.delete(`/products/${id}`),
}

export const categoryApi = {
    getAll: () =>
        api.get<ApiResponse<Category[]>>('/categories'),

    create: (data: { name: string; description?: string }) =>
        api.post<ApiResponse<Category>>('/categories', data),

    update: (id: string, data: { name?: string; description?: string }) =>
        api.put<ApiResponse<Category>>(`/categories/${id}`, data),

    delete: (id: string) =>
        api.delete(`/categories/${id}`),
}