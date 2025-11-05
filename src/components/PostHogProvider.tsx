'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function PostHogProvider() {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (posthogKey && posthogHost && typeof window !== 'undefined') {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        defaults: '2025-05-24'
      })
    }
  }, [])

  return null
}

