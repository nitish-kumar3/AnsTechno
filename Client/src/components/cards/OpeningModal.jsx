import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, X } from 'lucide-react'
import ApplyForm from '../forms/ApplyForm'

function List({ title, items }) {
  if (!items?.length) return null
  return (
    <>
      <h4 className="mt-7 text-sm font-semibold uppercase tracking-widest text-white/50">
        {title}
      </h4>
      <ul className="mt-3 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/75">
            <Check size={16} className="mt-0.5 shrink-0 text-brand-400" />
            {i}
          </li>
        ))}
      </ul>
    </>
  )
}

export default function OpeningModal({ opening, startView = 'details', onClose }) {
  const [view, setView] = useState(startView)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const isIntern = opening.type === 'Internship'
  const chips = (
    isIntern
      ? [opening.mode, opening.duration, opening.fee]
      : [opening.location, opening.experience, opening.salary]
  ).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#080d0b] p-5 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.22),transparent_70%)]" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* header */}
        <div className="relative pr-10">
          <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-300">
            {isIntern ? 'Free Internship' : opening.type}
          </span>
          <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{opening.title}</h3>
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative mt-6 border-t border-white/10 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'details' && (
                <div>
                  <p className="leading-relaxed text-white/65">{opening.about}</p>
                  <List
                    title={isIntern ? 'You will learn' : 'Responsibilities'}
                    items={isIntern ? opening.learn : opening.responsibilities}
                  />
                  <List
                    title={isIntern ? 'Who can apply' : 'Requirements'}
                    items={opening.requirements}
                  />
                  {opening.skills?.length > 0 && (
                    <>
                      <h4 className="mt-7 text-sm font-semibold uppercase tracking-widest text-white/50">
                        Skills
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {opening.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => setView('form')}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
                  >
                    Apply Now <ArrowUpRight size={16} />
                  </button>
                </div>
              )}

              {view === 'form' && (
                <ApplyForm
                  opening={opening}
                  onBack={startView === 'details' ? () => setView('details') : null}
                  onSuccess={(mail) => {
                    setEmail(mail)
                    setView('success')
                  }}
                />
              )}

              {view === 'success' && (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-black shadow-[0_0_60px_-5px_rgba(25,195,154,0.7)]"
                  >
                    <Check size={40} strokeWidth={3} />
                  </motion.div>
                  <h4 className="mt-6 text-2xl font-bold">Application received!</h4>
                  <p className="mx-auto mt-3 max-w-md text-white/60">
                    Thank you for applying for <b>{opening.title}</b>. We will
                    contact you on <b className="text-brand-300">{email}</b> soon.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}