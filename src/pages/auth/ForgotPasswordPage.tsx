import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useScreenSize } from '../../utils/responsive'

export default function ForgotPasswordPage() {
    const navigate    = useNavigate()
    const { isSmall } = useScreenSize()

    const [form, setForm] = useState({ shopSlug: '', email: '' })
    const [loading,   setLoading]   = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error,     setError]     = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await authApi.forgotPassword(form)
            setSubmitted(true)
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: '#fff', borderBottom: '1px solid #e1e3e5',
                padding: '0 32px', height: '56px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    <div style={{
                        width: '28px', height: '28px', background: '#008060',
                        borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>NuPOS</span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{ background: 'none', border: 'none', color: '#008060', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                >
                    Back to login
                </button>
            </nav>

            <div style={{
                minHeight: '100vh', background: '#f6f6f7',
                display: 'flex', flexDirection: 'column',
                fontFamily: "'DM Sans', sans-serif", paddingTop: '56px',
            }}>
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }
          .fp-input {
            width: 100%; padding: 10px 14px;
            border: 1.5px solid #e1e3e5; border-radius: 6px;
            font-size: 14px; color: #1a1a1a; background: #fff;
            outline: none; transition: border-color 0.15s, box-shadow 0.15s;
            font-family: 'DM Sans', sans-serif; box-sizing: border-box;
          }
          .fp-input:focus { border-color: #008060; box-shadow: 0 0 0 3px rgba(0,128,96,0.1); }
          .fp-input::placeholder { color: #b0b8bf; }
          .fp-btn {
            width: 100%; padding: 12px; background: #008060;
            color: #fff; border: none; border-radius: 6px;
            font-size: 15px; font-weight: 600; cursor: pointer;
            font-family: 'DM Sans', sans-serif; transition: background 0.15s;
          }
          .fp-btn:hover:not(:disabled) { background: #005c43; }
          .fp-btn:disabled { opacity: 0.65; cursor: not-allowed; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: isSmall ? '24px 16px' : '40px 24px',
                }}>
                    <div style={{ width: '100%', maxWidth: '440px' }}>
                        <div style={{
                            background: '#fff', border: '1px solid #e1e3e5',
                            borderRadius: '12px', padding: '36px 32px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                            {!submitted ? (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', background: '#f0fdf4',
                                            borderRadius: '10px', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', margin: '0 auto 16px',
                                            border: '1px solid #bbf7d0',
                                        }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                                <path d="M7 11V7a5 5 0 0110 0v4"/>
                                            </svg>
                                        </div>
                                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                                            Forgot your password?
                                        </h1>
                                        <p style={{ color: '#6d7175', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                                            Enter your shop ID and email and we'll send you a reset link.
                                        </p>
                                    </div>

                                    {error && (
                                        <div style={{
                                            background: '#fff4f4', border: '1px solid #ffd2d2',
                                            borderRadius: '6px', padding: '10px 14px', marginBottom: '20px',
                                            display: 'flex', alignItems: 'flex-start', gap: '8px',
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            <span style={{ color: '#c0392b', fontSize: '13px', lineHeight: 1.5 }}>{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                                Shop ID
                                            </label>
                                            <input
                                                type="text"
                                                className="fp-input"
                                                placeholder="e.g. kamau-minimart"
                                                value={form.shopSlug}
                                                onChange={e => setForm({ ...form, shopSlug: e.target.value })}
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <div style={{ marginBottom: '24px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                                Email address
                                            </label>
                                            <input
                                                type="email"
                                                className="fp-input"
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <button type="submit" disabled={loading} className="fp-btn">
                                            {loading ? (
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                         style={{ animation: 'spin 0.8s linear infinite' }}>
                                                        <line x1="12" y1="2"  x2="12" y2="6"/>
                                                        <line x1="12" y1="18" x2="12" y2="22"/>
                                                        <line x1="4.93" y1="4.93"   x2="7.76"  y2="7.76"/>
                                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                                                        <line x1="2"  y1="12" x2="6"  y2="12"/>
                                                        <line x1="18" y1="12" x2="22" y2="12"/>
                                                        <line x1="4.93"  y1="19.07" x2="7.76"  y2="16.24"/>
                                                        <line x1="16.24" y1="7.76"  x2="19.07" y2="4.93"/>
                                                    </svg>
                                                    Sending...
                                                </span>
                                            ) : 'Send reset link'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '56px', height: '56px', background: '#f0fdf4',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', margin: '0 auto 20px',
                                        border: '1px solid #bbf7d0',
                                    }}>
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20,6 9,17 4,12"/>
                                        </svg>
                                    </div>
                                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                                        Check your email
                                    </h2>
                                    <p style={{ color: '#6d7175', fontSize: '14px', lineHeight: 1.7, margin: '0 0 24px' }}>
                                        If an account exists for <strong>{form.email}</strong>, we've sent a password reset link. Check your inbox and spam folder.
                                    </p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        style={{
                                            width: '100%', padding: '12px', background: '#008060',
                                            color: '#fff', border: 'none', borderRadius: '6px',
                                            fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        Back to login
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}