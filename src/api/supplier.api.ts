import api from './axios'
import type {ApiResponse} from '../types';

export const supplierApi = {
    // Suppliers
    getAll: () =>
        api.get<ApiResponse<any[]>>('/suppliers'),

    getById: (id: string) =>
        api.get<ApiResponse<any>>(`/suppliers/${id}`),

    create: (data: {
        name: string; contact?: string; phone?: string
        email?: string; address?: string; notes?: string
    }) => api.post<ApiResponse<any>>('/suppliers', data),

    update: (id: string, data: Partial<{
        name: string; contact: string; phone: string
        email: string; address: string; notes: string
    }>) => api.put<ApiResponse<any>>(`/suppliers/${id}`, data),

    delete: (id: string) =>
        api.delete(`/suppliers/${id}`),

    // Purchase orders
    getAllOrders: () =>
        api.get<ApiResponse<any[]>>('/suppliers/orders'),

    getOrderById: (id: string) =>
        api.get<ApiResponse<any>>(`/suppliers/orders/${id}`),

    createOrder: (data: {
        supplierId?: string
        notes?:      string
        items:       { productId: string; quantity: number; unitCost: number }[]
    }) => api.post<ApiResponse<any>>('/suppliers/orders', data),

    markAsOrdered: (id: string) =>
        api.patch(`/suppliers/orders/${id}/order`),

    receiveOrder: (id: string, data: {
        items: { purchaseOrderItemId: string; receivedQty: number }[]
        notes?: string
    }) => api.patch(`/suppliers/orders/${id}/receive`, data),

    cancelOrder: (id: string) =>
        api.patch(`/suppliers/orders/${id}/cancel`),
}