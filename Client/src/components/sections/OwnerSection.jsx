import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Code, Sparkles } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { owner } from '../../data/story'

export default function OwnerSection() {
  const [failed, setFailed] = useState(false)
  const initials = owner.name
    .split(' ')
    .map((w) => w[0])
    .join('')

  return (
    <section className="relative isolate overflow-hidden pb-24">
      <div className="absolute left-0 top-1/4 -z-10 h-[500px] w-[500px] bg-[radial-gradient(circle_at_center,rgba(25,195,154,0.15),transparent_65%)]" />

      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:p-8 lg:p-12">
          <div className="bg-grid absolute inset-0 opacity-40" />

          <div className="relative grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto w-full max-w-sm lg:col-span-2 lg:max-w-none"
            >
              <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-500/20 blur-3xl" />
              <div className="rounded-[2rem] bg-linear-to-br from-brand-400 via-brand-600/40 to-transparent p-[2px]">
                <div className="aspect-[4/5] overflow-hidden rounded-[1.9rem] bg-[#08100d]">
                  {!failed ? (
                    <img
                      src={owner.photo}
                      alt={owner.name}
                      onError={() => setFailed(true)}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-linear-to-br from-brand-500/30 to-transparent text-7xl font-bold text-brand-300">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <div className="animate-float absolute -left-3 bottom-10 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:-left-8">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
                  <Code size={18} />
                </span>
                <div>
                  <p className="text-[11px] text-white/50">Expertise</p>
                  <p className="text-sm font-semibold">MERN + AI</p>
                </div>
              </div>

              <div
                className="animate-float absolute -right-2 top-8 rounded-2xl border border-white/10 bg-ink/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:-right-6"
                style={{ animationDelay: '1.5s' }}
              >
                <p className="text-[11px] text-white/50">Role</p>
                <p className="text-sm font-semibold">Founder</p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                <Sparkles size={14} />
                Meet the Owner
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {owner.name}
              </h2>
              <p className="mt-2 font-medium text-brand-300">{owner.role}</p>

              <div className="mt-6 space-y-4 leading-relaxed text-white/65">
                {owner.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {owner.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {owner.highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center sm:p-4"
                  >
                    <p className="text-xl font-bold text-brand-300 sm:text-2xl">
                      {h.value}
                    </p>
                    <p className="mt-1 text-[11px] text-white/50 sm:text-xs">
                      {h.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/lets-connect">
                  Let&apos;s Talk <ArrowUpRight size={16} />
                </Button>
                <Button to="/portfolio" variant="secondary">
                  See My Work
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}