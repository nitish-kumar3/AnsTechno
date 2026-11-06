import { useRef, useState } from 'react'

// Chhota sa "Saved!" message dikhane ke liye
export function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const show = (message, type = 'success') => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), message, type })
    timer.current = setTimeout(() => setToast(null), 2500)
  }

  return { toast, show }
}