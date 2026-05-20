import { useState, useRef, useEffect, useCallback } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { productApi, categoryApi } from '../../api/product.api'
import { customerApi } from '../../api/customer.api'
import { saleApi } from '../../api/sale.api'
import { useCartStore } from '../../store/cart.store'
import { useAuthStore } from '../../store/auth.store'
import { useSettingsStore } from '../../store/settings.store'
import type { Product, Category, Customer } from '../../types'
import { formatCurrency, formatWhatsAppReceipt, openWhatsAppReceipt } from '../../utils/helpers'
import { printReceipt } from '../../utils/thermal'
import { toast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import BarcodeScanner from '../../components/BarcodeScanner'
import { useOfflineStore, type OfflineSale } from '../../store/offline.store'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { v4 as uuidv4 } from 'uuid'
import { useScreenSize } from '../../utils/responsive'
import { loyaltyApi } from '../../api/loyalty.api'

// Payment method button
function PaymentBtn({
                        label, icon, selected, onClick, color = '#2563eb',
                    }: {
    label:    string
    icon:     React.ReactNode
    selected: boolean
    onClick:  () => void
    color?:   string
}) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1, padding: '12px 8px', borderRadius: '10px',
                border: selected ? `2px solid ${color}` : '2px solid #e2e8f0',
                background: selected ? `${color}15` : '#fff',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '6px', transition: 'all 0.15s',
            }}
        >
            <span style={{ color: selected ? color : '#94a3b8' }}>{icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: selected ? color : '#64748b' }}>
        {label}
      </span>
        </button>
    )
}

