import { motion } from 'framer-motion'

// Chart/list ka dibba: title, chhota text, kone me action
export default function Panel({ title, subtitle, action, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-white/50">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  )
}