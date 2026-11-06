import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { getServiceIcon } from '../../utils/serviceIcons'

export default function ServiceCard({ service, index = 0, onOpen }) {
  const ref = useRef(null)
  const Icon = getServiceIcon(service.icon)

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onClick={() => onOpen(service)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.25, delay: 0 } }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-colors duration-300 hover:border-brand-500/40"
    >
      {/* mouse-follow glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(350px circle at var(--x) var(--y), rgba(25,195,154,0.16), transparent 45%)',
        }}
      />

      <div className="relative flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-black">
          <Icon size={26} />
        </span>
        <span className="text-5xl font-bold text-white/[0.06]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <p className="relative mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
        {service.category}
      </p>
      <h3 className="relative mt-1 text-xl font-semibold">{service.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-white/60">
        {service.tagline}
      </p>

      <ul className="relative mt-5 space-y-2">
        {service.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/70">
            <Check size={16} className="mt-0.5 shrink-0 text-brand-400" />
            {f}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto flex items-center justify-between pt-6">
        <span className="flex items-center gap-1 text-sm font-medium text-brand-300">
          View details
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
        <Link
          to={`/lets-connect?service=${service.id}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-brand-300"
        >
          Apply
        </Link>
      </div>
    </motion.article>
  )
}