import api from './axios'
import type {ApiResponse} from '../types'

export const loyaltyApi = {
    getSettings: () =>
        api.get<ApiResponse<any>>('/loyalty/settings'),

    updateSettings: (data: {
        isEnabled?:            boolean
        pointsPerHundred?:     number
        pointsRedemptionRate?: number
        minimumRedemption?:    number
    }) => api.put<ApiResponse<any>>('/loyalty/settings', data),

    calculatePoints: (amount: number) =>
        api.get<ApiResponse<any>>('/loyalty/calculate', { params: { amount } }),

    getCustomerHistory: (customerId: string) =>
        api.get<ApiResponse<any>>(`/loyalty/customers/${customerId}`),

    adjustPoints: (customerId: string, points: number, note: string) =>
        api.post<ApiResponse<any>>(`/loyalty/customers/${customerId}/adjust`, { points, note }),

    redeemPoints: (customerId: string, points: number) =>
        api.post<ApiResponse<any>>('/loyalty/redeem', { customerId, points }),
}