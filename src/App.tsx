import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProductsPage from './pages/products/ProductsPage'
import Layout from './components/layout/Layout'

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
    if (!isLoggedIn) return <Navigate to="/login" replace />
    return <>{children}</>
}

// Public route — redirect to dashboard if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
    if (isLoggedIn) return <Navigate to="/dashboard" replace />
    return <>{children}</>
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                {/* Protected */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="products"  element={<ProductsPage />} />

                    {/* Added per step */}
                    {/* <Route path="sales"     element={<SalesPage />} /> */}
                    {/* <Route path="sales/new" element={<NewSalePage />} /> */}
                    {/* <Route path="customers" element={<CustomersPage />} /> */}
                    {/* <Route path="reports"   element={<ReportsPage />} /> */}
                    {/* <Route path="users"     element={<UsersPage />} /> */}
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
        </BrowserRouter>
    )
}