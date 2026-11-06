// import { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import { Check, PhoneCall, X } from 'lucide-react'
// import api from '../../services/api'
// import FormField, { inputClass } from '../ui/FormField'

// const times = [
//   'Anytime',
//   'Morning (10 AM - 1 PM)',
//   'Afternoon (1 PM - 5 PM)',
//   'Evening (5 PM - 8 PM)',
// ]

// export default function CallRequestModal({ onClose }) {
//   const [form, setForm] = useState({ name: '', phone: '', preferredTime: times[0] })
//   const [errors, setErrors] = useState({})
//   const [serverError, setServerError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [sent, setSent] = useState(false)

//   // Esc se band ho, aur peeche ka page scroll na ho
//   useEffect(() => {
//     const onKey = (e) => e.key === 'Escape' && onClose()
//     document.addEventListener('keydown', onKey)
//     document.body.style.overflow = 'hidden'
//     return () => {
//       document.removeEventListener('keydown', onKey)
//       document.body.style.overflow = ''
//     }
//   }, [onClose])

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

//   const submit = async (e) => {
//     e.preventDefault()
//     const err = {}
//     if (!form.name.trim()) err.name = 'Please enter your name'
//     if (form.phone.replace(/\D/g, '').length < 10) err.phone = 'Enter a valid phone number'
//     setErrors(err)
//     if (Object.keys(err).length) return

//     setLoading(true)
//     setServerError('')
//     try {
//       await api.post('/inquiries', {
//         type: 'call',
//         name: form.name.trim(),
//         phone: form.phone.trim(),
//         preferredTime: form.preferredTime,
//       })
//       setSent(true)
//     } catch (error) {
//       setServerError(
//         error.response?.data?.message || 'Cannot reach the server. Please try again in a moment.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onMouseDown={onClose}
//       className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 50, scale: 0.97 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: 50, scale: 0.97 }}
//         transition={{ type: 'spring', damping: 26, stiffness: 260 }}
//         onMouseDown={(e) => e.stopPropagation()}
//         className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-[#080d0b] p-6 shadow-2xl sm:rounded-3xl sm:p-8"
//       >
//         <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.25),transparent_70%)]" />

//         <button
//           onClick={onClose}
//           aria-label="Close"
//           className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
//         >
//           <X size={18} />
//         </button>

//         {sent ? (
//           <div className="relative py-6 text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: 'spring', stiffness: 260, damping: 15 }}
//               className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-black shadow-[0_0_60px_-5px_rgba(25,195,154,0.7)]"
//             >
//               <Check size={40} strokeWidth={3} />
//             </motion.div>
//             <h3 className="mt-6 text-2xl font-bold">Request received!</h3>
//             <p className="mx-auto mt-3 max-w-xs text-white/60">
//               Thank you {form.name.trim().split(' ')[0]}. We will call you on{' '}
//               <b className="text-brand-300">{form.phone}</b> soon.
//             </p>
//             <button
//               onClick={onClose}
//               className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
//             >
//               Done
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={submit} noValidate className="relative">
//             <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
//               <PhoneCall size={26} />
//             </span>
//             <h3 className="mt-5 text-2xl font-bold">Claim your free call</h3>
//             <p className="mt-2 text-sm text-white/55">
//               Share your number and we will call you back. No charges, no obligation.
//             </p>

//             {serverError && (
//               <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
//                 {serverError}
//               </div>
//             )}

//             <div className="mt-6 space-y-4">
//               <FormField label="Your name" error={errors.name}>
//                 <input
//                   className={inputClass}
//                   placeholder="Your name"
//                   value={form.name}
//                   onChange={set('name')}
//                 />
//               </FormField>
//               <FormField label="Phone number" error={errors.phone}>
//                 <input
//                   type="tel"
//                   className={inputClass}
//                   placeholder="98765 43210"
//                   value={form.phone}
//                   onChange={set('phone')}
//                 />
//               </FormField>
//               <FormField label="Best time to call">
//                 <select
//                   className={inputClass}
//                   value={form.preferredTime}
//                   onChange={set('preferredTime')}
//                 >
//                   {times.map((t) => (
//                     <option key={t} value={t} className="bg-ink">
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </FormField>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
//             >
//               {loading ? (
//                 <>
//                   <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
//                   Sending...
//                 </>
//               ) : (
//                 'Request a call back'
//               )}
//             </button>
//           </form>
//         )}
//       </motion.div>
//     </motion.div>
//   )
// }




import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, PhoneCall, X } from 'lucide-react'
import api from '../../services/api'
import { useLanguage } from '../../hooks/useLanguage'
import FormField, { inputClass } from '../ui/FormField'

// value English me jati hai (admin ko English dikhe), label user ki bhasha me
const times = [
  { value: 'Anytime', key: 'time.any' },
  { value: 'Morning (10 AM - 1 PM)', key: 'time.morning' },
  { value: 'Afternoon (1 PM - 5 PM)', key: 'time.afternoon' },
  { value: 'Evening (5 PM - 8 PM)', key: 'time.evening' },
]

export default function CallRequestModal({ onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', preferredTime: times[0].value })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // Esc se band ho, aur peeche ka page scroll na ho
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = t('call.errName')
    if (form.phone.replace(/\D/g, '').length < 10) err.phone = t('call.errPhone')
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    setServerError('')
    try {
      await api.post('/inquiries', {
        type: 'call',
        name: form.name.trim(),
        phone: form.phone.trim(),
        preferredTime: form.preferredTime,
      })
      setSent(true)
    } catch (error) {
      setServerError(error.response?.data?.message || t('call.errServer'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-[#080d0b] p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.25),transparent_70%)]" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        {sent ? (
          <div className="relative py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-black shadow-[0_0_60px_-5px_rgba(25,195,154,0.7)]"
            >
              <Check size={40} strokeWidth={3} />
            </motion.div>
            <h3 className="mt-6 text-2xl font-bold">{t('call.doneTitle')}</h3>
            <p className="mx-auto mt-3 max-w-xs text-white/60">
              {t('call.doneText', {
                name: form.name.trim().split(' ')[0],
                phone: form.phone,
              })}
            </p>
            <button
              onClick={onClose}
              className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
            >
              {t('call.done')}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
              <PhoneCall size={26} />
            </span>
            <h3 className="mt-5 text-2xl font-bold">{t('call.title')}</h3>
            <p className="mt-2 text-sm text-white/55">{t('call.sub')}</p>

            {serverError && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {serverError}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <FormField label={t('call.name')} error={errors.name}>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={set('name')}
                />
              </FormField>
              <FormField label={t('call.phone')} error={errors.phone}>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </FormField>
              <FormField label={t('call.time')}>
                <select
                  className={inputClass}
                  value={form.preferredTime}
                  onChange={set('preferredTime')}
                >
                  {times.map((x) => (
                    <option key={x.value} value={x.value} className="bg-ink">
                      {t(x.key)}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  {t('call.sending')}
                </>
              ) : (
                t('call.send')
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}