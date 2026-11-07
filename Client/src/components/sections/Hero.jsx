import { motion } from 'framer-motion'
import { ArrowRight, Bot, Check, Code, Megaphone, Sparkles, TrendingUp } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { useLanguage } from '../../hooks/useLanguage'

// HD image lagani ho to file public folder me rakho aur path likho, jaise '/hero.jpg'
// Khali rakhoge to neeche ka dashboard design dikhega
const heroImage = ''

const services = [
  'Facebook Ads',
  'Instagram Ads',
  'AI & Automation',
  'Backend Development',
  'Frontend Development',
  'Full-stack Development',
  'WordPress & CMS',
  'Deployment & DevOps',
  'Social Media Management',
  'Digital Marketing',
]

// const points = ['Free Internships', 'Low-cost Skill Training', 'Offline → Online Business']
const pointKeys = ['hero.p1', 'hero.p2', 'hero.p3']

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.12 },
})

function FloatCard({ icon: Icon, title, value, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + delay, duration: 0.6 }}
      className={`hidden sm:absolute sm:block ${className}`}
    >
      <div
        className="animate-float flex max-w-[calc(100vw-3rem)] items-center gap-2 rounded-2xl border border-white/10 bg-ink/80 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:max-w-none sm:gap-3 sm:px-4 sm:py-3"
        style={{ animationDelay: `${delay}s` }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-[11px] text-white/50">{title}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}

function DashboardMock() {
  const line =
    'M0 110 C40 100 60 80 100 85 S160 60 200 55 S270 70 300 40 S360 20 400 10'
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50">
          anstech.dev/dashboard
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-white/50">Growth overview</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">+248%</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-300">
          <TrendingUp size={14} /> This quarter
        </span>
      </div>

      <svg viewBox="0 0 400 140" className="mt-4 h-28 w-full sm:h-36">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#19c39a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#19c39a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} V140 H0 Z`} fill="url(#chartFill)" />
        <motion.path
          d={line}
          fill="none"
          stroke="#34d3a8"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
        />
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
        {[
          ['Leads', '1.2k'],
          ['Traffic', '48k'],
          ['Orders', '320'],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-2 sm:p-3"
          >
            <p className="text-[11px] text-white/50">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold sm:text-lg">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
    const { t } = useLanguage()
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-32 lg:pt-40">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-32 left-0 h-[600px] w-[600px] bg-[radial-gradient(circle_at_center,rgba(25,195,154,0.22),transparent_65%)]" />
        <div className="absolute -right-40 top-40 h-[500px] w-[500px] bg-[radial-gradient(circle_at_center,rgba(15,157,123,0.18),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent" />
      </div>

      <Container>
        <div className="grid items-center gap-12 sm:gap-16 lg:grid-cols-2">
          {/* LEFT: content */}
          <div>
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300"
            >
              <Sparkles size={14} />
              {/* Digital Agency · Software Company */}
              {t('hero.badge')}
            </motion.div>

            <motion.h1
              {...fadeUp(1)}
              className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {/* We build brands, software &amp;{' '}
              <span className="text-gradient">digital futures</span> */}
              {t('hero.title')}{' '}
              <span className="text-gradient">{t('hero.highlight')}</span>
            </motion.h1>

            <motion.p
              {...fadeUp(2)}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              {/* Websites, ads, AI automation and complete software for your
              business, plus affordable skill training and free internships for
              anyone who wants to learn and grow. */}
              {t('hero.text')}
            </motion.p>

            <motion.div {...fadeUp(3)} className="mt-8 flex w-full flex-nowrap justify-center gap-2 sm:w-auto sm:flex-wrap sm:justify-start sm:gap-3">
              <Button to="/lets-connect" className="whitespace-nowrap px-4 sm:px-6">
                {/* Start a Project */}
                {t('nav.startProject')}
                 <ArrowRight size={16} />
              </Button>
              <Button to="/portfolio" variant="secondary" className="whitespace-nowrap px-4 sm:px-6">
                {t('hero.cta2')}
                <ArrowRight size={16} className="text-brand-400" />
              </Button>
            </motion.div>

            <motion.ul
              {...fadeUp(4)}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60"
            >
              {/* {points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500/15 text-brand-400">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))} */}
              {pointKeys.map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500/15 text-brand-400">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t(k)}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT: image / visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl sm:overflow-visible"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-500/20 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Digital agency"
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <DashboardMock />
              )}
            </div>

            <FloatCard
              icon={Megaphone}
              title="Ads ROI"
              value="+248%"
              className="left-0 top-12 sm:-left-10"
            />
            <FloatCard
              icon={Bot}
              title="AI Automation"
              value="Active 24/7"
              delay={1.2}
              className="right-0 top-1/2 sm:-right-8"
            />
            <FloatCard
              icon={Code}
              title="Deployment"
              value="Live · v2.4"
              delay={2.4}
              className="-bottom-5 left-8"
            />
          </motion.div>
        </div>

        {/* Services marquee */}
        <div className="mt-24 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-marquee">
            {[...services, ...services].map((s, i) => (
              <span
                key={i}
                className="mr-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-white/70"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}