import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '../../api/customer.api'
import type {Customer} from '../../types'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'
import { toast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { loyaltyApi } from '../../api/loyalty.api'

// Customer form
interface CustomerFormData {
    name:  string
    phone: string
    email: string
}

const emptyForm: CustomerFormData = { name: '', phone: '', email: '' }

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
            <label style={{
                display: 'block', color: '#64748b', fontSize: '12px',
                fontWeight: 500, marginBottom: '6px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
                {label}
            </label>
            {children}
        </div>
    )
}

//  Customer form modal
function CustomerFormModal({
                               form, onChange, onSubmit, onClose, loading, isEdit,
                           }: {
    form:     CustomerFormData
    onChange: (f: CustomerFormData) => void
    onSubmit: () => void
    onClose:  () => void
    loading:  boolean
    isEdit:   boolean
}) {
    const set = (key: keyof CustomerFormData, val: string) =>
        onChange({ ...form, [key]: val })

    return (
        <>
            <Field label="Name *">
                <input
                    style={inputStyle}
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Customer full name"
                    autoFocus
                />
            </Field>
            <Field label="Phone">
                <input
                    style={inputStyle}
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="07XXXXXXXX"
                />
            </Field>
            <Field label="Email">
                <input
                    style={inputStyle}
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="customer@email.com"
                />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={onClose} style={{
                    padding: '9px 20px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', background: '#fff',
                    color: '#64748b', fontSize: '14px', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading || !form.name}
                    style={{
                        padding: '9px 20px', borderRadius: '8px',
                        border: 'none', background: '#2563eb',
                        color: '#fff', fontSize: '14px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        opacity: loading || !form.name ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Add customer'}
                </button>
            </div>
        </>
    )
}

// Customer detail modal
function CustomerDetailModal({
                                 customerId, onClose, onEdit,
                             }: {
    customerId: string
    onClose:    () => void
    onEdit:     () => void
}) {
    const { data, isLoading } = useQuery({
        queryKey: ['customer-history', customerId],
        queryFn:  () => customerApi.getWithHistory(customerId).then(r => r.data.data),
    })

    const customer = data

    const { data: loyaltyData } = useQuery({
        queryKey: ['loyalty-history', customerId],
        queryFn:  () => loyaltyApi.getCustomerHistory(customerId).then(r => r.data.data),
    })

    return (
        <Modal title="Customer profile" onClose={onClose} maxWidth={520}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Spinner size={28} />
                </div>
            ) : !customer ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Customer not found</p>
            ) : (
                <>
                    {/* Profile header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        marginBottom: '20px', paddingBottom: '20px',
                        borderBottom: '1px solid #f1f5f9',
                    }}>
                        <div style={{
                            width: '52px', height: '52px',
                            background: '#eff6ff', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
              <span style={{ color: '#2563eb', fontSize: '18px', fontWeight: 600 }}>
                {customer.name?.charAt(0).toUpperCase()}
              </span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#0f172a', fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>
                                {customer.name}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {customer.phone && (
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>📞 {customer.phone}</span>
                                )}
                                {customer.email && (
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>✉️ {customer.email}</span>
                                )}
                            </div>
                        </div>
                        <div style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderRadius: '10px', padding: '10px 14px', textAlign: 'right',
                        }}>
                            <p style={{ color: '#64748b', fontSize: '11px', margin: '0 0 2px' }}>Total spent</p>
                            <p style={{ color: '#16a34a', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                {formatCurrency(customer.totalSpent || 0)}
                            </p>
                        </div>
                    </div>

                    {/* Loyalty points summary */}
                    {loyaltyData?.customer?.loyaltyPoints > 0 && (
                        <div style={{
                            background: '#fdf4ff', border: '1px solid #e9d5ff',
                            borderRadius: '10px', padding: '14px 16px', marginBottom: '20px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div>
                                <p style={{ color: '#7c3aed', fontSize: '12px', margin: '0 0 2px', fontWeight: 500 }}>
                                    ⭐ Loyalty points
                                </p>
                                <p style={{ color: '#0f172a', fontSize: '24px', fontWeight: 700, margin: 0 }}>
                                    {loyaltyData.customer.loyaltyPoints}
                                </p>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, textAlign: 'right' }}>
                                Worth KES {loyaltyData.customer.loyaltyPoints}<br />
                                <span style={{ fontSize: '11px' }}>at 1pt = KES 1</span>
                            </p>
                        </div>
                    )}

                    {/* Loyalty transaction history */}
                    {loyaltyData?.transactions?.length > 0 && (
                        <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                            <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Points history
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                                {loyaltyData.transactions.map((t: any) => (
                                    <div key={t.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '8px 12px', background: '#f8fafc', borderRadius: '6px',
                                    }}>
                                        <div>
                                            <p style={{ color: '#0f172a', fontSize: '12px', fontWeight: 500, margin: 0 }}>
                                                {t.type === 'EARNED'   ? '+ Earned'   :
                                                    t.type === 'REDEEMED' ? '- Redeemed' :
                                                        t.type === 'ADJUSTED' ? '± Adjusted' : t.type}
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>
                                                {t.note} · {new Date(t.createdAt).toLocaleDateString('en-KE')}
                                            </p>
                                        </div>
                                        <span style={{
                                            color: t.points > 0 ? '#16a34a' : '#dc2626',
                                            fontSize: '13px', fontWeight: 600,
                                        }}>
                                            {t.points > 0 ? '+' : ''}{t.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Purchase history */}
                    <div>
                        <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Purchase history
                        </p>
                        {!customer.purchaseHistory || customer.purchaseHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '14px', background: '#f8fafc', borderRadius: '8px' }}>
                                No purchases yet
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
                                {customer.purchaseHistory.map((sale: any) => (
                                    <div key={sale.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                                    }}>
                                        <div>
                                            <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 500, margin: '0 0 2px', fontFamily: 'DM Mono, monospace' }}>
                                                {sale.receiptNumber}
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                                                {formatDate(sale.createdAt)}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                                                {formatCurrency(sale.totalAmount)}
                                            </p>
                                            <span style={{
                                                background: sale.paymentMethod === 'MPESA' ? '#eff6ff' : '#f0fdf4',
                                                color:      sale.paymentMethod === 'MPESA' ? '#2563eb' : '#16a34a',
                                                fontSize: '11px', fontWeight: 500,
                                                padding: '1px 6px', borderRadius: '10px',
                                            }}>
                        {sale.paymentMethod === 'BANK_TRANSFER' ? 'Bank' : sale.paymentMethod}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button onClick={onClose} style={{
                            flex: 1, padding: '10px', borderRadius: '8px',
                            border: '1px solid #e2e8f0', background: '#fff',
                            color: '#64748b', fontSize: '14px', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Close
                        </button>
                        <button onClick={onEdit} style={{
                            flex: 1, padding: '10px', borderRadius: '8px',
                            border: 'none', background: '#2563eb', color: '#fff',
                            fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Edit customer
                        </button>
                    </div>
                </>
            )}
        </Modal>
    )
}

//Main page
export default function CustomersPage() {
    const queryClient = useQueryClient()
    const { hasRole } = useAuthStore()
    const canEdit     = hasRole(['MANAGER'])

    const [search,       setSearch]       = useState('')
    const [page,         setPage]         = useState(1)
    const [showCreate,   setShowCreate]   = useState(false)
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
    const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
    const [form,         setForm]         = useState<CustomerFormData>(emptyForm)
    const [formError,    setFormError]    = useState('')

    const { data, isLoading } = useQuery({
        queryKey: ['customers', page, search],
        queryFn: () =>
            customerApi.getAll({
                page, limit: 20,
                search: search || undefined,
            }).then(r => r.data),
    })

    const customers: Customer[] = data?.data || []
    const meta                  = data?.meta

    // Mutations
    const createMutation = useMutation({
        mutationFn: (f: CustomerFormData) =>
            customerApi.create({
                name:  f.name,
                phone: f.phone || undefined,
                email: f.email || undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            setShowCreate(false)
            setForm(emptyForm)
            setFormError('')
            toast.success('Customer added successfully')
        },
        onError: (e: any) => {
            const msg = e?.response?.data?.message || 'Failed to add customer'
            setFormError(msg)
            toast.error(msg)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, f }: { id: string; f: CustomerFormData }) =>
            customerApi.update(id, {
                name:  f.name,
                phone: f.phone || undefined,
                email: f.email || undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            setEditCustomer(null)
            setForm(emptyForm)
            setFormError('')
            toast.success('Customer updated successfully')
        },
        onError: (e: any) => {
            const msg = e?.response?.data?.message || 'Failed to update customer'
            setFormError(msg)
            toast.error(msg)
        },
    })

    const deactivateMutation = useMutation({
        mutationFn: (id: string) => customerApi.deactivate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            toast.success('Customer deactivated')
        },
        onError: () => toast.error('Failed to deactivate customer'),
    })

    //Handlers
    const openCreate = () => {
        setForm(emptyForm)
        setFormError('')
        setShowCreate(true)
    }

    const openEdit = (c: Customer) => {
        setForm({ name: c.name, phone: c.phone || '', email: c.email || '' })
        setFormError('')
        setViewCustomer(null)
        setEditCustomer(c)
    }

    const handleDeactivate = (id: string, name: string) => {
        if (confirm(`Deactivate "${name}"?`)) {
            deactivateMutation.mutate(id)
        }
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`
        .cust-row { cursor: pointer; }
        .cust-row:hover td { background: #f8fafc; }
        .action-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 6px;
          transition: background 0.15s; display: flex; align-items: center;
        }
        .action-btn:hover        { background: #f1f5f9; }
        .action-btn.danger:hover { background: #fef2f2; }
        .search-input {
          padding: 9px 12px 9px 36px;
          border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 14px; outline: none; width: 280px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
          background: #fff;
        }
        .search-input:focus { border-color: #2563eb; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Customers
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        {meta?.total || 0} customers in your shop
                    </p>
                </div>
                {canEdit && (
                    <button onClick={openCreate} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#2563eb', color: '#fff',
                        border: 'none', borderRadius: '8px',
                        padding: '10px 18px', fontSize: '14px',
                        fontWeight: 500, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add customer
                    </button>
                )}
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                        <Spinner size={24} />
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading customers...</span>
                    </div>
                ) : customers.length === 0 ? (
                    <EmptyState
                        title="No customers found"
                        sub={search ? 'Try a different search term' : 'Add your first customer to get started'}
                        action={canEdit && !search ? 'Add customer' : undefined}
                        onAction={canEdit && !search ? openCreate : undefined}
                    />
                ) : (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Customer', 'Phone', 'Email', 'Total spent', 'Status', ''].map(h => (
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
                            {customers.map(c => (
                                <tr key={c.id} className="cust-row" onClick={() => setViewCustomer(c)}>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '34px', height: '34px',
                                                background: '#eff6ff', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                          <span style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600 }}>
                            {c.name?.charAt(0).toUpperCase()}
                          </span>
                                            </div>
                                            <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>
                          {c.name}
                        </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>
                        {c.phone || '—'}
                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>
                        {c.email || '—'}
                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ color: '#16a34a', fontSize: '14px', fontWeight: 600 }}>
                        {formatCurrency(c.totalSpent || 0)}
                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{
                          background: c.isActive ? '#f0fdf4' : '#f1f5f9',
                          color:      c.isActive ? '#16a34a' : '#94a3b8',
                          fontSize: '11px', fontWeight: 500,
                          padding: '2px 8px', borderRadius: '20px',
                      }}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                        {canEdit && (
                                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                                                <button className="action-btn" onClick={() => openEdit(c)} title="Edit">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </button>
                                                {c.isActive && (
                                                    <button className="action-btn danger" onClick={() => handleDeactivate(c.id, c.name)} title="Deactivate">
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10"/>
                                                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        )}
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
                  Page {meta.page} of {meta.totalPages} — {meta.total} customers
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

            {/* Create modal */}
            {showCreate && (
                <Modal title="Add customer" onClose={() => setShowCreate(false)}>
                    {formError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}
                    <CustomerFormModal
                        form={form}
                        onChange={setForm}
                        onSubmit={() => createMutation.mutate(form)}
                        onClose={() => setShowCreate(false)}
                        loading={createMutation.isPending}
                        isEdit={false}
                    />
                </Modal>
            )}

            {/* Edit modal */}
            {editCustomer && (
                <Modal title="Edit customer" onClose={() => setEditCustomer(null)}>
                    {formError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}
                    <CustomerFormModal
                        form={form}
                        onChange={setForm}
                        onSubmit={() => updateMutation.mutate({ id: editCustomer.id, f: form })}
                        onClose={() => setEditCustomer(null)}
                        loading={updateMutation.isPending}
                        isEdit={true}
                    />
                </Modal>
            )}

            {/* View detail modal */}
            {viewCustomer && (
                <CustomerDetailModal
                    customerId={viewCustomer.id}
                    onClose={() => setViewCustomer(null)}
                    onEdit={() => openEdit(viewCustomer)}
                />
            )}
        </div>
    )
}