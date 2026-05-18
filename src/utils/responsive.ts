// Breakpoints
export const breakpoints = {
    mobile:  480,
    tablet:  768,
    desktop: 1024,
} as const

// Use this hook in components to get current screen size
import { useState, useEffect } from 'react'

export function useScreenSize() {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handler = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return {
        width,
        isMobile:  width < 480,
        isTablet:  width >= 480 && width < 768,
        isDesktop: width >= 1024,
        isSmall:   width < 768,
    }
}