import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code, ExternalLink } from 'lucide-react'
import ProjectVisual from '../ui/ProjectVisual'

export default function ProjectCard({ project, index = 0, onOpen }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.25, delay: 0 } }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur transition-colors duration-300 hover:border-brand-500/40"
    >
      {/* mouse-follow glow */}
      <div
        className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(350px circle at var(--x) var(--y), rgba(25,195,154,0.14), transparent 45%)',
        }}
      />

      <div className="relative p-2">
        <ProjectVisual project={project} className="aspect-[16/10] rounded-2xl" />
        <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-ink/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-300 backdrop-blur">
          {project.category}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5 pt-3">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-brand-500/25 bg-brand-500/10 px-2.5 py-1 text-[11px] text-brand-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="flex items-center gap-1 text-sm font-medium text-brand-300">
            View details
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
          <div className="flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Live demo"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white hover:text-black"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Source code"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white hover:text-black"
              >
                <Code size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}