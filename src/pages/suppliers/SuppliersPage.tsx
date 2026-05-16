import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierApi } from '../../api/supplier.api'
import { productApi } from '../../api/product.api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { toast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

// Status badge
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { bg: string; color: string }> = {
        DRAFT:     { bg: '#f1f5f9', color: '#64748b' },
        ORDERED:   { bg: '#eff6ff', color: '#2563eb' },
        RECEIVED:  { bg: '#f0fdf4', color: '#16a34a' },
        CANCELLED: { bg: '#fef2f2', color: '#dc2626' },
    }
    const s = map[status] || { bg: '#f1f5f9', color: '#64748b' }
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
      {status}
    </span>
    )
}

//   Input style
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
    background: '#fff',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {label}
            </label>
            {children}
        </div>
    )
}

// Supplier form
function SupplierForm({
                          form, onChange, onSubmit, onClose, loading, isEdit,
                      }: {
    form:     any
    onChange: (f: any) => void
    onSubmit: () => void
    onClose:  () => void
    loading:  boolean
    isEdit:   boolean
}) {
    const set = (key: string, val: string) => onChange({ ...form, [key]: val })
    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Supplier name *">
                        <input style={inputStyle} value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="e.g. Bidco Africa" autoFocus />
                    </Field>
                </div>
                <Field label="Contact person">
                    <input style={inputStyle} value={form.contact || ''} onChange={e => set('contact', e.target.value)} placeholder="e.g. John Mwangi" />
                </Field>
                <Field label="Phone">
                    <input style={inputStyle} value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="07XXXXXXXX" />
                </Field>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Email">
                        <input style={inputStyle} type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="supplier@email.com" />
                    </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Address">
                        <input style={inputStyle} value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="e.g. Industrial Area, Nairobi" />
                    </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Notes">
                        <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes" />
                    </Field>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button onClick={onSubmit} disabled={loading || !form.name} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: loading || !form.name ? 0.6 : 1 }}>
                    {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Add supplier'}
                </button>
            </div>
        </>
    )
}

//  Create purchase order modal
function CreateOrderModal({
                              suppliers, onClose, onSuccess,
                          }: {
    suppliers: any[]
    onClose:   () => void
    onSuccess: () => void
}) {
    const [supplierId, setSupplierId] = useState('')
    const [notes,      setNotes]      = useState('')
    const [items,      setItems]      = useState([{ productId: '', quantity: 1, unitCost: 0 }])

    const { data: productsData } = useQuery({
        queryKey: ['products-all'],
        queryFn:  () => productApi.getAll({ limit: 500 }).then(r => r.data.data || []),
    })
    const allProducts = productsData || []

    const mutation = useMutation({
        mutationFn: () => supplierApi.createOrder({
            supplierId: supplierId || undefined,
            notes:      notes      || undefined,
            items:      items.filter(i => i.productId).map(i => ({
                productId: i.productId,
                quantity:  i.quantity,
                unitCost:  i.unitCost,
            })),
        }),
        onSuccess: () => {
            toast.success('Purchase order created')
            onSuccess()
            onClose()
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create order'),
    })

    const addItem     = () => setItems([...items, { productId: '', quantity: 1, unitCost: 0 }])
    const removeItem  = (i: number) => setItems(items.filter((_, idx) => idx !== i))
    const updateItem  = (i: number, key: string, val: any) =>
        setItems(items.map((item, idx) => idx === i ? { ...item, [key]: val } : item))

    const total = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0)
    const validItems = items.filter(i => i.productId)

    return (
        <Modal title="New purchase order" onClose={onClose} maxWidth={640}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Field label="Supplier">
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                        <option value="">No supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </Field>
                <Field label="Notes">
                    <input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional" />
                </Field>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Items *
                    </label>
                    <button onClick={addItem} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        + Add item
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 32px', gap: '8px' }}>
                        {['Product', 'Qty', 'Unit cost', ''].map(h => (
                            <span key={h} style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>{h}</span>
                        ))}
                    </div>
                    {items.map((item, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 32px', gap: '8px', alignItems: 'center' }}>
                            <select
                                style={{ ...inputStyle, padding: '7px 10px' }}
                                value={item.productId}
                                onChange={e => {
                                    const product = allProducts.find((p: any) => p.id === e.target.value)
                                    updateItem(i, 'productId', e.target.value)
                                    if (product) updateItem(i, 'unitCost', parseFloat(product.costPrice) || 0)
                                }}
                            >
                                <option value="">Select product</option>
                                {allProducts.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input
                                style={{ ...inputStyle, padding: '7px 10px' }}
                                type="number" min="1"
                                value={item.quantity}
                                onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                            />
                            <input
                                style={{ ...inputStyle, padding: '7px 10px' }}
                                type="number" min="0" step="0.01"
                                value={item.unitCost}
                                onChange={e => updateItem(i, 'unitCost', parseFloat(e.target.value) || 0)}
                            />
                            <button
                                onClick={() => removeItem(i)}
                                disabled={items.length === 1}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', opacity: items.length === 1 ? 0.3 : 1 }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Total order value</span>
                <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700 }}>{formatCurrency(total)}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending || validItems.length === 0}
                    style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: mutation.isPending || validItems.length === 0 ? 0.6 : 1 }}
                >
                    {mutation.isPending ? 'Creating...' : 'Create order'}
                </button>
            </div>
        </Modal>
    )
}

