import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Landmark, Store } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'

const items = [
  {
    icon: Briefcase,
    title: 'Free Internships',
    text: 'Learn on real projects with mentor guidance. Free to join, with only a small guidance fee.',
  },
  {
    icon: GraduationCap,
    title: 'Low-cost Skill Training',
    text: 'Affordable tech and earning skills for village and underprivileged learners, no coding background needed. Learn, then earn through freelance projects.',
  },
  {
    icon: Store,
    title: 'Digitalize Your Business',
    text: 'Still offline or no website yet? We help shops and small businesses build their first online presence.',
  },
  {
    icon: Landmark,
    title: 'Government Projects',
    text: 'We also apply for and deliver digital projects for government departments and public initiatives.',
  },
]

export default function LearnEarn() {
  return (
    <section className="relative py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] border border-brand-500/20 bg-linear-to-br from-brand-500/15 via-white/[0.03] to-transparent p-6 sm:p-10 lg:p-14"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-brand-500/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
                Our Purpose
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Technology should belong to{' '}
                <span className="text-gradient">everyone</span>
              </h2>
              <p className="mt-5 leading-relaxed text-white/65">
                Beyond building software for businesses, we want to open doors
                for people who have never had access to tech. Whether you are a
                student looking for an internship, someone from a village who
                wants to learn a skill and earn, or a business that is still
                offline, we are here to help you take the first step.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/career">Join Internship</Button>
                <Button to="/lets-connect" variant="secondary">
                  Talk to Us
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((it, i) => (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                  className="rounded-2xl border border-white/10 bg-ink/60 p-5 backdrop-blur"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-black">
                    <it.icon size={20} />
                  </span>
                  <h3 className="mt-4 font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {it.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}