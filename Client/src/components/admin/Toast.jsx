import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check } from 'lucide-react'

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-2xl border bg-ink px-4 py-3 text-sm font-medium shadow-xl ${
            toast.type === 'error'
              ? 'border-red-500/40 text-red-500'
              : 'border-brand-500/40 text-brand-300'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}