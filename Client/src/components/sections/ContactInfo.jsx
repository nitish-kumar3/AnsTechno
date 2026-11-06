import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Clock, Copy, Mail, MapPin, MessageCircle, Phone, Zap } from 'lucide-react'
// import { contact, nextSteps } from '../../data/contact'
import { nextSteps } from '../../data/contact'
import { useSettings } from '../../hooks/useContent'

function InfoCard({ icon: Icon, label, children, action, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ x: 6, transition: { duration: 0.2, delay: 0 } }}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/40"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
        <div className="mt-0.5 break-words font-medium">{children}</div>
      </div>
      {action}
    </motion.div>
  )
}

export default function ContactInfo() {
    const contact = useSettings()

  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard allowed nahi hai */
    }
  }

  let i = 0

  return (
    <div>
      <h2 className="text-2xl font-bold sm:text-3xl">Reach us directly</h2>
      <p className="mt-2 text-white/55">
        Prefer talking over typing? Use any of these.
      </p>

      <div className="mt-6 space-y-3">
        {contact.email && (
          <InfoCard
            icon={Mail}
            label="Email"
            index={i++}
            action={
              <button
                onClick={copyEmail}
                aria-label="Copy email"
                className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white hover:text-black"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            }
          >
            <a href={`mailto:${contact.email}`} className="hover:text-brand-300">
              {contact.email}
            </a>
          </InfoCard>
        )}

        {contact.phone && (
          <InfoCard icon={Phone} label="Phone" index={i++}>
            <a href={`tel:${contact.phone}`} className="hover:text-brand-300">
              {contact.phone}
            </a>
          </InfoCard>
        )}

        {contact.whatsapp && (
          <InfoCard
            icon={MessageCircle}
            label="WhatsApp"
            index={i++}
            action={<ArrowUpRight size={18} className="shrink-0 text-brand-400" />}
          >
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-300"
            >
              Chat with us
            </a>
          </InfoCard>
        )}

        {contact.address && (
          <InfoCard icon={MapPin} label="Location" index={i++}>
            {contact.address}
          </InfoCard>
        )}

        {contact.hours && (
          <InfoCard icon={Clock} label="Working hours" index={i++}>
            {contact.hours}
          </InfoCard>
        )}

        {contact.reply && (
          <InfoCard icon={Zap} label="Response time" index={i++}>
            {contact.reply}
          </InfoCard>
        )}
      </div>

      {/* What happens next */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-semibold">What happens next?</h3>
        <ol className="mt-5 space-y-5">
          {nextSteps.map((s, idx) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex gap-4"
            >
              {idx < nextSteps.length - 1 && (
                <span className="absolute left-[15px] top-9 h-[calc(100%-0.5rem)] w-px bg-brand-500/30" />
              )}
              <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-black">
                {idx + 1}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="mt-0.5 text-sm text-white/55">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}