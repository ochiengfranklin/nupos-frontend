export type UserRole = 'OWNER' | 'MANAGER' | 'CASHIER' | 'STOREKEEPER'

export interface User {
    id:        string
    name:      string
    email:     string
    role:      UserRole
    isActive:  boolean
    createdAt: string
}

export interface Shop {
    id:   string
    name: string
    slug: string
}

export interface AuthState {
    accessToken:  string | null
    refreshToken: string | null
    user:         User | null
    shop:         Shop | null
}

export interface Product {
    id:                string
    name:              string
    sku:               string | null
    barcode:           string | null
    price:             string
    costPrice:         string
    stockQuantity:     number
    lowStockThreshold: number
    isActive:          boolean
    categoryId:        string | null
    category:          { id: string; name: string } | null
}

export interface Category {
    id:          string
    name:        string
    description: string | null
    isActive:    boolean
}

export interface CartItem {
    product:   Product
    quantity:  number
    subtotal:  number
}

export interface Customer {
    id:         string
    name:       string
    phone:      string | null
    email:      string | null
    totalSpent: string
    isActive:   boolean
}

export interface Sale {
    id:            string
    receiptNumber: string
    totalAmount:   string
    subtotal:      string
    taxAmount:     string
    discountAmount: string
    paymentMethod: string
    status:        string
    cashierId:     string
    customerId:    string | null
    createdAt:     string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data?:   T
    meta?:   PaginationMeta
    errors?: { field: string; message: string }[]
}

export interface PaginationMeta {
    total:      number
    page:       number
    limit:      number
    totalPages: number
}