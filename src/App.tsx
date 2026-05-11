import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/auth/LoginPage'
import DashboardPage  from './pages/dashboard/DashboardPage'
import ProductsPage   from './pages/products/ProductsPage'
import NewSalePage    from './pages/sales/NewSalePage'
import SalesPage      from './pages/sales/SalesPage'
import CustomersPage  from './pages/customers/CustomersPage'
import UsersPage      from './pages/users/UsersPage'
import ReportsPage    from './pages/reports/ReportsPage'
import Layout         from './components/layout/Layout'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
    if (!isLoggedIn) return <Navigate to="/login" replace />
    return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
    if (isLoggedIn) return <Navigate to="/dashboard" replace />
    return <>{children}</>
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Landing page — public */}
                <Route path="/" element={<LandingPage />} />

                {/* Login — redirect to dashboard if logged in */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                {/* App — protected */}
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index                element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard"     element={<DashboardPage />} />
                    <Route path="products"      element={<ProductsPage />} />
                    <Route path="sales"         element={<SalesPage />} />
                    <Route path="sales/new"     element={<NewSalePage />} />
                    <Route path="customers"     element={<CustomersPage />} />
                    <Route path="users"         element={<UsersPage />} />
                    <Route path="reports"       element={<ReportsPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    )
}