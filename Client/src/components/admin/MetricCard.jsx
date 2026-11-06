import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'

const tones = {
  brand: { icon: 'bg-brand-500/15 text-brand-400', glow: 'bg-brand-500/20' },
  cyan: { icon: 'bg-cyan-500/15 text-cyan-500', glow: 'bg-cyan-500/20' },
  amber: { icon: 'bg-amber-500/15 text-amber-500', glow: 'bg-amber-500/20' },
  violet: { icon: 'bg-violet-500/15 text-violet-500', glow: 'bg-violet-500/20' },
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  decimals = 0,
  badge,
  hint,
  tone = 'brand',
  index = 0,
}) {
  const [shown, setShown] = useState(0)

  // Number 0 se ginta hua aata hai
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setShown(v),
    })
    return () => controls.stop()
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5"
    >
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${tones[tone].glow}`} />

      <div className="relative flex items-start justify-between gap-2">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone].icon}`}>
          <Icon size={22} />
        </span>
        {badge}
      </div>

      <p className="relative mt-5 text-4xl font-bold tracking-tight">
        {shown.toFixed(decimals)}
        {suffix}
      </p>
      <p className="relative mt-1 text-sm font-medium text-white/80">{label}</p>
      {hint && <p className="relative mt-0.5 text-xs text-white/50">{hint}</p>}
    </motion.div>
  )
}