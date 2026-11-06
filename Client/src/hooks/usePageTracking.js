import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../services/track'

// Page badalte hi ek view count hota hai
export function usePageTracking() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])
}