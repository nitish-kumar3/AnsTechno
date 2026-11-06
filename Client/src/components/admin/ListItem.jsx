import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import Toggle from './Toggle'

// Har row ka card: left me content (children), right me switch, edit, delete
export default function ListItem({ item, index = 0, name, onToggle, onEdit, onDelete, children }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/30 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">{children}</div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Toggle
            checked={item.isActive}
            onChange={() => onToggle(item)}
            label={`Show ${name} on website`}
          />
          <span className="w-12">{item.isActive ? 'Visible' : 'Hidden'}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            aria-label={`Edit ${name}`}
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:border-brand-500/40 hover:text-brand-300"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(item)}
            aria-label={`Delete ${name}`}
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.li>
  )
}