import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {User, Shop} from '../types'

interface AuthStore {
    accessToken:  string | null
    refreshToken: string | null
    user:         User | null
    shop:         Shop | null

    // Actions
    setAuth:    (data: { accessToken: string; refreshToken: string; user: User; shop: Shop }) => void
    setTokens:  (accessToken: string, refreshToken: string) => void
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

            logout: () => set({
                accessToken:  null,
                refreshToken: null,
                user:         null,
                shop:         null,
            }),

            isLoggedIn: () => !!get().accessToken && !!get().user,

            // Check if current user has one of the allowed roles
            hasRole: (roles: string[]) => {
                const role = get().user?.role
                if (!role) return false
                if (role === 'OWNER') return true  // owner has access to everything
                return roles.includes(role)
            },
        }),
        {
            name: 'pos-auth', // key in localStorage
        }
    )
)