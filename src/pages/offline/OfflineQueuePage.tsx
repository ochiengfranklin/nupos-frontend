import { useOfflineStore } from '../../store/offline.store'
import { useSyncQueue } from '../../hooks/useSyncQueue'
import { formatCurrency } from '../../utils/helpers'

export default function OfflineQueuePage() {
    const { saleQueue, clearSynced, isOnline } = useOfflineStore()
    const { syncQueue, isSyncing, pendingCount } = useSyncQueue()

    const synced  = saleQueue.filter(s => s.synced)

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '900px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Offline queue
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        Sales recorded while offline
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {synced.length > 0 && (
                        <button
                            onClick={clearSynced}
                            style={{
                                padding: '9px 16px', borderRadius: '8px',
                                border: '1px solid #e2e8f0', background: '#fff',
                                color: '#64748b', fontSize: '14px', cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Clear synced
                        </button>
                    )}
                    {pendingCount > 0 && isOnline && (
                        <button
                            onClick={syncQueue}
                            disabled={isSyncing}
                            style={{
                                padding: '9px 16px', borderRadius: '8px',
                                border: 'none', background: '#2563eb',
                                color: '#fff', fontSize: '14px', fontWeight: 500,
                                cursor: isSyncing ? 'not-allowed' : 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                                opacity: isSyncing ? 0.7 : 1,
                            }}
                        >
                            {isSyncing ? 'Syncing...' : `Sync ${pendingCount} sale${pendingCount !== 1 ? 's' : ''}`}
                        </button>
                    )}
                </div>
            </div>

            {saleQueue.length === 0 ? (
                <div style={{
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: '12px', padding: '60px',
                    textAlign: 'center',
                }}>
                    <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 6px' }}>No offline sales</p>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0 }}>
                        Sales made while offline will appear here and sync automatically
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {saleQueue.map(sale => (
                        <div key={sale.id} style={{
                            background: '#fff', border: `1px solid ${sale.syncError ? '#fecaca' : sale.synced ? '#bbf7d0' : '#e2e8f0'}`,
                            borderRadius: '12px', padding: '20px 24px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>
                      OFFLINE-{sale.id.slice(0, 8).toUpperCase()}
                    </span>
                                        {sale.synced ? (
                                            <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
                        Synced ✓
                      </span>
                                        ) : sale.syncError ? (
                                            <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
                        Failed
                      </span>
                                        ) : (
                                            <span style={{ background: '#fff7ed', color: '#ea580c', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
                        Pending
                      </span>
                                        )}
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                                        {new Date(sale.createdAt).toLocaleString('en-KE')}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 2px' }}>
                                        {formatCurrency(sale.totalAmount)}
                                    </p>
                                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                                        {sale.paymentMethod}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {sale.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: '#64748b' }}>{item.name} × {item.quantity}</span>
                                        <span style={{ color: '#0f172a' }}>{formatCurrency(parseFloat(item.price) * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Sync error */}
                            {sale.syncError && (
                                <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px' }}>
                                    <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>Error: {sale.syncError}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}