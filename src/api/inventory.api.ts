import api from './axios'
import type {ApiResponse} from '../types'

export const inventoryApi = {
    getMovements: (productId?: string) =>
        api.get<ApiResponse<any[]>>('/inventory/movements', {
            params: productId ? { productId } : undefined,
        }),

    getLowStock: () =>
        api.get<ApiResponse<any[]>>('/inventory/low-stock'),

    adjustStock: (data: {
        productId: string
        type:      'RESTOCK' | 'ADJUSTMENT' | 'DAMAGE' | 'RETURN'
        quantity:  number
        reason:    string
    }) => api.post<ApiResponse<any>>('/inventory/adjust', data),

    stockTake: (items: {
        productId:      string
        actualQuantity: number
        reason?:        string
    }[]) => api.post<ApiResponse<any>>('/inventory/stock-take', { items }),
}