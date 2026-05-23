import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscriptionApi } from '../../api/subscription.api'
import { toast } from '../../components/ui/Toast'
import Spinner from '../../components/ui/Spinner'

const PLANS = [
    {
        key:         'STARTER',
        name:        'Starter',
        price:       999,
        description: 'For small shops just getting started with digital POS.',
        features:    [
            '1 cashier account',
            'Up to 200 products',
            'Sales history',
            'M-Pesa integration',
            'Basic reports',
            'Email support',
        ],
        popular: false,
    },
    {
        key:         'BUSINESS',
        name:        'Business',
        price:       2499,
        description: 'For growing shops that need more users and advanced features.',
        features:    [
            'Up to 5 user accounts',
            'Unlimited products',
            'Advanced reports',
            'M-Pesa integration',
            'Customer management',
            'Inventory alerts',
            'Priority support',
        ],
        popular: true,
    },
]

function CheckIcon({ color = '#16a34a' }: { color?: string }) {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12"/>
        </svg>
    )
}

function PlanCard({
                      plan, isCurrent, checkingOut, onCheckout,
                  }: {
    plan:        typeof PLANS[0]
    isCurrent:   boolean
    checkingOut: string | null
    onCheckout:  (key: 'STARTER' | 'BUSINESS') => void
}) {
    return (
        <div style={{
            background:   '#fff',
            border:       plan.popular ? '2px solid #2563eb' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding:      '24px',
            position:     'relative',
        }}>
            {plan.popular && (
                <div style={{
                    position:     'absolute',
                    top:          '-12px',
                    left:         '50%',
                    transform:    'translateX(-50%)',
                    background:   '#2563eb',
                    color:        '#fff',
                    fontSize:     '11px',
                    fontWeight:   700,
                    padding:      '3px 12px',
                    borderRadius: '20px',
                    whiteSpace:   'nowrap',
                }}>
                    MOST POPULAR
                </div>
            )}
            <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>
                {plan.name}
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>
                {plan.description}
            </p>
            <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#0f172a', fontSize: '32px', fontWeight: 800 }}>
                    KES {plan.price.toLocaleString()}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>/month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckIcon />
                        <span style={{ color: '#0f172a', fontSize: '13px' }}>{f}</span>
                    </div>
                ))}
            </div>
            <button
                onClick={() => { if (!isCurrent) onCheckout(plan.key as 'STARTER' | 'BUSINESS') }}
                disabled={isCurrent || checkingOut === plan.key}
                style={{
                    width:        '100%',
                    padding:      '11px',
                    border:       'none',
                    borderRadius: '8px',
                    background:   isCurrent ? '#f1f5f9' : plan.popular ? '#2563eb' : '#0f172a',
                    color:        isCurrent ? '#94a3b8' : '#fff',
                    fontSize:     '14px',
                    fontWeight:   600,
                    cursor:       isCurrent ? 'not-allowed' : 'pointer',
                    fontFamily:   "'DM Sans', sans-serif",
                }}
            >
                {checkingOut === plan.key ? 'Redirecting...' : isCurrent ? 'Current plan' : 'Subscribe now'}
            </button>
        </div>
    )
}

function EnterpriseCard() {
    const navigate = useNavigate()
    return (
        <div style={{
            background:   '#0f172a',
            border:       '1px solid #1e293b',
            borderRadius: '12px',
            padding:      '24px',
        }}>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>
                Enterprise
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px' }}>
                For wholesalers and businesses with multiple branches.
            </p>
            <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#fff', fontSize: '32px', fontWeight: 800 }}>Custom</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                    'Unlimited users',
                    'Multi-branch support',
                    'Custom reports',
                    'API access',
                    'Dedicated account manager',
                    'On-site training',
                ].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckIcon color="#16a34a" />
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{f}</span>
                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate('/contact')}
                style={{
                    width:          '100%',
                    padding:        '11px',
                    border:         '1px solid #334155',
                    borderRadius:   '8px',
                    background:     'transparent',
                    color:          '#fff',
                    fontSize:       '14px',
                    fontWeight:     600,
                    cursor:         'pointer',
                    fontFamily:     "'DM Sans', sans-serif",
                    textAlign:      'center',
                }}
            >
                Contact us
            </button>
        </div>
    )
}

export default function BillingPage() {
    const [sub,         setSub]         = useState<any>(null)
    const [loading,     setLoading]     = useState(true)
    const [checkingOut, setCheckingOut] = useState<string | null>(null)

    useEffect(() => {
        subscriptionApi.get()
            .then((r: any) => setSub(r.data?.data))
            .catch(() => toast.error('Failed to load subscription'))
            .finally(() => setLoading(false))
    }, [])

    const handleCheckout = async (plan: 'STARTER' | 'BUSINESS') => {
        setCheckingOut(plan)
        try {
            const res = await subscriptionApi.checkout(plan)
            const { redirectUrl } = res.data?.data
            window.location.href = redirectUrl
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'Failed to initiate checkout')
        } finally {
            setCheckingOut(null)
        }
    }

    const getDaysLeft = (date: string) =>
        Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000))

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
                <Spinner size={24} />
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading billing info...</span>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#0f172a', fontSize: '24px', fontWeight: 700, margin: '0 0 6px' }}>
                    Billing and Plans
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                    Manage your NuPOS subscription
                </p>
            </div>

            {sub && (
                <div style={{
                    background:   '#fff',
                    border:       '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding:      '24px',
                    marginBottom: '32px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px' }}>Current plan</p>
                            <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>
                                {sub.plan === 'TRIAL' ? 'Free Trial' : sub.plan.charAt(0) + sub.plan.slice(1).toLowerCase()}
                            </h2>
                            <span style={{
                                display:      'inline-block',
                                padding:      '3px 10px',
                                borderRadius: '20px',
                                fontSize:     '12px',
                                fontWeight:   600,
                                background:   sub.status === 'ACTIVE' ? '#f0fdf4' :
                                    sub.status === 'TRIAL'  ? '#eff6ff' :
                                        sub.status === 'GRACE'  ? '#fff7ed' : '#fef2f2',
                                color:        sub.status === 'ACTIVE' ? '#16a34a' :
                                    sub.status === 'TRIAL'  ? '#2563eb' :
                                        sub.status === 'GRACE'  ? '#ea580c' : '#dc2626',
                            }}>
                                {sub.status === 'TRIAL'  ? 'Trial — ' + getDaysLeft(sub.trialEndsAt) + ' days left' :
                                    sub.status === 'ACTIVE' ? 'Active' :
                                        sub.status === 'GRACE'  ? 'Grace period — ' + getDaysLeft(sub.graceEndsAt) + ' days left' :
                                            'Suspended'}
                            </span>
                        </div>
                        {sub.currentPeriodEnd && sub.status === 'ACTIVE' && (
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px' }}>Next billing date</p>
                                <p style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, margin: 0 }}>
                                    {new Date(sub.currentPeriodEnd).toLocaleDateString('en-KE', {
                                        day: 'numeric', month: 'long', year: 'numeric',
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <h2 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>
                {sub?.status === 'ACTIVE' ? 'Change plan' : 'Choose a plan'}
            </h2>

            <div style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap:                 '16px',
                marginBottom:        '32px',
            }}>
                {PLANS.map(plan => (
                    <PlanCard
                        key={plan.key}
                        plan={plan}
                        isCurrent={sub?.plan === plan.key && sub?.status === 'ACTIVE'}
                        checkingOut={checkingOut}
                        onCheckout={handleCheckout}
                    />
                ))}
                <EnterpriseCard />
            </div>
        </div>
    )
}