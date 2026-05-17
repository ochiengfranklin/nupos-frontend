import { useOfflineStore } from '../../store/offline.store'
import { useSyncQueue } from '../../hooks/useSyncQueue'

export default function OnlineStatus() {
    const { isOnline } = useOfflineStore()
    const { syncQueue, isSyncing, pendingCount } = useSyncQueue()

    if (isOnline && pendingCount === 0 && !isSyncing) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '20px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
            }}>
                <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#16a34a',
                    boxShadow: '0 0 0 2px rgba(22,163,74,0.2)',
                }} />
                <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 500 }}>
          Online
        </span>
            </div>
        )
    }

    if (!isOnline) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '20px',
                background: '#fff7ed', border: '1px solid #fed7aa',
            }}>
                <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#ea580c',
                }} />
                <span style={{ color: '#ea580c', fontSize: '12px', fontWeight: 500 }}>
          Offline {pendingCount > 0 ? `· ${pendingCount} queued` : ''}
        </span>
            </div>
        )
    }

    if (isSyncing) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '20px',
                background: '#eff6ff', border: '1px solid #bfdbfe',
            }}>
                <div style={{
                    width: '12px', height: '12px',
                    border: '2px solid #bfdbfe', borderTopColor: '#2563eb',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 500 }}>
          Syncing {pendingCount} sale{pendingCount !== 1 ? 's' : ''}...
        </span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (pendingCount > 0) {
        return (
            <div
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '20px',
                    background: '#fef9c3', border: '1px solid #fef08a',
                    cursor: 'pointer',
                }}
                onClick={syncQueue}
                title="Click to sync now"
            >
                <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#ca8a04',
                }} />
                <span style={{ color: '#ca8a04', fontSize: '12px', fontWeight: 500 }}>
          {pendingCount} pending · tap to sync
        </span>
            </div>
        )
    }

    return null
}