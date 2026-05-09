import { create } from 'zustand'
import type {CartItem, Product} from '../types'

interface CartStore {
    items:    CartItem[]
    customerId: string | null

    // Actions
    addItem:       (product: Product) => void
    removeItem:    (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    setCustomer:   (customerId: string | null) => void
    clearCart:     () => void
    getTotal:      () => number
    getItemCount:  () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
    items:      [],
    customerId: null,

    addItem: (product: Product) => {
        const existing = get().items.find((i) => i.product.id === product.id)

        if (existing) {
            // If already in cart — increment quantity
            set((state) => ({
                items: state.items.map((i) =>
                    i.product.id === product.id
                        ? {
                            ...i,
                            quantity: i.quantity + 1,
                            subtotal: (i.quantity + 1) * parseFloat(product.price),
                        }
                        : i
                ),
            }))
        } else {
            // Add new item
            set((state) => ({
                items: [
                    ...state.items,
                    {
                        product,
                        quantity: 1,
                        subtotal: parseFloat(product.price),
                    },
                ],
            }))
        }
    },

    removeItem: (productId: string) => {
        set((state) => ({
            items: state.items.filter((i) => i.product.id !== productId),
        }))
    },

    updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
            get().removeItem(productId)
            return
        }

        set((state) => ({
            items: state.items.map((i) =>
                i.product.id === productId
                    ? {
                        ...i,
                        quantity,
                        subtotal: quantity * parseFloat(i.product.price),
                    }
                    : i
            ),
        }))
    },

    setCustomer: (customerId) => set({ customerId }),

    clearCart: () => set({ items: [], customerId: null }),

    getTotal: () =>
        get().items.reduce((sum, item) => sum + item.subtotal, 0),

    getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
}))