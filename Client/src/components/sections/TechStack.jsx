import { motion } from 'framer-motion'
import { Bot, Database, Globe, Megaphone, Monitor, Rocket } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const groups = [
  {
    icon: Monitor,
    title: 'Frontend',
    items: ['React', 'Tailwind CSS', 'JavaScript', 'Framer Motion', 'Vite'],
  },
  {
    icon: Database,
    title: 'Backend & Database',
    items: ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST APIs'],
  },
  {
    icon: Bot,
    title: 'AI & Machine Learning',
    items: ['Python', 'Machine Learning', 'OpenCV', 'NLP', 'AI APIs'],
  },
  {
    icon: Rocket,
    title: 'DevOps & Cloud',
    items: ['Docker', 'GitHub Actions', 'Nginx', 'Linux', 'CI/CD'],
  },
  {
    icon: Megaphone,
    title: 'Marketing & Ads',
    items: ['Meta Ads', 'Google Analytics', 'SEO', 'Canva', 'Search Console'],
  },
  {
    icon: Globe,
    title: 'CMS & Websites',
    items: ['WordPress', 'Elementor', 'WooCommerce', 'Headless CMS', 'Git & GitHub'],
  },
]

export default function TechStack() {
  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading
          eyebrow="Our toolbox"
          title="Modern tools,"
          highlight="reliable results"
          text="We use proven, modern technology so your product is fast, secure and ready to scale."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-brand-500/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-400 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-black">
                  <g.icon size={20} />
                </span>
                <h3 className="text-lg font-semibold">{g.title}</h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors duration-300 hover:border-brand-500/40 hover:text-brand-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}