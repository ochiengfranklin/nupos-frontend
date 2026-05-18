import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loyaltyApi } from '../../api/loyalty.api'
import { useAuthStore } from '../../store/auth.store'
import { toast } from '../../components/ui/Toast'
import Spinner from '../../components/ui/Spinner'

export default function LoyaltySettingsPage() {
    const queryClient = useQueryClient()
    const { hasRole } = useAuthStore()
    const canEdit     = hasRole(['MANAGER'])

    const { data, isLoading } = useQuery({
        queryKey: ['loyalty-settings'],
        queryFn:  () => loyaltyApi.getSettings().then(r => r.data.data),
    })

    const [form, setForm] = useState({
        isEnabled:            true,
        pointsPerHundred:     10,
        pointsRedemptionRate: 1,
        minimumRedemption:    100,
    })

    useEffect(() => {
        if (data) setForm({
            isEnabled:            data.isEnabled,
            pointsPerHundred:     data.pointsPerHundred,
            pointsRedemptionRate: data.pointsRedemptionRate,
            minimumRedemption:    data.minimumRedemption,
        })
    }, [data])

    const mutation = useMutation({
        mutationFn: () => loyaltyApi.updateSettings(form),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loyalty-settings'] })
            toast.success('Loyalty settings saved')
        },
        onError: () => toast.error('Failed to save settings'),
    })

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '9px 12px',
        border: '1px solid #e2e8f0', borderRadius: '8px',
        fontSize: '14px', color: '#0f172a', outline: 'none',
        boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
        background: '#fff',
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
                <Spinner size={24} />
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</span>
            </div>
        )
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '640px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                    Loyalty program
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    Reward customers with points for every purchase
                </p>
            </div>

            {/* Enable toggle */}
            <div style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: '12px', padding: '20px 24px', marginBottom: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 4px' }}>
                        Enable loyalty program
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                        Customers earn and redeem points with every purchase
                    </p>
                </div>
                <button
                    onClick={() => canEdit && setForm({ ...form, isEnabled: !form.isEnabled })}
                    style={{
                        width: '44px', height: '24px',
                        borderRadius: '12px',
                        background: form.isEnabled ? '#7c3aed' : '#e2e8f0',
                        border: 'none', cursor: canEdit ? 'pointer' : 'not-allowed',
                        position: 'relative', transition: 'background 0.2s',
                        flexShrink: 0,
                    }}
                >
                    <div style={{
                        width: '18px', height: '18px',
                        borderRadius: '50%', background: '#fff',
                        position: 'absolute',
                        top: '3px',
                        left: form.isEnabled ? '23px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                </button>
            </div>

            {form.isEnabled && (
                <div style={{
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: '12px', padding: '24px',
                    marginBottom: '16px',
                }}>
                    <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 500, margin: '0 0 20px' }}>
                        Points configuration
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Points per KES 100
                            </label>
                            <input
                                style={inputStyle}
                                type="number" min="1" max="1000"
                                value={form.pointsPerHundred}
                                onChange={e => setForm({ ...form, pointsPerHundred: parseInt(e.target.value) || 1 })}
                                disabled={!canEdit}
                            />
                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0' }}>
                                e.g. {form.pointsPerHundred} points for every KES 100 spent
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                KES value per point
                            </label>
                            <input
                                style={inputStyle}
                                type="number" min="1" max="100"
                                value={form.pointsRedemptionRate}
                                onChange={e => setForm({ ...form, pointsRedemptionRate: parseInt(e.target.value) || 1 })}
                                disabled={!canEdit}
                            />
                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0' }}>
                                1 point = KES {form.pointsRedemptionRate}
                            </p>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Minimum points to redeem
                            </label>
                            <input
                                style={inputStyle}
                                type="number" min="1"
                                value={form.minimumRedemption}
                                onChange={e => setForm({ ...form, minimumRedemption: parseInt(e.target.value) || 1 })}
                                disabled={!canEdit}
                            />
                            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0' }}>
                                Customer needs at least {form.minimumRedemption} points to redeem
                            </p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div style={{
                        background: '#fdf4ff', border: '1px solid #e9d5ff',
                        borderRadius: '10px', padding: '16px', marginTop: '20px',
                    }}>
                        <p style={{ color: '#7c3aed', fontSize: '12px', fontWeight: 600, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            ⭐ Example
                        </p>
                        <p style={{ color: '#4a4a4a', fontSize: '13px', margin: '0 0 6px', lineHeight: 1.6 }}>
                            Customer spends <strong>KES 500</strong> →
                            earns <strong>{Math.floor(5 * form.pointsPerHundred)} points</strong>
                        </p>
                        <p style={{ color: '#4a4a4a', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                            Customer has <strong>{form.minimumRedemption} points</strong> →
                            redeems for <strong>KES {form.minimumRedemption * form.pointsRedemptionRate} discount</strong>
                        </p>
                    </div>
                </div>
            )}

            {canEdit && (
                <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                    style={{
                        padding: '11px 24px', borderRadius: '8px',
                        border: 'none', background: '#7c3aed',
                        color: '#fff', fontSize: '14px', fontWeight: 500,
                        cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        opacity: mutation.isPending ? 0.7 : 1,
                    }}
                >
                    {mutation.isPending ? 'Saving...' : 'Save settings'}
                </button>
            )}
        </div>
    )
}