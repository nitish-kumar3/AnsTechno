import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Container from './Container'

export default function PageHeader({ badge, title, highlight, text }) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-36 text-center lg:pt-44">
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.22),transparent_65%)]" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300"
        >
          <Sparkles size={14} />
          {badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
        >
          {title} <span className="text-gradient">{highlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {text}
        </motion.p>
      </Container>
    </section>
  )
}