import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Avatar from '../talent/Avatar'
import { useTalent } from '../../hooks/useContent'
import { useLanguage } from '../../hooks/useLanguage'

const copy = {
  en: {
    eyebrow: 'Hire trained talent',
    title: 'Need skilled people for your',
    highlight: 'business or team?',
    text: 'Meet learners who completed our internships and training, with verified certificates.',
    open: '{n} open to work',
    btn: 'Meet the talent',
  },
  hi: {
    eyebrow: 'ट्रेंड टैलेंट हायर करें',
    title: 'अपने बिज़नेस या टीम के लिए',
    highlight: 'हुनरमंद लोग चाहिए?',
    text: 'उन सीखने वालों से मिलिए जिन्होंने हमारी इंटर्नशिप और ट्रेनिंग पूरी की है, सत्यापित सर्टिफिकेट के साथ।',
    open: '{n} काम के लिए उपलब्ध',
    btn: 'टैलेंट से मिलिए',
  },
}

export default function TalentTeaser() {
  const { lang } = useLanguage()
  const { data } = useTalent()
  const list = data || []
  const c = copy[lang]

  if (list.length === 0) return null

  const open = list.filter((t) => t.openToWork).length

  return (
    <section className="relative py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-brand-500/20 bg-linear-to-br from-brand-500/15 via-white/[0.03] to-transparent p-7 sm:p-10"
        >
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
                {c.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {c.title} <span className="text-gradient">{c.highlight}</span>
              </h2>
              <p className="mt-3 text-white/65">{c.text}</p>
              <Link
                to="/talent"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
              >
                {c.btn} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {list.slice(0, 5).map((t) => (
                  <Avatar
                    key={t._id}
                    talent={t}
                    className="h-14 w-14 rounded-full border-2 border-ink text-lg sm:h-16 sm:w-16"
                  />
                ))}
              </div>
              {open > 0 && (
                <p className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                  {c.open.replace('{n}', open)}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}