import { motion } from 'framer-motion'

const tones = {
  brand: 'bg-brand-500',
  cyan: 'bg-cyan-400',
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
}

// Naam + number + lambi hoti hui bar
export default function BarList({ items, tone = 'brand', empty = 'No data yet', format }) {
  const total = items.reduce((sum, i) => sum + i.count, 0)
  const max = Math.max(1, ...items.map((i) => i.count))

  if (total === 0) {
    return <p className="py-8 text-center text-sm text-white/50">{empty}</p>
  }

  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-white/80" title={item.label}>
              {format ? format(item.label) : item.label}
            </span>
            <span className="shrink-0 font-semibold">{item.count}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full ${tones[tone]}`}
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}