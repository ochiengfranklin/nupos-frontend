import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi } from '../../api/product.api'
import type {Product, Category} from '../../types'
import { formatCurrency } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'

//  Types
interface ProductFormData {
    name:              string
    sku:               string
    barcode:           string
    price:             string
    costPrice:         string
    stockQuantity:     string
    lowStockThreshold: string
    categoryId:        string
    description:       string
}

const emptyForm: ProductFormData = {
    name:              '',
    sku:               '',
    barcode:           '',
    price:             '',
    costPrice:         '',
    stockQuantity:     '',
    lowStockThreshold: '5',
    categoryId:        '',
    description:       '',
}

//   Stock badge
function StockBadge({ qty, threshold }: { qty: number; threshold: number }) {
    if (qty === 0) {
        return (
            <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
        Out of stock
      </span>
        )
    }
    if (qty <= threshold) {
        return (
            <span style={{ background: '#fff7ed', color: '#ea580c', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
        Low: {qty}
      </span>
        )
    }
    return (
        <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
      {qty} in stock
    </span>
    )
}

//   Modal
function Modal({ title, onClose, children }: {
    title:    string
    onClose:  () => void
    children: React.ReactNode
}) {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,23,42,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '24px',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                width: '100%', maxWidth: '560px',
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                }}>
                    <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 500, margin: 0 }}>
                        {title}
                    </h3>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', padding: '4px',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div style={{ padding: '24px' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

//   Form field
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{
                display: 'block',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
            }}>
                {label}
            </label>
            {children}
        </div>
    )
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    background: '#fff',
}

