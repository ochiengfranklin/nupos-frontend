import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportApi } from '../../api/report.api'
import { formatCurrency, formatDateShort } from '../../utils/helpers'
import Spinner from '../../components/ui/Spinner'
import { useScreenSize } from '../../utils/responsive'

//  Stat card
function StatCard({
                      label, value, sub, color = '#2563eb',
                  }: {
    label: string
    value: string
    sub?:  string
    color?: string
}) {
    return (
        <div style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '12px', padding: '20px 24px',
        }}>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 6px' }}>{label}</p>
            <p style={{ color: '#0f172a', fontSize: '24px', fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                {value}
            </p>
            {sub && <p style={{ color, fontSize: '12px', margin: 0, fontWeight: 500 }}>{sub}</p>}
        </div>
    )
}

//  Section header
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 500, margin: '0 0 4px' }}>{title}</h3>
            {sub && <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{sub}</p>}
        </div>
    )
}

//  Simple bar chart
function BarChart({ data }: { data: { date: string; revenue: number; count: number }[] }) {
    if (!data || data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>
                No data for this period
            </div>
        )
    }

    const max = Math.max(...data.map(d => d.revenue), 1)

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', minWidth: `${data.length * 40}px`, height: '180px', padding: '0 4px' }}>
                {data.map((d, i) => {
                    const pct = (d.revenue / max) * 100
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ color: '#94a3b8', fontSize: '10px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
                {formatCurrency(d.revenue)}
              </span>
                            <div
                                title={`${d.date}: ${formatCurrency(d.revenue)} (${d.count} sales)`}
                                style={{
                                    width: '100%', background: '#2563eb', borderRadius: '4px 4px 0 0',
                                    height: `${Math.max(pct, 2)}%`, transition: 'height 0.3s ease',
                                    minHeight: '4px', cursor: 'pointer',
                                }}
                            />
                            <span style={{ color: '#94a3b8', fontSize: '9px', whiteSpace: 'nowrap', transform: 'rotate(-45deg)', transformOrigin: 'center', marginTop: '4px' }}>
                {d.date?.slice(5)}
              </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

//  Payment method breakdown
function PaymentBreakdown({ data }: { data: { method: string; total: number; count: number }[] }) {
    if (!data || data.length === 0) {
        return <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No payment data</p>
    }

    const totalRevenue = data.reduce((s, d) => s + d.total, 0)
    const colors: Record<string, string> = {
        CASH: '#16a34a', MPESA: '#2563eb', CARD: '#9333ea', BANK_TRANSFER: '#ea580c',
    }
    const labels: Record<string, string> = {
        CASH: 'Cash', MPESA: 'M-Pesa', CARD: 'Card', BANK_TRANSFER: 'Bank Transfer',
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.map(p => {
                const pct   = totalRevenue > 0 ? Math.round((p.total / totalRevenue) * 100) : 0
                const color = colors[p.method] || '#64748b'
                return (
                    <div key={p.method}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500 }}>
                {labels[p.method] || p.method}
              </span>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>
                {formatCurrency(p.total)} · {p.count} sale{p.count !== 1 ? 's' : ''}
              </span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '8px' }}>
                            <div style={{ background: color, width: `${pct}%`, height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0', textAlign: 'right' }}>{pct}%</p>
                    </div>
                )
            })}
        </div>
    )
}

