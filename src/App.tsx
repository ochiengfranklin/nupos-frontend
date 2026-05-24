import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import LandingPage         from './pages/LandingPage'
import LoginPage           from './pages/auth/LoginPage'
import RegisterPage        from './pages/auth/RegisterPage'
import DemoPage            from './pages/auth/DemoPage'
import ForgotPasswordPage  from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage   from './pages/auth/ResetPasswordPage'
import DashboardPage       from './pages/dashboard/DashboardPage'
import ProductsPage        from './pages/products/ProductsPage'
import NewSalePage         from './pages/sales/NewSalePage'
import SalesPage           from './pages/sales/SalesPage'
import CustomersPage       from './pages/customers/CustomersPage'
import UsersPage           from './pages/users/UsersPage'
import ReportsPage         from './pages/reports/ReportsPage'
import Layout              from './components/layout/Layout'
import ContactPage         from './pages/ContactPage'
import InventoryPage       from './pages/inventory/InventoryPage'
import SuppliersPage       from './pages/suppliers/SuppliersPage'
import OfflineQueuePage    from './pages/offline/OfflineQueuePage'
import LoyaltySettingsPage from './pages/loyalty/LoyaltySettingsPage'
import SettingsPage        from './pages/settings/SettingsPage'
import BillingPage         from './pages/billing/BillingPage'

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

                <Route path="/login" element={
                    <PublicRoute><LoginPage /></PublicRoute>
                } />

                <Route path="/register" element={
                    <PublicRoute><RegisterPage /></PublicRoute>
                } />

                <Route path="/demo"             element={<DemoPage />} />
                <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
                <Route path="/reset-password"   element={<ResetPasswordPage />} />

                <Route path="/app" element={
                    <ProtectedRoute><Layout /></ProtectedRoute>
                }>
                    <Route index                element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard"     element={<DashboardPage />} />
                    <Route path="products"      element={<ProductsPage />} />
                    <Route path="sales"         element={<SalesPage />} />
                    <Route path="sales/new"     element={<NewSalePage />} />
                    <Route path="customers"     element={<CustomersPage />} />
                    <Route path="users"         element={<UsersPage />} />
                    <Route path="reports"       element={<ReportsPage />} />
                    <Route path="inventory"     element={<InventoryPage />} />
                    <Route path="suppliers"     element={<SuppliersPage />} />
                    <Route path="offline-queue" element={<OfflineQueuePage />} />
                    <Route path="loyalty"       element={<LoyaltySettingsPage />} />
                    <Route path="settings"      element={<SettingsPage />} />
                    <Route path="billing"       element={<BillingPage />} />
                </Route>

                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy"  element={<Navigate to="/" replace />} />
                <Route path="/terms"    element={<Navigate to="/" replace />} />
                <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}