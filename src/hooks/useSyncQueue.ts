import { useEffect, useCallback } from 'react'
import { useOfflineStore } from '../store/offline.store'
import { saleApi } from '../api/sale.api'
import { toast } from '../components/ui/Toast'

export function useSyncQueue() {
    const {
        isOnline, saleQueue, markSynced,
        markSyncError, clearSynced,
        setIsSyncing, setLastSyncAt,
        isSyncing, getPendingCount,
    } = useOfflineStore()

    const syncQueue = useCallback(async () => {
        const pending = saleQueue.filter(s => !s.synced)
        if (pending.length === 0 || isSyncing) return

        setIsSyncing(true)
        let syncedCount = 0
        let errorCount  = 0

        for (const sale of pending) {
            try {
                await saleApi.create({
                    items:           sale.items.map(i => ({
                        productId: i.productId,
                        quantity:  i.quantity,
                    })),
                    paymentMethod:   sale.paymentMethod as any,
                    customerId:      sale.customerId,
                    discountAmount:  sale.discountAmount,
                    notes:           sale.notes || undefined,
                })
                markSynced(sale.id)
                syncedCount++
            } catch (err: any) {
                const msg = err?.response?.data?.message || 'Sync failed'
                markSyncError(sale.id, msg)
                errorCount++
            }
        }

        setIsSyncing(false)
        setLastSyncAt(new Date().toISOString())
        clearSynced()

        if (syncedCount > 0) {
            toast.success(`${syncedCount} offline sale${syncedCount > 1 ? 's' : ''} synced successfully`)
        }
        if (errorCount > 0) {
            toast.error(`${errorCount} sale${errorCount > 1 ? 's' : ''} failed to sync — check offline queue`)
        }
    }, [saleQueue, isSyncing, markSynced, markSyncError, clearSynced, setIsSyncing, setLastSyncAt])

    // Auto sync when coming back online
    useEffect(() => {
        if (isOnline && getPendingCount() > 0) {
            // Small delay to ensure connection is stable
            const timer = setTimeout(syncQueue, 2000)
            return () => clearTimeout(timer)
        }
    }, [isOnline, syncQueue, getPendingCount])

    return { syncQueue, isSyncing, pendingCount: getPendingCount() }
}