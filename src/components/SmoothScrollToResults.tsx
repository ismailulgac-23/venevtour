'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export const SmoothScrollToResults = () => {
    const searchParams = useSearchParams()

    useEffect(() => {
        // If there are search parameters (excluding pagination maybe, but let's keep it simple)
        if (searchParams.toString().length > 0) {
            const heading = document.getElementById('heading')
            if (heading) {
                // Wait slightly for layout to settle
                setTimeout(() => {
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 300)
            }
        }
    }, [])

    return null
}
