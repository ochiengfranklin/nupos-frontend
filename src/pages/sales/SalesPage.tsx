import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { saleApi } from '../../api/sale.api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'
import { toast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatWhatsAppReceipt, openWhatsAppReceipt } from '../../utils/receipt'
import { printReceipt } from '../../utils/thermal'
import { useScreenSize } from '../../utils/responsive'

//   Payment badge
function PaymentBadge({ method }: { method: string }) {
    const map: Record<string, { bg: string; color: string; label: string }> = {
        CASH:          { bg: '#f0fdf4', color: '#16a34a', label: 'Cash' },
        MPESA:         { bg: '#eff6ff', color: '#2563eb', label: 'M-Pesa' },
        CARD:          { bg: '#fdf4ff', color: '#9333ea', label: 'Card' },
        BANK_TRANSFER: { bg: '#fff7ed', color: '#ea580c', label: 'Bank' },
    }
    const s = map[method] || { bg: '#f1f5f9', color: '#64748b', label: method }
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
      {s.label}
    </span>
    )
}

//   Status badge
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { bg: string; color: string }> = {
        COMPLETED: { bg: '#f0fdf4', color: '#16a34a' },
        VOIDED:    { bg: '#fef2f2', color: '#dc2626' },
        REFUNDED:  { bg: '#fff7ed', color: '#ea580c' },
    }
    const s = map[status] || { bg: '#f1f5f9', color: '#64748b' }
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
      {status}
    </span>
    )
}

