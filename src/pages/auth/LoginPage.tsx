import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import { getErrorMessage } from '../../utils/helpers'

export default function LoginPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const [form, setForm] = useState({
        shopSlug: '',
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
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
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            display: 'flex',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.19s; }
        .fade-up-4 { animation-delay: 0.26s; }
        .fade-up-5 { animation-delay: 0.33s; }
        .fade-up-6 { animation-delay: 0.40s; }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 16px 12px 40px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #475569; }
        .login-input:focus {
          border-color: #3b82f6;
          background: rgba(59,130,246,0.05);
        }
        .login-input:hover:not(:focus) {
          border-color: rgba(255,255,255,0.2);
        }
        .login-input-password {
          padding-right: 44px;
        }
        .submit-btn {
          width: 100%;
          background: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .submit-btn:hover:not(:disabled) { background: #2563eb; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #475569;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #94a3b8; }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #334155;
          pointer-events: none;
        }
        .field-label {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .grid-line-v {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(255,255,255,0.03);
        }
        .grid-line-h {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.03);
        }
      `}</style>

            {/* ── Left panel — branding ── */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
                borderRight: '1px solid rgba(255,255,255,0.05)',
            }}>
                {/* Grid decoration */}
                {[20, 40, 60, 80].map(p => (
                    <div key={p} className="grid-line-v" style={{ left: `${p}%` }} />
                ))}
                {[20, 40, 60, 80].map(p => (
                    <div key={p} className="grid-line-h" style={{ top: `${p}%` }} />
                ))}

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: '#3b82f6',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </div>
                    <span style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '500', letterSpacing: '-0.01em' }}>
            NuPOS
          </span>
                </div>

                {/* Headline */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        marginBottom: '24px',
                    }}>
            <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: '500' }}>
              Point of Sale — Kenya
            </span>
                    </div>
                    <h1 style={{
                        color: '#f1f5f9',
                        fontSize: '42px',
                        fontWeight: '300',
                        lineHeight: '1.15',
                        margin: '0 0 20px',
                        letterSpacing: '-0.02em',
                    }}>
                        Run your shop<br />
                        <span style={{ color: '#3b82f6', fontWeight: '500' }}>smarter.</span>
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        margin: 0,
                        maxWidth: '340px',
                    }}>
                        Multi-tenant POS built for Kenyan retail. Inventory, sales, M-Pesa — all in one place.
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '32px', position: 'relative' }}>
                    {[
                        { value: 'M-Pesa', label: 'Integrated' },
                        { value: 'Real-time', label: 'Inventory' },
                        { value: 'Multi', label: 'Branch ready' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '500', margin: '0 0 2px' }}>
                                {stat.value}
                            </p>
                            <p style={{ color: '#475569', fontSize: '12px', margin: 0 }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel — form ── */}
            <div style={{
                width: '460px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
            }}>
                <div style={{ width: '100%' }}>

                    {/* Header */}
                    <div className="fade-up fade-up-1" style={{ marginBottom: '36px' }}>
                        <h2 style={{
                            color: '#f1f5f9',
                            fontSize: '24px',
                            fontWeight: '500',
                            margin: '0 0 6px',
                            letterSpacing: '-0.01em',
                        }}>
                            Welcome back
                        </h2>
                        <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
                            Sign in to your shop dashboard
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            <span style={{ color: '#fca5a5', fontSize: '13px' }}>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Shop ID */}
                        <div className="fade-up fade-up-2" style={{ marginBottom: '16px' }}>
                            <label className="field-label">Shop ID</label>
                            <div style={{ position: 'relative' }}>
                <span className="field-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </span>
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="e.g. kamau-minimart"
                                    value={form.shopSlug}
                                    onChange={(e) => setForm({ ...form, shopSlug: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="fade-up fade-up-3" style={{ marginBottom: '16px' }}>
                            <label className="field-label">Email</label>
                            <div style={{ position: 'relative' }}>
                <span className="field-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                                <input
                                    type="email"
                                    className="login-input"
                                    placeholder="you@shop.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="fade-up fade-up-4" style={{ marginBottom: '28px' }}>
                            <label className="field-label">Password</label>
                            <div style={{ position: 'relative' }}>
                <span className="field-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="login-input login-input-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                        <div className="fade-up fade-up-5">
                            <button type="submit" disabled={loading} className="submit-btn">
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <line x1="12" y1="2" x2="12" y2="6"/>
                      <line x1="12" y1="18" x2="12" y2="22"/>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                      <line x1="2" y1="12" x2="6" y2="12"/>
                      <line x1="18" y1="12" x2="22" y2="12"/>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                    Signing in...
                  </span>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="fade-up fade-up-6" style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}>
                        <p style={{ color: '#334155', fontSize: '12px', margin: 0, textAlign: 'center' }}>
                            NuPOS · Built for Kenyan businesses
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}