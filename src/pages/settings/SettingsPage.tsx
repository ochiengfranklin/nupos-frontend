import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shopApi } from '../../api/shop.api'
import { useAuthStore } from '../../store/auth.store'
import { useSettingsStore } from '../../store/settings.store'
import { toast } from '../../components/ui/Toast'
import Spinner from '../../components/ui/Spinner'

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
    background: '#fff',
}

const disabledInputStyle: React.CSSProperties = {
    ...inputStyle,
    background: '#f8fafc',
    color: '#94a3b8',
    cursor: 'not-allowed',
}

function Field({
                   label, hint, children,
               }: {
    label:    string
    hint?:    string
    children: React.ReactNode
}) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{
                display: 'block', color: '#0f172a', fontSize: '13px',
                fontWeight: 500, marginBottom: '6px',
            }}>
                {label}
            </label>
            {children}
            {hint && (
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0', lineHeight: 1.5 }}>
                    {hint}
                </p>
            )}
        </div>
    )
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '12px', padding: '24px',
            marginBottom: '20px',
        }}>
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>
                    {title}
                </h3>
                {sub && <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{sub}</p>}
            </div>
            {children}
        </div>
    )
}

export default function SettingsPage() {
    const queryClient           = useQueryClient()
    const { shop, setAuth, user, accessToken, refreshToken } = useAuthStore()
    const { hasRole }           = useAuthStore()
    const canEdit               = hasRole(['MANAGER'])
    const { paperWidth, setPaperWidth } = useSettingsStore()

    const [form, setForm] = useState({
        name:          '',
        phone:         '',
        email:         '',
        address:       '',
        city:          '',
        country:       'Kenya',
        tillNumber:    '',
        taxRate:       '0',
        receiptFooter: '',
    })

    const { data, isLoading } = useQuery({
        queryKey: ['shop-settings'],
        queryFn:  () => shopApi.getShop().then(r => r.data.data),
    })

    useEffect(() => {
        if (data) {
            setForm({
                name:          data.name          || '',
                phone:         data.phone         || '',
                email:         data.email         || '',
                address:       data.address       || '',
                city:          data.city          || '',
                country:       data.country       || 'Kenya',
                tillNumber:    data.tillNumber    || '',
                taxRate:       data.taxRate       || '0',
                receiptFooter: data.receiptFooter || '',
            })
        }
    }, [data])

    const mutation = useMutation({
        mutationFn: () => shopApi.updateShop({
            name:          form.name          || undefined,
            phone:         form.phone         || undefined,
            email:         form.email         || undefined,
            address:       form.address       || undefined,
            city:          form.city          || undefined,
            country:       form.country       || undefined,
            tillNumber:    form.tillNumber    || undefined,
            taxRate:       parseFloat(form.taxRate) || 0,
            receiptFooter: form.receiptFooter || undefined,
        }),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['shop-settings'] })
            // Update auth store so shop name updates everywhere
            if (res.data.data && accessToken && refreshToken && user) {
                setAuth({
                    accessToken,
                    refreshToken,
                    user,
                    shop: res.data.data,
                })
            }
            toast.success('Settings saved successfully')
        },
        onError: () => toast.error('Failed to save settings'),
    })

    const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
                <Spinner size={24} />
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading settings...</span>
            </div>
        )
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '720px' }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                    Settings
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    Manage your shop configuration
                </p>
            </div>

            {/* Shop info */}
            <Section title="Shop information" sub="Basic details about your business">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <Field label="Shop name" hint="This appears on receipts and the customer portal">
                            <input
                                style={canEdit ? inputStyle : disabledInputStyle}
                                value={form.name}
                                onChange={e => set('name', e.target.value)}
                                disabled={!canEdit}
                                placeholder="e.g. Kamau Minimart"
                            />
                        </Field>
                    </div>
                    <Field label="Phone number" hint="Displayed on receipts">
                        <input
                            style={canEdit ? inputStyle : disabledInputStyle}
                            value={form.phone}
                            onChange={e => set('phone', e.target.value)}
                            disabled={!canEdit}
                            placeholder="07XXXXXXXX"
                        />
                    </Field>
                    <Field label="Email address">
                        <input
                            style={canEdit ? inputStyle : disabledInputStyle}
                            type="email"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            disabled={!canEdit}
                            placeholder="shop@email.com"
                        />
                    </Field>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <Field label="Address" hint="Street address shown on receipts">
                            <input
                                style={canEdit ? inputStyle : disabledInputStyle}
                                value={form.address}
                                onChange={e => set('address', e.target.value)}
                                disabled={!canEdit}
                                placeholder="e.g. Moi Avenue, Nairobi"
                            />
                        </Field>
                    </div>
                    <Field label="City">
                        <input
                            style={canEdit ? inputStyle : disabledInputStyle}
                            value={form.city}
                            onChange={e => set('city', e.target.value)}
                            disabled={!canEdit}
                            placeholder="e.g. Nairobi"
                        />
                    </Field>
                    <Field label="Country">
                        <input
                            style={canEdit ? inputStyle : disabledInputStyle}
                            value={form.country}
                            onChange={e => set('country', e.target.value)}
                            disabled={!canEdit}
                            placeholder="Kenya"
                        />
                    </Field>
                </div>
            </Section>

            {/* Shop ID — read only */}
            <Section title="Shop ID" sub="Your unique shop identifier — cannot be changed">
                <div style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '8px', padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
          <span style={{ color: '#0f172a', fontSize: '14px', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
            {data?.slug || shop?.slug || '—'}
          </span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(data?.slug || shop?.slug || '')
                            toast.success('Shop ID copied')
                        }}
                        style={{
                            background: 'none', border: '1px solid #e2e8f0',
                            borderRadius: '6px', padding: '4px 10px',
                            fontSize: '12px', color: '#64748b', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Copy
                    </button>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '8px 0 0' }}>
                    Share this with your cashiers: <strong>nupos-frontend.vercel.app/login?shop={data?.slug || shop?.slug}</strong>
                </p>
            </Section>

            {/* M-Pesa */}
            <Section title="M-Pesa settings" sub="Configure your M-Pesa till or paybill number">
                <Field label="Till number" hint="Your M-Pesa till number — shown to customers during checkout">
                    <input
                        style={canEdit ? inputStyle : disabledInputStyle}
                        value={form.tillNumber}
                        onChange={e => set('tillNumber', e.target.value)}
                        disabled={!canEdit}
                        placeholder="e.g. 247247"
                    />
                </Field>
                {form.tillNumber && (
                    <div style={{
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: '8px', padding: '12px 14px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                        </svg>
                        <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>
                            Customers will be asked to pay to till <strong>{form.tillNumber}</strong>
                        </p>
                    </div>
                )}
            </Section>

            {/* Receipt settings */}
            <Section title="Receipt settings" sub="Customize what appears on printed and WhatsApp receipts">
                <Field label="Receipt footer message" hint="Shown at the bottom of every receipt">
          <textarea
              style={{
                  ...(canEdit ? inputStyle : disabledInputStyle),
                  minHeight: '80px', resize: 'vertical',
              }}
              value={form.receiptFooter}
              onChange={e => set('receiptFooter', e.target.value)}
              disabled={!canEdit}
              placeholder="e.g. Thank you for shopping with us! Follow us on Instagram @kamauminimart"
          />
                </Field>

                <Field label="Tax rate (%)" hint="Applied to all sales. Set to 0 if you don't charge VAT">
                    <input
                        style={canEdit ? { ...inputStyle, maxWidth: '160px' } : { ...disabledInputStyle, maxWidth: '160px' }}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={form.taxRate}
                        onChange={e => set('taxRate', e.target.value)}
                        disabled={!canEdit}
                        placeholder="0"
                    />
                </Field>

                {/* Paper size */}
                <Field label="Thermal printer paper size" hint="Choose based on your printer model">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {(['58mm', '80mm'] as const).map(size => (
                            <button
                                key={size}
                                onClick={() => setPaperWidth(size)}
                                style={{
                                    padding: '10px 24px', borderRadius: '8px',
                                    border: `1.5px solid ${paperWidth === size ? '#2563eb' : '#e2e8f0'}`,
                                    background: paperWidth === size ? '#eff6ff' : '#fff',
                                    color: paperWidth === size ? '#2563eb' : '#64748b',
                                    fontSize: '14px', fontWeight: paperWidth === size ? 500 : 400,
                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                    transition: 'all 0.15s',
                                }}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '6px 0 0' }}>
                        {paperWidth === '58mm'
                            ? 'Common for small desktop thermal printers'
                            : 'Standard for most Kenyan POS printers'
                        }
                    </p>
                </Field>
            </Section>

            {/* Cashier login link */}
            <Section title="Cashier access" sub="Share this link with your cashiers so they don't need to remember the shop ID">
                <div style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '8px', padding: '12px 14px',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                }}>
          <span style={{ color: '#64748b', fontSize: '13px', wordBreak: 'break-all' }}>
            https://nupos-frontend.vercel.app/login?shop={data?.slug || shop?.slug}
          </span>
                    <button
                        onClick={() => {
                            const link = `https://nupos-frontend.vercel.app/login?shop=${data?.slug || shop?.slug}`
                            navigator.clipboard.writeText(link)
                            toast.success('Login link copied')
                        }}
                        style={{
                            background: '#2563eb', color: '#fff',
                            border: 'none', borderRadius: '6px',
                            padding: '6px 14px', fontSize: '12px',
                            fontWeight: 500, cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Copy link
                    </button>
                </div>
            </Section>

            {/* Save button */}
            {canEdit && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        style={{
                            padding: '11px 28px', borderRadius: '8px',
                            border: 'none', background: '#2563eb',
                            color: '#fff', fontSize: '14px', fontWeight: 500,
                            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            opacity: mutation.isPending ? 0.7 : 1,
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}
                    >
                        {mutation.isPending ? (
                            <>
                                <Spinner size={16} color="#fff" />
                                Saving...
                            </>
                        ) : 'Save settings'}
                    </button>
                </div>
            )}

            {!canEdit && (
                <div style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '8px', padding: '12px 16px',
                    color: '#64748b', fontSize: '13px',
                }}>
                    Only managers and owners can edit settings.
                </div>
            )}
        </div>
    )
}