//   Product form
function ProductForm({
                         form,
                         categories,
                         onChange,
                         onSubmit,
                         onClose,
                         loading,
                         isEdit,
                     }: {
    form:       ProductFormData
    categories: Category[]
    onChange:   (f: ProductFormData) => void
    onSubmit:   () => void
    onClose:    () => void
    loading:    boolean
    isEdit:     boolean
}) {
    const set = (key: keyof ProductFormData, val: string) =>
        onChange({ ...form, [key]: val })

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Product name *">
                        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Coca Cola 500ml" />
                    </Field>
                </div>
                <Field label="SKU">
                    <input style={inputStyle} value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. COKE-500" />
                </Field>
                <Field label="Barcode">
                    <input style={inputStyle} value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="e.g. 5000112637922" />
                </Field>
                <Field label="Selling price (KES) *">
                    <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
                </Field>
                <Field label="Cost price (KES)">
                    <input style={inputStyle} type="number" min="0" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" />
                </Field>
                {!isEdit && (
                    <Field label="Opening stock">
                        <input style={inputStyle} type="number" min="0" value={form.stockQuantity} onChange={e => set('stockQuantity', e.target.value)} placeholder="0" />
                    </Field>
                )}
                <Field label="Low stock alert">
                    <input style={inputStyle} type="number" min="0" value={form.lowStockThreshold} onChange={e => set('lowStockThreshold', e.target.value)} placeholder="5" />
                </Field>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Category">
                        <select
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            value={form.categoryId}
                            onChange={e => set('categoryId', e.target.value)}
                        >
                            <option value="">No category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Description">
            <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Optional product description"
            />
                    </Field>
                </div>
            </div>

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
                    disabled={loading || !form.name || !form.price}
                    style={{
                        padding: '9px 20px', borderRadius: '8px',
                        border: 'none', background: '#3b82f6',
                        color: '#fff', fontSize: '14px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        opacity: loading || !form.name || !form.price ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
                </button>
            </div>
        </>
    )
}

//   Main page
export default function ProductsPage() {
    const queryClient = useQueryClient()
    const { hasRole }  = useAuthStore()
    const canEdit      = hasRole(['MANAGER'])

    const [search,       setSearch]       = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [lowStockOnly, setLowStockOnly] = useState(false)
    const [page,         setPage]         = useState(1)
    const [showCreate,   setShowCreate]   = useState(false)
    const [editProduct,  setEditProduct]  = useState<Product | null>(null)
    const [form,         setForm]         = useState<ProductFormData>(emptyForm)
    const [formError,    setFormError]    = useState('')

    // Queries
    const { data, isLoading } = useQuery({
        queryKey: ['products', page, search, categoryFilter, lowStockOnly],
        queryFn: () =>
            productApi.getAll({
                page,
                limit: 20,
                search:     search     || undefined,
                categoryId: categoryFilter || undefined,
                lowStock:   lowStockOnly || undefined,
            }).then(r => r.data),
    })

    const { data: catData } = useQuery({
        queryKey: ['categories'],
        queryFn:  () => categoryApi.getAll().then(r => r.data.data || []),
    })

    const categories: Category[] = catData || []
    const products:   Product[]  = data?.data || []
    const meta                   = data?.meta

    // Mutations
    const createMutation = useMutation({
        mutationFn: (f: ProductFormData) =>
            productApi.create({
                name:              f.name,
                sku:               f.sku       || undefined,
                barcode:           f.barcode   || undefined,
                description:       f.description || undefined,
                price:             parseFloat(f.price),
                costPrice:         parseFloat(f.costPrice || '0'),
                stockQuantity:     parseInt(f.stockQuantity || '0'),
                lowStockThreshold: parseInt(f.lowStockThreshold || '5'),
                categoryId:        f.categoryId || undefined,
            } as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setShowCreate(false)
            setForm(emptyForm)
            setFormError('')
        },
        onError: (e: any) => setFormError(e?.response?.data?.message || 'Failed to create product'),
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, f }: { id: string; f: ProductFormData }) =>
            productApi.update(id, {
                name:              f.name,
                sku:               f.sku       || undefined,
                barcode:           f.barcode   || undefined,
                description:       f.description || undefined,
                price:             parseFloat(f.price),
                costPrice:         parseFloat(f.costPrice || '0'),
                lowStockThreshold: parseInt(f.lowStockThreshold || '5'),
                categoryId:        f.categoryId || undefined,
            } as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setEditProduct(null)
            setForm(emptyForm)
            setFormError('')
        },
        onError: (e: any) => setFormError(e?.response?.data?.message || 'Failed to update product'),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productApi.delete(id),
        onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    })

    // Handlers
    const openCreate = () => {
        setForm(emptyForm)
        setFormError('')
        setShowCreate(true)
    }

    const openEdit = (p: Product) => {
        setForm({
            name:              p.name,
            sku:               p.sku          || '',
            barcode:           p.barcode      || '',
            price:             p.price,
            costPrice:         p.costPrice,
            stockQuantity:     String(p.stockQuantity),
            lowStockThreshold: String(p.lowStockThreshold),
            categoryId:        p.categoryId   || '',
            description:       '',
        })
        setFormError('')
        setEditProduct(p)
    }

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Delete "${name}"? This cannot be undone.`)) {
            deleteMutation.mutate(id)
        }
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1200px' }}>
            <style>{`
        .action-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 6px;
          transition: background 0.15s;
          display: flex; align-items: center;
        }
        .action-btn:hover { background: #f1f5f9; }
        .action-btn.danger:hover { background: #fef2f2; }
        .filter-btn {
          padding: 8px 14px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: #fff;
          font-size: 13px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          color: #64748b; transition: all 0.15s;
        }
        .filter-btn.active {
          background: #eff6ff; border-color: #bfdbfe; color: #2563eb;
        }
        .search-input {
          padding: 9px 12px 9px 36px;
          border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 14px; outline: none; width: 260px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
        }
        .search-input:focus { border-color: #3b82f6; }
        tr:hover td { background: #f8fafc; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Products
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        {meta?.total || 0} products in your shop
                    </p>
                </div>
                {canEdit && (
                    <button onClick={openCreate} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#3b82f6', color: '#fff',
                        border: 'none', borderRadius: '10px',
                        padding: '10px 18px', fontSize: '14px',
                        fontWeight: 500, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add product
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
                <select
                    style={{
                        padding: '9px 12px', borderRadius: '8px',
                        border: '1px solid #e2e8f0', background: '#fff',
                        fontSize: '13px', color: '#64748b', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif", outline: 'none',
                    }}
                    value={categoryFilter}
                    onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
                >
                    <option value="">All categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button
                    className={`filter-btn${lowStockOnly ? ' active' : ''}`}
                    onClick={() => { setLowStockOnly(!lowStockOnly); setPage(1) }}
                >
                    ⚠️ Low stock only
                </button>
            </div>

            {/* Table */}
            <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
            }}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 8px' }}>No products found</p>
                        <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0 }}>
                            {search ? 'Try a different search term' : 'Add your first product to get started'}
                        </p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            {['Product', 'SKU', 'Category', 'Price', 'Cost', 'Stock', ''].map(h => (
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
                        {products.map(p => (
                            <tr key={p.id}>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>
                                        {p.name}
                                    </p>
                                    {p.barcode && (
                                        <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0, fontFamily: 'monospace' }}>
                                            {p.barcode}
                                        </p>
                                    )}
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', fontFamily: 'monospace' }}>
                      {p.sku || '—'}
                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    {p.category ? (
                                        <span style={{
                                            background: '#f1f5f9', color: '#64748b',
                                            fontSize: '12px', padding: '3px 8px', borderRadius: '6px',
                                        }}>
                        {p.category.name}
                      </span>
                                    ) : (
                                        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>—</span>
                                    )}
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>
                      {formatCurrency(p.price)}
                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                      {formatCurrency(p.costPrice)}
                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    <StockBadge qty={p.stockQuantity} threshold={p.lowStockThreshold} />
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    {canEdit && (
                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                            <button className="action-btn" onClick={() => openEdit(p)} title="Edit">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button className="action-btn danger" onClick={() => handleDelete(p.id, p.name)} title="Delete">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderTop: '1px solid #f1f5f9',
                    }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
              Page {meta.page} of {meta.totalPages} — {meta.total} products
            </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{
                                    padding: '6px 14px', borderRadius: '8px',
                                    border: '1px solid #e2e8f0', background: '#fff',
                                    fontSize: '13px', cursor: 'pointer',
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
                                    fontSize: '13px', cursor: 'pointer',
                                    color: page === meta.totalPages ? '#cbd5e1' : '#64748b',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create modal */}
            {showCreate && (
                <Modal title="Add product" onClose={() => setShowCreate(false)}>
                    {formError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}
                    <ProductForm
                        form={form}
                        categories={categories}
                        onChange={setForm}
                        onSubmit={() => createMutation.mutate(form)}
                        onClose={() => setShowCreate(false)}
                        loading={createMutation.isPending}
                        isEdit={false}
                    />
                </Modal>
            )}

            {/* Edit modal */}
            {editProduct && (
                <Modal title="Edit product" onClose={() => setEditProduct(null)}>
                    {formError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}
                    <ProductForm
                        form={form}
                        categories={categories}
                        onChange={setForm}
                        onSubmit={() => updateMutation.mutate({ id: editProduct.id, f: form })}
                        onClose={() => setEditProduct(null)}
                        loading={updateMutation.isPending}
                        isEdit={true}
                    />
                </Modal>
            )}
        </div>
    )
}