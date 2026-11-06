import { motion } from 'framer-motion'

export default function ActivityChart({ data }) {
  const W = 560 // chart ki chaudai
  const H = 190 // unchai
  const top = 10
  const bottom = 28 // neeche dates ke liye jagah
  const baseY = H - bottom
  const chartHeight = H - top - bottom

  // Sabse bada number (bars ki unchai uske hisaab se)
  const max = Math.max(1, ...data.flatMap((d) => [d.applications, d.inquiries]))
  const slot = W / data.length
  const barWidth = Math.min(12, slot / 3)
  const nothing = data.every((d) => d.applications === 0 && d.inquiries === 0)

  const barHeight = (value) => (value === 0 ? 2 : Math.max(4, (value / max) * chartHeight))
  const label = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-white/60">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Applications
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Messages
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full">
        {/* Peeche ki lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="0"
            x2={W}
            y1={baseY - p * chartHeight}
            y2={baseY - p * chartHeight}
            className="stroke-white/10"
            strokeWidth="1"
            strokeDasharray={p === 0 ? '0' : '3 5'}
          />
        ))}

        {data.map((d, i) => {
          const center = i * slot + slot / 2
          const appH = barHeight(d.applications)
          const inqH = barHeight(d.inquiries)

          return (
            <g key={i}>
              <motion.rect
                x={center - barWidth - 1}
                width={barWidth}
                rx="3"
                className="fill-brand-500"
                opacity={d.applications === 0 ? 0.25 : 1}
                initial={{ y: baseY, height: 0 }}
                animate={{ y: baseY - appH, height: appH }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
              >
                <title>{`${label(d.date)}: ${d.applications} applications`}</title>
              </motion.rect>

              <motion.rect
                x={center + 1}
                width={barWidth}
                rx="3"
                className="fill-cyan-400"
                opacity={d.inquiries === 0 ? 0.25 : 1}
                initial={{ y: baseY, height: 0 }}
                animate={{ y: baseY - inqH, height: inqH }}
                transition={{ duration: 0.6, delay: i * 0.03 + 0.05 }}
              >
                <title>{`${label(d.date)}: ${d.inquiries} messages`}</title>
              </motion.rect>

              {/* Har dusre din ki date */}
              {i % 2 === 0 && (
                <text
                  x={center}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-white/50"
                  fontSize="10"
                >
                  {label(d.date)}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {nothing && (
        <p className="mt-2 text-center text-sm text-white/50">
          Abhi tak koi activity nahi. Applications ya messages aate hi yahan dikhenge.
        </p>
      )}
    </div>
  )
}