export default function Modal({
                                  title,
                                  onClose,
                                  children,
                                  maxWidth = 560,
                              }: {
    title:     string
    onClose:   () => void
    children:  React.ReactNode
    maxWidth?: number
}) {
    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(15,23,42,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 50, padding: '24px',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div style={{
                background:   '#fff',
                borderRadius: '16px',
                width:        '100%',
                maxWidth:     `${maxWidth}px`,
                maxHeight:    '90vh',
                overflowY:    'auto',
                boxShadow:    '0 20px 60px rgba(0,0,0,0.15)',
                animation:    'modalIn 0.2s ease',
            }}>
                <div style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    padding:        '20px 24px',
                    borderBottom:   '1px solid #f1f5f9',
                    position:       'sticky',
                    top:            0,
                    background:     '#fff',
                    zIndex:         1,
                }}>
                    <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 500, margin: 0 }}>
                        {title}
                    </h3>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', padding: '4px', borderRadius: '6px',
                        display: 'flex', alignItems: 'center',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div style={{ padding: '24px' }}>
                    {children}
                </div>
            </div>
            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
        </div>
    )
}