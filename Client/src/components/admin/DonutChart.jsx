import { motion } from 'framer-motion'

const palette = [
  { stroke: 'stroke-brand-500', dot: 'bg-brand-500' },
  { stroke: 'stroke-cyan-400', dot: 'bg-cyan-400' },
  { stroke: 'stroke-amber-400', dot: 'bg-amber-400' },
  { stroke: 'stroke-violet-400', dot: 'bg-violet-400' },
]

export default function DonutChart({ items, centerLabel = 'Total' }) {
  const total = items.reduce((sum, i) => sum + i.count, 0)

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-white/50">No data yet</p>
  }

  const R = 42
  const C = 2 * Math.PI * R // gol ki lambai
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="11" className="stroke-white/10" />
          {items.map((item, i) => {
            const length = (item.count / total) * C
            const circle = (
              <motion.circle
                key={item.label}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                strokeWidth="11"
                className={palette[i % palette.length].stroke}
                strokeDasharray={`${length} ${C - length}`}
                strokeDashoffset={-offset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              />
            )
            offset += length
            return circle
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-[11px] text-white/50">{centerLabel}</p>
          </div>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-white/80">
              <span className={`h-2.5 w-2.5 rounded-full ${palette[i % palette.length].dot}`} />
              {item.label}
            </span>
            <span className="font-semibold">
              {item.count}
              <span className="ml-1.5 text-xs font-normal text-white/50">
                {Math.round((item.count / total) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}