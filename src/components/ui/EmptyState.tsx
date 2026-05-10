export default function EmptyState({
                                       title,
                                       sub,
                                       action,
                                       onAction,
                                   }: {
    title:     string
    sub?:      string
    action?:   string
    onAction?: () => void
}) {
    return (
        <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '64px 24px',
            textAlign:      'center',
        }}>
            <div style={{
                width:        '56px',
                height:       '56px',
                background:   '#f1f5f9',
                borderRadius: '14px',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                marginBottom: '16px',
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
            </div>
            <p style={{ color: '#0f172a', fontSize: '15px', fontWeight: 500, margin: '0 0 6px' }}>
                {title}
            </p>
            {sub && (
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px', maxWidth: '300px', lineHeight: 1.6 }}>
                    {sub}
                </p>
            )}
            {action && onAction && (
                <button onClick={onAction} style={{
                    background: '#2563eb', color: '#fff',
                    border: 'none', borderRadius: '8px',
                    padding: '9px 20px', fontSize: '14px',
                    fontWeight: 500, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    {action}
                </button>
            )}
        </div>
    )
}