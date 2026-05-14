import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const navigate = useNavigate()

    const scrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#1a1a1a' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green:       #008060;
          --green-dark:  #005c43;
          --green-light: #e3f1ec;
          --green-mid:   #c2e0d5;
          --text:        #1a1a1a;
          --text-2:      #4a4a4a;
          --text-3:      #6d7175;
          --border:      #e1e3e5;
          --bg:          #f6f6f7;
          --white:       #ffffff;
        }

        .btn-green {
          background: #008060; color: #fff; border: none;
          padding: 14px 28px; border-radius: 6px; font-size: 15px;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px;
          letter-spacing: -0.01em;
        }
        .btn-green:hover { background: #005c43; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,128,96,0.25); }
        .btn-green:active { transform: translateY(0); }

        .btn-outline {
          background: transparent; color: #1a1a1a;
          border: 1.5px solid #e1e3e5;
          padding: 13px 28px; border-radius: 6px; font-size: 15px;
          font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-outline:hover { border-color: #1a1a1a; }

        .btn-white {
          background: #fff; color: #008060; border: none;
          padding: 14px 28px; border-radius: 6px; font-size: 15px;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .btn-white:hover { background: #f0faf7; }

        .nav-link {
          color: #4a4a4a; font-size: 14px; text-decoration: none;
          font-weight: 500; transition: color 0.15s; cursor: pointer;
          background: none; border: none; font-family: 'DM Sans', sans-serif;
        }
        .nav-link:hover { color: #1a1a1a; }

        .feature-card {
          background: #fff; border: 1px solid #e1e3e5;
          border-radius: 12px; padding: 28px; transition: all 0.2s;
        }
        .feature-card:hover {
          border-color: #c2e0d5;
          box-shadow: 0 4px 24px rgba(0,128,96,0.08);
          transform: translateY(-2px);
        }

        .pricing-card {
          background: #fff; border: 1.5px solid #e1e3e5;
          border-radius: 12px; padding: 32px; transition: all 0.2s;
        }
        .pricing-card.popular {
          border-color: #008060;
          box-shadow: 0 8px 32px rgba(0,128,96,0.12);
        }

        .business-tag {
          background: #f6f6f7; border: 1px solid #e1e3e5;
          border-radius: 20px; padding: 7px 16px;
          color: #4a4a4a; font-size: 13px; font-weight: 500;
          display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.15s; cursor: default;
        }
        .business-tag:hover { border-color: #008060; color: #008060; background: #e3f1ec; }

        .testimonial-card {
          background: #fff; border: 1px solid #e1e3e5;
          border-radius: 12px; padding: 28px;
        }

        .footer-link {
          color: #6d7175; font-size: 13px; text-decoration: none;
          transition: color 0.15s; display: block; margin-bottom: 10px;
        }
        .footer-link:hover { color: #fff; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up  { animation: fadeUp 0.55s ease forwards; opacity: 0; }
        .delay-1  { animation-delay: 0.08s; }
        .delay-2  { animation-delay: 0.16s; }
        .delay-3  { animation-delay: 0.24s; }
        .delay-4  { animation-delay: 0.32s; }

        @media (max-width: 900px) {
          .hero-grid     { grid-template-columns: 1fr !important; }
          .mockup-wrap   { display: none !important; }
        }
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .pricing-grid  { grid-template-columns: 1fr !important; }
          .footer-grid   { grid-template-columns: 1fr 1fr !important; }
          .steps-grid    { grid-template-columns: 1fr !important; }
          .hero-title    { font-size: 36px !important; }
          .nav-links     { display: none !important; }
          .hero-stats    { grid-template-columns: 1fr 1fr !important; }
          .reviews-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .footer-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #e1e3e5',
            }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto', padding: '0 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    height: '60px',
                }}>
                    {/* Logo */}
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div style={{
                            width: '32px', height: '32px', background: '#008060',
                            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>NuPOS</span>
                    </div>

                    {/* Nav links */}
                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <button className="nav-link" onClick={() => scrollTo('features')}>Features</button>
                        <button className="nav-link" onClick={() => scrollTo('how-it-works')}>How it works</button>
                        <button className="nav-link" onClick={() => scrollTo('pricing')}>Pricing</button>
                        <button className="nav-link" onClick={() => navigate('/contact')}>Contact</button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="btn-outline" onClick={() => navigate('/login')} style={{ padding: '9px 18px', fontSize: '14px' }}>
                            Log in
                        </button>
                        <button className="btn-green" onClick={() => navigate('/login')} style={{ padding: '9px 18px', fontSize: '14px' }}>
                            Start free trial
                        </button>
                    </div>
                </div>
            </nav>

            {/*Hero*/}
            <section style={{ background: '#fff', padding: '72px 32px 80px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

                        {/* Left */}
                        <div>
                            <div className="fade-up delay-1" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: '#e3f1ec', border: '1px solid #c2e0d5',
                                borderRadius: '4px', padding: '5px 12px', marginBottom: '20px',
                            }}>
                                <span style={{ width: '6px', height: '6px', background: '#008060', borderRadius: '50%', display: 'inline-block' }} />
                                <span style={{ color: '#005c43', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Built for Kenya
                </span>
                            </div>

                            <h1 className="fade-up delay-2 hero-title" style={{
                                fontSize: '48px', fontWeight: 700, lineHeight: 1.08,
                                letterSpacing: '-0.03em', marginBottom: '20px', color: '#1a1a1a',
                            }}>
                                The POS system<br />
                                your shop<br />
                                <span style={{ color: '#008060' }}>actually needs</span>
                            </h1>

                            <p className="fade-up delay-3" style={{
                                fontSize: '17px', color: '#4a4a4a', lineHeight: 1.65,
                                marginBottom: '32px', maxWidth: '440px',
                            }}>
                                Sell in-person with M-Pesa, cash or card. Track inventory in real time.
                                Manage your team. See your business grow — all from one place.
                            </p>

                            <div className="fade-up delay-4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                                <button className="btn-green" onClick={() => navigate('/login')}>
                                    Start free trial
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12,5 19,12 12,19"/>
                                    </svg>
                                </button>
                                <button className="btn-outline" onClick={() => navigate('/demo')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polygon points="10,8 16,12 10,16 10,8"/>
                                    </svg>
                                    Try live demo
                                </button>
                            </div>

                            <p style={{ color: '#6d7175', fontSize: '13px' }}>
                                ✓ No credit card required &nbsp;·&nbsp; ✓ Setup in 5 minutes &nbsp;·&nbsp; ✓ Cancel anytime
                            </p>

                            {/* Stats */}
                            <div className="hero-stats" style={{
                                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px', marginTop: '40px', paddingTop: '32px',
                                borderTop: '1px solid #e1e3e5',
                            }}>
                                {[
                                    { value: 'M-Pesa', label: 'Fully integrated' },
                                    { value: '5 min',  label: 'Setup time' },
                                    { value: '99.9%',  label: 'Uptime SLA' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <p style={{ fontSize: '22px', fontWeight: 700, color: '#008060', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{s.value}</p>
                                        <p style={{ fontSize: '12px', color: '#6d7175', margin: 0 }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — mockup */}
                        <div className="mockup-wrap fade-up delay-3" style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', inset: '-20px',
                                background: 'radial-gradient(circle at 50% 50%, rgba(0,128,96,0.08) 0%, transparent 70%)',
                                pointerEvents: 'none',
                            }} />
                            <div style={{
                                background: '#fff', borderRadius: '14px',
                                border: '1px solid #e1e3e5',
                                boxShadow: '0 24px 64px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
                                overflow: 'hidden', position: 'relative',
                            }}>
                                {/* Browser bar */}
                                <div style={{ background: '#f6f6f7', padding: '10px 16px', borderBottom: '1px solid #e1e3e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                                    </div>
                                    <div style={{ flex: 1, background: '#fff', borderRadius: '4px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e1e3e5', marginLeft: '8px' }}>
                                        <span style={{ color: '#6d7175', fontSize: '11px' }}>nupos.app/pos</span>
                                    </div>
                                </div>

                                {/* POS mockup */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', minHeight: '360px' }}>
                                    {/* Products */}
                                    <div style={{ background: '#f6f6f7', padding: '14px' }}>
                                        <div style={{ background: '#fff', border: '1px solid #e1e3e5', borderRadius: '6px', padding: '8px 12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6d7175" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                            </svg>
                                            <span style={{ color: '#6d7175', fontSize: '11px' }}>Search products...</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                            {['All', 'Beverages', 'Snacks'].map((c, i) => (
                                                <div key={c} style={{ background: i === 0 ? '#008060' : '#fff', border: `1px solid ${i === 0 ? '#008060' : '#e1e3e5'}`, borderRadius: '4px', padding: '4px 8px' }}>
                                                    <span style={{ color: i === 0 ? '#fff' : '#4a4a4a', fontSize: '10px', fontWeight: 500 }}>{c}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                            {[
                                                { name: 'Fanta 500ml',  price: 'KES 55',  active: true },
                                                { name: 'Coke 500ml',   price: 'KES 60',  active: false },
                                                { name: 'Pepsi 500ml',  price: 'KES 50',  active: false },
                                                { name: 'Water 500ml',  price: 'KES 30',  active: false },
                                                { name: 'Sprite 500ml', price: 'KES 55',  active: false },
                                                { name: 'Juice 1L',     price: 'KES 120', active: false },
                                            ].map((p, i) => (
                                                <div key={i} style={{
                                                    background: p.active ? '#e3f1ec' : '#fff',
                                                    border: `1.5px solid ${p.active ? '#008060' : '#e1e3e5'}`,
                                                    borderRadius: '6px', padding: '8px',
                                                }}>
                                                    <div style={{ width: '26px', height: '26px', background: p.active ? '#c2e0d5' : '#f6f6f7', borderRadius: '4px', marginBottom: '5px' }} />
                                                    <p style={{ color: '#1a1a1a', fontSize: '9px', fontWeight: 600, margin: '0 0 2px', lineHeight: 1.2 }}>{p.name}</p>
                                                    <p style={{ color: '#008060', fontSize: '10px', fontWeight: 700, margin: 0 }}>{p.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cart */}
                                    <div style={{ background: '#fff', borderLeft: '1px solid #e1e3e5', padding: '14px', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 700 }}>Cart</span>
                                            <span style={{ background: '#008060', color: '#fff', fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '10px' }}>3</span>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {[
                                                { name: 'Fanta 500ml', total: 'KES 110', qty: '×2' },
                                                { name: 'Coke 500ml',  total: 'KES 60',  qty: '×1' },
                                                { name: 'Water 500ml', total: 'KES 30',  qty: '×1' },
                                            ].map(item => (
                                                <div key={item.name} style={{ background: '#f6f6f7', borderRadius: '5px', padding: '7px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <p style={{ color: '#1a1a1a', fontSize: '9px', fontWeight: 600, margin: 0 }}>{item.name}</p>
                                                        <p style={{ color: '#6d7175', fontSize: '9px', margin: 0 }}>{item.qty}</p>
                                                    </div>
                                                    <span style={{ color: '#008060', fontSize: '10px', fontWeight: 700 }}>{item.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ borderTop: '1px solid #e1e3e5', paddingTop: '10px', marginTop: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700 }}>Total</span>
                                                <span style={{ fontSize: '13px', fontWeight: 800 }}>KES 200</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '7px' }}>
                                                {['Cash', 'M-Pesa', 'Card'].map((m, i) => (
                                                    <div key={m} style={{
                                                        flex: 1, textAlign: 'center', padding: '5px 2px', borderRadius: '4px',
                                                        background: i === 1 ? '#e3f1ec' : '#f6f6f7',
                                                        border: `1px solid ${i === 1 ? '#008060' : '#e1e3e5'}`,
                                                    }}>
                                                        <span style={{ color: i === 1 ? '#008060' : '#4a4a4a', fontSize: '8px', fontWeight: 600 }}>{m}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ background: '#008060', borderRadius: '5px', padding: '8px', textAlign: 'center' }}>
                                                <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>Charge KES 200</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*Business types*/}
            <section style={{ background: '#f6f6f7', borderTop: '1px solid #e1e3e5', borderBottom: '1px solid #e1e3e5', padding: '24px 32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#6d7175', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>Built for:</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Retail shops', emoji: '🏪' },
                            { label: 'Minimarts',    emoji: '🛒' },
                            { label: 'Pharmacies',   emoji: '💊' },
                            { label: 'Electronics',  emoji: '📱' },
                            { label: 'Agrovets',     emoji: '🌱' },
                            { label: 'Wholesalers',  emoji: '📦' },
                            { label: 'Boutiques',    emoji: '👗' },
                            { label: 'Restaurants',  emoji: '🍽️' },
                        ].map(b => (
                            <span key={b.label} className="business-tag">{b.emoji} {b.label}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/*Features*/}
            <section id="features" style={{ padding: '88px 32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ maxWidth: '560px', marginBottom: '56px' }}>
                        <p style={{ color: '#008060', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Features
                        </p>
                        <h2 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '14px', color: '#1a1a1a', lineHeight: 1.1 }}>
                            Everything your shop needs.<br />Nothing it doesn't.
                        </h2>
                        <p style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: 1.7 }}>
                            NuPOS is built specifically for Kenyan businesses. No bloat, no unnecessary complexity — just the tools you need.
                        </p>
                    </div>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {[
                            {
                                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
                                title: 'M-Pesa payments',
                                desc:  'Accept M-Pesa instantly. Capture transaction codes and reconcile automatically at end of day.',
                            },
                            {
                                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
                                title: 'Inventory tracking',
                                desc:  'Stock levels update automatically with every sale. Get notified before you run out.',
                            },
                            {
                                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
                                title: 'Team management',
                                desc:  'Add cashiers, managers and storekeepers. Role-based access ensures each person sees only what they need.',
                            },
                            {
                                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                                title: 'Business reports',
                                desc:  'Daily revenue, top products, cashier performance and payment breakdowns — all in one place.',
                            },
                            {
                                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                                title: 'Digital receipts',
                                desc:  'Generate receipts instantly. Print to thermal printers or share via WhatsApp.',
                            },
                            {
                                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
                                title: 'Secure & private',
                                desc:  'Each business has a fully isolated account. Your data is always private and secure.',
                            },
                        ].map(f => (
                            <div key={f.title} className="feature-card">
                                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#e3f1ec', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a', letterSpacing: '-0.01em' }}>
                                    {f.title}
                                </h3>
                                <p style={{ color: '#4a4a4a', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*How it works*/}
            <section id="how-it-works" style={{ background: '#f6f6f7', padding: '88px 32px', borderTop: '1px solid #e1e3e5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <p style={{ color: '#008060', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            How it works
                        </p>
                        <h2 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '14px', color: '#1a1a1a' }}>
                            Up and running in minutes
                        </h2>
                        <p style={{ color: '#4a4a4a', fontSize: '16px', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
                            No installation. No hardware required. Just sign up and start selling.
                        </p>
                    </div>

                    <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                        {[
                            {
                                num:    '1',
                                title:  'Create your shop',
                                desc:   'Sign up, enter your shop name and you are ready. The whole setup takes less than 5 minutes.',
                                detail: ['Enter shop name', 'Add your logo', 'Set currency to KES'],
                            },
                            {
                                num:    '2',
                                title:  'Add your products',
                                desc:   'Enter your products with prices, SKUs and opening stock. Set low stock alerts.',
                                detail: ['Add product names and prices', 'Set stock quantities', 'Organize by category'],
                            },
                            {
                                num:    '3',
                                title:  'Start selling',
                                desc:   'Tap products, select payment method and charge. Your cashier is operational immediately.',
                                detail: ['Tap to add to cart', 'Accept M-Pesa or cash', 'Receipt generated instantly'],
                            },
                        ].map((s, i) => (
                            <div key={s.num} style={{
                                background: '#fff', padding: '36px 32px',
                                border: '1px solid #e1e3e5',
                                borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                                borderLeft: i > 0 ? 'none' : '1px solid #e1e3e5',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: '#008060', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '16px', fontWeight: 700, marginBottom: '20px',
                                }}>
                                    {s.num}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                                    {s.title}
                                </h3>
                                <p style={{ color: '#4a4a4a', fontSize: '14px', lineHeight: 1.65, marginBottom: '20px' }}>
                                    {s.desc}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {s.detail.map(d => (
                                        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20,6 9,17 4,12"/>
                                            </svg>
                                            <span style={{ color: '#4a4a4a', fontSize: '13px' }}>{d}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn-green" onClick={() => navigate('/login')}>
                            Get started for free →
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing*/}
            <section id="pricing" style={{ padding: '88px 32px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <p style={{ color: '#008060', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Pricing
                        </p>
                        <h2 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '14px', color: '#1a1a1a' }}>
                            Simple, transparent pricing
                        </h2>
                        <p style={{ color: '#4a4a4a', fontSize: '16px', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
                            No hidden fees. No setup costs. No per-transaction charges.
                        </p>
                    </div>

                    <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
                        {[
                            {
                                name:     'Starter',
                                price:    '999',
                                desc:     'For small shops just getting started with digital POS.',
                                features: ['1 cashier account', 'Up to 200 products', 'Sales history', 'M-Pesa integration', 'Basic reports', 'Email support'],
                                cta:      'Get started',
                                popular:  false,
                            },
                            {
                                name:     'Business',
                                price:    '2,499',
                                desc:     'For growing shops that need more users and advanced features.',
                                features: ['Up to 5 user accounts', 'Unlimited products', 'Advanced reports', 'M-Pesa integration', 'Customer management', 'Inventory alerts', 'Priority support'],
                                cta:      'Start free trial',
                                popular:  true,
                            },
                            {
                                name:     'Enterprise',
                                price:    'Custom',
                                desc:     'For wholesalers and businesses with multiple branches.',
                                features: ['Unlimited users', 'Multi-branch support', 'Custom reports', 'API access', 'Dedicated account manager', 'On-site training'],
                                cta:      'Contact us',
                                popular:  false,
                            },
                        ].map(p => (
                            <div key={p.name} className={`pricing-card${p.popular ? ' popular' : ''}`}>
                                {p.popular && (
                                    <div style={{
                                        background: '#008060', color: '#fff',
                                        fontSize: '11px', fontWeight: 700,
                                        padding: '4px 10px', borderRadius: '4px',
                                        display: 'inline-block', marginBottom: '20px',
                                        letterSpacing: '0.04em', textTransform: 'uppercase',
                                    }}>
                                        Most popular
                                    </div>
                                )}
                                <p style={{ color: '#6d7175', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>{p.name}</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '6px' }}>
                                    {p.price !== 'Custom' && (
                                        <span style={{ color: '#6d7175', fontSize: '15px', fontWeight: 500 }}>KES</span>
                                    )}
                                    <span style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.03em' }}>{p.price}</span>
                                    {p.price !== 'Custom' && (
                                        <span style={{ color: '#6d7175', fontSize: '14px' }}>/month</span>
                                    )}
                                </div>
                                <p style={{ color: '#4a4a4a', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>{p.desc}</p>
                                <button
                                    onClick={() => p.cta === 'Contact us'
                                        ? navigate('/contact')
                                        : navigate('/login')
                                    }
                                    style={{
                                        width: '100%', padding: '12px',
                                        border: p.popular ? 'none' : '1.5px solid #e1e3e5',
                                        borderRadius: '6px',
                                        background: p.popular ? '#008060' : '#fff',
                                        color: p.popular ? '#fff' : '#1a1a1a',
                                        fontSize: '14px', fontWeight: 600,
                                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                        marginBottom: '24px', transition: 'all 0.15s',
                                    }}
                                    onMouseOver={e => {
                                        if (p.popular) (e.currentTarget as HTMLButtonElement).style.background = '#005c43'
                                        else (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a1a1a'
                                    }}
                                    onMouseOut={e => {
                                        if (p.popular) (e.currentTarget as HTMLButtonElement).style.background = '#008060'
                                        else (e.currentTarget as HTMLButtonElement).style.borderColor = '#e1e3e5'
                                    }}
                                >
                                    {p.cta}
                                </button>
                                <div style={{ borderTop: '1px solid #e1e3e5', paddingTop: '20px' }}>
                                    <p style={{ color: '#6d7175', fontSize: '12px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        What's included
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {p.features.map(f => (
                                            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                                                    <polyline points="20,6 9,17 4,12"/>
                                                </svg>
                                                <span style={{ color: '#4a4a4a', fontSize: '13px', lineHeight: 1.5 }}>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', color: '#6d7175', fontSize: '13px', marginTop: '24px' }}>
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                </div>
            </section>

            {/*Testimonials*/}
            <section style={{ background: '#f6f6f7', borderTop: '1px solid #e1e3e5', padding: '80px 32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#1a1a1a' }}>
                            Trusted by Kenyan businesses
                        </h2>
                    </div>
                    <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            {
                                quote: '"Setting up NuPOS took less than 10 minutes. My cashiers were selling the same day."',
                                name:  'James M.',
                                shop:  'Westlands Minimart, Nairobi',
                            },
                            {
                                quote: '"The M-Pesa integration is seamless. No more manual reconciliation at end of day."',
                                name:  'Sarah K.',
                                shop:  'Purity Pharmacy, Mombasa',
                            },
                            {
                                quote: '"Finally a POS that understands how Kenyan shops actually work."',
                                name:  'Peter O.',
                                shop:  'TechHub Electronics, Kisumu',
                            },
                        ].map(t => (
                            <div key={t.name} className="testimonial-card">
                                <div style={{ marginBottom: '14px' }}>
                                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>)}
                                </div>
                                <p style={{ color: '#1a1a1a', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                                    {t.quote}
                                </p>
                                <div>
                                    <p style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 700, margin: '0 0 2px' }}>{t.name}</p>
                                    <p style={{ color: '#6d7175', fontSize: '12px', margin: 0 }}>{t.shop}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA banner*/}
            <section style={{ background: '#008060', padding: '80px 32px' }}>
                <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '38px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.1 }}>
                        Ready to run your shop smarter?
                    </h2>
                    <p style={{ color: '#c2e0d5', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                        Start your free 14-day trial today. No credit card needed.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-white" onClick={() => navigate('/login')}>
                            Start free trial →
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            style={{
                                padding: '14px 28px', fontSize: '15px',
                                border: '1.5px solid rgba(255,255,255,0.4)',
                                borderRadius: '6px', background: 'transparent',
                                color: '#fff', cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                            }}
                        >
                            Contact sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer*/}
            <footer style={{ background: '#1a1a1a', padding: '56px 32px 32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ width: '30px', height: '30px', background: '#008060', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 01-8 0"/>
                                    </svg>
                                </div>
                                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>NuPOS</span>
                            </div>
                            <p style={{ color: '#6d7175', fontSize: '13px', lineHeight: 1.7, maxWidth: '240px', marginBottom: '16px' }}>
                                Modern cloud-based POS built for Kenyan businesses. Fast, reliable, M-Pesa ready.
                            </p>
                            <p style={{ color: '#4a4a4a', fontSize: '12px' }}>Built in Kenya 🇰🇪</p>
                        </div>

                        {[
                            {
                                title: 'Product',
                                links: [
                                    { label: 'Features',      action: () => scrollTo('features') },
                                    { label: 'Pricing',       action: () => scrollTo('pricing') },
                                    { label: 'How it works', action: () => scrollTo('how-it-works') },
                                ],
                            },
                            {
                                title: 'Company',
                                links: [
                                    { label: 'Contact us', action: () => navigate('/contact') },
                                    { label: 'About',      action: () => navigate('/contact') },
                                    { label: 'Careers',    action: () => navigate('/contact') },
                                ],
                            },
                            {
                                title: 'Account',
                                links: [
                                    { label: 'Log in',       action: () => navigate('/login') },
                                    { label: 'Sign up free', action: () => navigate('/login') },
                                    { label: 'View pricing', action: () => scrollTo('pricing') },
                                ],
                            },
                        ].map(col => (
                            <div key={col.title}>
                                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>{col.title}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {col.links.map(l => (
                                        <button
                                            key={l.label}
                                            onClick={l.action}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#6d7175', fontSize: '13px', textAlign: 'left',
                                                padding: 0, fontFamily: "'DM Sans', sans-serif",
                                                transition: 'color 0.15s',
                                            }}
                                            onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                                            onMouseOut={e  => (e.currentTarget.style.color = '#6d7175')}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <p style={{ color: '#4a4a4a', fontSize: '13px' }}>© {new Date().getFullYear()} NuPOS. All rights reserved.</p>
                        <p style={{ color: '#4a4a4a', fontSize: '13px' }}>Made with ❤️ for Kenyan businesses</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}