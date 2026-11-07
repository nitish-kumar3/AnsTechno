import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Megaphone, X } from 'lucide-react'
import { useAnnouncements } from '../../hooks/useContent'
import { useLanguage } from '../../hooks/useLanguage'

const KEY = 'ann-dismissed'
const BAR_HEIGHT = '40px' // h-10 ke barabar

export default function AnnouncementBar() {
  const { lang } = useLanguage()
  const { data } = useAnnouncements()
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })

  const items = data || []
  const show = items.length > 0 && !dismissed

  // Navbar ko patti ke neeche khisakne ke liye (CSS variable)
  useEffect(() => {
    document.documentElement.style.setProperty('--bar-h', show ? BAR_HEIGHT : '0px')
    return () => document.documentElement.style.setProperty('--bar-h', '0px')
  }, [show])

  // Ek se zyada ho to har 6 second me badlo
  useEffect(() => {
    if (items.length < 2 || dismissed) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000)
    return () => clearInterval(id)
  }, [items.length, dismissed])

  const close = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      // storage allowed nahi hai
    }
  }

  if (!show) return null

  const item = items[index % items.length]
  const text = lang === 'hi' && item.textHi ? item.textHi : item.text
  const label =
    (lang === 'hi' ? item.linkLabelHi : item.linkLabel) || (lang === 'hi' ? 'जानें' : 'Know more')

  // Sirf andar ka (/...) ya https wala link chalega
  const internal = item.link?.startsWith('/')
  const external = /^https:\/\//i.test(item.link || '')
  const linkClass = 'inline-flex shrink-0 items-center gap-1 font-bold underline underline-offset-2'

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="absolute inset-x-0 top-0 z-[55] flex h-10 items-center justify-center gap-2 bg-linear-to-r from-brand-600 via-brand-500 to-brand-400 px-10 text-xs text-black sm:text-sm"
    >
      <Megaphone size={15} className="hidden shrink-0 sm:block" />

      <AnimatePresence mode="wait">
        <motion.p
          key={item._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex min-w-0 items-center gap-2 font-medium"
        >
          <span className="truncate">{text}</span>
          {internal && (
            <Link to={item.link} className={linkClass}>
              {label} <ArrowRight size={14} />
            </Link>
          )}
          {external && (
            <a href={item.link} target="_blank" rel="noreferrer noopener" className={linkClass}>
              {label} <ArrowRight size={14} />
            </a>
          )}
        </motion.p>
      </AnimatePresence>

      <button
        type="button"
        onClick={close}
        aria-label="Close announcement"
        className="absolute right-2 grid h-7 w-7 place-items-center rounded-full text-black/70 transition hover:bg-black/10 hover:text-black"
      >
        <X size={16} />
      </button>
    </div>
  )
}