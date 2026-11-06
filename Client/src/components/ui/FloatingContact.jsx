import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, MessageCircle, Phone, PhoneCall, Plus } from 'lucide-react'
import { useSettings } from '../../hooks/useContent'
import CallRequestModal from '../forms/CallRequestModal'
import { useLanguage } from '../../hooks/useLanguage'

export default function FloatingContact() {
  const contact = useSettings() // phone, whatsapp, email Admin > Settings se aate 
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [callModal, setCallModal] = useState(false)

  // Esc dabane par band
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // WhatsApp number: 10 digit ho to aage 91 laga do
  const digits = String(contact.whatsapp || contact.phone || '').replace(/\D/g, '')
  const whatsapp = digits.length === 10 ? `91${digits}` : digits
//   const waText = encodeURIComponent('Hi Anstechno, I visited your website and want to know more.')
  const waText = encodeURIComponent(t('float.waText'))

  // Jis cheez ki info nahi hai wo option dikhega hi nahi
  const actions = [
    {
      key: 'free',
    //   label: 'Claim Free Call',
      label: t('float.free'),
      icon: PhoneCall,
      color: 'bg-brand-500',
      onClick: () => {
        setOpen(false)
        setCallModal(true)
      },
    },
    whatsapp && {
      key: 'wa',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      href: `https://wa.me/${whatsapp}?text=${waText}`,
      external: true,
    },
    contact.phone && {
      key: 'call',
    //   label: 'Call Us',
      label: t('float.call'), 
      icon: Phone,
      color: 'bg-cyan-400',
      href: `tel:${String(contact.phone).replace(/[^\d+]/g, '')}`,
    },
    contact.email && {
      key: 'mail',
    //   label: 'Email Us',
      label: t('float.email'),
      icon: Mail,
      color: 'bg-violet-400',
      href: `mailto:${contact.email}`,
    },
  ].filter(Boolean)

  return (
    <>
      {/* Peeche halka parda */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {/* Options (upar ki taraf khulte hain) */}
        <AnimatePresence>
          {open &&
            actions.map((a, i) => {
              const body = (
                <>
                  <span className="rounded-full border border-white/10 bg-ink/95 px-4 py-2 text-sm font-medium shadow-xl backdrop-blur">
                    {a.label}
                  </span>
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-full text-black shadow-lg ${a.color}`}
                  >
                    <a.icon size={22} />
                  </span>
                </>
              )

              return (
                <motion.div
                  key={a.key}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8, transition: { duration: 0.12 } }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 24,
                    delay: (actions.length - 1 - i) * 0.05,
                  }}
                >
                  {a.href ? (
                    <a
                      href={a.href}
                      target={a.external ? '_blank' : undefined}
                      rel={a.external ? 'noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3"
                    >
                      {body}
                    </a>
                  ) : (
                    <button type="button" onClick={a.onClick} className="flex items-center gap-3">
                      {body}
                    </button>
                  )}
                </motion.div>
              )
            })}
        </AnimatePresence>

        {/* Main "+" button */}
        <div className="relative">
          {!open && (
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/50" />
          )}
          <motion.button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close contact options' : 'Contact us'}
            aria-expanded={open}
            whileTap={{ scale: 0.92 }}
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="relative grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-black shadow-[0_10px_40px_-8px_rgba(25,195,154,0.8)] transition-colors hover:bg-brand-400"
          >
            <Plus size={28} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {callModal && <CallRequestModal onClose={() => setCallModal(false)} />}
      </AnimatePresence>
    </>
  )
}