// Top products table
function TopProductsTable({ data }: { data: any[] }) {
    const { isSmall } = useScreenSize()

    if (!data || data.length === 0) {
        return <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No sales data</p>
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isSmall ? '100%' : '500px' }}>
                <thead>
                <tr style={{ background: '#f8fafc' }}>
                    {(['#', 'Product', !isSmall && 'SKU', 'Qty sold', 'Revenue'].filter(Boolean) as string[]).map(h => (
                        <th key={h} style={{
                            textAlign: 'left', padding: '10px 14px',
                            color: '#94a3b8', fontSize: '12px', fontWeight: 500,
                            borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
                        }}>
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((p, i) => (
                    <tr key={p.productId}>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: i < 3 ? '#fef9c3' : '#f1f5f9',
                      color: i < 3 ? '#854d0e' : '#64748b',
                      fontSize: '12px', fontWeight: 600,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i + 1}
                  </span>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                            <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{p.productName}</span>
                        </td>
                        {!isSmall && (
                            <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                                <span style={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>{p.sku || '—'}</span>
                            </td>
                        )}
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                            <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{p.totalQuantity}</span>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                            <span style={{ color: '#16a34a', fontSize: '14px', fontWeight: 600 }}>{formatCurrency(p.totalRevenue)}</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

// Cashier performance table
function CashierTable({ data }: { data: any[] }) {
    const { isSmall } = useScreenSize()

    if (!data || data.length === 0) {
        return <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No cashier data</p>
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isSmall ? '100%' : '500px' }}>
                <thead>
                <tr style={{ background: '#f8fafc' }}>
                    {(['Cashier', 'Sales', 'Revenue', !isSmall && 'Avg sale'].filter(Boolean) as string[]).map(h => (
                        <th key={h} style={{
                            textAlign: 'left', padding: '10px 14px',
                            color: '#94a3b8', fontSize: '12px', fontWeight: 500,
                            borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
                        }}>
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((c, i) => (
                    <tr key={c.cashierId}>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                      <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 600 }}>
                        {c.cashierName?.charAt(0).toUpperCase()}
                      </span>
                                </div>
                                <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>
                      {c.cashierName || 'Unknown'}
                                    {i === 0 && (
                                        <span style={{ marginLeft: '6px', fontSize: '11px' }}>🏆</span>
                                    )}
                    </span>
                            </div>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                            <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{c.totalSales}</span>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                            <span style={{ color: '#16a34a', fontSize: '14px', fontWeight: 600 }}>{formatCurrency(c.totalRevenue)}</span>
                        </td>
                        {!isSmall && (
                            <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                                <span style={{ color: '#64748b', fontSize: '13px' }}>{formatCurrency(c.averageSale)}</span>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

// Inventory summary
function InventorySummary({ data }: { data: any }) {
    if (!data) return null

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
                { label: 'Total products',   value: data.summary?.totalProducts,   color: '#2563eb' },
                { label: 'Stock value',      value: formatCurrency(data.summary?.totalStockValue || 0),   color: '#64748b' },
                { label: 'Retail value',     value: formatCurrency(data.summary?.totalRetailValue || 0),  color: '#16a34a' },
                { label: 'Potential profit', value: formatCurrency(data.summary?.potentialProfit || 0),   color: '#9333ea' },
            ].map(item => (
                <div key={item.label} style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '10px', padding: '14px 16px',
                }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px' }}>{item.label}</p>
                    <p style={{ color: item.color, fontSize: '18px', fontWeight: 600, margin: 0 }}>{item.value}</p>
                </div>
            ))}
        </div>
    )
}

//  Main reports page
export default function ReportsPage() {
    const { isSmall } = useScreenSize()
    const today       = new Date().toISOString().slice(0, 10)
    const monthStart  = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

    const [startDate, setStartDate] = useState(monthStart)
    const [endDate,   setEndDate]   = useState(today)
    const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'cashiers' | 'inventory'>('sales')

    // Queries
    const { data: salesData, isLoading: salesLoading } = useQuery({
        queryKey: ['report-sales', startDate, endDate],
        queryFn:  () => reportApi.getSalesReport(startDate, endDate).then(r => r.data.data),
        enabled:  !!startDate && !!endDate,
    })

    const { data: topProductsData, isLoading: productsLoading } = useQuery({
        queryKey: ['report-top-products', startDate, endDate],
        queryFn:  () => reportApi.getTopProducts({ startDate, endDate, limit: 10 }).then(r => r.data.data),
        enabled:  !!startDate && !!endDate,
    })

    const { data: cashierData, isLoading: cashiersLoading } = useQuery({
        queryKey: ['report-cashiers', startDate, endDate],
        queryFn:  () => reportApi.getCashierReport({ startDate, endDate }).then(r => r.data.data),
        enabled:  !!startDate && !!endDate,
    })

    const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
        queryKey: ['report-inventory'],
        queryFn:  () => reportApi.getInventoryReport().then(r => r.data.data),
    })

    const tabs = [
        { key: 'sales',     label: 'Sales report' },
        { key: 'products',  label: 'Top products' },
        { key: 'cashiers',  label: 'Cashier performance' },
        { key: 'inventory', label: 'Inventory' },
    ] as const

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`
        .tab-btn {
          padding: 8px 16px; border-radius: 8px; border: none;
          font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.15s;
          background: transparent; color: #64748b;
          white-space: nowrap;
        }
        .tab-btn:hover  { background: #f1f5f9; color: #0f172a; }
        .tab-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .date-input {
          padding: 8px 12px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: #fff;
          font-size: 13px; color: #0f172a; outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .date-input:focus { border-color: #2563eb; }
      `}</style>

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: isSmall ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
                flexDirection: isSmall ? 'column' : 'row',
            }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Reports
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        Business analytics and insights
                    </p>
                </div>

                {/* Date range */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#64748b', fontSize: '13px' }}>From</label>
                        <input type="date" className="date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#64748b', fontSize: '13px' }}>To</label>
                        <input type="date" className="date-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    {/* Quick date presets */}
                    {!isSmall && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[
                                { label: 'Today',     start: today,      end: today },
                                { label: 'This month', start: monthStart, end: today },
                                {
                                    label: 'Last 7 days',
                                    start: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
                                    end:   today,
                                },
                            ].map(p => (
                                <button
                                    key={p.label}
                                    onClick={() => { setStartDate(p.start); setEndDate(p.end) }}
                                    style={{
                                        padding: '7px 10px', borderRadius: '8px',
                                        border: '1px solid #e2e8f0', background: startDate === p.start && endDate === p.end ? '#eff6ff' : '#fff',
                                        color: startDate === p.start && endDate === p.end ? '#2563eb' : '#64748b',
                                        fontSize: '12px', cursor: 'pointer',
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: startDate === p.start && endDate === p.end ? 500 : 400,
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Summary cards — always visible */}
            {salesData && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    <StatCard
                        label="Total revenue"
                        value={formatCurrency(salesData.summary?.totalRevenue || 0)}
                        sub={`${salesData.summary?.totalSales || 0} sales`}
                        color="#16a34a"
                    />
                    <StatCard
                        label="Average sale"
                        value={formatCurrency(salesData.summary?.averageSale || 0)}
                        color="#2563eb"
                    />
                    <StatCard
                        label="Total discount"
                        value={formatCurrency(salesData.summary?.totalDiscount || 0)}
                        color="#ea580c"
                    />
                    <StatCard
                        label="Inventory value"
                        value={formatCurrency(inventoryData?.summary?.totalStockValue || 0)}
                        sub="At cost price"
                        color="#9333ea"
                    />
                </div>
            )}

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '4px',
                background: '#f1f5f9',
                borderRadius: '10px',
                padding: '4px',
                marginBottom: '20px',
                width: isSmall ? '100%' : 'fit-content',
                overflowX: 'auto',
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>

                {/* Sales tab */}
                {activeTab === 'sales' && (
                    <>
                        <SectionHeader title="Revenue over time" sub={`${formatDateShort(startDate)} — ${formatDateShort(endDate)}`} />
                        {salesLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                <Spinner size={28} />
                            </div>
                        ) : (
                            <>
                                <BarChart data={salesData?.dailyRevenue || []} />
                                <div style={{ marginTop: '32px' }}>
                                    <SectionHeader title="Payment methods" sub="Breakdown for selected period" />
                                    <PaymentBreakdown data={salesData?.paymentBreakdown || []} />
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Top products tab */}
                {activeTab === 'products' && (
                    <>
                        <SectionHeader title="Top selling products" sub={`${formatDateShort(startDate)} — ${formatDateShort(endDate)}`} />
                        {productsLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                <Spinner size={28} />
                            </div>
                        ) : (
                            <TopProductsTable data={topProductsData || []} />
                        )}
                    </>
                )}

                {/* Cashiers tab */}
                {activeTab === 'cashiers' && (
                    <>
                        <SectionHeader title="Cashier performance" sub={`${formatDateShort(startDate)} — ${formatDateShort(endDate)}`} />
                        {cashiersLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                <Spinner size={28} />
                            </div>
                        ) : (
                            <CashierTable data={cashierData || []} />
                        )}
                    </>
                )}

                {/* Inventory tab */}
                {activeTab === 'inventory' && (
                    <>
                        <SectionHeader title="Inventory report" sub="Current stock levels and values" />
                        {inventoryLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                <Spinner size={28} />
                            </div>
                        ) : (
                            <>
                                <InventorySummary data={inventoryData} />

                                {/* Low stock */}
                                {inventoryData?.lowStockItems?.length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <SectionHeader title="⚠️ Low stock items" sub="Products that need restocking" />
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                            {inventoryData.lowStockItems.map((p: any) => (
                                                <div key={p.id} style={{
                                                    background: '#fef2f2', border: '1px solid #fecaca',
                                                    borderRadius: '8px', padding: '12px 14px',
                                                }}>
                                                    <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{p.name}</p>
                                                    <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 8px', fontFamily: 'DM Mono, monospace' }}>{p.sku || '—'}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>{p.stockQuantity} left</span>
                                                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>Min: {p.lowStockThreshold}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent movements */}
                                {inventoryData?.recentMovements?.length > 0 && (
                                    <>
                                        <SectionHeader title="Recent stock movements" sub="Last 20 inventory changes" />
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isSmall ? '100%' : '600px' }}>
                                                <thead>
                                                <tr style={{ background: '#f8fafc' }}>
                                                    {(['Product', 'Type', 'Qty', !isSmall && 'Before', !isSmall && 'After', 'Reason'].filter(Boolean) as string[]).map(h => (
                                                        <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#94a3b8', fontSize: '12px', fontWeight: 500, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {inventoryData.recentMovements.map((m: any) => (
                                                    <tr key={m.id}>
                                                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc', fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                                                            {m.product?.name || '—'}
                                                        </td>
                                                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc' }}>
                                  <span style={{
                                      background: m.type === 'SALE' ? '#fef2f2' : m.type === 'RESTOCK' ? '#f0fdf4' : '#f1f5f9',
                                      color:      m.type === 'SALE' ? '#dc2626' : m.type === 'RESTOCK' ? '#16a34a' : '#64748b',
                                      fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px',
                                  }}>
                                    {m.type}
                                  </span>
                                                        </td>
                                                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc', fontSize: '13px', fontWeight: 600 }}>
                                  <span style={{ color: m.quantity < 0 ? '#dc2626' : '#16a34a' }}>
                                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                                  </span>
                                                        </td>
                                                        {!isSmall && (
                                                            <>
                                                                <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc', fontSize: '13px', color: '#64748b' }}>
                                                                    {m.stockBefore}
                                                                </td>
                                                                <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc', fontSize: '13px', color: '#64748b' }}>
                                                                    {m.stockAfter}
                                                                </td>
                                                            </>
                                                        )}
                                                        <td style={{ padding: '12px 14px', borderBottom: '1px solid #f8fafc', fontSize: '13px', color: '#94a3b8' }}>
                                                            {m.reason || '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}