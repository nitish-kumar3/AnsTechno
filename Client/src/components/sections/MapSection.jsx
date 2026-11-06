import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import Container from '../ui/Container'
// import { contact } from '../../data/contact'
import { useSettings } from '../../hooks/useContent'

export default function MapSection() {
  const contact = useSettings()
  const q = encodeURIComponent(contact.mapQuery)

  return (
    <section className="relative pb-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
        >
          <iframe
            title="Our location"
            src={`https://maps.google.com/maps?q=${q}&z=11&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[340px] w-full sm:h-[440px]"
            style={{
              border: 0,
              filter: 'invert(92%) hue-rotate(180deg) contrast(0.9) saturate(0.7)',
            }}
          />

          <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_80px_rgba(5,8,7,0.8)]" />

          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl border border-white/10 bg-ink/85 p-3 shadow-xl backdrop-blur-xl sm:left-5 sm:top-5 sm:p-4">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500 text-black">
              <span className="absolute inset-0 animate-ping rounded-xl bg-brand-500/50" />
              <MapPin size={20} className="relative" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-white/50">Our location</p>
              <p className="font-semibold">{contact.address}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${q}`}
              target="_blank"
              rel="noreferrer"
              className="ml-1 hidden items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-brand-300 sm:inline-flex"
            >
              Open in Maps <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}