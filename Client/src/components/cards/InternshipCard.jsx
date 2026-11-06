import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Check, GraduationCap, MapPin } from 'lucide-react'

export default function InternshipCard({ item, index = 0, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.25, delay: 0 } }}
      onClick={() => onOpen(item)}
      className="group relative cursor-pointer rounded-3xl bg-linear-to-br from-brand-500/70 via-cyan-400/30 to-transparent p-px"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-[#07100c] p-6">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/25 blur-3xl transition-all duration-500 group-hover:scale-150" />

        <div className="relative flex items-center justify-between">
          <span className="rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
            Free Internship
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-300 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <GraduationCap size={20} />
          </span>
        </div>

        <h3 className="relative mt-5 text-xl font-semibold">{item.title}</h3>
        <p className="relative mt-1 text-sm text-white/50">{item.department}</p>

        <div className="relative mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/65">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-brand-400" />
            {item.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-brand-400" />
            {item.mode}
          </span>
        </div>

        <div className="relative mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-300">
          {item.fee}
        </div>

        <p className="relative mt-5 text-xs font-semibold uppercase tracking-widest text-white/40">
          You will learn
        </p>
        <ul className="relative mt-2 space-y-2">
          {item.learn.map((l) => (
            <li key={l} className="flex items-start gap-2 text-sm text-white/75">
              <Check size={16} className="mt-0.5 shrink-0 text-brand-400" />
              {l}
            </li>
          ))}
        </ul>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {item.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
            >
              {s}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpen(item, 'form')
          }}
          className="relative mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-brand-400 to-brand-500 px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          style={{ marginTop: '1.5rem' }}
        >
          Apply for Internship
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </motion.article>
  )
}