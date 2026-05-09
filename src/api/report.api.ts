import api from './axios'
import type {ApiResponse} from '../types'

export const reportApi = {
    getDashboard: () =>
        api.get<ApiResponse<any>>('/reports/dashboard'),

    getSalesReport: (startDate: string, endDate: string) =>
        api.get<ApiResponse<any>>('/reports/sales', {
            params: { startDate, endDate },
        }),

    getTopProducts: (params?: {
        startDate?: string
        endDate?: string
        limit?: number
    }) => api.get<ApiResponse<any>>('/reports/products/top', { params }),

    getInventoryReport: () =>
        api.get<ApiResponse<any>>('/reports/inventory'),

    getCashierReport: (params?: {
        startDate?: string
        endDate?: string
    }) => api.get<ApiResponse<any>>('/reports/cashiers', { params }),
}