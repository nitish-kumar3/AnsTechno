import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Award, BookOpen, GraduationCap, Store } from 'lucide-react'
import api from '../../services/api'
import Container from '../ui/Container'
import CountUp from '../ui/CountUp'
import { useLanguage } from '../../hooks/useLanguage'

const items = [
  { key: 'certificates', icon: Award, to: '/verify', en: 'Certificates issued', hi: 'सर्टिफिकेट जारी' },
  { key: 'shops', icon: Store, to: '/digital-dukaan', en: 'Shops online with Digital Dukaan', hi: 'डिजिटल दुकान से ऑनलाइन दुकानें' },
  { key: 'talent', icon: GraduationCap, to: '/talent', en: 'Trained talent profiles', hi: 'ट्रेंड टैलेंट प्रोफ़ाइल' },
  { key: 'posts', icon: BookOpen, to: '/blog', en: 'Articles published', hi: 'प्रकाशित लेख' },
]

export default function LiveProof() {
  const { lang } = useLanguage()
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    api
      .get('/proof')
      .then(({ data }) => setCounts(data.counts))
      .catch(() => {})
  }, [])

  // Jinki ginti 0 hai wo dikhayenge hi nahi
  const shown = counts ? items.filter((i) => counts[i.key] > 0) : []
  if (shown.length === 0) return null

  return (
    <section className="relative py-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
        >
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
            </span>
            {lang === 'hi' ? 'हमारे सिस्टम से लाइव' : 'Live from our system'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {shown.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="group flex min-w-[10.5rem] flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/40 sm:max-w-[16rem]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-400 transition-all group-hover:bg-brand-500 group-hover:text-black">
                  <item.icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-gradient text-2xl font-bold">
                    <CountUp to={counts[item.key]} />
                  </p>
                  <p className="text-xs leading-snug text-white/60">{item[lang]}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}