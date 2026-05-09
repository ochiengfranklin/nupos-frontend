import { useQuery } from '@tanstack/react-query'
import { reportApi } from '../../api/report.api'
import { useAuthStore } from '../../store/auth.store'
import { formatCurrency, formatDate } from '../../utils/helpers'

// Stat card
function StatCard({
                      label,
                      value,
                      sub,
                      color = '#3b82f6',
                  }: {
    label: string
    value: string
    sub?: string
    color?: string
}) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
        }}>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, fontWeight: 400 }}>
                {label}
            </p>
            <p style={{ color: '#0f172a', fontSize: '26px', fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
                {value}
            </p>
            {sub && (
                <p style={{ color, fontSize: '12px', margin: 0, fontWeight: 500 }}>
                    {sub}
                </p>
            )}
        </div>
    )
}

//   Payment badge
function PaymentBadge({ method }: { method: string }) {
    const colors: Record<string, { bg: string; color: string }> = {
        CASH:          { bg: '#f0fdf4', color: '#16a34a' },
        MPESA:         { bg: '#eff6ff', color: '#2563eb' },
        CARD:          { bg: '#fdf4ff', color: '#9333ea' },
        BANK_TRANSFER: { bg: '#fff7ed', color: '#ea580c' },
    }
    const style = colors[method] || { bg: '#f1f5f9', color: '#64748b' }
    return (
        <span style={{
            background: style.bg,
            color: style.color,
            fontSize: '11px',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: '20px',
        }}>
      {method === 'BANK_TRANSFER' ? 'Bank' : method}
    </span>
    )
}

//  Status badge
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, { bg: string; color: string }> = {
        COMPLETED: { bg: '#f0fdf4', color: '#16a34a' },
        VOIDED:    { bg: '#fef2f2', color: '#dc2626' },
        REFUNDED:  { bg: '#fff7ed', color: '#ea580c' },
    }
    const style = colors[status] || { bg: '#f1f5f9', color: '#64748b' }
    return (
        <span style={{
            background: style.bg,
            color: style.color,
            fontSize: '11px',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: '20px',
        }}>
      {status}
    </span>
    )
}

//   Section header
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 500, margin: 0 }}>
                {title}
            </h3>
            {sub && <p style={{ color: '#94a3b8', fontSize: '13px', margin: '2px 0 0' }}>{sub}</p>}
        </div>
    )
}

//  Main dashboard
export default function DashboardPage() {
    const { user } = useAuthStore()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => reportApi.getDashboard().then((r) => r.data.data),
        refetchInterval: 60_000, // refresh every 60 seconds
    })

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        border: '3px solid #e2e8f0',
                        borderTopColor: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto 12px',
                    }} />
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading dashboard...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (isError) {
        return (
            <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '20px',
                color: '#dc2626',
                fontSize: '14px',
            }}>
                Failed to load dashboard. Please refresh the page.
            </div>
        )
    }

    const today      = data?.today
    const thisMonth  = data?.thisMonth
    const allTime    = data?.allTime
    const lowStock   = data?.lowStockProducts || []
    const recent     = data?.recentSales || []
    const payments   = data?.paymentBreakdown || []

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Page header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                    color: '#0f172a',
                    fontSize: '22px',
                    fontWeight: 500,
                    margin: '0 0 4px',
                    letterSpacing: '-0.01em',
                }}>
                    Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stat cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
            }}>
                <StatCard
                    label="Today's revenue"
                    value={formatCurrency(today?.revenue || 0)}
                    sub={`${today?.saleCount || 0} sales today`}
                    color="#16a34a"
                />
                <StatCard
                    label="This month"
                    value={formatCurrency(thisMonth?.revenue || 0)}
                    sub={`${thisMonth?.saleCount || 0} total sales`}
                    color="#2563eb"
                />
                <StatCard
                    label="All time revenue"
                    value={formatCurrency(allTime?.revenue || 0)}
                    sub={`${allTime?.saleCount || 0} total sales`}
                    color="#9333ea"
                />
                <StatCard
                    label="Low stock alerts"
                    value={String(lowStock.length)}
                    sub={lowStock.length > 0 ? 'Needs restocking' : 'All good'}
                    color={lowStock.length > 0 ? '#dc2626' : '#16a34a'}
                />
            </div>

            {/* Middle row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '16px',
                marginBottom: '16px',
            }}>

                {/* Recent sales */}
                <div style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '24px',
                }}>
                    <SectionHeader title="Recent sales" sub="Last 5 transactions" />
                    {recent.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '14px' }}>
                            No sales yet today
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                {['Receipt', 'Cashier', 'Method', 'Amount', 'Status', 'Time'].map((h) => (
                                    <th key={h} style={{
                                        textAlign: 'left',
                                        color: '#94a3b8',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        padding: '0 0 12px',
                                        borderBottom: '1px solid #f1f5f9',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {recent.map((sale: any) => (
                                <tr key={sale.id}>
                                    <td style={{ padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, fontFamily: 'monospace' }}>
                        {sale.receiptNumber}
                      </span>
                                    </td>
                                    <td style={{ padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>
                        {sale.cashier?.name || '—'}
                      </span>
                                    </td>
                                    <td style={{ padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                                        <PaymentBadge method={sale.paymentMethod} />
                                    </td>
                                    <td style={{ padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500 }}>
                        {formatCurrency(sale.totalAmount)}
                      </span>
                                    </td>
                                    <td style={{ padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                                        <StatusBadge status={sale.status} />
                                    </td>
                                    <td style={{ padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {formatDate(sale.createdAt)}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Payment breakdown */}
                <div style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '24px',
                }}>
                    <SectionHeader title="Payment methods" sub="Today's breakdown" />
                    {payments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '14px' }}>
                            No payments today
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {payments.map((p: any) => {
                                const percent = today?.revenue
                                    ? Math.round((p.total / today.revenue) * 100)
                                    : 0
                                const colors: Record<string, string> = {
                                    CASH: '#16a34a',
                                    MPESA: '#2563eb',
                                    CARD: '#9333ea',
                                    BANK_TRANSFER: '#ea580c',
                                }
                                const color = colors[p.method] || '#64748b'
                                return (
                                    <div key={p.method}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500 }}>
                        {p.method === 'BANK_TRANSFER' ? 'Bank Transfer' : p.method}
                      </span>
                                            <span style={{ color: '#64748b', fontSize: '13px' }}>
                        {formatCurrency(p.total)} · {p.count} sale{p.count !== 1 ? 's' : ''}
                      </span>
                                        </div>
                                        <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px' }}>
                                            <div style={{
                                                background: color,
                                                width: `${percent}%`,
                                                height: '100%',
                                                borderRadius: '4px',
                                                transition: 'width 0.5s ease',
                                            }} />
                                        </div>
                                        <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0', textAlign: 'right' }}>
                                            {percent}%
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Low stock */}
            {lowStock.length > 0 && (
                <div style={{
                    background: '#fff',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '24px',
                }}>
                    <SectionHeader
                        title="⚠️ Low stock alerts"
                        sub="These products need restocking"
                    />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '12px',
                    }}>
                        {lowStock.map((product: any) => (
                            <div key={product.id} style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '12px 14px',
                            }}>
                                <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: '0 0 4px' }}>
                                    {product.name}
                                </p>
                                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px' }}>
                                    SKU: {product.sku || '—'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
                    {product.stockQuantity} left
                  </span>
                                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                    Min: {product.lowStockThreshold}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
}