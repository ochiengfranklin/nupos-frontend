import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {Product} from '../types'

export interface OfflineSale {
    id:              string
    items:           { productId: string; quantity: number; name: string; price: string }[]
    paymentMethod:   string
    discountAmount:  number
    notes:           string
    customerId?:     string
    totalAmount:     number
    createdAt:       string
    synced:          boolean
    syncError?:      string
}

interface OfflineStore {
    isOnline:       boolean
    cachedProducts: Product[]
    saleQueue:      OfflineSale[]
    lastSyncAt:     string | null
    isSyncing:      boolean

    setOnline:        (online: boolean) => void
    cacheProducts:    (products: Product[]) => void
    addToQueue:       (sale: OfflineSale) => void
    markSynced:       (id: string) => void
    markSyncError:    (id: string, error: string) => void
    clearSynced:      () => void
    setIsSyncing:     (val: boolean) => void
    setLastSyncAt:    (val: string) => void
    getPendingCount:  () => number
}

export const useOfflineStore = create<OfflineStore>()(
    persist(
        (set, get) => ({
            isOnline:       true,
            cachedProducts: [],
            saleQueue:      [],
            lastSyncAt:     null,
            isSyncing:      false,

            setOnline:     (online) => set({ isOnline: online }),
            cacheProducts: (products) => set({ cachedProducts: products }),
            setIsSyncing:  (val) => set({ isSyncing: val }),
            setLastSyncAt: (val) => set({ lastSyncAt: val }),

            addToQueue: (sale) => set(state => ({
                saleQueue: [...state.saleQueue, sale],
            })),

            markSynced: (id) => set(state => ({
                saleQueue: state.saleQueue.map(s =>
                    s.id === id ? { ...s, synced: true, syncError: undefined } : s
                ),
            })),

            markSyncError: (id, error) => set(state => ({
                saleQueue: state.saleQueue.map(s =>
                    s.id === id ? { ...s, syncError: error } : s
                ),
            })),

            clearSynced: () => set(state => ({
                saleQueue: state.saleQueue.filter(s => !s.synced),
            })),

            getPendingCount: () =>
                get().saleQueue.filter(s => !s.synced).length,
        }),
        {
            name: 'pos-offline',
            partialize: (state) => ({
                cachedProducts: state.cachedProducts,
                saleQueue:      state.saleQueue,
                lastSyncAt:     state.lastSyncAt,
            }),
        }
    )
)