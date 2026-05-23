import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscriptionApi } from '../../api/subscription.api'

export default function SubscriptionBanner() {
    const navigate              = useNavigate()
    const [sub,     setSub]     = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        subscriptionApi.get()
            .then((r: any) => setSub(r.data?.data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    if (loading || !sub) return null

    // Trial banner
    if (sub.status === 'TRIAL') {
        const daysLeft = sub.trialEndsAt
            ? Math.max(0, Math.ceil((new Date(sub.trialEndsAt).getTime() - Date.now()) / 86400000))
            : 0

        if (daysLeft > 3) return null

        return (
            <div style={{
                background: '#fef9c3', borderBottom: '1px solid #fde047',
                padding: '8px 24px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '12px',
                fontSize: '13px', fontWeight: 500,
                color: '#854d0e', flexShrink: 0, flexWrap: 'wrap',
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {daysLeft === 0
                    ? 'Your free trial has expired.'
                    : 'Your free trial ends in ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + '.'
                } Subscribe to keep using NuPOS.
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{
                        background: '#854d0e', color: '#fff',
                        border: 'none', borderRadius: '4px',
                        padding: '4px 12px', fontSize: '12px',
                        fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    View plans
                </button>
            </div>
        )
    }

    // Grace period banner
    if (sub.status === 'GRACE') {
        const daysLeft = sub.graceEndsAt
            ? Math.max(0, Math.ceil((new Date(sub.graceEndsAt).getTime() - Date.now()) / 86400000))
            : 0

        return (
            <div style={{
                background: '#fff7ed', borderBottom: '1px solid #fdba74',
                padding: '8px 24px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '12px',
                fontSize: '13px', fontWeight: 500,
                color: '#9a3412', flexShrink: 0, flexWrap: 'wrap',
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Payment overdue. Your account will be suspended in {daysLeft} day{daysLeft === 1 ? '' : 's'}.
                <button
                    onClick={() => navigate('/app/billing')}
                    style={{
                        background: '#9a3412', color: '#fff',
                        border: 'none', borderRadius: '4px',
                        padding: '4px 12px', fontSize: '12px',
                        fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    Renew now
                </button>
            </div>
        )
    }

    // Suspended — full paywall
    if (sub.status === 'SUSPENDED') {
        return (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: 'rgba(15,23,42,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Sans', sans-serif",
            }}>
                <div style={{
                    background: '#fff', borderRadius: '16px',
                    padding: '40px', maxWidth: '440px', width: '90%',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '56px', height: '56px', background: '#fef2f2',
                        borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                    </div>
                    <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
                        Account suspended
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
                        Your subscription has expired. Subscribe to a plan to continue using NuPOS. Your data is safe and will be restored immediately after payment.
                    </p>
                    <button
                        onClick={() => navigate('/app/billing')}
                        style={{
                            width: '100%', padding: '12px',
                            background: '#2563eb', color: '#fff',
                            border: 'none', borderRadius: '8px',
                            fontSize: '15px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Choose a plan
                    </button>
                </div>
            </div>
        )
    }

    return null
}