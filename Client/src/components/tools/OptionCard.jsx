import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// Chunne wala card (estimator aur quiz dono me)
export default function OptionCard({ icon: Icon, title, text, selected, onClick }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-pressed={selected}
      className={`relative w-full rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? 'border-brand-500 bg-brand-500/10'
          : 'border-white/10 bg-white/[0.03] hover:border-brand-500/40'
      }`}
    >
      <span
        className={`absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border transition ${
          selected
            ? 'border-brand-500 bg-brand-500 text-black'
            : 'border-white/20 text-transparent'
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </span>

      {Icon && (
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
          <Icon size={20} />
        </span>
      )}
      <p className={`${Icon ? 'mt-3' : ''} pr-6 font-semibold`}>{title}</p>
      {text && <p className="mt-1 text-sm text-white/55">{text}</p>}
    </motion.button>
  )
}