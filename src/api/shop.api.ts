import api from './axios'
import type {ApiResponse} from '../types'

export const shopApi = {
    getShop: () =>
        api.get<ApiResponse<any>>('/shop'),

    updateShop: (data: {
        name?:          string
        phone?:         string
        email?:         string
        address?:       string
        city?:          string
        country?:       string
        tillNumber?:    string
        taxRate?:       number
        receiptFooter?: string
    }) => api.put<ApiResponse<any>>('/shop', data),
}