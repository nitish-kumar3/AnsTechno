import { motion } from 'framer-motion'
import { useLanguage } from '../../hooks/useLanguage'

const options = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
]

// id alag alag dena (navbar me ye do baar lagta hai: desktop aur mobile)
export default function LanguageToggle({ id }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex h-10 items-center rounded-full border border-white/10 bg-white/5 p-1"
    >
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
          className="relative h-full rounded-full px-2.5 text-xs font-semibold"
        >
          {lang === o.code && (
            <motion.span
              layoutId={`lang-pill-${id}`}
              className="absolute inset-0 rounded-full bg-brand-500"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${lang === o.code ? 'text-black' : 'text-white/70'}`}>
            {o.label}
          </span>
        </button>
      ))}
    </div>
  )
}