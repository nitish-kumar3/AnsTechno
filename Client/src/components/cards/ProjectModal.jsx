import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Code, ExternalLink, X } from 'lucide-react'
import ProjectVisual from '../ui/ProjectVisual'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

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
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-ink/70 p-2 text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <ProjectVisual project={project} className="aspect-[16/8] rounded-2xl" />

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
          {project.category}
        </p>
        <h3 className="mt-1 text-2xl font-bold sm:text-3xl">{project.title}</h3>
        <p className="mt-3 font-medium text-brand-300">{project.tagline}</p>
        <p className="mt-2 leading-relaxed text-white/65">{project.description}</p>

        <h4 className="mt-7 text-sm font-semibold uppercase tracking-widest text-white/50">
          Key features
        </h4>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {project.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/80"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-brand-400" />
              {f}
            </li>
          ))}
        </ul>

        <h4 className="mt-7 text-sm font-semibold uppercase tracking-widest text-white/50">
          Tech stack
        </h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/lets-connect?service=${project.serviceId}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
          >
            Build something like this <ArrowUpRight size={16} />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Live demo <ExternalLink size={16} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Source code <Code size={16} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}