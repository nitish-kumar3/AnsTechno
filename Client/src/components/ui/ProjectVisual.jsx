import { getProjectIcon } from '../../utils/projectIcons'
import assetUrl from '../../utils/assetUrl'

const tones = {
  'Web App': 'from-brand-500/35 via-brand-600/10 to-transparent',
  'AI / ML': 'from-cyan-400/30 via-cyan-600/10 to-transparent',
}

export default function ProjectVisual({ project, className = '' }) {
  const Icon = getProjectIcon(project.icon)

  return (
    <div className={`relative isolate overflow-hidden bg-[#08100d] ${className}`}>
      {project.image ? (
        <img
          src={assetUrl(project.image)}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <>
          <div
            className={`absolute inset-0 bg-linear-to-br ${
              tones[project.category] || tones['Web App']
            }`}
          />
          <div className="bg-grid absolute inset-0 opacity-70" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-3xl border border-white/15 bg-white/5 text-brand-300 shadow-[0_0_60px_-10px_rgba(25,195,154,0.6)] backdrop-blur transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
              <Icon size={36} />
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-ink/70 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}