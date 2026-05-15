import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '../../api/inventory.api'
import { productApi } from '../../api/product.api'
import type {Product} from '../../types'
import { formatDate } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'
import { toast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

//Movement type badge
function MovementBadge({ type }: { type: string }) {
    const map: Record<string, { bg: string; color: string }> = {
        SALE:       { bg: '#fef2f2', color: '#dc2626' },
        RESTOCK:    { bg: '#f0fdf4', color: '#16a34a' },
        ADJUSTMENT: { bg: '#eff6ff', color: '#2563eb' },
        DAMAGE:     { bg: '#fff7ed', color: '#ea580c' },
        RETURN:     { bg: '#fdf4ff', color: '#9333ea' },
    }
    const s = map[type] || { bg: '#f1f5f9', color: '#64748b' }
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
      {type}
    </span>
    )
}

// Adjust stock modal
function AdjustModal({
                         product,
                         onClose,
                         onSuccess,
                     }: {
    product:   Product
    onClose:   () => void
    onSuccess: () => void
}) {
    const [type,     setType]     = useState<'RESTOCK' | 'ADJUSTMENT' | 'DAMAGE' | 'RETURN'>('RESTOCK')
    const [quantity, setQuantity] = useState('')
    const [reason,   setReason]   = useState('')

    const mutation = useMutation({
        mutationFn: () => inventoryApi.adjustStock({
            productId: product.id,
            type,
            quantity:  parseInt(quantity),
            reason,
        }),
        onSuccess: (res) => {
            toast.success(`Stock updated — ${res.data.data?.stockBefore} → ${res.data.data?.stockAfter}`)
            onSuccess()
            onClose()
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to adjust stock'),
    })

    const typeConfig = {
        RESTOCK:    { label: 'Restock',    desc: 'Add stock received from supplier', color: '#16a34a', sign: '+' },
        RETURN:     { label: 'Return',     desc: 'Customer returned item to stock',  color: '#9333ea', sign: '+' },
        ADJUSTMENT: { label: 'Adjustment', desc: 'Correct stock after stock count',  color: '#2563eb', sign: '-' },
        DAMAGE:     { label: 'Damage',     desc: 'Remove damaged or expired stock',  color: '#ea580c', sign: '-' },
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '9px 12px',
        border: '1px solid #e2e8f0', borderRadius: '8px',
        fontSize: '14px', color: '#0f172a', outline: 'none',
        boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
        background: '#fff',
    }

    return (
        <Modal title="Adjust stock" onClose={onClose}>
            {/* Product info */}
            <div style={{
                background: '#f8fafc', borderRadius: '8px',
                padding: '12px 14px', marginBottom: '20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>
                        {product.name}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, fontFamily: 'DM Mono, monospace' }}>
                        {product.sku || '—'}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 2px' }}>Current stock</p>
                    <p style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700, margin: 0 }}>
                        {product.stockQuantity}
                    </p>
                </div>
            </div>

            {/* Type selector */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Adjustment type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {(Object.entries(typeConfig) as [typeof type, typeof typeConfig[typeof type]][]).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setType(key)}
                            style={{
                                padding: '10px 12px', borderRadius: '8px', textAlign: 'left',
                                border: `1.5px solid ${type === key ? config.color : '#e2e8f0'}`,
                                background: type === key ? `${config.color}10` : '#fff',
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}
                        >
                            <p style={{ color: config.color, fontSize: '12px', fontWeight: 700, margin: '0 0 2px' }}>
                                {config.sign} {config.label}
                            </p>
                            <p style={{ color: '#64748b', fontSize: '11px', margin: 0, lineHeight: 1.4 }}>
                                {config.desc}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Quantity *
                </label>
                <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="e.g. 10"
                    autoFocus
                />
                {quantity && (
                    <p style={{ color: '#64748b', fontSize: '12px', margin: '5px 0 0' }}>
                        New stock will be:{' '}
                        <strong style={{ color: '#0f172a' }}>
                            {['RESTOCK', 'RETURN'].includes(type)
                                ? product.stockQuantity + parseInt(quantity || '0')
                                : Math.max(0, product.stockQuantity - parseInt(quantity || '0'))
                            }
                        </strong>
                    </p>
                )}
            </div>

            {/* Reason */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Reason *
                </label>
                <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder={
                        type === 'RESTOCK'    ? 'e.g. Received from supplier — invoice #1234' :
                            type === 'DAMAGE'     ? 'e.g. Found expired during stock count' :
                                type === 'RETURN'     ? 'e.g. Customer returned unopened item' :
                                    'e.g. Stock count correction'
                    }
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{
                    padding: '9px 20px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', background: '#fff',
                    color: '#64748b', fontSize: '14px', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    Cancel
                </button>
                <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending || !quantity || !reason || parseInt(quantity) < 1}
                    style={{
                        padding: '9px 20px', borderRadius: '8px',
                        border: 'none', background: '#2563eb',
                        color: '#fff', fontSize: '14px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        opacity: mutation.isPending || !quantity || !reason ? 0.6 : 1,
                    }}
                >
                    {mutation.isPending ? 'Saving...' : 'Confirm adjustment'}
                </button>
            </div>
        </Modal>
    )
}

// Stock take modal
function StockTakeModal({
                            products: productList,
                            onClose,
                            onSuccess,
                        }: {
    products:  Product[]
    onClose:   () => void
    onSuccess: () => void
}) {
    const [counts, setCounts] = useState<Record<string, string>>({})

    const mutation = useMutation({
        mutationFn: () => {
            const items = Object.entries(counts)
                .filter(([, qty]) => qty !== '')
                .map(([productId, qty]) => ({
                    productId,
                    actualQuantity: parseInt(qty),
                    reason: 'Stock take',
                }))
            return inventoryApi.stockTake(items)
        },
        onSuccess: (res) => {
            const count = res.data.data?.length || 0
            toast.success(`Stock take complete — ${count} products updated`)
            onSuccess()
            onClose()
        },
        onError: () => toast.error('Failed to complete stock take'),
    })

    const changedCount = Object.values(counts).filter(v => v !== '').length

    return (
        <Modal title="Stock take" onClose={onClose} maxWidth={640}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
                Enter the actual physical count for each product. Only products with changed quantities will be updated.
            </p>

            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                        {['Product', 'SKU', 'System qty', 'Actual qty'].map(h => (
                            <th key={h} style={{
                                textAlign: 'left', padding: '10px 12px',
                                color: '#94a3b8', fontSize: '12px', fontWeight: 500,
                                borderBottom: '1px solid #e2e8f0',
                            }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {productList.map(p => {
                        const actual    = counts[p.id]
                        const isDiff    = actual !== '' && actual !== undefined && parseInt(actual) !== p.stockQuantity
                        return (
                            <tr key={p.id} style={{ background: isDiff ? '#fffbeb' : '#fff' }}>
                                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8fafc', fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                                    {p.name}
                                </td>
                                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8fafc', fontSize: '12px', color: '#64748b', fontFamily: 'DM Mono, monospace' }}>
                                    {p.sku || '—'}
                                </td>
                                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8fafc', fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                                    {p.stockQuantity}
                                </td>
                                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f8fafc' }}>
                                    <input
                                        type="number"
                                        min="0"
                                        value={counts[p.id] || ''}
                                        onChange={e => setCounts({ ...counts, [p.id]: e.target.value })}
                                        placeholder={String(p.stockQuantity)}
                                        style={{
                                            width: '80px', padding: '6px 8px',
                                            border: `1.5px solid ${isDiff ? '#f59e0b' : '#e2e8f0'}`,
                                            borderRadius: '6px', fontSize: '13px',
                                            outline: 'none', fontFamily: "'DM Sans', sans-serif",
                                            color: '#0f172a', background: isDiff ? '#fffbeb' : '#fff',
                                        }}
                                    />
                                    {isDiff && (
                                        <span style={{ marginLeft: '6px', fontSize: '11px', color: parseInt(actual) > p.stockQuantity ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                        {parseInt(actual) > p.stockQuantity ? '+' : ''}{parseInt(actual) - p.stockQuantity}
                      </span>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {changedCount} product{changedCount !== 1 ? 's' : ''} with changes
        </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onClose} style={{
                        padding: '9px 20px', borderRadius: '8px',
                        border: '1px solid #e2e8f0', background: '#fff',
                        color: '#64748b', fontSize: '14px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        Cancel
                    </button>
                    <button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending || changedCount === 0}
                        style={{
                            padding: '9px 20px', borderRadius: '8px',
                            border: 'none', background: '#2563eb',
                            color: '#fff', fontSize: '14px', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            opacity: mutation.isPending || changedCount === 0 ? 0.6 : 1,
                        }}
                    >
                        {mutation.isPending ? 'Saving...' : `Apply ${changedCount} change${changedCount !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

//  Main page
export default function InventoryPage() {
    const queryClient  = useQueryClient()
    const { hasRole }  = useAuthStore()
    const canAdjust    = hasRole(['MANAGER', 'STOREKEEPER'])

    const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
    const [showStockTake, setShowStockTake] = useState(false)
    const [activeTab,     setActiveTab]     = useState<'movements' | 'lowstock'>('movements')

    const { data: movementsData, isLoading: movementsLoading } = useQuery({
        queryKey: ['inventory-movements'],
        queryFn:  () => inventoryApi.getMovements().then(r => r.data.data || []),
    })

    const { data: lowStockData, isLoading: lowStockLoading } = useQuery({
        queryKey: ['inventory-lowstock'],
        queryFn:  () => inventoryApi.getLowStock().then(r => r.data.data || []),
    })

    const { data: productsData } = useQuery({
        queryKey: ['products-all'],
        queryFn:  () => productApi.getAll({ limit: 200 }).then(r => r.data.data || []),
    })

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
        queryClient.invalidateQueries({ queryKey: ['inventory-lowstock'] })
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['products-all'] })
    }

    const movements: any[]  = movementsData || []
    const lowStock:  any[]  = lowStockData  || []
    const allProducts: Product[] = productsData || []

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`
        .tab-btn {
          padding: 8px 16px; border-radius: 8px; border: none;
          font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.15s;
          background: transparent; color: #64748b;
        }
        .tab-btn:hover  { background: #f1f5f9; color: #0f172a; }
        .tab-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        tbody tr:hover td { background: #f8fafc; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Inventory
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        Stock movements and adjustments
                    </p>
                </div>
                {canAdjust && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setShowStockTake(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: '#fff', color: '#0f172a',
                                border: '1px solid #e2e8f0', borderRadius: '8px',
                                padding: '10px 18px', fontSize: '14px',
                                fontWeight: 500, cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                            </svg>
                            Stock take
                        </button>
                        <button
                            onClick={() => setAdjustProduct(allProducts[0] || null)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: '#2563eb', color: '#fff',
                                border: 'none', borderRadius: '8px',
                                padding: '10px 18px', fontSize: '14px',
                                fontWeight: 500, cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Adjust stock
                        </button>
                    </div>
                )}
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total products',   value: allProducts.length,                          color: '#2563eb' },
                    { label: 'Low stock items',  value: lowStock.length,                             color: lowStock.length > 0 ? '#dc2626' : '#16a34a' },
                    { label: 'Out of stock',     value: allProducts.filter(p => p.stockQuantity === 0).length, color: '#dc2626' },
                    { label: 'Recent movements', value: movements.length,                            color: '#64748b' },
                ].map(card => (
                    <div key={card.label} style={{
                        background: '#fff', border: '1px solid #e2e8f0',
                        borderRadius: '12px', padding: '18px 20px',
                    }}>
                        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 6px' }}>{card.label}</p>
                        <p style={{ color: card.color, fontSize: '28px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
                <button className={`tab-btn${activeTab === 'movements' ? ' active' : ''}`} onClick={() => setActiveTab('movements')}>
                    Stock movements
                </button>
                <button className={`tab-btn${activeTab === 'lowstock' ? ' active' : ''}`} onClick={() => setActiveTab('lowstock')}>
                    Low stock {lowStock.length > 0 && `(${lowStock.length})`}
                </button>
            </div>

            {/* Movements tab */}
            {activeTab === 'movements' && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    {movementsLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                            <Spinner size={24} />
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading movements...</span>
                        </div>
                    ) : movements.length === 0 ? (
                        <EmptyState title="No stock movements yet" sub="Movements are recorded automatically with every sale and manual adjustment" />
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Product', 'Type', 'Qty change', 'Before', 'After', 'Reason', 'Date'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 500, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {movements.map((m: any) => (
                                <tr key={m.id}>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{m.product?.name || '—'}</p>
                                        <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0, fontFamily: 'DM Mono, monospace' }}>{m.product?.sku || ''}</p>
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <MovementBadge type={m.type} />
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: m.quantity > 0 ? '#16a34a' : '#dc2626', fontSize: '14px', fontWeight: 600 }}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{m.stockBefore}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500 }}>{m.stockAfter}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{m.reason || '—'}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{formatDate(m.createdAt)}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Low stock tab */}
            {activeTab === 'lowstock' && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    {lowStockLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                            <Spinner size={24} />
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</span>
                        </div>
                    ) : lowStock.length === 0 ? (
                        <EmptyState title="All products are well stocked" sub="Products will appear here when stock falls below the low stock threshold" />
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Product', 'SKU', 'In stock', 'Minimum', 'Status', ''].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 500, borderBottom: '1px solid #e2e8f0' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {lowStock.map((p: any) => (
                                <tr key={p.id}>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{p.name}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>{p.sku || '—'}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: p.stockQuantity === 0 ? '#dc2626' : '#ea580c', fontSize: '16px', fontWeight: 700 }}>
                        {p.stockQuantity}
                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{p.lowStockThreshold}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        {p.stockQuantity === 0 ? (
                                            <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
                          Out of stock
                        </span>
                                        ) : (
                                            <span style={{ background: '#fff7ed', color: '#ea580c', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
                          Low stock
                        </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        {canAdjust && (
                                            <button
                                                onClick={() => {
                                                    const product = allProducts.find(pr => pr.id === p.id)
                                                    if (product) setAdjustProduct(product)
                                                }}
                                                style={{
                                                    background: '#eff6ff', color: '#2563eb',
                                                    border: '1px solid #bfdbfe', borderRadius: '6px',
                                                    padding: '5px 12px', fontSize: '12px',
                                                    fontWeight: 500, cursor: 'pointer',
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                Restock
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Adjust modal */}
            {adjustProduct && (
                <AdjustModal
                    product={adjustProduct}
                    onClose={() => setAdjustProduct(null)}
                    onSuccess={refresh}
                />
            )}

            {/* Stock take modal */}
            {showStockTake && (
                <StockTakeModal
                    products={allProducts}
                    onClose={() => setShowStockTake(false)}
                    onSuccess={refresh}
                />
            )}
        </div>
    )
}