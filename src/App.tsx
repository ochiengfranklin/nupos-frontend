import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import LandingPage   from './pages/LandingPage'
import LoginPage     from './pages/auth/LoginPage'
import RegisterPage  from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProductsPage  from './pages/products/ProductsPage'
import NewSalePage   from './pages/sales/NewSalePage'
import SalesPage     from './pages/sales/SalesPage'
import CustomersPage from './pages/customers/CustomersPage'
import UsersPage     from './pages/users/UsersPage'
import ReportsPage   from './pages/reports/ReportsPage'
import Layout        from './components/layout/Layout'
import ContactPage   from './pages/ContactPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
    if (!isLoggedIn) return <Navigate to="/login" replace />
    return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
    if (isLoggedIn) return <Navigate to="/app/dashboard" replace />
    return <>{children}</>
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                {/* --- Added Register Route --- */}
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index            element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="products"  element={<ProductsPage />} />
                    <Route path="sales"     element={<SalesPage />} />
                    <Route path="sales/new" element={<NewSalePage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="users"     element={<UsersPage />} />
                    <Route path="reports"   element={<ReportsPage />} />
                </Route>

                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<Navigate to="/" replace />} />
                <Route path="/terms"   element={<Navigate to="/" replace />} />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}