import { motion } from 'framer-motion'

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  text,
  align = 'center',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}{' '}
        {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {text && <p className="mt-4 leading-relaxed text-white/60">{text}</p>}
    </motion.div>
  )
}