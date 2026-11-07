import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, MapPin, Trophy } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import AdminModal from '../admin/AdminModal'
import { useStories } from '../../hooks/useContent'
import { useLanguage } from '../../hooks/useLanguage'
import assetUrl from '../../utils/assetUrl'

const copy = {
  en: {
    eyebrow: 'Success stories',
    title: 'Businesses we helped',
    highlight: 'go digital',
    text: 'Real examples of shops and businesses that grew with us.',
    read: 'Read story',
    before: 'Before',
    after: 'After',
    result: 'Result',
    cta: 'Want a similar result?',
    talk: 'Talk to us',
  },
  hi: {
    eyebrow: 'सफलता की कहानियां',
    title: 'जिन बिज़नेस को हमने',
    highlight: 'डिजिटल बनाया',
    text: 'उन दुकानों और बिज़नेस के असली उदाहरण जो हमारे साथ आगे बढ़े।',
    read: 'कहानी पढ़ें',
    before: 'पहले',
    after: 'अब',
    result: 'नतीजा',
    cta: 'आप भी ऐसा नतीजा चाहते हैं?',
    talk: 'हमसे बात करें',
  },
}

export default function SuccessStories({ limit }) {
  const { lang } = useLanguage()
  const { data } = useStories()
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])
  const c = copy[lang]

  const list = limit ? (data || []).slice(0, limit) : data || []

  // Koi asli story nahi to section dikhana hi nahi
  if (list.length === 0) return null

  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.highlight} text={c.text} />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <motion.article
              key={s._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25, delay: 0 } }}
              onClick={() => setSelected(s)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-brand-500/40"
            >
              <div className="aspect-[16/10] overflow-hidden bg-brand-500/10">
                {s.image ? (
                  <img
                    src={assetUrl(s.image)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-brand-400">
                    <Trophy size={40} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                {(s.business || s.location) && (
                  <p className="flex flex-wrap items-center gap-x-2 text-xs text-white/50">
                    {s.business}
                    {s.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {s.location}
                      </span>
                    )}
                  </p>
                )}
                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                {s.summary && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">{s.summary}</p>
                )}
                {s.result && (
                  <span className="mt-4 inline-block self-start rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
                    {s.result}
                  </span>
                )}
                <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-medium text-brand-300">
                  {c.read}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {selected && (
          <AdminModal key={selected._id} title={selected.title} size="max-w-3xl" onClose={close}>
            <div className="space-y-5">
              {selected.image && (
                <img
                  src={assetUrl(selected.image)}
                  alt=""
                  className="aspect-[16/8] w-full rounded-2xl object-cover"
                />
              )}

              {(selected.business || selected.location) && (
                <p className="text-sm text-white/55">
                  {[selected.business, selected.location].filter(Boolean).join(' · ')}
                </p>
              )}
              {selected.summary && <p className="leading-relaxed text-white/70">{selected.summary}</p>}

              {(selected.before || selected.after) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {selected.before && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                        {c.before}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">{selected.before}</p>
                    </div>
                  )}
                  {selected.after && (
                    <div className="rounded-2xl border border-brand-500/30 bg-brand-500/[0.06] p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
                        {c.after}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">{selected.after}</p>
                    </div>
                  )}
                </div>
              )}

              {selected.result && (
                <p className="rounded-2xl bg-brand-500 px-5 py-3 text-center font-semibold text-black">
                  {c.result}: {selected.result}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <p className="font-medium">{c.cta}</p>
                <Link
                  to="/lets-connect"
                  onClick={close}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
                >
                  {c.talk}
                </Link>
              </div>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </section>
  )
}