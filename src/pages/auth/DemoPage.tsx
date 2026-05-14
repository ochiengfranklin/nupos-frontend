import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'

export default function DemoPage() {
    const navigate = useNavigate()
    const setAuth  = useAuthStore((state) => state.setAuth)
    const [error,  setError] = useState('')

    useEffect(() => {
        const loginDemo = async () => {
            try {
                const response = await authApi.loginDemo()
                const { accessToken, refreshToken, user, shop } = response.data.data!
                setAuth({ accessToken, refreshToken, user, shop })
                navigate('/app/sales/new')
            } catch (err: any) {
                console.error('Demo login failed:', err?.response?.data || err?.message)
                setError('Demo unavailable. Please try again later.')
            }
        }
        loginDemo()
    }, [])

    return (
        <div style={{
            minHeight: '100vh', background: '#f6f6f7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ textAlign: 'center', maxWidth: '360px', padding: '0 24px' }}>
                {error ? (
                    <div style={{
                        background: '#fff', border: '1px solid #e1e3e5',
                        borderRadius: '12px', padding: '32px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{
                            width: '48px', height: '48px', background: '#fff4f4',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 16px',
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <h3 style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 700, margin: '0 0 8px' }}>
                            Demo unavailable
                        </h3>
                        <p style={{ color: '#6d7175', fontSize: '13px', margin: '0 0 24px', lineHeight: 1.6 }}>
                            The demo account could not be loaded. Please try signing up for free instead.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    width: '100%', padding: '10px',
                                    background: '#008060', color: '#fff',
                                    border: 'none', borderRadius: '6px',
                                    fontSize: '14px', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    width: '100%', padding: '10px',
                                    background: '#fff', color: '#1a1a1a',
                                    border: '1.5px solid #e1e3e5', borderRadius: '6px',
                                    fontSize: '14px', fontWeight: 500,
                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Sign up free instead
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#6d7175', fontSize: '13px',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                ← Back to home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', border: '1px solid #e1e3e5',
                        borderRadius: '12px', padding: '40px 32px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{
                            width: '32px', height: '32px',
                            border: '3px solid #e1e3e5', borderTopColor: '#008060',
                            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 20px',
                        }} />
                        <p style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>
                            Loading your demo...
                        </p>
                        <p style={{ color: '#6d7175', fontSize: '13px', margin: 0 }}>
                            Setting up Demo Minimart for you
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}