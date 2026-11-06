import { TrendingDown, TrendingUp } from 'lucide-react'

// Pichhle period se kitna badla (+12% / -5%)
export default function Delta({ current, previous }) {
  if (!previous) return null // pehle ka data nahi to kuch mat dikhao

  const percent = Math.round(((current - previous) / previous) * 100)
  const up = percent >= 0

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        up ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'
      }`}
    >
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? '+' : ''}
      {percent}%
    </span>
  )
}