import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import { getErrorMessage } from '../../utils/helpers'
import { useScreenSize } from '../../utils/responsive'

export default function LoginPage() {
    const navigate = useNavigate()
    const setAuth  = useAuthStore((state) => state.setAuth)
    const { isSmall } = useScreenSize()

    const [form, setForm] = useState({
        shopSlug: '',
        email:    '',
        password: '',
    })
    const [error,       setError]       = useState('')
    const [loading,     setLoading]     = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await authApi.login(form)
            const { accessToken, refreshToken, user, shop } = response.data.data!
            setAuth({ accessToken, refreshToken, user, shop })
            navigate('/app/dashboard')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Sticky navbar — outside the scrollable area */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: '#fff',
                borderBottom: '1px solid #e1e3e5',
                padding: '0 32px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
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

                <p style={{ color: '#6d7175', fontSize: '13px', margin: 0 }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        style={{ background: 'none', border: 'none', color: '#008060', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: 0 }}
                    >
                        Start free trial
                    </button>
                </p>
            </nav>

            {/* Scrollable content — padded top to account for fixed navbar */}
            <div style={{
                minHeight: '100vh',
                background: '#f6f6f7',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'DM Sans', sans-serif",
                paddingTop: '56px',
            }}>
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }

          .login-input {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid #e1e3e5;
            border-radius: 6px;
            font-size: 14px;
            color: #1a1a1a;
            background: #fff;
            outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
            font-family: 'DM Sans', sans-serif;
            box-sizing: border-box;
          }
          .login-input:focus {
            border-color: #008060;
            box-shadow: 0 0 0 3px rgba(0,128,96,0.1);
          }
          .login-input::placeholder { color: #b0b8bf; }

          .login-btn {
            width: 100%;
            padding: 12px;
            background: #008060;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            transition: background 0.15s;
            letter-spacing: -0.01em;
          }
          .login-btn:hover:not(:disabled) { background: #005c43; }
          .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

          .eye-btn {
            position: absolute; right: 12px; top: 50%;
            transform: translateY(-50%);
            background: none; border: none; cursor: pointer;
            color: #6d7175; padding: 0; display: flex; align-items: center;
            transition: color 0.15s;
          }
          .eye-btn:hover { color: #1a1a1a; }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

                {/* Main content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isSmall ? '24px 16px' : '40px 24px',
                }}>
                    <div style={{ width: '100%', maxWidth: '440px' }}>

                        {/* Card */}
                        <div style={{
                            background: '#fff',
                            border: '1px solid #e1e3e5',
                            borderRadius: '12px',
                            padding: '36px 32px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                <div style={{
                                    width: '44px', height: '44px', background: '#008060',
                                    borderRadius: '10px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', margin: '0 auto 16px',
                                }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 01-8 0"/>
                                    </svg>
                                </div>
                                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                                    Log in to NuPOS
                                </h1>
                                <p style={{ color: '#6d7175', fontSize: '14px', margin: 0 }}>
                                    Enter your shop details to continue
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    background: '#fff4f4',
                                    border: '1px solid #ffd2d2',
                                    borderRadius: '6px',
                                    padding: '10px 14px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    <span style={{ color: '#c0392b', fontSize: '13px', lineHeight: 1.5 }}>{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>

                                {/* Shop ID */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Shop ID
                                    </label>
                                    <input
                                        type="text"
                                        className="login-input"
                                        placeholder="e.g. kamau-minimart"
                                        value={form.shopSlug}
                                        onChange={e => setForm({ ...form, shopSlug: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <p style={{ color: '#6d7175', fontSize: '12px', margin: '5px 0 0' }}>
                                        Your unique shop identifier
                                    </p>
                                </div>

                                {/* Email */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="login-input"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {}}
                                            style={{ background: 'none', border: 'none', color: '#008060', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: 0 }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="login-input"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            style={{ paddingRight: '44px' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={loading} className="login-btn">
                                    {loading ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           style={{ animation: 'spin 0.8s linear infinite' }}>
                        <line x1="12" y1="2" x2="12" y2="6"/>
                        <line x1="12" y1="18" x2="12" y2="22"/>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                        <line x1="2" y1="12" x2="6" y2="12"/>
                        <line x1="18" y1="12" x2="22" y2="12"/>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                      </svg>
                      Logging in...
                    </span>
                                    ) : 'Log in'}
                                </button>
                            </form>
                        </div>

                        {/* Footer note */}
                        <p style={{ textAlign: 'center', color: '#6d7175', fontSize: '12px', marginTop: '20px', lineHeight: 1.6 }}>
                            By logging in you agree to NuPOS{' '}
                            <button style={{ background: 'none', border: 'none', color: '#6d7175', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                                Terms of Service
                            </button>
                            {' '}and{' '}
                            <button style={{ background: 'none', border: 'none', color: '#6d7175', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                                Privacy Policy
                            </button>
                        </p>

                        {/* Back to home */}
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#6d7175', fontSize: '13px',
                                    fontFamily: "'DM Sans', sans-serif",
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"/>
                                    <polyline points="12,19 5,12 12,5"/>
                                </svg>
                                Back to home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '1px solid #e1e3e5',
                    padding: '16px 32px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    background: '#fff',
                }}>
                    {['Privacy policy', 'Terms of service', 'Contact support'].map(l => (
                        <button
                            key={l}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#6d7175', fontSize: '12px',
                                fontFamily: "'DM Sans', sans-serif",
                                transition: 'color 0.15s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = '#1a1a1a')}
                            onMouseOut={e  => (e.currentTarget.style.color = '#6d7175')}
                            onClick={() => {
                                if (l === 'Contact support') navigate('/contact')
                                else if (l === 'Privacy policy') navigate('/privacy')
                                else if (l === 'Terms of service') navigate('/terms')
                            }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}