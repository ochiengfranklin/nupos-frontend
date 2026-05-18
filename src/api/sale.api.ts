import api from './axios'
import type {ApiResponse, Sale} from '../types';

interface CreateSalePayload {
    items:             { productId: string; quantity: number }[]
    paymentMethod:     'CASH' | 'MPESA' | 'CARD' | 'BANK_TRANSFER'
    customerId?:       string
    discountAmount?:   number
    notes?:            string
    paymentReference?: string
    loyaltyPointsUsed?: number
}

export const saleApi = {
    create: (data: CreateSalePayload) =>
        api.post<ApiResponse<any>>('/sales', data),

    getAll: (params?: {
        page?:          number
        limit?:         number
        startDate?:     string
        endDate?:       string
        paymentMethod?: string
        status?:        string
    }) => api.get<ApiResponse<Sale[]>>('/sales', { params }),

    getById: (id: string) =>
        api.get<ApiResponse<any>>(`/sales/${id}`),

    void: (id: string) =>
        api.patch(`/sales/${id}/void`),
}