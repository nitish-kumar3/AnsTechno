import { motion } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import CountUp from '../ui/CountUp'
import { useImpact } from '../../hooks/useContent'
import { useLanguage } from '../../hooks/useLanguage'
import { getBlockIcon } from '../../utils/blockIcons'

const copy = {
  en: {
    eyebrow: 'Our impact',
    title: 'The difference we are',
    highlight: 'making',
    text: 'Our work in numbers.',
  },
  hi: {
    eyebrow: 'हमारा असर',
    title: 'हम जो बदलाव ला रहे हैं,',
    highlight: 'आंकड़ों में',
    text: 'हमारा काम संख्याओं में।',
  },
}

export default function ImpactSection() {
  const { lang } = useLanguage()
  const { data } = useImpact()
  const items = data || []
  const c = copy[lang]

  // Koi asli number nahi to section dikhana hi nahi
  if (items.length === 0) return null

  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.highlight} text={c.text} />

        <div className="mt-14 flex flex-wrap justify-center gap-5">
          {items.map((item, i) => {
            const Icon = getBlockIcon(item.icon)
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                className="w-[calc(50%-0.625rem)] rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center transition-colors hover:border-brand-500/40 lg:w-[calc(25%-0.95rem)]"
              >
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                  <Icon size={22} />
                </span>
                <p className="text-gradient mt-4 text-4xl font-bold sm:text-5xl">
                  <CountUp to={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {lang === 'hi' && item.labelHi ? item.labelHi : item.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}