import { motion } from 'framer-motion'
import {
  Code,
  Eye,
  GraduationCap,
  Heart,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
} from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { intro, mission, pillars, values, vision } from '../../data/story'

const icons = {
  code: Code,
  graduation: GraduationCap,
  store: Store,
  shield: ShieldCheck,
  sparkles: Sparkles,
  heart: Heart,
}

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: i * 0.1 },
})

export default function MissionValues() {
  return (
    <section className="relative pb-24">
      <Container>
        {/* Intro */}
        <SectionHeading
          eyebrow="Who we are"
          title={intro.title}
          text={intro.text}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = icons[p.icon]
            return (
              <motion.div
                key={p.title}
                {...fade(i)}
                whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-500/30"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {p.text}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Mission and Vision */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[
            { ...mission, Icon: Target },
            { ...vision, Icon: Eye },
          ].map((m, i) => (
            <motion.div
              key={m.title}
              {...fade(i)}
              className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-linear-to-br from-brand-500/15 via-white/[0.03] to-transparent p-7 sm:p-9"
            >
              <m.Icon
                size={120}
                className="absolute -bottom-6 -right-6 text-brand-500/10"
              />
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-black">
                <m.Icon size={22} />
              </span>
              <h3 className="relative mt-5 text-2xl font-bold">{m.title}</h3>
              <p className="relative mt-3 leading-relaxed text-white/70">
                {m.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading eyebrow="What we stand for" title="Our core" highlight="values" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = icons[v.icon]
              return (
                <motion.div
                  key={v.title}
                  {...fade(i)}
                  whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-500/30"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-500/30 text-brand-400 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-black">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {v.text}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}