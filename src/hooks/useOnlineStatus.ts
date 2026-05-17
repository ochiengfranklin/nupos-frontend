import { useEffect } from 'react'
import { useOfflineStore } from '../store/offline.store'
import { useQueryClient } from '@tanstack/react-query'

export function useOnlineStatus() {
    const { setOnline, isOnline } = useOfflineStore()
    const queryClient             = useQueryClient()

    useEffect(() => {
        const handleOnline = () => {
            setOnline(true)
            // Refetch all queries when coming back online
            queryClient.invalidateQueries()
        }
        const handleOffline = () => {
            setOnline(false)
        }

        // Set initial state
        setOnline(navigator.onLine)

        window.addEventListener('online',  handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online',  handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [setOnline, queryClient])

    return isOnline
}