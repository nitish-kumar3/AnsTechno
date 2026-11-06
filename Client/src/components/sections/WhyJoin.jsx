import { motion } from 'framer-motion'
import { Award, Laptop, Rocket, Users } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { perks } from '../../data/careers'

const icons = { rocket: Rocket, users: Users, laptop: Laptop, award: Award }

export default function WhyJoin() {
  return (
    <section className="relative pb-20">
      <Container>
        <SectionHeading
          eyebrow="Why join us"
          title="Grow your skills and your"
          highlight="career"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => {
            const Icon = icons[p.icon]
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-500/30"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {p.text}
                </p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}