import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ContactPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', shop: '', message: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate sending — replace with real API call later
        await new Promise(r => setTimeout(r, 1200))
        setSent(true)
        setLoading(false)
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f6f6f7', minHeight: '100vh' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .contact-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #e1e3e5; border-radius: 6px;
          font-size: 14px; color: #1a1a1a; background: #fff;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .contact-input:focus {
          border-color: #008060;
          box-shadow: 0 0 0 3px rgba(0,128,96,0.1);
        }
        .contact-input::placeholder { color: #b0b8bf; }
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
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#6d7175', fontSize: '13px',
                        fontFamily: "'DM Sans', sans-serif",
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12,19 5,12 12,5"/>
                    </svg>
                    Back to home
                </button>
            </nav>

            {/* Content */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

                {/* Left — info */}
                <div>
                    <p style={{ color: '#008060', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Contact us
                    </p>
                    <h1 style={{ fontSize: '38px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.1 }}>
                        We'd love to<br />hear from you
                    </h1>
                    <p style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: 1.7, marginBottom: '40px' }}>
                        Have a question about NuPOS? Want to see a demo? Need help with your account?
                        Our team is here to help.
                    </p>

                    {/* Contact info cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            {
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                ),
                                label: 'Email us',
                                value: 'hello@nupos.app',
                                sub:   'We reply within 24 hours',
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                ),
                                label: 'Location',
                                value: 'Nairobi, Kenya',
                                sub:   'Serving all of Kenya',
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                                    </svg>
                                ),
                                label: 'WhatsApp',
                                value: '+254 700 000 000',
                                sub:   'Mon–Fri, 8am–6pm EAT',
                            },
                        ].map(item => (
                            <div key={item.label} style={{
                                display: 'flex', gap: '14px', alignItems: 'flex-start',
                                background: '#fff', border: '1px solid #e1e3e5',
                                borderRadius: '10px', padding: '18px 20px',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', background: '#e3f1ec',
                                    borderRadius: '8px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', flexShrink: 0,
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p style={{ color: '#6d7175', fontSize: '12px', margin: '0 0 2px', fontWeight: 500 }}>{item.label}</p>
                                    <p style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{item.value}</p>
                                    <p style={{ color: '#6d7175', fontSize: '12px', margin: 0 }}>{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — form */}
                <div style={{
                    background: '#fff', border: '1px solid #e1e3e5',
                    borderRadius: '12px', padding: '32px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{
                                width: '56px', height: '56px', background: '#e3f1ec',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 16px',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20,6 9,17 4,12"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                                Message sent!
                            </h3>
                            <p style={{ color: '#6d7175', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
                                Thanks for reaching out. We'll get back to you within 24 hours.
                            </p>
                            <button
                                onClick={() => { setSent(false); setForm({ name: '', email: '', shop: '', message: '' }) }}
                                style={{
                                    background: '#008060', color: '#fff', border: 'none',
                                    borderRadius: '6px', padding: '10px 24px', fontSize: '14px',
                                    fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 24px', letterSpacing: '-0.01em' }}>
                                Send us a message
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Your name *
                                    </label>
                                    <input
                                        className="contact-input"
                                        placeholder="John Kamau"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Email address *
                                    </label>
                                    <input
                                        className="contact-input"
                                        type="email"
                                        placeholder="john@shop.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Shop name
                                    </label>
                                    <input
                                        className="contact-input"
                                        placeholder="Kamau Minimart"
                                        value={form.shop}
                                        onChange={e => setForm({ ...form, shop: e.target.value })}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                                        Message *
                                    </label>
                                    <textarea
                                        className="contact-input"
                                        placeholder="Tell us how we can help..."
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        required
                                        rows={5}
                                        style={{ resize: 'vertical', minHeight: '120px' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%', padding: '12px',
                                        background: '#008060', color: '#fff',
                                        border: 'none', borderRadius: '6px',
                                        fontSize: '15px', fontWeight: 600,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontFamily: "'DM Sans', sans-serif",
                                        opacity: loading ? 0.7 : 1,
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                    }}
                                >
                                    {loading ? (
                                        <>
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
                                            Sending...
                                        </>
                                    ) : 'Send message'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}