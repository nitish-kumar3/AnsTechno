import { motion } from 'framer-motion'
import { Code, Lightbulb, PenTool, Rocket } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { processSteps } from '../../data/services'

const icons = [Lightbulb, PenTool, Code, Rocket]

export default function ProcessSteps() {
  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="From idea to launch in"
          highlight="4 clear steps"
          text="A simple, transparent process so you always know what is happening with your project."
        />

        <div className="relative mt-16">
          {/* animated connector line (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 lg:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              style={{ originX: 0 }}
              className="h-full bg-linear-to-r from-brand-500 to-brand-300"
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((s, i) => {
              const Icon = icons[i]
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-brand-500/40 bg-ink text-brand-400 shadow-[0_0_30px_-5px_rgba(25,195,154,0.5)]">
                    <Icon size={26} />
                  </div>

                  <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-brand-500/30">
                    <span className="absolute right-4 top-2 text-7xl font-bold text-white/[0.04]">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">
                      Step {i + 1}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm font-medium text-brand-300/80">
                      {s.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {s.text}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}