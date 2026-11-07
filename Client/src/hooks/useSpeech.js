import { useCallback, useEffect, useRef, useState } from 'react'

const Recognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

// Bolte waqt /estimate jaise page naam ajeeb lagte hain, to hata dete hain
const pages =
  /\/(?:services|portfolio|career|estimate|online-check|lets-connect|our-story|verify|talent|blog)(?![\w-])/g

export function useSpeech() {
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [error, setError] = useState('')
  const recRef = useRef(null)

  // Mic se bolna sunna
  const listen = useCallback((lang, onFinal) => {
    if (!Recognition) return
    setError('')

    const rec = new Recognition()
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    rec.interimResults = false
    rec.continuous = false
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.trim()
      if (text) onFinal(text)
    }
    rec.onerror = (e) => {
      setError(e.error || 'error')
      setListening(false)
    }
    rec.onend = () => setListening(false)

    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    recRef.current?.stop()
  }, [])

  // Jawab bolkar sunana
  const speak = useCallback((text) => {
    if (!canSpeak || !text) return
    window.speechSynthesis.cancel()

    const clean = text.replace(pages, '').replace(/\s+/g, ' ').trim()
    if (!clean) return

    const utter = new SpeechSynthesisUtterance(clean)
    utter.lang = /[\u0900-\u097F]/.test(clean) ? 'hi-IN' : 'en-IN' // Devanagari ho to Hindi awaaz
    utter.rate = 0.95

    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith(utter.lang.slice(0, 2)))
    if (voice) utter.voice = voice

    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (canSpeak) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  // Component hatne par sab band
  useEffect(
    () => () => {
      recRef.current?.abort?.()
      if (canSpeak) window.speechSynthesis.cancel()
    },
    []
  )

  return {
    canListen: Boolean(Recognition),
    canSpeak,
    listening,
    speaking,
    error,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  }
}