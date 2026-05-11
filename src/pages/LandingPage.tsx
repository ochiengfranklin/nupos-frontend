import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#0f172a' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-link {
          color: #64748b; font-size: 14px; text-decoration: none;
          transition: color 0.15s; cursor: pointer;
        }
        .nav-link:hover { color: #0f172a; }

        .btn-primary {
          background: #2563eb; color: #fff; border: none;
          padding: 12px 24px; border-radius: 8px; font-size: 15px;
          font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }

        .btn-secondary {
          background: #fff; color: #0f172a;
          border: 1.5px solid #e2e8f0;
          padding: 12px 24px; border-radius: 8px; font-size: 15px;
          font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .btn-secondary:hover { border-color: #2563eb; color: #2563eb; }

        .feature-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 24px;
          transition: all 0.2s;
        }
        .feature-card:hover {
          border-color: #bfdbfe;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
          transform: translateY(-2px);
        }

        .step-number {
          width: 36px; height: 36px; border-radius: 50%;
          background: #eff6ff; color: #2563eb;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; flex-shrink: 0;
        }

        .pricing-card {
          background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 16px; padding: 32px;
          transition: all 0.2s;
        }
        .pricing-card.popular {
          border-color: #2563eb;
          box-shadow: 0 8px 30px rgba(37,99,235,0.12);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.4s; opacity: 0; }

        @media (max-width: 768px) {
          .hero-btns { flex-direction: column !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 36px !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid #f1f5f9',
                padding: '0 24px',
            }}>
                <div style={{
                    maxWidth: '1100px', margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    height: '64px',
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '34px', height: '34px', background: '#2563eb',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                        </div>
                        <span style={{ fontSize: '17px', fontWeight: 600, color: '#0f172a' }}>NuPOS</span>
                    </div>

                    {/* Nav links */}
                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        <a className="nav-link" href="#features">Features</a>
                        <a className="nav-link" href="#how-it-works">How it works</a>
                        <a className="nav-link" href="#pricing">Pricing</a>
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button className="btn-secondary" onClick={() => navigate('/login')} style={{ padding: '8px 16px', fontSize: '14px' }}>
                            Sign in
                        </button>
                        <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '8px 16px', fontSize: '14px' }}>
                            Get started free
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={{
                background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)',
                padding: '80px 24px 100px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute', top: '-100px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
                    {/* Badge */}
                    <div className="fade-up fade-up-1" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: '#eff6ff', border: '1px solid #bfdbfe',
                        borderRadius: '20px', padding: '6px 14px', marginBottom: '24px',
                    }}>
                        <span style={{ width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%', display: 'inline-block' }} />
                        <span style={{ color: '#2563eb', fontSize: '13px', fontWeight: 500 }}>
              Built for Kenyan businesses
            </span>
                    </div>

                    {/* Headline */}
                    <h1 className="fade-up fade-up-2 hero-title" style={{
                        fontSize: '52px', fontWeight: 700, lineHeight: 1.1,
                        letterSpacing: '-0.03em', marginBottom: '20px',
                        color: '#0f172a',
                    }}>
                        The modern POS system<br />
                        <span style={{ color: '#2563eb' }}>Kenyan businesses</span> deserve
                    </h1>

                    {/* Subheadline */}
                    <p className="fade-up fade-up-3" style={{
                        fontSize: '18px', color: '#64748b', lineHeight: 1.7,
                        marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px',
                    }}>
                        Manage sales, inventory and staff from one place.
                        M-Pesa integrated. Works for retail shops, minimarts,
                        pharmacies, electronics stores and wholesalers.
                    </p>

                    {/* CTA buttons */}
                    <div className="fade-up fade-up-4 hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '14px 32px', fontSize: '16px' }}>
                            Start for free →
                        </button>
                        <button className="btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                            Watch demo
                        </button>
                    </div>

                    {/* Social proof */}
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '20px' }}>
                        No credit card required · Setup in 5 minutes · Cancel anytime
                    </p>
                </div>

                {/* Hero mockup */}
                <div style={{
                    maxWidth: '900px', margin: '60px auto 0',
                    background: '#0f172a', borderRadius: '16px',
                    padding: '16px', boxShadow: '0 40px 80px rgba(15,23,42,0.2)',
                    border: '1px solid #1e293b',
                }}>
                    {/* Fake browser bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #1e293b' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                        <div style={{ flex: 1, background: '#1e293b', borderRadius: '4px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
                            <span style={{ color: '#475569', fontSize: '11px' }}>nupos.vercel.app</span>
                        </div>
                    </div>
                    {/* Fake POS UI */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '12px', minHeight: '320px' }}>
                        {/* Left — products */}
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px' }}>
                            <div style={{ background: '#e2e8f0', borderRadius: '6px', height: '32px', marginBottom: '12px' }} />
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                {['All', 'Beverages', 'Electronics'].map(c => (
                                    <div key={c} style={{ background: c === 'All' ? '#2563eb' : '#fff', borderRadius: '20px', padding: '4px 12px', border: '1px solid #e2e8f0' }}>
                                        <span style={{ color: c === 'All' ? '#fff' : '#64748b', fontSize: '11px' }}>{c}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {['Fanta 500ml\nKES 55', 'Coke 500ml\nKES 60', 'Pepsi 500ml\nKES 50', 'Water 500ml\nKES 30', 'Sprite 500ml\nKES 55', 'Juice 1L\nKES 120'].map((p, i) => (
                                    <div key={i} style={{ background: i === 0 ? '#eff6ff' : '#fff', border: `1.5px solid ${i === 0 ? '#2563eb' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                                        <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '6px', margin: '0 auto 6px' }} />
                                        <p style={{ color: '#0f172a', fontSize: '10px', fontWeight: 500, margin: '0 0 2px' }}>{p.split('\n')[0]}</p>
                                        <p style={{ color: '#2563eb', fontSize: '11px', fontWeight: 600, margin: 0 }}>{p.split('\n')[1]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right — cart */}
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                            <p style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600, margin: '0 0 12px' }}>Cart <span style={{ background: '#2563eb', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>3</span></p>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[['Fanta 500ml', 'KES 110', '×2'], ['Coke 500ml', 'KES 60', '×1'], ['Water 500ml', 'KES 30', '×1']].map(([n, p, q]) => (
                                    <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '6px', padding: '8px 10px' }}>
                                        <div>
                                            <p style={{ color: '#0f172a', fontSize: '11px', fontWeight: 500, margin: 0 }}>{n}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '10px', margin: 0 }}>{q}</p>
                                        </div>
                                        <p style={{ color: '#2563eb', fontSize: '11px', fontWeight: 600, margin: 0 }}>{p}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>Total</span>
                                    <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700 }}>KES 200</span>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                    {['Cash', 'M-Pesa', 'Card'].map((m, i) => (
                                        <div key={m} style={{ flex: 1, background: i === 1 ? '#f0fdf4' : '#f8fafc', border: `1.5px solid ${i === 1 ? '#16a34a' : '#e2e8f0'}`, borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                                            <span style={{ color: i === 1 ? '#16a34a' : '#64748b', fontSize: '10px', fontWeight: 500 }}>{m}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#2563eb', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Charge KES 200</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Logos / social proof ── */}
            <section style={{ padding: '32px 24px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                        Built for every type of Kenyan business
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Retail shops', 'Minimarts', 'Pharmacies', 'Electronics', 'Agrovets', 'Wholesalers', 'Boutiques', 'Restaurants'].map(b => (
                            <span key={b} style={{
                                background: '#fff', border: '1px solid #e2e8f0',
                                borderRadius: '20px', padding: '6px 14px',
                                color: '#64748b', fontSize: '13px',
                            }}>
                {b}
              </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <p style={{ color: '#2563eb', fontSize: '13px', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Features
                        </p>
                        <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                            Everything you need to run your shop
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                            No complicated setup. No training required. Start selling in minutes.
                        </p>
                    </div>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            {
                                icon: '📱',
                                title: 'M-Pesa integrated',
                                desc: 'Accept M-Pesa payments instantly. Till number management, transaction codes, and automatic reconciliation.',
                                color: '#16a34a',
                            },
                            {
                                icon: '📦',
                                title: 'Real-time inventory',
                                desc: 'Stock levels update automatically with every sale. Get alerts when products are running low.',
                                color: '#2563eb',
                            },
                            {
                                icon: '👥',
                                title: 'Multi-user access',
                                desc: 'Add cashiers, managers and storekeepers. Each role sees only what they need.',
                                color: '#9333ea',
                            },
                            {
                                icon: '📊',
                                title: 'Business reports',
                                desc: 'Daily revenue, top products, cashier performance and payment breakdowns — all in one dashboard.',
                                color: '#ea580c',
                            },
                            {
                                icon: '🧾',
                                title: 'Digital receipts',
                                desc: 'Generate receipts instantly. Share via WhatsApp or print to thermal printers.',
                                color: '#0891b2',
                            },
                            {
                                icon: '🏪',
                                title: 'Multi-tenant SaaS',
                                desc: 'Each business has its own isolated account. Your data is always private and secure.',
                                color: '#dc2626',
                            },
                        ].map(f => (
                            <div key={f.title} className="feature-card">
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '10px',
                                    background: `${f.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px', marginBottom: '16px',
                                }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                                    {f.title}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section id="how-it-works" style={{ padding: '80px 24px', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <p style={{ color: '#2563eb', fontSize: '13px', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            How it works
                        </p>
                        <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                            Up and running in 3 steps
                        </h2>
                    </div>

                    <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                        {[
                            {
                                step: '01',
                                title: 'Create your shop',
                                desc: 'Sign up and set up your shop profile in under 5 minutes. No technical knowledge needed.',
                            },
                            {
                                step: '02',
                                title: 'Add your products',
                                desc: 'Import your product list with prices, SKUs and stock levels. Set low stock alerts.',
                            },
                            {
                                step: '03',
                                title: 'Start selling',
                                desc: 'Your cashiers can start processing sales immediately. Cash, M-Pesa or card.',
                            },
                        ].map((s, i) => (
                            <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="step-number">{s.step}</div>
                                    {i < 2 && (
                                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0', display: 'none' }} />
                                    )}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>{s.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <p style={{ color: '#2563eb', fontSize: '13px', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Pricing
                        </p>
                        <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                            Simple, honest pricing
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.7 }}>
                            No hidden fees. No per-transaction charges. Pay monthly and cancel anytime.
                        </p>
                    </div>

                    <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            {
                                name:     'Starter',
                                price:    'KES 999',
                                period:   '/month',
                                desc:     'Perfect for small retail shops just getting started.',
                                features: ['1 cashier', 'Up to 200 products', 'Basic reports', 'M-Pesa integration', 'Email support'],
                                cta:      'Get started',
                                popular:  false,
                                color:    '#64748b',
                            },
                            {
                                name:     'Business',
                                price:    'KES 2,499',
                                period:   '/month',
                                desc:     'For growing shops that need more power and users.',
                                features: ['Up to 5 users', 'Unlimited products', 'Advanced reports', 'M-Pesa integration', 'Customer management', 'Priority support'],
                                cta:      'Start free trial',
                                popular:  true,
                                color:    '#2563eb',
                            },
                            {
                                name:     'Enterprise',
                                price:    'Custom',
                                period:   '',
                                desc:     'For wholesalers and multi-branch businesses.',
                                features: ['Unlimited users', 'Multi-branch', 'Custom reports', 'API access', 'Dedicated support', 'Custom training'],
                                cta:      'Contact us',
                                popular:  false,
                                color:    '#9333ea',
                            },
                        ].map(p => (
                            <div key={p.name} className={`pricing-card${p.popular ? ' popular' : ''}`}>
                                {p.popular && (
                                    <div style={{
                                        background: '#2563eb', color: '#fff',
                                        fontSize: '11px', fontWeight: 600,
                                        padding: '4px 10px', borderRadius: '20px',
                                        display: 'inline-block', marginBottom: '16px',
                                    }}>
                                        Most popular
                                    </div>
                                )}
                                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>{p.name}</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>{p.price}</span>
                                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>{p.period}</span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>{p.desc}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                                    {p.features.map(f => (
                                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20,6 9,17 4,12"/>
                                            </svg>
                                            <span style={{ color: '#64748b', fontSize: '13px' }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{
                                        width: '100%', padding: '11px',
                                        border: p.popular ? 'none' : '1.5px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: p.popular ? '#2563eb' : '#fff',
                                        color: p.popular ? '#fff' : '#0f172a',
                                        fontSize: '14px', fontWeight: 500,
                                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {p.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA banner ── */}
            <section style={{ padding: '80px 24px', background: '#0f172a' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                        Ready to modernize your shop?
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                        Join hundreds of Kenyan businesses already using NuPOS to run smarter operations.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '14px 32px', fontSize: '16px' }}>
                            Start for free →
                        </button>
                        <button style={{
                            padding: '14px 32px', fontSize: '16px',
                            border: '1.5px solid #334155', borderRadius: '8px',
                            background: 'transparent', color: '#94a3b8',
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                            transition: 'all 0.15s',
                        }}>
                            Contact sales
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '48px 24px 32px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 01-8 0"/>
                                    </svg>
                                </div>
                                <span style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600 }}>NuPOS</span>
                            </div>
                            <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.7, maxWidth: '240px' }}>
                                Modern cloud-based POS system built for Kenyan businesses. Fast, reliable, M-Pesa ready.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Product</p>
                            {['Features', 'Pricing', 'Changelog', 'Roadmap'].map(l => (
                                <p key={l} style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}
                                       onMouseOver={e => (e.currentTarget.style.color = '#94a3b8')}
                                       onMouseOut={e  => (e.currentTarget.style.color = '#475569')}
                                    >{l}</a>
                                </p>
                            ))}
                        </div>

                        {/* Company */}
                        <div>
                            <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Company</p>
                            {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                                <p key={l} style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}
                                       onMouseOver={e => (e.currentTarget.style.color = '#94a3b8')}
                                       onMouseOut={e  => (e.currentTarget.style.color = '#475569')}
                                    >{l}</a>
                                </p>
                            ))}
                        </div>

                        {/* Legal */}
                        <div>
                            <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Legal</p>
                            {['Privacy policy', 'Terms of service', 'Cookie policy'].map(l => (
                                <p key={l} style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}
                                       onMouseOver={e => (e.currentTarget.style.color = '#94a3b8')}
                                       onMouseOut={e  => (e.currentTarget.style.color = '#475569')}
                                    >{l}</a>
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <p style={{ color: '#334155', fontSize: '13px' }}>
                            © {new Date().getFullYear()} NuPOS. Built in Kenya 🇰🇪
                        </p>
                        <p style={{ color: '#334155', fontSize: '13px' }}>
                            Made with ❤️ for Kenyan businesses
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}