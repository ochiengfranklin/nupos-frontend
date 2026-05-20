import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { authApi } from '../../api/auth.api'
import OnlineStatus from '../ui/OnlineStatus'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

const navItems = [
    {
        path:  '/app/dashboard',
        label: 'Dashboard',
        roles: ['OWNER', 'MANAGER', 'CASHIER', 'STOREKEEPER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        path:  '/app/sales/new',
        label: 'New Sale',
        roles: ['OWNER', 'MANAGER', 'CASHIER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
        ),
    },
    {
        path:  '/app/sales',
        label: 'Sales',
        roles: ['OWNER', 'MANAGER', 'CASHIER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6"  x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6"  x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
        ),
    },
    {
        path:  '/app/products',
        label: 'Products',
        roles: ['OWNER', 'MANAGER', 'STOREKEEPER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
        ),
    },
    {
        path:  '/app/inventory',
        label: 'Inventory',
        roles: ['OWNER', 'MANAGER', 'STOREKEEPER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
        ),
    },
    {
        path:  '/app/suppliers',
        label: 'Suppliers',
        roles: ['OWNER', 'MANAGER', 'STOREKEEPER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
        ),
    },
    {
        path:  '/app/customers',
        label: 'Customers',
        roles: ['OWNER', 'MANAGER', 'CASHIER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
        ),
    },
    {
        path:  '/app/loyalty',
        label: 'Loyalty',
        roles: ['OWNER', 'MANAGER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
            </svg>
        ),
    },
    {
        path:  '/app/reports',
        label: 'Reports',
        roles: ['OWNER', 'MANAGER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
        ),
    },
    {
        path:  '/app/users',
        label: 'Users',
        roles: ['OWNER', 'MANAGER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),
    },
    {
        path:  '/app/offline-queue',
        label: 'Offline queue',
        roles: ['OWNER', 'MANAGER', 'CASHIER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
            </svg>
        ),
    },
    {
        path:  '/app/settings',
        label: 'Settings',
        roles: ['OWNER', 'MANAGER'],
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
        ),
    },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const navigate          = useNavigate()
    const { user, shop, logout } = useAuthStore()
    useOnlineStatus()

    const visibleItems = navItems.filter(item =>
        user ? item.roles.includes(user.role) : false
    )

    const handleLogout = async () => {
        try { await authApi.logout() } finally {
            logout()
            navigate('/')
        }
    }

    const initials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'

    return (
        <aside style={{
            width:         '240px',
            minWidth:      '240px',
            background:    '#0f172a',
            display:       'flex',
            flexDirection: 'column',
            height:        '100vh',
        }}>
            <style>{`
        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; font-weight: 400;
          color: #64748b; text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover  { background: rgba(255,255,255,0.05); color: #cbd5e1; }
        .nav-link.active { background: rgba(59,130,246,0.15); color: #60a5fa; }
        .nav-link.active svg { stroke: #60a5fa; }
        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; color: #475569;
          background: none; border: none; cursor: pointer;
          width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; }
      `}</style>

            {/* Logo + close button */}
            <div style={{
                padding:      '20px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '34px', height: '34px',
                        background: '#3b82f6', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
                            NuPOS
                        </p>
                        <p style={{ color: '#334155', fontSize: '11px', margin: 0, lineHeight: 1.2 }}>
                            {shop?.name || '...'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', color: '#64748b',
                            padding: '4px', display: 'flex', alignItems: 'center',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6"  y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {visibleItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Online status */}
            <div style={{ padding: '8px 12px' }}>
                <OnlineStatus />
            </div>

            {/* User + logout */}
            <div style={{
                padding:   '12px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', marginBottom: '4px',
                }}>
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'rgba(59,130,246,0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
            <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 500 }}>
              {initials}
            </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name}
                        </p>
                        <p style={{ color: '#334155', fontSize: '11px', margin: 0 }}>
                            {user?.role}
                        </p>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign out
                </button>
            </div>
        </aside>
    )
}