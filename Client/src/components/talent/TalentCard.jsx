import { motion } from 'framer-motion'
import { BadgeCheck, MapPin } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import Avatar from './Avatar'

const copy = {
  en: { verified: 'Verified', open: 'Open to work' },
  hi: { verified: 'सत्यापित', open: 'काम के लिए उपलब्ध' },
}

export default function TalentCard({ talent, index = 0, onOpen }) {
  const { lang } = useLanguage()
  const c = copy[lang]
  const skills = talent.skills || []

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8, transition: { duration: 0.25, delay: 0 } }}
      onClick={() => onOpen(talent)}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-brand-500/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Avatar
          talent={talent}
          className="h-full w-full text-6xl transition-transform duration-700 group-hover:scale-110"
        />

        {talent.verified && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-[#ffffff] backdrop-blur">
            <BadgeCheck size={13} className="text-brand-400" /> {c.verified}
          </span>
        )}
        {talent.openToWork && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-[#ffffff] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> {c.open}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{talent.name}</h3>
        {talent.headline && <p className="mt-0.5 text-sm text-brand-300">{talent.headline}</p>}
        {talent.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
            <MapPin size={12} /> {talent.location}
          </p>
        )}

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
              >
                {s}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="rounded-full px-2 py-1 text-[11px] text-white/45">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}