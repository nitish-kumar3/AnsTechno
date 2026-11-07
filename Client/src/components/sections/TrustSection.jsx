import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { useCredentials } from '../../hooks/useContent'
import { useLanguage } from '../../hooks/useLanguage'
import { getBlockIcon } from '../../utils/blockIcons'

const copy = {
  en: {
    eyebrow: 'Trust and credentials',
    title: 'Registered, verified and',
    highlight: 'accountable',
    text: 'The facts behind our work.',
    verify: 'Verify a certificate',
  },
  hi: {
    eyebrow: 'भरोसा और प्रमाण',
    title: 'पंजीकृत, प्रमाणित और',
    highlight: 'जवाबदेह',
    text: 'हमारे काम के पीछे के तथ्य।',
    verify: 'सर्टिफिकेट जांचें',
  },
}

export default function TrustSection() {
  const { lang } = useLanguage()
  const { data } = useCredentials()
  const items = data || []
  const c = copy[lang]

  // Koi asli credential nahi to section dikhana hi nahi
  if (items.length === 0) return null

  return (
    <section className="relative pb-24">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.highlight} text={c.text} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = getBlockIcon(item.icon)
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-500/40"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">
                    {lang === 'hi' && item.titleHi ? item.titleHi : item.title}
                  </h3>
                  {item.detail && <p className="mt-1 text-sm text-white/60">{item.detail}</p>}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/verify"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
          >
            {c.verify} <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  )
}