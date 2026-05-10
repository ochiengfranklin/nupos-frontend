import { useState, useEffect, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
    id:      string
    type:    ToastType
    message: string
}

// Global toast event system
const listeners: ((toast: ToastMessage) => void)[] = []

export const toast = {
    success: (message: string) => emit({ id: uid(), type: 'success', message }),
    error:   (message: string) => emit({ id: uid(), type: 'error',   message }),
    info:    (message: string) => emit({ id: uid(), type: 'info',    message }),
    warning: (message: string) => emit({ id: uid(), type: 'warning', message }),
}

function emit(t: ToastMessage) {
    listeners.forEach(fn => fn(t))
}

function uid() {
    return Math.random().toString(36).slice(2)
}

const STYLES: Record<ToastType, { bg: string; border: string; color: string; icon: string }> = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: '✓' },
    error:   { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '✕' },
    info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb', icon: 'i' },
    warning: { bg: '#fff7ed', border: '#fed7aa', color: '#ea580c', icon: '!' },
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const remove = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    useEffect(() => {
        const handler = (t: ToastMessage) => {
            setToasts(prev => [...prev, t])
            setTimeout(() => remove(t.id), 3500)
        }
        listeners.push(handler)
        return () => {
            const idx = listeners.indexOf(handler)
            if (idx > -1) listeners.splice(idx, 1)
        }
    }, [remove])

    return (
        <div style={{
            position:      'fixed',
            bottom:        '24px',
            right:         '24px',
            zIndex:        9999,
            display:       'flex',
            flexDirection: 'column',
            gap:           '10px',
            pointerEvents: 'none',
        }}>
            {toasts.map(t => {
                const s = STYLES[t.type]
                return (
                    <div key={t.id} style={{
                        background:    s.bg,
                        border:        `1px solid ${s.border}`,
                        borderRadius:  '10px',
                        padding:       '12px 16px',
                        display:       'flex',
                        alignItems:    'center',
                        gap:           '10px',
                        boxShadow:     '0 4px 12px rgba(0,0,0,0.08)',
                        minWidth:      '280px',
                        maxWidth:      '400px',
                        pointerEvents: 'auto',
                        animation:     'slideIn 0.25s ease',
                    }}>
            <span style={{
                width:          '20px',
                height:         '20px',
                background:     s.color,
                borderRadius:   '50%',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                color:          '#fff',
                fontSize:       '11px',
                fontWeight:     700,
                flexShrink:     0,
            }}>
              {s.icon}
            </span>
                        <span style={{ color: '#0f172a', fontSize: '14px', flex: 1, lineHeight: 1.4 }}>
              {t.message}
            </span>
                        <button
                            onClick={() => remove(t.id)}
                            style={{
                                background: 'none',
                                border:     'none',
                                cursor:     'pointer',
                                color:      '#94a3b8',
                                fontSize:   '18px',
                                padding:    '0',
                                lineHeight: 1,
                                flexShrink: 0,
                            }}
                        >
                            ×
                        </button>
                    </div>
                )
            })}
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    )
}