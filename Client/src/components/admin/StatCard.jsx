import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// Har card ka apna rang
const tones = {
  brand: { icon: 'bg-brand-500/15 text-brand-400', glow: 'bg-brand-500/20' },
  cyan: { icon: 'bg-cyan-500/15 text-cyan-500', glow: 'bg-cyan-500/20' },
  amber: { icon: 'bg-amber-500/15 text-amber-500', glow: 'bg-amber-500/20' },
  violet: { icon: 'bg-violet-500/15 text-violet-500', glow: 'bg-violet-500/20' },
}

export default function StatCard({ icon: Icon, label, value, hint, to, tone = 'brand', index = 0 }) {
  const [shown, setShown] = useState(0)

  // Number 0 se ginta hua aata hai
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
    >
      <Link
        to={to}
        className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-500/40"
      >
        <div
          className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150 ${tones[tone].glow}`}
        />

        <div className="relative flex items-start justify-between">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone].icon}`}>
            <Icon size={22} />
          </span>
          <ArrowUpRight
            size={18}
            className="text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-400"
          />
        </div>

        <p className="relative mt-5 text-4xl font-bold tracking-tight">{shown}</p>
        <p className="relative mt-1 text-sm font-medium text-white/80">{label}</p>
        <p className="relative mt-0.5 text-xs text-white/50">{hint}</p>
      </Link>
    </motion.div>
  )
}