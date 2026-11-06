import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Phone, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useLanguage } from '../../hooks/useLanguage'
import { useSettings } from '../../hooks/useContent'
import CallRequestModal from '../forms/CallRequestModal'
import ChatMessage from './ChatMessage'

const copy = {
  en: {
    launcher: 'Ask AI',
    title: 'Anstechno Assistant',
    status: 'AI assistant · Ask anything',
    greeting:
      'Hi! I am the Anstechno assistant. Ask me about our services, internships, pricing or how we can help your business go digital.',
    teaser: 'Hi! Need help? Ask me anything.',
    chips: [
      'What services do you offer?',
      'How much does a website cost?',
      'Tell me about free internships',
      'I want to talk to your team',
    ],
    placeholder: 'Type your question...',
    disclaimer: 'AI can make mistakes. Please do not share passwords or ID numbers.',
    call: 'Request a call back',
    wa: 'WhatsApp us',
    newChat: 'New chat',
    close: 'Close chat',
    errBusy: 'I am getting too many questions right now. Please try again in a minute, or reach us directly:',
    errLimit: 'Our chat is resting for today. Please reach us directly:',
    errOff: 'The assistant is not available right now. Please reach us directly:',
    errFail: 'Sorry, something went wrong. Please try again, or reach us directly:',
    waText: 'Hi Anstechno, I was chatting on your website and want to know more.',
  },
  hi: {
    launcher: 'AI से पूछें',
    title: 'Anstechno असिस्टेंट',
    status: 'AI असिस्टेंट · कुछ भी पूछें',
    greeting:
      'नमस्ते! मैं Anstechno का असिस्टेंट हूं। हमारी सेवाओं, इंटर्नशिप, कीमत या अपने बिज़नेस को डिजिटल बनाने के बारे में पूछिए।',
    teaser: 'नमस्ते! मदद चाहिए? कुछ भी पूछिए।',
    chips: [
      'आप कौन-कौन सी सेवाएं देते हैं?',
      'वेबसाइट बनवाने में कितना खर्च आएगा?',
      'मुफ़्त इंटर्नशिप के बारे में बताइए',
      'मुझे आपकी टीम से बात करनी है',
    ],
    placeholder: 'अपना सवाल लिखें...',
    disclaimer: 'AI से गलती हो सकती है। कृपया पासवर्ड या ID नंबर न भेजें।',
    call: 'कॉल बैक का अनुरोध करें',
    wa: 'WhatsApp करें',
    newChat: 'नई चैट',
    close: 'चैट बंद करें',
    errBusy: 'अभी बहुत सारे सवाल आ रहे हैं। कृपया एक मिनट बाद कोशिश करें, या सीधे संपर्क करें:',
    errLimit: 'आज के लिए हमारी चैट आराम कर रही है। कृपया सीधे संपर्क करें:',
    errOff: 'असिस्टेंट अभी उपलब्ध नहीं है। कृपया सीधे संपर्क करें:',
    errFail: 'माफ़ कीजिए, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें, या सीधे संपर्क करें:',
    waText: 'नमस्ते Anstechno, मैं आपकी वेबसाइट पर चैट कर रहा था और और जानकारी चाहता हूं।'
  },
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <span className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-300 to-brand-600 text-black">
        <Sparkles size={14} />
      </span>
      <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.03] px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-white/50"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const { lang } = useLanguage()
  const c = copy[lang]
  const contact = useSettings()
  const { messages, loading, send, reset } = useChat()

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [callModal, setCallModal] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // WhatsApp number: 10 digit ho to aage 91 laga do
  const digits = String(contact.whatsapp || contact.phone || '').replace(/\D/g, '')
  const whatsapp = digits.length === 10 ? `91${digits}` : digits
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(c.waText)}`
    : ''

  // 5 second baad chhota "Hi! Need help?" bubble (ek session me ek baar)
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('chatTeaser') === '1'
    } catch {
      // ignore
    }
    if (seen) return
    const timer = setTimeout(() => setTeaser(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const hideTeaser = () => {
    setTeaser(false)
    try {
      sessionStorage.setItem('chatTeaser', '1')
    } catch {
      // ignore
    }
  }

  const toggle = () => {
    setOpen((o) => !o)
    hideTeaser()
  }

  // Chat khuli ho to: Esc se band, phone par peeche ka page scroll na ho
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)

    const phone = window.matchMedia('(max-width: 639px)').matches
    if (phone) document.body.style.overflow = 'hidden'
    else setTimeout(() => inputRef.current?.focus(), 250)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // Naya message aaye to neeche scroll
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading, open])

  const submit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    send(input, lang)
    setInput('')
  }

  // Chat me link dabane par phone par chat band ho jaye, taaki page dikhe
  const onNavigate = () => {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false)
  }

  const errorText = (code) =>
    ({ busy: c.errBusy, limit: c.errLimit, off: c.errOff })[code] || c.errFail

  // Call back aur WhatsApp ke buttons
  const actions = (
    <div className="mt-2 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setCallModal(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-brand-300"
      >
        <Phone size={13} /> {c.call}
      </button>
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
        >
          <MessageCircle size={13} /> {c.wa}
        </a>
      )}
    </div>
  )

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label={c.title}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden border-white/10 bg-[#080d0b] sm:inset-auto sm:bottom-24 sm:left-6 sm:h-[34rem] sm:max-h-[calc(100vh-8rem)] sm:w-[24rem] sm:rounded-3xl sm:border sm:shadow-2xl"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.22),transparent_70%)]" />
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-300 to-brand-600 text-black">
                <Sparkles size={20} />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="truncate font-semibold">{c.title}</p>
                <p className="flex items-center gap-1.5 truncate text-xs text-white/55">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                  {c.status}
                </p>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={reset}
                  title={c.newChat}
                  aria-label={c.newChat}
                  className="relative rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label={c.close}
                className="relative rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <ChatMessage role="bot" text={c.greeting} onNavigate={onNavigate} />

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {c.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip, lang)}
                      className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-2 text-left text-xs font-medium text-brand-300 transition hover:bg-brand-500/20"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) =>
                m.role === 'user' ? (
                  <ChatMessage key={m.id} role="user" text={m.text} />
                ) : m.error ? (
                  <ChatMessage key={m.id} role="bot" text={errorText(m.error)} onNavigate={onNavigate}>
                    {actions}
                  </ChatMessage>
                ) : (
                  <ChatMessage key={m.id} role="bot" text={m.text} onNavigate={onNavigate}>
                    {m.offerCall && actions}
                  </ChatMessage>
                )
              )}

              {loading && <TypingDots />}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              <form onSubmit={submit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder={c.placeholder}
                  aria-label={c.placeholder}
                  className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-base outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-black transition hover:bg-brand-400 disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="mt-2 text-center text-[11px] text-white/40">{c.disclaimer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neeche left me hamesha dikhne wala button */}
      <div className="fixed bottom-5 left-5 z-40 sm:bottom-6 sm:left-6">
        <AnimatePresence>
          {teaser && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-3 flex w-60 items-start gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-ink/95 p-3 pr-2 text-sm shadow-xl backdrop-blur-xl"
            >
              <button type="button" onClick={toggle} className="flex-1 text-left font-medium">
                {c.teaser}
              </button>
              <button
                type="button"
                onClick={hideTeaser}
                aria-label="Dismiss"
                className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          whileTap={{ scale: 0.95 }}
          aria-label={open ? c.close : c.launcher}
          aria-expanded={open}
          className="relative inline-flex h-14 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_10px_40px_-8px_rgba(25,195,154,0.7)] transition-colors hover:bg-brand-300"
        >
          {open ? (
            <X size={20} />
          ) : (
            <>
              <Sparkles size={20} className="text-brand-600" />
              <span>{c.launcher}</span>
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-500" />
              </span>
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {callModal && <CallRequestModal onClose={() => setCallModal(false)} />}
      </AnimatePresence>
    </>
  )
}