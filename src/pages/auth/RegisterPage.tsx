import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import { getErrorMessage } from '../../utils/helpers'

export default function RegisterPage() {
    const navigate = useNavigate()
    const setAuth  = useAuthStore((state) => state.setAuth)

    const [form, setForm] = useState({
        shopName:  '',
        shopPhone: '',
        name:      '',
        email:     '',
        password:  '',
    })
    const [error,        setError]        = useState('')
    const [loading,      setLoading]      = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [step,         setStep]         = useState<1 | 2>(1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await authApi.register({
                shopName:  form.shopName,
                shopPhone: form.shopPhone || undefined,
                name:      form.name,
                email:     form.email,
                password:  form.password,
            })
            const { accessToken, refreshToken, user, shop } = response.data.data!
            setAuth({ accessToken, refreshToken, user, shop })
            navigate('/app/dashboard')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.shopName) { setError('Shop name is required'); return }
        setError('')
        setStep(2)
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f6f6f7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .reg-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #e1e3e5; border-radius: 6px;
          font-size: 14px; color: #1a1a1a; background: #fff;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .reg-input:focus {
          border-color: #008060;
          box-shadow: 0 0 0 3px rgba(0,128,96,0.1);
        }
        .reg-input::placeholder { color: #b0b8bf; }
        .reg-btn {
          width: 100%; padding: 12px;
          background: #008060; color: #fff;
          border: none; border-radius: 6px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .reg-btn:hover:not(:disabled) { background: #005c43; }
        .reg-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

            {/* Navbar */}
            <nav style={{
                background: '#fff', borderBottom: '1px solid #e1e3e5',
                padding: '0 32px', height: '56px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    <div style={{ width: '28px', height: '28px', background: '#008060', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>NuPOS</span>
                </div>
                <p style={{ color: '#6d7175', fontSize: '13px', margin: 0 }}>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'none', border: 'none', color: '#008060', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: 0 }}
                    >
                        Log in
                    </button>
                </p>
            </nav>

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                <div style={{ width: '100%', maxWidth: '460px' }}>

                    {/* Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: step >= s ? '#008060' : '#e1e3e5',
                                    color: step >= s ? '#fff' : '#6d7175',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: 700, transition: 'all 0.3s',
                                }}>
                                    {step > s ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20,6 9,17 4,12"/>
                                        </svg>
                                    ) : s}
                                </div>
                                <span style={{ fontSize: '13px', color: step >= s ? '#1a1a1a' : '#6d7175', fontWeight: step >= s ? 600 : 400 }}>
                  {s === 1 ? 'Shop details' : 'Your account'}
                </span>
                                {s === 1 && (
                                    <div style={{ width: '32px', height: '1px', background: step > 1 ? '#008060' : '#e1e3e5', transition: 'background 0.3s' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Card */}
                    <div style={{
                        background: '#fff', border: '1px solid #e1e3e5',
                        borderRadius: '12px', padding: '36px 32px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                                {step === 1 ? 'Create your shop' : 'Create your account'}
                            </h1>
                            <p style={{ color: '#6d7175', fontSize: '14px', margin: 0 }}>
                                {step === 1
                                    ? 'Start your free 14-day trial. No credit card required.'
                                    : 'This will be your owner account for the shop.'
                                }
                            </p>
                        </div>

                        {/* Error */}
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

                        {/* Step 1 — Shop details */}
                        {step === 1 && (
                            <form onSubmit={handleNext}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Shop name *
                                    </label>
                                    <input
                                        className="reg-input"
                                        placeholder="e.g. Kamau Minimart"
                                        value={form.shopName}
                                        onChange={e => setForm({ ...form, shopName: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <p style={{ color: '#6d7175', fontSize: '12px', margin: '5px 0 0' }}>
                                        This is your shop's public name
                                    </p>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Shop phone number
                                    </label>
                                    <input
                                        className="reg-input"
                                        placeholder="07XXXXXXXX"
                                        value={form.shopPhone}
                                        onChange={e => setForm({ ...form, shopPhone: e.target.value })}
                                    />
                                    <p style={{ color: '#6d7175', fontSize: '12px', margin: '5px 0 0' }}>
                                        Optional — used for receipts and M-Pesa
                                    </p>
                                </div>

                                {/* Preview slug */}
                                {form.shopName && (
                                    <div style={{
                                        background: '#f6f6f7', border: '1px solid #e1e3e5',
                                        borderRadius: '6px', padding: '10px 14px', marginBottom: '20px',
                                    }}>
                                        <p style={{ color: '#6d7175', fontSize: '12px', margin: '0 0 2px' }}>Your shop ID will be:</p>
                                        <p style={{ color: '#008060', fontSize: '13px', fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>
                                            {form.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                                        </p>
                                    </div>
                                )}

                                <button type="submit" className="reg-btn">
                                    Continue →
                                </button>
                            </form>
                        )}

                        {/* Step 2 — Account details */}
                        {step === 2 && (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Your full name *
                                    </label>
                                    <input
                                        className="reg-input"
                                        placeholder="John Kamau"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Email address *
                                    </label>
                                    <input
                                        className="reg-input"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Password *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="reg-input"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            style={{ paddingRight: '44px' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute', right: '12px', top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#6d7175', padding: 0, display: 'flex', alignItems: 'center',
                                            }}
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

                                    {/* Password strength */}
                                    {form.password && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                                {[
                                                    form.password.length >= 8,
                                                    /[A-Z]/.test(form.password),
                                                    /[0-9]/.test(form.password),
                                                ].map((met, i) => (
                                                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: met ? '#008060' : '#e1e3e5', transition: 'background 0.2s' }} />
                                                ))}
                                            </div>
                                            <p style={{ color: '#6d7175', fontSize: '11px', margin: 0 }}>
                                                {[
                                                    !(/[A-Z]/.test(form.password)) && 'Add an uppercase letter',
                                                    form.password.length < 8 && 'At least 8 characters',
                                                    !(/[0-9]/.test(form.password)) && 'Add a number',
                                                ].filter(Boolean)[0] || '✓ Strong password'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setError('') }}
                                        style={{
                                            flex: 1, padding: '12px',
                                            border: '1.5px solid #e1e3e5', borderRadius: '6px',
                                            background: '#fff', color: '#1a1a1a',
                                            fontSize: '14px', fontWeight: 500,
                                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="reg-btn"
                                        style={{ flex: 2 }}
                                    >
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
                        Creating your shop...
                      </span>
                                        ) : 'Create my shop'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer note */}
                    <p style={{ textAlign: 'center', color: '#6d7175', fontSize: '12px', marginTop: '20px', lineHeight: 1.6 }}>
                        By signing up you agree to NuPOS{' '}
                        <button style={{ background: 'none', border: 'none', color: '#6d7175', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                            Terms of Service
                        </button>
                        {' '}and{' '}
                        <button style={{ background: 'none', border: 'none', color: '#6d7175', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                            Privacy Policy
                        </button>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                borderTop: '1px solid #e1e3e5', padding: '16px 32px',
                display: 'flex', justifyContent: 'center', gap: '24px', background: '#fff',
            }}>
                {['Privacy policy', 'Terms of service', 'Contact support'].map(l => (
                    <button
                        key={l}
                        onClick={() => l === 'Contact support' ? navigate('/contact') : {}}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#6d7175', fontSize: '12px',
                            fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = '#1a1a1a')}
                        onMouseOut={e  => (e.currentTarget.style.color = '#6d7175')}
                    >
                        {l}
                    </button>
                ))}
            </div>
        </div>
    )
}