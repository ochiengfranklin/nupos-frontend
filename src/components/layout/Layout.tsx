import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { ToastContainer } from '../ui/Toast'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'
import { useScreenSize } from '../../utils/responsive'

export default function Layout() {
    const { shop, logout }   = useAuthStore()
    const navigate           = useNavigate()
    const { isSmall }        = useScreenSize()
    const isDemo             = shop?.slug === 'demo-minimart'
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleSignUp = () => {
        logout()
        navigate('/register')
    }

    return (
        <div style={{
            display:       'flex',
            height:        '100vh',
            background:    '#f8fafc',
            fontFamily:    "'DM Sans', sans-serif",
            flexDirection: 'column',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5);
          z-index: 40;
          display: none;
        }
        .sidebar-overlay.open { display: block; }
      `}</style>

            {/* Demo banner */}
            {isDemo && (
                <div style={{
                    background: '#008060', color: '#fff',
                    padding: '8px 24px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px', fontSize: '13px', fontWeight: 500,
                    flexShrink: 0, flexWrap: 'wrap',
                }}>
                    <span>🎯 You are exploring the NuPOS live demo</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>·</span>
                    <button
                        onClick={handleSignUp}
                        style={{
                            background: '#fff', color: '#008060',
                            border: 'none', borderRadius: '4px',
                            padding: '4px 12px', fontSize: '12px',
                            fontWeight: 700, cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Sign up free →
                    </button>
                </div>
            )}

            {/* Mobile top bar */}
            {isSmall && (
                <div style={{
                    background: '#0f172a',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            style={{
                                background: 'none', border: 'none',
                                cursor: 'pointer', color: '#fff',
                                display: 'flex', alignItems: 'center',
                                padding: '4px',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6"  x2="21" y2="6"/>
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        </button>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>NuPOS</span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{shop?.name}</span>
                </div>
            )}

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

                {/* Mobile overlay */}
                {isSmall && (
                    <div
                        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div style={{
                    position:   isSmall ? 'fixed' : 'relative',
                    left:       isSmall ? (sidebarOpen ? 0 : '-260px') : 'auto',
                    top:        0,
                    bottom:     0,
                    zIndex:     isSmall ? 50 : 'auto',
                    transition: 'left 0.25s ease',
                    flexShrink: 0,
                }}>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>

                <main style={{
                    flex:      1,
                    overflowY: 'auto',
                    padding:   isSmall ? '16px' : '32px',
                }}>
                    <Outlet />
                </main>
            </div>

            <ToastContainer />
        </div>
    )
}