import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import { processSteps } from '../../data/services'

export default function Process() {
  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A simple process,"
          highlight="clear results"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-500/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 font-bold text-black">
                  {i + 1}
                </span>
                {i < processSteps.length - 1 && (
                  <span className="hidden h-px flex-1 bg-linear-to-r from-brand-500/60 to-transparent lg:block" />
                )}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-brand-300/80">{s.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button to="/services" variant="secondary">
            See full process <ArrowRight size={16} className="text-brand-400" />
          </Button>
        </div>
      </Container>
    </section>
  )
}