// Receipt modal
function ReceiptModal({
                          sale, onClose, onNewSale, shopName, shopPhone, cashierName,
                      }: {
    sale:         any
    onClose:      () => void
    onNewSale:    () => void
    shopName:     string
    shopPhone?:   string
    cashierName?: string
}) {
    const { shop }                  = useAuthStore()
    const [phone,     setPhone]     = useState('')
    const [showPhone, setShowPhone] = useState(false)
    const [sending,   setSending]   = useState(false)
    const { paperWidth }            = useSettingsStore()

    const handlePrint = () => {
        printReceipt({
            receiptNumber:  sale.receiptNumber  || '—',
            shopName,
            shopPhone,
            shopAddress:    shop?.address,
            receiptFooter:  shop?.receiptFooter,
            items: (sale.items || []).map((item: any) => ({
                name:      item.name || item.product?.name || 'Product',
                quantity:  item.quantity,
                unitPrice: item.unitPrice || item.price || 0,
                subtotal:  item.subtotal  || (
                    parseFloat(String(item.unitPrice || item.price || 0)) * item.quantity
                ),
            })),
            subtotal:       sale.subtotal       || 0,
            discountAmount: sale.discountAmount || 0,
            totalAmount:    sale.totalAmount    || 0,
            paymentMethod:  sale.paymentMethod  || 'CASH',
            cashierName,
            createdAt:      sale.createdAt      || new Date().toISOString(),
            notes:          sale.notes,
        }, paperWidth)
    }

    const handleWhatsApp = () => {
        if (!phone.trim()) return
        setSending(true)
        const receiptText = formatWhatsAppReceipt({
            receiptNumber:  sale.receiptNumber,
            shopName,
            items: (sale.items || []).map((item: any) => ({
                name:      item.name || item.product?.name || 'Product',
                quantity:  item.quantity,
                unitPrice: item.unitPrice || item.price || 0,
                subtotal:  item.subtotal  || (
                    parseFloat(String(item.unitPrice || item.price || 0)) * item.quantity
                ),
            })),
            subtotal:       sale.subtotal,
            discountAmount: sale.discountAmount,
            totalAmount:    sale.totalAmount,
            paymentMethod:  sale.paymentMethod,
            createdAt:      sale.createdAt,
        })
        openWhatsAppReceipt(phone, receiptText)
        setSending(false)
        setShowPhone(false)
        setPhone('')
        toast.success('WhatsApp opened with receipt')
    }

    return (
        <Modal title="Sale complete" onClose={onClose} maxWidth={420}>
            {/* Success icon */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '56px', height: '56px', background: '#f0fdf4',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 12px',
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12"/>
                    </svg>
                </div>
                <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 500, margin: '0 0 4px' }}>
                    Payment received
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, fontFamily: 'DM Mono, monospace' }}>
                    {sale?.receiptNumber || '—'}
                </p>
            </div>

            {/* Items preview */}
            <div style={{ marginBottom: '12px' }}>
                {(sale.items || []).map((item: any, i: number) => (
                    <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '4px 0', fontSize: '13px',
                        borderBottom: '1px solid #f1f5f9',
                    }}>
            <span style={{ color: '#0f172a' }}>
              {item.name || item.product?.name || 'Product'} × {item.quantity}
            </span>
                        <span style={{ color: '#64748b' }}>
              {formatCurrency(parseFloat(String(item.subtotal || 0)))}
            </span>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Subtotal</span>
                    <span style={{ color: '#0f172a', fontSize: '13px' }}>
            KES {parseFloat(sale?.subtotal || '0').toFixed(2)}
          </span>
                </div>
                {parseFloat(sale?.discountAmount || '0') > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>Discount</span>
                        <span style={{ color: '#dc2626', fontSize: '13px' }}>
              -KES {parseFloat(sale?.discountAmount || '0').toFixed(2)}
            </span>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600 }}>Total</span>
                    <span style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600 }}>
            KES {parseFloat(sale?.totalAmount || '0').toFixed(2)}
          </span>
                </div>
            </div>

            {/* Print + WhatsApp */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                    onClick={handlePrint}
                    style={{
                        flex: 1, padding: '10px',
                        border: '1.5px solid #e2e8f0', borderRadius: '8px',
                        background: '#fff', color: '#0f172a', fontSize: '13px',
                        fontWeight: 500, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6,9 6,2 18,2 18,9"/>
                        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                        <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    Print
                </button>

                {!showPhone ? (
                    <button
                        onClick={() => setShowPhone(true)}
                        style={{
                            flex: 1, padding: '10px',
                            border: '1.5px solid #dcfce7', borderRadius: '8px',
                            background: '#f0fdf4', color: '#16a34a', fontSize: '13px',
                            fontWeight: 500, cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#16a34a">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                    </button>
                ) : (
                    <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="07XXXXXXXX"
                            autoFocus
                            style={{
                                flex: 1, padding: '8px 10px',
                                border: '1px solid #e2e8f0', borderRadius: '8px',
                                fontSize: '13px', outline: 'none',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                            onKeyDown={e => e.key === 'Enter' && handleWhatsApp()}
                        />
                        <button
                            onClick={handleWhatsApp}
                            disabled={!phone.trim() || sending}
                            style={{
                                padding: '8px 12px', borderRadius: '8px',
                                border: 'none', background: '#16a34a',
                                color: '#fff', fontSize: '12px', cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                                opacity: !phone.trim() ? 0.6 : 1,
                            }}
                        >
                            Send
                        </button>
                        <button
                            onClick={() => { setShowPhone(false); setPhone('') }}
                            style={{
                                padding: '8px', borderRadius: '8px',
                                border: '1px solid #e2e8f0', background: '#fff',
                                color: '#64748b', cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Close + New sale */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={onClose} style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', background: '#fff',
                    color: '#64748b', fontSize: '14px', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    Close
                </button>
                <button onClick={onNewSale} style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    border: 'none', background: '#2563eb', color: '#fff',
                    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    New sale
                </button>
            </div>
        </Modal>
    )
}

// M-Pesa modal
function MpesaModal({
                        total, onConfirm, onClose, loading, tillNumber,
                    }: {
    total:       number
    onConfirm:   (ref: string) => void
    onClose:     () => void
    loading:     boolean
    tillNumber?: string
}) {
    const [ref, setRef] = useState('')
    return (
        <Modal title="M-Pesa payment" onClose={onClose} maxWidth={400}>
            <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '10px', padding: '16px',
                marginBottom: '20px', textAlign: 'center',
            }}>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px' }}>Amount to collect</p>
                <p style={{ color: '#1d4ed8', fontSize: '28px', fontWeight: 600, margin: 0 }}>
                    {formatCurrency(total)}
                </p>
            </div>
            {tillNumber && (
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 6px' }}>Till Number</p>
                    <div style={{
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        borderRadius: '8px', padding: '10px 14px',
                        fontSize: '18px', fontWeight: 600, color: '#0f172a',
                        letterSpacing: '0.05em', fontFamily: 'DM Mono, monospace',
                    }}>
                        {tillNumber}
                    </div>
                </div>
            )}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                    M-Pesa transaction code (optional)
                </label>
                <input
                    style={{
                        width: '100%', padding: '9px 12px',
                        border: '1px solid #e2e8f0', borderRadius: '8px',
                        fontSize: '14px', color: '#0f172a', outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'DM Mono, monospace',
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}
                    placeholder="e.g. QHX4BK2MNP"
                    value={ref}
                    onChange={e => setRef(e.target.value.toUpperCase())}
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={onClose} style={{
                    flex: 1, padding: '11px',
                    border: '1px solid #e2e8f0', borderRadius: '8px',
                    background: '#fff', color: '#64748b',
                    fontSize: '14px', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(ref)}
                    disabled={loading}
                    style={{
                        flex: 2, padding: '11px', border: 'none', borderRadius: '8px',
                        background: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                        fontFamily: "'DM Sans', sans-serif",
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                >
                    {loading ? <><Spinner size={16} color="#fff" /> Processing...</> : 'Confirm payment'}
                </button>
            </div>
        </Modal>
    )
}

// Add customer modal
function AddCustomerModal({
                              onSelect, onClose,
                          }: {
    onSelect: (c: Customer | null) => void
    onClose:  () => void
}) {
    const [search,   setSearch]   = useState('')
    const [newName,  setNewName]  = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [creating, setCreating] = useState(false)
    const [tab,      setTab]      = useState<'search' | 'new'>('search')

    const { data } = useQuery({
        queryKey: ['customers-search', search],
        queryFn:  () => customerApi.getAll({ search: search || undefined, limit: 10 }).then(r => r.data.data || []),
    })

    const customers: Customer[] = data || []

    const handleCreate = async () => {
        if (!newName) return
        setCreating(true)
        try {
            const res = await customerApi.create({ name: newName, phone: newPhone || undefined })
            onSelect(res.data.data!)
            toast.success('Customer added')
        } catch {
            toast.error('Failed to create customer')
        } finally {
            setCreating(false)
        }
    }

    return (
        <Modal title="Select customer" onClose={onClose} maxWidth={460}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                {(['search', 'new'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        flex: 1, padding: '7px', borderRadius: '6px', border: 'none',
                        background: tab === t ? '#fff' : 'transparent',
                        color: tab === t ? '#0f172a' : '#64748b',
                        fontSize: '13px', fontWeight: tab === t ? 500 : 400,
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}>
                        {t === 'search' ? 'Search existing' : 'Add new'}
                    </button>
                ))}
            </div>

            {tab === 'search' ? (
                <>
                    <input
                        style={{
                            width: '100%', padding: '9px 12px',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            fontSize: '14px', outline: 'none', marginBottom: '12px',
                            boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                        }}
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '260px', overflowY: 'auto' }}>
                        <button onClick={() => onSelect(null)} style={{
                            padding: '10px 12px', borderRadius: '8px',
                            border: '1px solid #e2e8f0', background: '#f8fafc',
                            textAlign: 'left', cursor: 'pointer', fontSize: '13px',
                            color: '#64748b', fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Walk-in customer (no account)
                        </button>
                        {customers.map(c => (
                            <button key={c.id} onClick={() => onSelect(c)} style={{
                                padding: '10px 12px', borderRadius: '8px',
                                border: '1px solid #e2e8f0', background: '#fff',
                                textAlign: 'left', cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                            }}>
                                <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>{c.name}</p>
                                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                                    {c.phone || 'No phone'} · Spent: {formatCurrency(c.totalSpent)}
                                </p>
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Name *
                        </label>
                        <input style={{
                            width: '100%', padding: '9px 12px',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                               placeholder="Customer name"
                               value={newName}
                               onChange={e => setNewName(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Phone
                        </label>
                        <input style={{
                            width: '100%', padding: '9px 12px',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                               placeholder="07XXXXXXXX"
                               value={newPhone}
                               onChange={e => setNewPhone(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={creating || !newName}
                        style={{
                            width: '100%', padding: '11px', border: 'none', borderRadius: '8px',
                            background: '#2563eb', color: '#fff', fontSize: '14px', fontWeight: 500,
                            cursor: creating || !newName ? 'not-allowed' : 'pointer',
                            opacity: creating || !newName ? 0.6 : 1,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {creating ? 'Adding...' : 'Add customer'}
                    </button>
                </>
            )}
        </Modal>
    )
}

// Main cashier page
export default function NewSalePage() {
    const { shop, user }     = useAuthStore()
    const { width, isSmall } = useScreenSize()
    const {
        items, addItem, updateQuantity, clearCart,
        getTotal, setCustomer, customerId,
    } = useCartStore()

    const isOnline = useOnlineStatus()
    const { cachedProducts, cacheProducts, addToQueue } = useOfflineStore()

    const [search,           setSearch]            = useState('')
    const [activeCategory,   setActiveCategory]    = useState('')
    const [paymentMethod,    setPaymentMethod]     = useState<'CASH' | 'MPESA' | 'CARD' | 'BANK_TRANSFER'>('CASH')
    const [discount,         setDiscount]          = useState('')
    const [notes,            setNotes]             = useState('')
    const [showMpesa,        setShowMpesa]         = useState(false)
    const [showCustomer,     setShowCustomer]      = useState(false)
    const [completedSale,    setCompletedSale]     = useState<any>(null)
    const [selectedCustomer, setSelectedCustomer]  = useState<Customer | null>(null)

    const [loyaltyPoints,   setLoyaltyPoints]   = useState(0)
    const [redeemingPoints, setRedeemingPoints] = useState(false)
    const [pointsToRedeem,  setPointsToRedeem]  = useState('')
    const [pointsDiscount,  setPointsDiscount]  = useState(0)
    const [loyaltySettings, setLoyaltySettings] = useState<any>(null)

    const [barcodeBuffer, setBarcodeBuffer] = useState('')
    const [barcodeError,  setBarcodeError]  = useState('')
    const barcodeTimeout                    = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [showCamera,    setShowCamera]    = useState(false)

    const searchRef = useRef<HTMLInputElement>(null)

    useEffect(() => { searchRef.current?.focus() }, [])

    useEffect(() => {
        loyaltyApi.getSettings().then(r => setLoyaltySettings(r.data.data)).catch(() => {})
    }, [])

    // Queries
    const { data: catData } = useQuery({
        queryKey: ['categories'],
        queryFn:  () => categoryApi.getAll().then(r => r.data.data || []),
    })

    const { data: productData, isLoading } = useQuery({
        queryKey: ['products-pos', search, activeCategory],
        queryFn: async () => {
            const result = await productApi.getAll({
                search:     search         || undefined,
                categoryId: activeCategory || undefined,
                limit:      50,
            }).then(r => r.data.data || [])
            if (result.length > 0) cacheProducts(result)
            return result
        },
        placeholderData: isOnline ? undefined : cachedProducts,
    })

    const categories: Category[] = catData || []
    const products:   Product[]  = isOnline
        ? (productData || []).filter((p: Product) => p.isActive && p.stockQuantity > 0)
        : cachedProducts.filter(p => p.isActive && p.stockQuantity > 0)

    const total      = getTotal()
    const discount_  = parseFloat(discount || '0')
    const finalTotal = Math.max(0, total - discount_ - pointsDiscount)

    // Barcode handler
    const handleBarcodeInput = useCallback((value: string) => {
        setBarcodeBuffer(value)
        if (barcodeTimeout.current) clearTimeout(barcodeTimeout.current)

        if (value.length >= 8) {
            barcodeTimeout.current = setTimeout(() => {
                const match = products.find(p => p.barcode === value || p.sku === value)
                if (match) {
                    addItem(match)
                    setSearch('')
                    setBarcodeBuffer('')
                    setBarcodeError('')
                    toast.success(`${match.name} added to cart`)
                } else {
                    setBarcodeError(`No product found for barcode: ${value}`)
                    setTimeout(() => setBarcodeError(''), 3000)
                }
            }, 100)
        } else {
            setSearch(value)
        }
    }, [products, addItem])

    const handleCameraScan = (barcode: string) => {
        setShowCamera(false)
        const match = products.find(p => p.barcode === barcode || p.sku === barcode)
        if (match) {
            addItem(match)
            setBarcodeError('')
            toast.success(`${match.name} added to cart`)
        } else {
            setBarcodeError(`No product found for barcode: ${barcode}`)
            setTimeout(() => setBarcodeError(''), 3000)
        }
    }

    // Checkout
    const handleCheckout = () => {
        if (items.length === 0) { toast.warning('Add items to the cart first'); return }
        if (!isOnline) {
            if (paymentMethod === 'MPESA') { toast.warning('M-Pesa is not available offline. Use cash.'); return }
            handleOfflineCheckout()
            return
        }
        if (paymentMethod === 'MPESA') { setShowMpesa(true); return }
        checkoutMutation.mutate(undefined)
    }

    const handleOfflineCheckout = () => {
        const offlineSale: OfflineSale = {
            id:            uuidv4(),
            items:         items.map(i => ({
                productId: i.product.id,
                quantity:  i.quantity,
                name:      i.product.name,
                price:     i.product.price,
            })),
            paymentMethod,
            discountAmount: discount_ + pointsDiscount,
            notes,
            customerId:     customerId || undefined,
            totalAmount:    finalTotal,
            createdAt:      new Date().toISOString(),
            synced:         false,
        }
        addToQueue(offlineSale)
        setCompletedSale({
            receiptNumber:  `OFFLINE-${Date.now()}`,
            subtotal:       String(total),
            discountAmount: String(discount_ + pointsDiscount),
            totalAmount:    String(finalTotal),
            paymentMethod,
            items: items.map(i => ({
                name:      i.product.name,
                quantity:  i.quantity,
                unitPrice: i.product.price,
                subtotal:  String(i.subtotal),
            })),
            createdAt: new Date().toISOString(),
            isOffline: true,
        })
        clearCart()
        setDiscount('')
        setNotes('')
        setSelectedCustomer(null)
        setCustomer(null)
        setPaymentMethod('CASH')
        setLoyaltyPoints(0)
        setPointsToRedeem('')
        setPointsDiscount(0)
        setRedeemingPoints(false)
        toast.success('Sale saved offline — will sync when internet returns')
    }

    const checkoutMutation = useMutation({
        mutationFn: (ref?: string) =>
            saleApi.create({
                items:             items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
                paymentMethod,
                customerId:        customerId || undefined,
                discountAmount:    (discount_ + pointsDiscount) || undefined,
                notes:             notes      || undefined,
                paymentReference:  ref        || undefined,
                loyaltyPointsUsed: pointsToRedeem ? parseInt(pointsToRedeem) : undefined,
            }),
        onSuccess: (res) => {
            const d          = res.data?.data
            const saleRecord = d?.sale || d || null
            setCompletedSale(saleRecord)
            clearCart()
            setDiscount('')
            setNotes('')
            setSelectedCustomer(null)
            setCustomer(null)
            setPaymentMethod('CASH')
            setShowMpesa(false)
            setLoyaltyPoints(0)
            setPointsToRedeem('')
            setPointsDiscount(0)
            setRedeemingPoints(false)
            toast.success('Sale completed!')
        },
        onError: (e: any) => {
            toast.error(e?.response?.data?.message || 'Checkout failed')
            setShowMpesa(false)
        },
    })

    const handleSelectCustomer = async (c: Customer | null) => {
        setSelectedCustomer(c)
        setCustomer(c?.id || null)
        setShowCustomer(false)
        setPointsToRedeem('')
        setPointsDiscount(0)
        if (c) {
            try {
                const res = await loyaltyApi.getCustomerHistory(c.id)
                setLoyaltyPoints(res.data.data?.customer?.loyaltyPoints || 0)
            } catch { setLoyaltyPoints(0) }
        } else {
            setLoyaltyPoints(0)
        }
    }

    const handleNewSale = () => {
        setCompletedSale(null)
        searchRef.current?.focus()
    }

    // Render
    return (
        <div style={{
            display:       'flex',
            flexDirection: isSmall ? 'column' : 'row',
            height:        isSmall ? 'auto' : 'calc(100vh - 64px)',
            minHeight:     isSmall ? '100vh' : 'auto',
            margin:        '-32px',
            fontFamily:    "'DM Sans', sans-serif",
            position:      'relative',
        }}>
            <style>{`
        .product-card {
          background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 10px; padding: 12px; cursor: pointer;
          transition: all 0.15s; text-align: left; width: 100%;
        }
        .product-card:hover { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .product-card:active { transform: scale(0.98); }
        .cat-tab {
          padding: 7px 14px; border-radius: 20px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 13px; cursor: pointer; white-space: nowrap;
          font-family: 'DM Sans', sans-serif; color: #64748b; transition: all 0.15s;
        }
        .cat-tab.active { background: #2563eb; border-color: #2563eb; color: #fff; font-weight: 500; }
        .qty-btn {
          width: 28px; height: 28px; border-radius: 6px;
          border: 1px solid #e2e8f0; background: #f8fafc;
          cursor: pointer; font-size: 16px; font-weight: 500;
          display: flex; align-items: center; justify-content: center;
          color: #0f172a; transition: all 0.1s; flex-shrink: 0;
        }
        .qty-btn:hover { background: #e2e8f0; }
        .qty-btn.danger:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
      `}</style>

            {/* Offline banner */}
            {!isOnline && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                    background: '#ea580c', color: '#fff',
                    padding: '8px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', fontSize: '13px', fontWeight: 500,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
                    </svg>
                    Offline — sales will sync when internet returns. M-Pesa unavailable.
                </div>
            )}

            {/* ── LEFT — Product grid ── */}
            <div style={{
                flex:         isSmall ? 'none' : 1,
                height:       isSmall ? 'auto' : '100%',
                display:      'flex',
                flexDirection: 'column',
                background:   '#f8fafc',
                borderRight:  isSmall ? 'none' : '1px solid #e2e8f0',
                borderBottom: isSmall ? '1px solid #e2e8f0' : 'none',
                overflow:     'hidden',
                maxHeight:    isSmall ? '60vh' : 'none',
            }}>

                {/* Search */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                    <div style={{ position: 'relative' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search products or scan barcode..."
                            value={barcodeBuffer || search}
                            onChange={e => handleBarcodeInput(e.target.value)}
                            onKeyDown={e => {
                                const val = (barcodeBuffer || search).trim()
                                if (e.key === 'Enter' && val) {
                                    const match = products.find(
                                        p => p.barcode === val || p.sku === val ||
                                            p.name.toLowerCase() === val.toLowerCase()
                                    )
                                    if (match) {
                                        addItem(match)
                                        setSearch('')
                                        setBarcodeBuffer('')
                                        setBarcodeError('')
                                        toast.success(`${match.name} added to cart`)
                                    } else {
                                        setBarcodeError(`No product found for "${val}"`)
                                        setTimeout(() => setBarcodeError(''), 3000)
                                    }
                                    e.preventDefault()
                                }
                            }}
                            style={{
                                width: '100%', padding: '10px 44px 10px 40px',
                                border: `1.5px solid ${barcodeError ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '10px', fontSize: '14px', outline: 'none',
                                boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                                color: '#0f172a', background: '#f8fafc',
                            }}
                            onFocus={e => (e.target.style.borderColor = barcodeError ? '#ef4444' : '#2563eb')}
                            onBlur={e  => (e.target.style.borderColor = barcodeError ? '#ef4444' : '#e2e8f0')}
                        />
                        <button
                            onClick={() => setShowCamera(true)}
                            title="Scan with camera"
                            style={{
                                position: 'absolute', right: '10px', top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                            </svg>
                        </button>
                    </div>

                    {/* Barcode error */}
                    {barcodeError && (
                        <div style={{
                            marginTop: '8px', padding: '8px 12px',
                            background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            <span style={{ color: '#ef4444', fontSize: '12px' }}>{barcodeError}</span>
                        </div>
                    )}
                </div>

                {/* Category tabs */}
                <div style={{
                    display: 'flex', gap: '8px', padding: '12px 20px',
                    overflowX: 'auto', borderBottom: '1px solid #e2e8f0', background: '#fff',
                }}>
                    <button className={`cat-tab${activeCategory === '' ? ' active' : ''}`} onClick={() => setActiveCategory('')}>
                        All
                    </button>
                    {categories.map(c => (
                        <button key={c.id} className={`cat-tab${activeCategory === c.id ? ' active' : ''}`} onClick={() => setActiveCategory(c.id)}>
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Product grid */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px' }}>
                            <Spinner size={24} />
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading products...</span>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '14px' }}>
                            {search ? `No products found for "${search}"` : 'No products available'}
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: width < 480
                                ? 'repeat(2, 1fr)'
                                : width < 768
                                    ? 'repeat(3, 1fr)'
                                    : 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '10px',
                        }}>
                            {products.map(p => {
                                const inCart = items.find(i => i.product.id === p.id)
                                const isLow  = p.stockQuantity <= p.lowStockThreshold
                                return (
                                    <button key={p.id} className="product-card" onClick={() => addItem(p)}>
                                        <div style={{
                                            width: '100%', height: '64px',
                                            background: inCart ? '#eff6ff' : '#f8fafc',
                                            borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            marginBottom: '8px',
                                        }}>
                                            {inCart ? (
                                                <span style={{ color: '#2563eb', fontSize: '22px', fontWeight: 600 }}>
                          ×{inCart.quantity}
                        </span>
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                                                </svg>
                                            )}
                                        </div>
                                        <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: '0 0 4px', lineHeight: 1.3 }}>
                                            {p.name}
                                        </p>
                                        <p style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>
                                            {formatCurrency(p.price)}
                                        </p>
                                        {isLow && (
                                            <span style={{ background: '#fff7ed', color: '#ea580c', fontSize: '10px', fontWeight: 500, padding: '1px 6px', borderRadius: '10px' }}>
                        {p.stockQuantity} left
                      </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT — Cart */}
            <div style={{
                width:         isSmall ? '100%' : '380px',
                minWidth:      isSmall ? 'auto' : '380px',
                display:       'flex',
                flexDirection: 'column',
                background:    '#fff',
                overflow:      'hidden',
            }}>

                {/* Cart header */}
                <div style={{
                    padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 500, margin: 0 }}>Cart</h3>
                        {items.length > 0 && (
                            <span style={{
                                background: '#2563eb', color: '#fff',
                                fontSize: '11px', fontWeight: 600,
                                padding: '2px 7px', borderRadius: '10px',
                            }}>
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Customer button */}
                        <button
                            onClick={() => setShowCustomer(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 10px', borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                background: selectedCustomer ? '#eff6ff' : '#fff',
                                color: selectedCustomer ? '#2563eb' : '#64748b',
                                fontSize: '12px', cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            {selectedCustomer ? selectedCustomer.name : 'Customer'}
                        </button>
                        {items.length > 0 && (
                            <button
                                onClick={() => { clearCart(); setSelectedCustomer(null); setCustomer(null) }}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#94a3b8', fontSize: '12px',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Cart items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
                    {items.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            height: '100%', gap: '12px',
                        }}>
                            <div style={{
                                width: '56px', height: '56px', background: '#f8fafc',
                                borderRadius: '14px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                                </svg>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, textAlign: 'center' }}>
                                Tap a product to add it to the cart
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {items.map(item => (
                                <div key={item.product.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 12px', background: '#f8fafc',
                                    borderRadius: '10px', border: '1px solid #f1f5f9',
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.product.name}
                                        </p>
                                        <p style={{ color: '#2563eb', fontSize: '12px', margin: 0, fontWeight: 500 }}>
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                        <button
                                            className={`qty-btn${item.quantity === 1 ? ' danger' : ''}`}
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        >
                                            {item.quantity === 1 ? (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3,6 5,6 21,6"/>
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                </svg>
                                            ) : '−'}
                                        </button>
                                        <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stockQuantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span style={{ color: '#64748b', fontSize: '12px', minWidth: '60px', textAlign: 'right' }}>
                    {formatCurrency(item.product.price)} ea
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart footer */}
                {items.length > 0 && (
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px' }}>

                        {/* Discount */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <label style={{ color: '#64748b', fontSize: '13px', minWidth: '70px' }}>Discount</label>
                            <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px' }}>
                  KES
                </span>
                                <input
                                    type="number" min="0"
                                    value={discount}
                                    onChange={e => setDiscount(e.target.value)}
                                    placeholder="0.00"
                                    style={{
                                        width: '100%', padding: '7px 10px 7px 44px',
                                        border: '1px solid #e2e8f0', borderRadius: '8px',
                                        fontSize: '14px', outline: 'none',
                                        boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                                        color: '#0f172a',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <label style={{ color: '#64748b', fontSize: '13px', minWidth: '70px' }}>Notes</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Optional note"
                                style={{
                                    flex: 1, padding: '7px 10px',
                                    border: '1px solid #e2e8f0', borderRadius: '8px',
                                    fontSize: '13px', outline: 'none',
                                    fontFamily: "'DM Sans', sans-serif", color: '#0f172a',
                                }}
                            />
                        </div>

                        {/* Loyalty points */}
                        {selectedCustomer && loyaltySettings?.isEnabled && loyaltyPoints > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{
                                    background: '#fdf4ff', border: '1px solid #e9d5ff',
                                    borderRadius: '8px', padding: '10px 12px',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: redeemingPoints ? '8px' : 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '14px' }}>⭐</span>
                                            <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 500 }}>
                        {loyaltyPoints} points available
                      </span>
                                        </div>
                                        {!redeemingPoints ? (
                                            <button
                                                onClick={() => setRedeemingPoints(true)}
                                                style={{
                                                    background: '#7c3aed', color: '#fff',
                                                    border: 'none', borderRadius: '6px',
                                                    padding: '4px 10px', fontSize: '11px',
                                                    fontWeight: 500, cursor: 'pointer',
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                Redeem
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setRedeemingPoints(false); setPointsToRedeem(''); setPointsDiscount(0) }}
                                                style={{
                                                    background: 'none', border: 'none',
                                                    color: '#94a3b8', fontSize: '12px',
                                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                    {redeemingPoints && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                min={loyaltySettings?.minimumRedemption || 100}
                                                max={loyaltyPoints}
                                                value={pointsToRedeem}
                                                onChange={e => {
                                                    const pts = parseInt(e.target.value || '0')
                                                    setPointsToRedeem(e.target.value)
                                                    setPointsDiscount(pts * (loyaltySettings?.pointsRedemptionRate || 1))
                                                }}
                                                placeholder={`Min ${loyaltySettings?.minimumRedemption || 100} pts`}
                                                style={{
                                                    flex: 1, padding: '6px 10px',
                                                    border: '1px solid #e9d5ff', borderRadius: '6px',
                                                    fontSize: '13px', outline: 'none',
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            />
                                            <span style={{ color: '#7c3aed', fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        = KES {pointsDiscount}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Totals */}
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#64748b', fontSize: '13px' }}>Subtotal</span>
                                <span style={{ color: '#0f172a', fontSize: '13px' }}>{formatCurrency(total)}</span>
                            </div>
                            {discount_ > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>Discount</span>
                                    <span style={{ color: '#dc2626', fontSize: '13px' }}>-{formatCurrency(discount_)}</span>
                                </div>
                            )}
                            {pointsDiscount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>Points discount</span>
                                    <span style={{ color: '#7c3aed', fontSize: '13px' }}>-{formatCurrency(pointsDiscount)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: 600 }}>Total</span>
                                <span style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700 }}>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        {/* Payment methods */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <PaymentBtn
                                label="Cash" selected={paymentMethod === 'CASH'}
                                onClick={() => setPaymentMethod('CASH')} color="#16a34a"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>}
                            />
                            <PaymentBtn
                                label="M-Pesa" selected={paymentMethod === 'MPESA'}
                                onClick={() => setPaymentMethod('MPESA')} color="#16a34a"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                            />
                            <PaymentBtn
                                label="Card" selected={paymentMethod === 'CARD'}
                                onClick={() => setPaymentMethod('CARD')} color="#2563eb"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
                            />
                            <PaymentBtn
                                label="Bank" selected={paymentMethod === 'BANK_TRANSFER'}
                                onClick={() => setPaymentMethod('BANK_TRANSFER')} color="#7c3aed"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12,2 20,7 4,7"/></svg>}
                            />
                        </div>

                        {/* Checkout button */}
                        <button
                            onClick={handleCheckout}
                            disabled={checkoutMutation.isPending || items.length === 0}
                            style={{
                                width: '100%', padding: '14px',
                                border: 'none', borderRadius: '10px',
                                background: items.length === 0 ? '#e2e8f0' : '#2563eb',
                                color: items.length === 0 ? '#94a3b8' : '#fff',
                                fontSize: '15px', fontWeight: 600,
                                cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '8px',
                                transition: 'all 0.15s',
                                opacity: checkoutMutation.isPending ? 0.7 : 1,
                            }}
                        >
                            {checkoutMutation.isPending ? (
                                <><Spinner size={18} color="#fff" /> Processing...</>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20,6 9,17 4,12"/>
                                    </svg>
                                    Charge {formatCurrency(finalTotal)}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {completedSale && (
                <ReceiptModal
                    sale={completedSale}
                    onClose={() => setCompletedSale(null)}
                    onNewSale={handleNewSale}
                    shopName={shop?.name || 'Our Shop'}
                    shopPhone={shop?.phone}
                    cashierName={user?.name}
                />
            )}
            {showMpesa && (
                <MpesaModal
                    total={finalTotal}
                    onConfirm={ref => checkoutMutation.mutate(ref)}
                    onClose={() => setShowMpesa(false)}
                    loading={checkoutMutation.isPending}
                    tillNumber={shop?.tillNumber}
                />
            )}
            {showCustomer && (
                <AddCustomerModal
                    onSelect={handleSelectCustomer}
                    onClose={() => setShowCustomer(false)}
                />
            )}
            {showCamera && (
                <BarcodeScanner
                    onScan={handleCameraScan}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </div>
    )
}