import { motion } from 'framer-motion'

// Pill jaise tabs. id har page ke liye alag rakhna
export default function FilterTabs({ id, options, value, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="relative rounded-full px-4 py-1.5 text-sm font-medium"
        >
          {value === option && (
            <motion.span
              layoutId={id}
              className="absolute inset-0 rounded-full bg-brand-500"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 transition-colors ${
              value === option ? 'text-black' : 'text-white/70'
            }`}
          >
            {option}
          </span>
        </button>
      ))}
    </div>
  )
}