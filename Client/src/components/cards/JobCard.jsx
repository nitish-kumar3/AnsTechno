import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Clock, MapPin, Wallet } from 'lucide-react'

export default function JobCard({ job, index = 0, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ x: 6, transition: { duration: 0.2, delay: 0 } }}
      onClick={() => onOpen(job)}
      className="group relative flex cursor-pointer flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 pl-6 transition-colors duration-300 hover:border-brand-500/40 sm:flex-row sm:items-center sm:justify-between sm:p-6 sm:pl-7"
    >
      <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-brand-500 transition-transform duration-300 group-hover:scale-y-100" />

      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-400 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-black">
          <Briefcase size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
            {job.department}
          </p>
          <h3 className="mt-1 text-lg font-semibold sm:text-xl">{job.title}</h3>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-400" />
              {job.location} · {job.workMode}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-brand-400" />
              {job.experience}
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet size={14} className="text-brand-400" />
              {job.salary}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <span className="text-xs text-white/50">
          {job.openings} {job.openings > 1 ? 'openings' : 'opening'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpen(job, 'form')
          }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
        >
          Apply Now
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </motion.article>
  )
}