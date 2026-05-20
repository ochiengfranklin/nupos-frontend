import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
    paperWidth: '58mm' | '80mm'
    setPaperWidth: (width: '58mm' | '80mm') => void
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            paperWidth:    '80mm',
            setPaperWidth: (width) => set({ paperWidth: width }),
        }),
        { name: 'pos-settings' }
    )
)