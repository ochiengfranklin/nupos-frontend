import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { ToastContainer } from '../ui/Toast'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'

export default function Layout() {
    const { shop, logout } = useAuthStore()
    const navigate         = useNavigate()
    const isDemo           = shop?.slug === 'demo-minimart'

    const handleSignUp = () => {
        logout()
        navigate('/register')
    }

    return (
        <div style={{
            display: 'flex', height: '100vh',
            background: '#f8fafc',
            fontFamily: "'DM Sans', sans-serif",
            flexDirection: 'column',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
      `}</style>

            {/* Demo banner */}
            {isDemo && (
                <div style={{
                    background: '#008060', color: '#fff',
                    padding: '8px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '12px', fontSize: '13px', fontWeight: 500,
                    flexShrink: 0,
                }}>
                    <span>🎯 You are exploring the NuPOS live demo</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>Data resets every 24 hours</span>
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

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar />
                <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                    <Outlet />
                </main>
            </div>
            <ToastContainer />
        </div>
    )
}