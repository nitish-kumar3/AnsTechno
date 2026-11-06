import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
// import { testimonials } from '../../data/story'
import { useTestimonials } from '../../hooks/useContent'


// Kitni der baad agla testimonial aaye (milliseconds). 4000 = 4 second
const INTERVAL = 4000

function Stars({ value, size = 18 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < value ? 'fill-brand-400 text-brand-400' : 'text-white/20'
          }
        />
      ))}
    </div>
  )
}

export default function Testimonials() {

  const { data } = useTestimonials()
  const testimonials = data || []

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = testimonials.length

  // index dependency me hai, isliye manual click ke baad timer dobara shuru hota hai
  useEffect(() => {
    if (paused || total < 2) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, total])

  if (total === 0) return null

  // const t = testimonials[index]
    const t = testimonials[index] || testimonials[0]

  const avg = (
    testimonials.reduce((sum, x) => sum + x.rating, 0) / total
  ).toFixed(1)
  const initials = t.name
    .split(' ')
    .map((w) => w[0])
    .join('')

  const go = (n) => setIndex((n + total) % total)

  return (
    <section className="relative pb-24">
      <Container>
        <SectionHeading
          eyebrow="Client love"
          title="What our clients"
          highlight="say about us"
          text="Real feedback from businesses and learners we have worked with."
        />

        <div className="mt-14 grid items-center gap-6 lg:grid-cols-3">
          {/* Rating summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-brand-500/20 bg-linear-to-br from-brand-500/15 to-transparent p-8 text-center"
          >
            <p className="text-gradient text-6xl font-bold sm:text-7xl">{avg}</p>
            <div className="mt-3 flex justify-center">
              <Stars value={Math.round(Number(avg))} size={22} />
            </div>
            <p className="mt-3 text-sm text-white/60">
              Average rating from {total} clients
            </p>
          </motion.div>

          {/* Testimonial card */}
          <div className="relative lg:col-span-2">
            <div
              onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:min-h-[300px] sm:p-9"
            >
              <Quote
                size={90}
                className="absolute right-4 top-4 text-brand-500/10"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="relative"
                >
                  <Stars value={t.rating} />
                  <p className="mt-5 text-lg leading-relaxed text-white/85 sm:text-xl">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 font-bold text-black">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold">{t.name}</p>
                      <p className="truncate text-sm text-white/50">{t.role}</p>
                    </div>
                    <span className="ml-auto hidden rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300 sm:block">
                      {t.service}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? 'w-8 bg-brand-400' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => go(index - 1)}
                  aria-label="Previous"
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label="Next"
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}