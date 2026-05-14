import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'

interface BarcodeScannerProps {
    onScan:  (barcode: string) => void
    onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const videoRef               = useRef<HTMLVideoElement>(null)
    const readerRef              = useRef<BrowserMultiFormatReader | null>(null)
    const [error,   setError]    = useState('')
    const [loading, setLoading]  = useState(true)

    useEffect(() => {
        const reader = new BrowserMultiFormatReader()
        readerRef.current = reader

        reader.listVideoInputDevices().then(devices => {
            if (devices.length === 0) {
                setError('No camera found on this device')
                setLoading(false)
                return
            }

            // Use back camera on mobile if available
            const backCamera = devices.find(d =>
                d.label.toLowerCase().includes('back') ||
                d.label.toLowerCase().includes('rear')
            ) || devices[0]

            setLoading(false)

            reader.decodeFromVideoDevice(
                backCamera.deviceId,
                videoRef.current!,
                (result) => { // <-- FIX: Removed the unused 'err' parameter here
                    if (result) {
                        onScan(result.getText())
                        reader.reset()
                    }
                }
            )
        }).catch(() => {
            setError('Camera access denied. Please allow camera permissions.')
            setLoading(false)
        })

        return () => {
            reader.reset()
        }
    }, [onScan])

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,23,42,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '24px',
        }}>
            <div style={{
                background: '#fff', borderRadius: '16px',
                overflow: 'hidden', width: '100%', maxWidth: '480px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
                }}>
                    <div>
                        <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 500, margin: '0 0 2px' }}>
                            Scan barcode
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                            Point camera at the product barcode
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#94a3b8', padding: '4px', borderRadius: '6px',
                            display: 'flex', alignItems: 'center',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                {/* Camera view */}
                <div style={{ position: 'relative', background: '#000', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {loading && (
                        <div style={{ position: 'absolute', zIndex: 1, textAlign: 'center' }}>
                            <div style={{
                                width: '32px', height: '32px',
                                border: '3px solid rgba(255,255,255,0.2)',
                                borderTopColor: '#fff', borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                                margin: '0 auto 12px',
                            }} />
                            <p style={{ color: '#fff', fontSize: '13px', margin: 0 }}>Starting camera...</p>
                        </div>
                    )}

                    {error ? (
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block' }}>
                                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                            </svg>
                            <p style={{ color: '#fff', fontSize: '14px', margin: '0 0 16px', lineHeight: 1.6 }}>{error}</p>
                            <button
                                onClick={onClose}
                                style={{
                                    background: '#fff', color: '#0f172a',
                                    border: 'none', borderRadius: '8px',
                                    padding: '8px 20px', fontSize: '13px',
                                    fontWeight: 500, cursor: 'pointer',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                style={{ width: '100%', display: 'block' }}
                                autoPlay
                                playsInline
                                muted
                            />
                            {/* Scanning overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                            }}>
                                <div style={{
                                    width: '200px', height: '120px',
                                    border: '2px solid #2563eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 0 0 2000px rgba(0,0,0,0.4)',
                                    position: 'relative',
                                }}>
                                    {/* Corner markers */}
                                    {[
                                        { top: -2, left: -2, borderTop: '3px solid #2563eb', borderLeft: '3px solid #2563eb', borderRadius: '4px 0 0 0' },
                                        { top: -2, right: -2, borderTop: '3px solid #2563eb', borderRight: '3px solid #2563eb', borderRadius: '0 4px 0 0' },
                                        { bottom: -2, left: -2, borderBottom: '3px solid #2563eb', borderLeft: '3px solid #2563eb', borderRadius: '0 0 0 4px' },
                                        { bottom: -2, right: -2, borderBottom: '3px solid #2563eb', borderRight: '3px solid #2563eb', borderRadius: '0 0 4px 0' },
                                    ].map((s, i) => (
                                        <div key={i} style={{ position: 'absolute', width: '20px', height: '20px', ...s }} />
                                    ))}
                                    {/* Scan line animation */}
                                    <div style={{
                                        position: 'absolute', left: 0, right: 0,
                                        height: '2px', background: '#2563eb',
                                        animation: 'scanLine 1.5s ease-in-out infinite',
                                        boxShadow: '0 0 8px #2563eb',
                                    }} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer tip */}
                {!error && (
                    <div style={{ padding: '12px 20px', background: '#f8fafc', textAlign: 'center' }}>
                        <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                            Hold the barcode steady inside the blue box
                        </p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanLine {
          0%   { top: 0; }
          50%  { top: calc(100% - 2px); }
          100% { top: 0; }
        }
      `}</style>
        </div>
    )
}