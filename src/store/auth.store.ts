import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface Shop {
    id:             string
    name:           string
    slug:           string
    phone?:         string
    email?:         string
    address?:       string
    city?:          string
    country?:       string
    currency?:      string
    tillNumber?:    string
    taxRate?:       string
    receiptFooter?: string
    logoUrl?:       string
}

interface AuthStore {
    accessToken:  string | null
    refreshToken: string | null
    user:         User   | null
    shop:         Shop   | null

    setAuth:    (data: { accessToken: string; refreshToken: string; user: User; shop: Shop }) => void
    setTokens:  (accessToken: string, refreshToken: string) => void
    setShop:    (shop: Shop) => void
    logout:     () => void
    isLoggedIn: () => boolean
    hasRole:    (roles: string[]) => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            accessToken:  null,
            refreshToken: null,
            user:         null,
            shop:         null,

            setAuth: (data) => set({
                accessToken:  data.accessToken,
                refreshToken: data.refreshToken,
                user:         data.user,
                shop:         data.shop,
            }),

            setTokens: (accessToken, refreshToken) => set({
                accessToken,
                refreshToken,
            }),

            setShop: (shop) => set({ shop }),

            logout: () => set({
                accessToken:  null,
                refreshToken: null,
                user:         null,
                shop:         null,
            }),

            isLoggedIn: () => !!get().accessToken && !!get().user,

            hasRole: (roles: string[]) => {
                const role = get().user?.role
                if (!role) return false
                if (role === 'OWNER') return true
                return roles.includes(role)
            },
        }),
        {
            name: 'pos-auth',
        }
    )
)