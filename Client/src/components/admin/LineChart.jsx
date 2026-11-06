import { useId, useState } from 'react'
import { motion } from 'framer-motion'

const W = 640
const H = 230
const PL = 38 // left (numbers ke liye)
const PR = 12
const PT = 14
const PB = 30 // neeche (dates ke liye)

// Upar ka number gol-gol (13 -> 20, 120 -> 200)
function niceMax(v) {
  if (v <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(v))
  return Math.ceil(v / pow) * pow
}

// Points ko smooth curve me jodo
function curve(points) {
  return points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      const mid = (prev.x + p.x) / 2
      return `C ${mid} ${prev.y}, ${mid} ${p.y}, ${p.x} ${p.y}`
    })
    .join(' ')
}

const label = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

export default function LineChart({ data }) {
  const gradientId = useId().replace(/:/g, '')
  const [hover, setHover] = useState(null)

  const n = data.length
  const innerW = W - PL - PR
  const innerH = H - PT - PB
  const baseY = PT + innerH
  const max = niceMax(Math.max(1, ...data.map((d) => d.views)))
  const nothing = data.every((d) => d.views === 0)

  const x = (i) => (n === 1 ? PL + innerW / 2 : PL + (i * innerW) / (n - 1))
  const y = (v) => baseY - (v / max) * innerH

  const viewPoints = data.map((d, i) => ({ x: x(i), y: y(d.views) }))
  const visitorPoints = data.map((d, i) => ({ x: x(i), y: y(d.visitors) }))
  const viewsLine = curve(viewPoints)
  const area = `${viewsLine} L ${viewPoints[n - 1].x} ${baseY} L ${viewPoints[0].x} ${baseY} Z`

  const slot = innerW / Math.max(n - 1, 1)
  const step = Math.ceil(n / 7) // kitni dates dikhani hain
  const tip = hover !== null ? data[hover] : null
  const tipLeft = hover !== null ? Math.min(88, Math.max(12, (x(hover) / W) * 100)) : 0

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Peeche ki lines aur left ke numbers */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <g key={p}>
            <line
              x1={PL}
              x2={W - PR}
              y1={baseY - p * innerH}
              y2={baseY - p * innerH}
              className="stroke-white/10"
              strokeDasharray={p === 0 ? '0' : '3 5'}
            />
            <text
              x={PL - 8}
              y={baseY - p * innerH + 3}
              textAnchor="end"
              fontSize="10"
              className="fill-white/50"
            >
              {Math.round(max * p)}
            </text>
          </g>
        ))}

        {/* Lines */}
        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d={viewsLine}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-cyan-400"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.path
          d={curve(visitorPoints)}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-brand-500"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.15 }}
        />

        {/* Hover par line aur dots */}
        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PT}
              y2={baseY}
              className="stroke-white/30"
              strokeDasharray="3 4"
            />
            <circle cx={x(hover)} cy={y(data[hover].views)} r="4.5" className="fill-cyan-400" />
            <circle cx={x(hover)} cy={y(data[hover].visitors)} r="4.5" className="fill-brand-500" />
          </g>
        )}

        {/* Neeche ki dates */}
        {data.map((d, i) =>
          i % step === 0 ? (
            <text
              key={d.date}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              className="fill-white/50"
            >
              {label(d.date)}
            </text>
          ) : null
        )}

        {/* Hover pakadne wale invisible hisse */}
        {data.map((d, i) => (
          <rect
            key={d.date}
            x={x(i) - slot / 2}
            y={0}
            width={slot}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onTouchStart={() => setHover(i)}
          />
        ))}
      </svg>

      {tip && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-xl border border-white/10 bg-ink/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          style={{ left: `${tipLeft}%` }}
        >
          <p className="font-semibold">{label(tip.date)}</p>
          <p className="mt-1 flex items-center gap-2 text-white/70">
            <span className="h-2 w-2 rounded-full bg-cyan-400" /> Page views: {tip.views}
          </p>
          <p className="flex items-center gap-2 text-white/70">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> Visitors: {tip.visitors}
          </p>
        </div>
      )}

      {nothing && (
        <p className="mt-2 text-center text-sm text-white/50">
          Abhi tak koi visitor nahi. Website khulte hi yahan dikhne lagega.
        </p>
      )}
    </div>
  )
}