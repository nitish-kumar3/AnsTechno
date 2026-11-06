import { useEffect, useState } from 'react'
import api from '../services/api'

const KEY = 'anstech-chat'

// Refresh karne par bhi baat-cheet yaad rahe (tab band hone tak)
function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function useChat() {
  const [messages, setMessages] = useState(load)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-30)))
    } catch {
      // storage allowed nahi hai
    }
  }, [messages])

  const send = async (text, lang) => {
    const clean = text.trim().slice(0, 500)
    if (!clean || loading) return

    const next = [...messages, { id: Date.now(), role: 'user', text: clean }]
    setMessages(next)
    setLoading(true)

    try {
      // Error wale messages server ko nahi bhejte
      const history = next
        .filter((m) => !m.error && m.text)
        .map((m) => ({ role: m.role, text: m.text }))

      const { data } = await api.post('/chat', { messages: history, lang })
      setMessages((list) => [
        ...list,
        { id: Date.now() + 1, role: 'bot', text: data.reply, offerCall: data.offerCall },
      ])
    } catch (err) {
      const code = err.response?.data?.code || 'fail'
      setMessages((list) => [...list, { id: Date.now() + 1, role: 'bot', text: '', error: code }])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setMessages([])
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      // ignore
    }
  }

  return { messages, loading, send, reset }
}