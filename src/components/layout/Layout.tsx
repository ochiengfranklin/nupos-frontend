import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: '#f8fafc',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
            <Sidebar />
            <main style={{
                flex: 1,
                overflowY: 'auto',
                padding: '32px',
            }}>
                <Outlet />
            </main>
        </div>
    )
}