// Receive order modal
function ReceiveOrderModal({
                               order, onClose, onSuccess,
                           }: {
    order:     any
    onClose:   () => void
    onSuccess: () => void
}) {
    const [receivedQtys, setReceivedQtys] = useState<Record<string, string>>(
        Object.fromEntries(order.items.map((i: any) => [i.id, String(i.quantity - i.receivedQty)]))
    )
    const [notes, setNotes] = useState('')

    const mutation = useMutation({
        mutationFn: () => supplierApi.receiveOrder(order.id, {
            items: order.items.map((i: any) => ({
                purchaseOrderItemId: i.id,
                receivedQty:         parseInt(receivedQtys[i.id] || '0'),
            })),
            notes: notes || undefined,
        }),
        onSuccess: () => {
            toast.success('Stock received and updated')
            onSuccess()
            onClose()
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to receive order'),
    })

    return (
        <Modal title={`Receive — ${order.orderNumber}`} onClose={onClose} maxWidth={560}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
                Enter the quantity received for each item. Stock levels will be updated automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px', gap: '8px' }}>
                    {['Product', 'Ordered', 'Received'].map(h => (
                        <span key={h} style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>{h}</span>
                    ))}
                </div>
                {order.items.map((item: any) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px', gap: '8px', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                        <div>
                            <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: 0 }}>{item.product?.name}</p>
                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{formatCurrency(item.unitCost)} each</p>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>{item.quantity}</span>
                        <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={receivedQtys[item.id] || ''}
                            onChange={e => setReceivedQtys({ ...receivedQtys, [item.id]: e.target.value })}
                            style={{ padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', width: '70px', fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <Field label="Notes">
                    <input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional delivery notes" />
                </Field>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                    style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: mutation.isPending ? 0.6 : 1 }}
                >
                    {mutation.isPending ? 'Receiving...' : 'Confirm receipt'}
                </button>
            </div>
        </Modal>
    )
}

// Main page
export default function SuppliersPage() {
    const queryClient = useQueryClient()

    const [activeTab,    setActiveTab]    = useState<'suppliers' | 'orders'>('suppliers')
    const [showCreate,   setShowCreate]   = useState(false)
    const [editSupplier, setEditSupplier] = useState<any>(null)
    const [supplierForm, setSupplierForm] = useState<any>({})
    const [showCreateOrder, setShowCreateOrder] = useState(false)
    const [receiveOrder,    setReceiveOrder]    = useState<any>(null)
    const [viewOrder,       setViewOrder]       = useState<any>(null)

    const { data: suppliersData, isLoading: suppliersLoading } = useQuery({
        queryKey: ['suppliers'],
        queryFn:  () => supplierApi.getAll().then(r => r.data.data || []),
    })

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['purchase-orders'],
        queryFn:  () => supplierApi.getAllOrders().then(r => r.data.data || []),
    })

    const suppliersList: any[] = suppliersData || []
    const ordersList:    any[] = ordersData    || []

    const createSupplierMutation = useMutation({
        mutationFn: (f: any) => supplierApi.create(f),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            setShowCreate(false)
            setSupplierForm({})
            toast.success('Supplier added')
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to add supplier'),
    })

    const updateSupplierMutation = useMutation({
        mutationFn: ({ id, f }: { id: string; f: any }) => supplierApi.update(id, f),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            setEditSupplier(null)
            setSupplierForm({})
            toast.success('Supplier updated')
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update supplier'),
    })

    const deleteSupplierMutation = useMutation({
        mutationFn: (id: string) => supplierApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            toast.success('Supplier removed')
        },
        onError: () => toast.error('Failed to remove supplier'),
    })

    const markOrderedMutation = useMutation({
        mutationFn: (id: string) => supplierApi.markAsOrdered(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
            toast.success('Order marked as ordered')
        },
        onError: () => toast.error('Failed to update order'),
    })

    const cancelOrderMutation = useMutation({
        mutationFn: (id: string) => supplierApi.cancelOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
            toast.success('Order cancelled')
        },
        onError: () => toast.error('Failed to cancel order'),
    })

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`
        .tab-btn { padding: 8px 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; background: transparent; color: #64748b; }
        .tab-btn:hover  { background: #f1f5f9; color: #0f172a; }
        .tab-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .action-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: background 0.15s; display: flex; align-items: center; }
        .action-btn:hover { background: #f1f5f9; }
        .action-btn.danger:hover { background: #fef2f2; }
        tbody tr:hover td { background: #f8fafc; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Suppliers
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        Manage suppliers and purchase orders
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {activeTab === 'suppliers' ? (
                        <button onClick={() => { setSupplierForm({}); setShowCreate(true) }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add supplier
                        </button>
                    ) : (
                        <button onClick={() => setShowCreateOrder(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            New purchase order
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
                <button className={`tab-btn${activeTab === 'suppliers' ? ' active' : ''}`} onClick={() => setActiveTab('suppliers')}>
                    Suppliers ({suppliersList.length})
                </button>
                <button className={`tab-btn${activeTab === 'orders' ? ' active' : ''}`} onClick={() => setActiveTab('orders')}>
                    Purchase orders ({ordersList.length})
                </button>
            </div>

            {/* Suppliers tab */}
            {activeTab === 'suppliers' && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    {suppliersLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                            <Spinner size={24} />
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading suppliers...</span>
                        </div>
                    ) : suppliersList.length === 0 ? (
                        <EmptyState
                            title="No suppliers yet"
                            sub="Add your first supplier to start tracking purchase orders"
                            action="Add supplier"
                            onAction={() => { setSupplierForm({}); setShowCreate(true) }}
                        />
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Supplier', 'Contact', 'Phone', 'Email', ''].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 500, borderBottom: '1px solid #e2e8f0' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {suppliersList.map((s: any) => (
                                <tr key={s.id}>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>{s.name}</p>
                                        {s.address && <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{s.address}</p>}
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{s.contact || '—'}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{s.phone || '—'}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{s.email || '—'}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                            <button className="action-btn" onClick={() => { setSupplierForm(s); setEditSupplier(s) }} title="Edit">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button className="action-btn danger" onClick={() => { if (confirm(`Remove "${s.name}"?`)) deleteSupplierMutation.mutate(s.id) }} title="Remove">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3,6 5,6 21,6"/>
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    {ordersLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                            <Spinner size={24} />
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading orders...</span>
                        </div>
                    ) : ordersList.length === 0 ? (
                        <EmptyState
                            title="No purchase orders yet"
                            sub="Create a purchase order when you need to restock from a supplier"
                            action="New purchase order"
                            onAction={() => setShowCreateOrder(true)}
                        />
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Order #', 'Supplier', 'Total', 'Status', 'Date', ''].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 500, borderBottom: '1px solid #e2e8f0' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {ordersList.map((o: any) => (
                                <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => setViewOrder(o)}>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>{o.orderNumber}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{o.supplier?.name || 'No supplier'}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>{formatCurrency(o.totalAmount)}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <StatusBadge status={o.status} />
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{formatDate(o.createdAt)}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                                            {o.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => markOrderedMutation.mutate(o.id)}
                                                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                                                >
                                                    Mark ordered
                                                </button>
                                            )}
                                            {(o.status === 'DRAFT' || o.status === 'ORDERED') && (
                                                <button
                                                    onClick={async () => {
                                                        const full = await supplierApi.getOrderById(o.id).then(r => r.data.data)
                                                        setReceiveOrder(full)
                                                    }}
                                                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                                                >
                                                    Receive
                                                </button>
                                            )}
                                            {(o.status === 'DRAFT' || o.status === 'ORDERED') && (
                                                <button
                                                    onClick={() => { if (confirm('Cancel this order?')) cancelOrderMutation.mutate(o.id) }}
                                                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modals */}
            {showCreate && (
                <Modal title="Add supplier" onClose={() => setShowCreate(false)}>
                    <SupplierForm
                        form={supplierForm} onChange={setSupplierForm}
                        onSubmit={() => createSupplierMutation.mutate(supplierForm)}
                        onClose={() => setShowCreate(false)}
                        loading={createSupplierMutation.isPending} isEdit={false}
                    />
                </Modal>
            )}

            {editSupplier && (
                <Modal title="Edit supplier" onClose={() => setEditSupplier(null)}>
                    <SupplierForm
                        form={supplierForm} onChange={setSupplierForm}
                        onSubmit={() => updateSupplierMutation.mutate({ id: editSupplier.id, f: supplierForm })}
                        onClose={() => setEditSupplier(null)}
                        loading={updateSupplierMutation.isPending} isEdit={true}
                    />
                </Modal>
            )}

            {showCreateOrder && (
                <CreateOrderModal
                    suppliers={suppliersList}
                    onClose={() => setShowCreateOrder(false)}
                    onSuccess={refresh}
                />
            )}

            {receiveOrder && (
                <ReceiveOrderModal
                    order={receiveOrder}
                    onClose={() => setReceiveOrder(null)}
                    onSuccess={refresh}
                />
            )}

            {viewOrder && (
                <Modal title={`Order — ${viewOrder.orderNumber}`} onClose={() => setViewOrder(null)}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <StatusBadge status={viewOrder.status} />
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{formatDate(viewOrder.createdAt)}</span>
                    </div>
                    {viewOrder.supplier && (
                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 2px' }}>Supplier</p>
                            <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: 0 }}>{viewOrder.supplier.name}</p>
                        </div>
                    )}
                    {viewOrder.notes && (
                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>{viewOrder.notes}</p>
                    )}
                    <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Items</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        {(viewOrder.items || []).map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', padding: '10px 12px' }}>
                                <div>
                                    <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: 0 }}>{item.product?.name}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>{item.quantity} × {formatCurrency(item.unitCost)}</p>
                                </div>
                                <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{formatCurrency(item.totalCost)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                        <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>Total</span>
                        <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700 }}>{formatCurrency(viewOrder.totalAmount)}</span>
                    </div>
                    <button onClick={() => setViewOrder(null)} style={{ width: '100%', marginTop: '16px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Close
                    </button>
                </Modal>
            )}
        </div>
    )
}