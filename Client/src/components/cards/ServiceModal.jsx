import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { getServiceIcon } from '../../utils/serviceIcons'

export default function ServiceModal({ service, onClose }) {
  const Icon = getServiceIcon(service.icon)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#080d0b] p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.25),transparent_70%)]" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="relative flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-black">
            <Icon size={26} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
              {service.category}
            </p>
            <h3 className="text-2xl font-bold">{service.title}</h3>
          </div>
        </div>

        <p className="relative mt-5 font-medium text-brand-300">{service.tagline}</p>
        <p className="relative mt-2 leading-relaxed text-white/65">
          {service.description}
        </p>

        <h4 className="relative mt-7 text-sm font-semibold uppercase tracking-widest text-white/50">
          What you will get
        </h4>
        <ul className="relative mt-3 grid gap-3 sm:grid-cols-2">
          {service.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/80"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-brand-400" />
              {f}
            </li>
          ))}
        </ul>

        <h4 className="relative mt-7 text-sm font-semibold uppercase tracking-widest text-white/50">
          Tools we use
        </h4>
        <div className="relative mt-3 flex flex-wrap gap-2">
          {service.tools.map((t) => (
            <span
              key={t}
              className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
          <span className="font-semibold text-white">Ideal for: </span>
          {service.idealFor}
        </div>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link
            to={`/lets-connect?service=${service.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
          >
            Apply for this service <ArrowUpRight size={16} />
          </Link>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}