import { useState } from 'react'

// Text copy karne ke liye, aur "Copied" dikhane ke liye
export function useCopy() {
  const [copied, setCopied] = useState(false)

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard allowed nahi hai
    }
  }

  return { copied, copyText }
}