// Sale detail modal
function SaleDetailModal({
                             saleId, onClose, onVoid, canVoid,
                         }: {
    saleId:  string
    onClose: () => void
    onVoid:  (id: string) => void
    canVoid: boolean
}) {
    const { data, isLoading } = useQuery({
        queryKey: ['sale', saleId],
        queryFn:  () => saleApi.getById(saleId).then(r => r.data.data),
    })

    const sale = data

    const [showWhatsApp, setShowWhatsApp] = useState(false)
    const [waPhone,      setWaPhone]      = useState('')
    const { shop, user } = useAuthStore()

    const handlePrint = () => {
        if (!sale) return
        printReceipt({
            receiptNumber:  sale.receiptNumber,
            shopName:       shop?.name || 'Our Shop',
            shopPhone:      (shop as any)?.phone, // Fixed TS Error here
            items:          sale.items?.map((i: any) => ({
                name:      i.product?.name || 'Product',
                quantity:  i.quantity,
                unitPrice: i.unitPrice,
                subtotal:  i.subtotal,
            })) || [],
            subtotal:       sale.subtotal,
            discountAmount: sale.discountAmount,
            totalAmount:    sale.totalAmount,
            paymentMethod:  sale.paymentMethod,
            cashierName:    user?.name,
            createdAt:      sale.createdAt,
            notes:          sale.notes,
        })
    }

    const handleWhatsApp = () => {
        if (!waPhone.trim() || !sale) return
        const receiptText = formatWhatsAppReceipt({
            receiptNumber:  sale.receiptNumber,
            shopName:       shop?.name || 'Our Shop',
            items:          sale.items || [],
            subtotal:       sale.subtotal,
            discountAmount: sale.discountAmount,
            totalAmount:    sale.totalAmount,
            paymentMethod:  sale.paymentMethod,
            createdAt:      sale.createdAt,
        })
        openWhatsAppReceipt(waPhone, receiptText)
        setShowWhatsApp(false)
        setWaPhone('')
    }

    return (
        <Modal title="Sale details" onClose={onClose} maxWidth={520}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Spinner size={28} />
                </div>
            ) : !sale ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Sale not found</p>
            ) : (
                <>
                    {/* Header */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9',
                    }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px' }}>Receipt number</p>
                            <p style={{ color: '#0f172a', fontSize: '16px', fontWeight: 600, margin: 0, fontFamily: 'DM Mono, monospace' }}>
                                {sale.receiptNumber}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <StatusBadge status={sale.status} />
                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: '6px 0 0' }}>
                                {formatDate(sale.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Items
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {sale.items?.map((item: any) => (
                                <div key={item.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                                }}>
                                    <div>
                                        <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>
                                            {item.product?.name || 'Unknown product'}
                                        </p>
                                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                                            {formatCurrency(item.unitPrice)} × {item.quantity}
                                        </p>
                                    </div>
                                    <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>
                    {formatCurrency(item.subtotal)}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>Subtotal</span>
                            <span style={{ color: '#0f172a', fontSize: '13px' }}>{formatCurrency(sale.subtotal)}</span>
                        </div>
                        {parseFloat(sale.discountAmount || '0') > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#64748b', fontSize: '13px' }}>Discount</span>
                                <span style={{ color: '#dc2626', fontSize: '13px' }}>-{formatCurrency(sale.discountAmount)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                            <span style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600 }}>Total</span>
                            <span style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600 }}>{formatCurrency(sale.totalAmount)}</span>
                        </div>
                    </div>

                    {/* Payment info */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, background: '#f8fafc', borderRadius: '8px', padding: '10px 12px' }}>
                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment</p>
                            <PaymentBadge method={sale.paymentMethod} />
                        </div>
                        {sale.payments?.[0]?.reference && (
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '8px', padding: '10px 12px' }}>
                                <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reference</p>
                                <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: 0, fontFamily: 'DM Mono, monospace' }}>
                                    {sale.payments[0].reference}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ marginBottom: '12px' }}>
                        {/* Print button */}
                        <button
                            onClick={handlePrint}
                            style={{
                                width: '100%', padding: '9px',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '8px', background: '#fff',
                                color: '#0f172a', fontSize: '13px',
                                fontWeight: 500, cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '6px',
                                marginBottom: '10px',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6,9 6,2 18,2 18,9"/>
                                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                                <rect x="6" y="14" width="12" height="8"/>
                            </svg>
                            Print receipt
                        </button>

                        {!showWhatsApp ? (
                            <button
                                onClick={() => setShowWhatsApp(true)}
                                style={{
                                    width: '100%', padding: '9px',
                                    border: '1.5px solid #dcfce7', borderRadius: '8px',
                                    background: '#f0fdf4', color: '#16a34a',
                                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                    fontFamily: "'DM Sans', sans-serif",
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '6px',
                                    marginBottom: '10px',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#16a34a">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                            </button>
                        ) : (
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="tel"
                                        value={waPhone}
                                        onChange={e => setWaPhone(e.target.value)}
                                        placeholder="07XXXXXXXX"
                                        autoFocus
                                        style={{
                                            flex: 1, padding: '9px 12px',
                                            border: '1px solid #e2e8f0', borderRadius: '8px',
                                            fontSize: '14px', outline: 'none',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                        onKeyDown={e => e.key === 'Enter' && handleWhatsApp()}
                                    />
                                    <button
                                        onClick={handleWhatsApp}
                                        disabled={!waPhone.trim()}
                                        style={{
                                            padding: '9px 14px', borderRadius: '8px',
                                            border: 'none', background: '#16a34a',
                                            color: '#fff', fontSize: '13px', fontWeight: 500,
                                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                            opacity: !waPhone.trim() ? 0.6 : 1,
                                        }}
                                    >
                                        Send
                                    </button>
                                    <button
                                        onClick={() => { setShowWhatsApp(false); setWaPhone('') }}
                                        style={{
                                            padding: '9px 12px', borderRadius: '8px',
                                            border: '1px solid #e2e8f0', background: '#fff',
                                            color: '#64748b', fontSize: '13px', cursor: 'pointer',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onClose} style={{
                            flex: 1, padding: '10px', borderRadius: '8px',
                            border: '1px solid #e2e8f0', background: '#fff',
                            color: '#64748b', fontSize: '14px', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Close
                        </button>
                        {canVoid && sale.status === 'COMPLETED' && (
                            <button
                                onClick={() => { onVoid(sale.id); onClose() }}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px',
                                    border: 'none', background: '#fef2f2',
                                    color: '#dc2626', fontSize: '14px', fontWeight: 500,
                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Void sale
                            </button>
                        )}
                    </div>
                </>
            )}
        </Modal>
    )
}

// ── Main page
export default function SalesPage() {
    const queryClient = useQueryClient()
    const { hasRole } = useAuthStore()
    const canVoid     = hasRole(['MANAGER'])
    const { isSmall } = useScreenSize()

    const [page,          setPage]          = useState(1)
    const [startDate,     setStartDate]     = useState('')
    const [endDate,       setEndDate]       = useState('')
    const [paymentFilter, setPaymentFilter] = useState('')
    const [statusFilter,  setStatusFilter]  = useState('')
    const [selectedSale,  setSelectedSale]  = useState<string | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['sales', page, startDate, endDate, paymentFilter, statusFilter],
        queryFn: () =>
            saleApi.getAll({
                page, limit: 20,
                startDate:     startDate     || undefined,
                endDate:       endDate       || undefined,
                paymentMethod: paymentFilter || undefined,
                status:        statusFilter  || undefined,
            }).then(r => r.data),
    })

    const voidMutation = useMutation({
        mutationFn: (id: string) => saleApi.void(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] })
            toast.success('Sale voided successfully')
        },
        onError: () => toast.error('Failed to void sale'),
    })

    const handleVoid = (id: string) => {
        if (confirm('Void this sale? Stock will be restored.')) {
            voidMutation.mutate(id)
        }
    }

    const sales = data?.data || []
    const meta  = data?.meta

    const totalRevenue = sales
        .filter((s: any) => s.status === 'COMPLETED')
        .reduce((sum: number, s: any) => sum + parseFloat(s.totalAmount || '0'), 0)

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`
        .sales-row { cursor: pointer; transition: background 0.1s; }
        .sales-row:hover td { background: #f8fafc; }
        .filter-select {
          padding: 8px 12px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: #fff;
          font-size: 13px; color: #64748b; cursor: pointer;
          font-family: 'DM Sans', sans-serif; outline: none;
        }
        .date-input {
          padding: 8px 12px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: #fff;
          font-size: 13px; color: #0f172a; outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .date-input:focus { border-color: #2563eb; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Sales history
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        {meta?.total || 0} total transactions
                    </p>
                </div>
                {/* Revenue summary */}
                {sales.length > 0 && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 16px', textAlign: 'right' }}>
                        <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 2px' }}>Showing revenue</p>
                        <p style={{ color: '#16a34a', fontSize: '18px', fontWeight: 600, margin: 0 }}>
                            {formatCurrency(totalRevenue)}
                        </p>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>From</label>
                    <input
                        type="date"
                        className="date-input"
                        value={startDate}
                        onChange={e => { setStartDate(e.target.value); setPage(1) }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>To</label>
                    <input
                        type="date"
                        className="date-input"
                        value={endDate}
                        onChange={e => { setEndDate(e.target.value); setPage(1) }}
                    />
                </div>
                <select
                    className="filter-select"
                    value={paymentFilter}
                    onChange={e => { setPaymentFilter(e.target.value); setPage(1) }}
                >
                    <option value="">All payments</option>
                    <option value="CASH">Cash</option>
                    <option value="MPESA">M-Pesa</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank transfer</option>
                </select>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                >
                    <option value="">All statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="VOIDED">Voided</option>
                    <option value="REFUNDED">Refunded</option>
                </select>
                {(startDate || endDate || paymentFilter || statusFilter) && (
                    <button
                        onClick={() => { setStartDate(''); setEndDate(''); setPaymentFilter(''); setStatusFilter(''); setPage(1) }}
                        style={{
                            padding: '8px 14px', borderRadius: '8px',
                            border: '1px solid #fecaca', background: '#fef2f2',
                            color: '#dc2626', fontSize: '13px', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                        <Spinner size={24} />
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading sales...</span>
                    </div>
                ) : sales.length === 0 ? (
                    <EmptyState
                        title="No sales found"
                        sub="Sales will appear here after your first transaction"
                    />
                ) : (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isSmall ? '100%' : '600px' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {(['Receipt', !isSmall && 'Date', !isSmall && 'Items', 'Payment', !isSmall && 'Discount', 'Total', 'Status', ''].filter(Boolean) as string[]).map(h => (
                                    <th key={h} style={{
                                        textAlign: 'left', padding: '12px 16px',
                                        color: '#94a3b8', fontSize: '12px', fontWeight: 500,
                                        borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {sales.map((sale: any) => (
                                <tr
                                    key={sale.id}
                                    className="sales-row"
                                    onClick={() => setSelectedSale(sale.id)}
                                >
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>
                        {sale.receiptNumber}
                      </span>
                                    </td>
                                    {!isSmall && (
                                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>
                          {formatDate(sale.createdAt)}
                        </span>
                                        </td>
                                    )}
                                    {!isSmall && (
                                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>
                          —
                        </span>
                                        </td>
                                    )}
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <PaymentBadge method={sale.paymentMethod} />
                                    </td>
                                    {!isSmall && (
                                        <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                        <span style={{ color: parseFloat(sale.discountAmount) > 0 ? '#dc2626' : '#94a3b8', fontSize: '13px' }}>
                          {parseFloat(sale.discountAmount) > 0 ? `-${formatCurrency(sale.discountAmount)}` : '—'}
                        </span>
                                        </td>
                                    )}
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>
                        {formatCurrency(sale.totalAmount)}
                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <StatusBadge status={sale.status} />
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9,18 15,12 9,6"/>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '14px 16px', borderTop: '1px solid #f1f5f9',
                            }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                  Page {meta.page} of {meta.totalPages} — {meta.total} sales
                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        style={{
                                            padding: '6px 14px', borderRadius: '8px',
                                            border: '1px solid #e2e8f0', background: '#fff',
                                            fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer',
                                            color: page === 1 ? '#cbd5e1' : '#64748b',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                        disabled={page === meta.totalPages}
                                        style={{
                                            padding: '6px 14px', borderRadius: '8px',
                                            border: '1px solid #e2e8f0', background: '#fff',
                                            fontSize: '13px', cursor: page === meta.totalPages ? 'not-allowed' : 'pointer',
                                            color: page === meta.totalPages ? '#cbd5e1' : '#64748b',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Sale detail modal */}
            {selectedSale && (
                <SaleDetailModal
                    saleId={selectedSale}
                    onClose={() => setSelectedSale(null)}
                    onVoid={handleVoid}
                    canVoid={canVoid}
                />
            )}
        </div>
    )
}