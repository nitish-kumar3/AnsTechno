// import { useState } from 'react'
// import { useSearchParams } from 'react-router-dom'
// import { AnimatePresence, motion } from 'framer-motion'
// import { Check, Send, X } from 'lucide-react'
// import FormField, { inputClass } from '../ui/FormField'
// import { services } from '../../data/services'

// const MAX = 1000
// const empty = { name: '', email: '', message: '' }

// export default function ContactForm() {
//   const [params, setParams] = useSearchParams()
//   const service = services.find((s) => s.id === params.get('service'))

//   const [form, setForm] = useState(empty)
//   const [errors, setErrors] = useState({})
//   const [loading, setLoading] = useState(false)
//   const [sent, setSent] = useState(false)

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

//   const submit = async (e) => {
//     e.preventDefault()
//     const err = {}
//     if (!form.name.trim()) err.name = 'Please enter your name'
//     if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email'
//     if (form.message.trim().length < 10)
//       err.message = 'Please write at least 10 characters'
//     setErrors(err)
//     if (Object.keys(err).length) return

//     setLoading(true)
//     const payload = { ...form, service: service ? service.title : '' }

//     // TODO (backend ke baad): await api.post('/inquiries', payload)
//     console.log('Inquiry:', payload)
//     await new Promise((r) => setTimeout(r, 1200))

//     setLoading(false)
//     setSent(true)
//   }

//   const reset = () => {
//     setForm(empty)
//     setErrors({})
//     setSent(false)
//   }

//   return (
//     <div className="glow-border rounded-[2rem] p-[1.5px]">
//       <div className="relative overflow-hidden rounded-[1.9rem] bg-[#07100c] p-6 sm:p-9">
//         <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/15 blur-3xl" />

//         <AnimatePresence mode="wait">
//           {sent ? (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               className="relative py-10 text-center"
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: 'spring', stiffness: 260, damping: 15 }}
//                 className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-black shadow-[0_0_60px_-5px_rgba(25,195,154,0.7)]"
//               >
//                 <Check size={40} strokeWidth={3} />
//               </motion.div>
//               <h3 className="mt-6 text-2xl font-bold">Message sent!</h3>
//               <p className="mx-auto mt-3 max-w-sm text-white/60">
//                 Thank you {form.name.trim().split(' ')[0]}. We will get back to
//                 you on <b className="text-brand-300">{form.email}</b> soon.
//               </p>
//               <button
//                 onClick={reset}
//                 className="mt-8 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
//               >
//                 Send another message
//               </button>
//             </motion.div>
//           ) : (
//             <motion.form
//               key="form"
//               onSubmit={submit}
//               noValidate
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="relative"
//             >
//               <h2 className="text-2xl font-bold sm:text-3xl">Send us a message</h2>
//               <p className="mt-2 text-sm text-white/55">
//                 Share your idea or question. It takes less than a minute.
//               </p>

//               {service && (
//                 <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 py-1.5 pl-4 pr-2 text-sm text-brand-300">
//                   <span className="truncate">Regarding: {service.title}</span>
//                   <button
//                     type="button"
//                     onClick={() => setParams({}, { replace: true })}
//                     aria-label="Remove service"
//                     className="shrink-0 rounded-full p-1 hover:bg-white/10"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               )}

//               <div className="mt-6 space-y-4">
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <FormField label="Your name" error={errors.name}>
//                     <input
//                       className={inputClass}
//                       placeholder="Your name"
//                       value={form.name}
//                       onChange={set('name')}
//                     />
//                   </FormField>
//                   <FormField label="Email" error={errors.email}>
//                     <input
//                       type="email"
//                       className={inputClass}
//                       placeholder="you@example.com"
//                       value={form.email}
//                       onChange={set('email')}
//                     />
//                   </FormField>
//                 </div>

//                 <FormField label="Message" error={errors.message}>
//                   <textarea
//                     rows={6}
//                     maxLength={MAX}
//                     className={`${inputClass} resize-none`}
//                     placeholder="Tell us about your project or question..."
//                     value={form.message}
//                     onChange={set('message')}
//                   />
//                   <span className="mt-1.5 block text-right text-xs text-white/40">
//                     {form.message.length}/{MAX}
//                   </span>
//                 </FormField>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_40px_-8px_rgba(255,255,255,0.5)] transition hover:bg-brand-300 disabled:opacity-70"
//               >
//                 {loading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     Send Message
//                     <Send
//                       size={16}
//                       className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
//                     />
//                   </>
//                 )}
//               </button>

//               <p className="mt-4 text-center text-xs text-white/40">
//                 Your details are safe with us. We never share them.
//               </p>
//             </motion.form>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Send, X } from 'lucide-react'
import api from '../../services/api'
import { useServices } from '../../hooks/useContent'
import FormField, { inputClass } from '../ui/FormField'

const MAX = 1000
const empty = { name: '', email: '', message: '' }

export default function ContactForm() {
  const [params, setParams] = useSearchParams()
  const { data: services } = useServices()

  // URL me ?service=... ho to us service ka naam chip me dikhao
  const service = (services || []).find((s) => s.id === params.get('service'))

  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email'
    if (form.message.trim().length < 10)
      err.message = 'Please write at least 10 characters'
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    setServerError('')

    try {
      await api.post('/inquiries', {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        service: service ? service.id : '',
      })
      setSent(true)
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Cannot reach the server. Please try again in a moment.'
      )
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm(empty)
    setErrors({})
    setServerError('')
    setSent(false)
  }

  return (
    <div className="glow-border rounded-[2rem] p-[1.5px]">
      <div className="relative overflow-hidden rounded-[1.9rem] bg-[#07100c] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/15 blur-3xl" />

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-black shadow-[0_0_60px_-5px_rgba(25,195,154,0.7)]"
              >
                <Check size={40} strokeWidth={3} />
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold">Message sent!</h3>
              <p className="mx-auto mt-3 max-w-sm text-white/60">
                Thank you {form.name.trim().split(' ')[0]}. We will get back to
                you on <b className="text-brand-300">{form.email}</b> soon.
              </p>
              <button
                onClick={reset}
                className="mt-8 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <h2 className="text-2xl font-bold sm:text-3xl">Send us a message</h2>
              <p className="mt-2 text-sm text-white/55">
                Share your idea or question. It takes less than a minute.
              </p>

              {service && (
                <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 py-1.5 pl-4 pr-2 text-sm text-brand-300">
                  <span className="truncate">Regarding: {service.title}</span>
                  <button
                    type="button"
                    onClick={() => setParams({}, { replace: true })}
                    aria-label="Remove service"
                    className="shrink-0 rounded-full p-1 hover:bg-white/10"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {serverError && (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {serverError}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Your name" error={errors.name}>
                    <input
                      className={inputClass}
                      placeholder="Your name"
                      value={form.name}
                      onChange={set('name')}
                    />
                  </FormField>
                  <FormField label="Email" error={errors.email}>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </FormField>
                </div>

                <FormField label="Message" error={errors.message}>
                  <textarea
                    rows={6}
                    maxLength={MAX}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your project or question..."
                    value={form.message}
                    onChange={set('message')}
                  />
                  <span className="mt-1.5 block text-right text-xs text-white/40">
                    {form.message.length}/{MAX}
                  </span>
                </FormField>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_40px_-8px_rgba(255,255,255,0.5)] transition hover:bg-brand-300 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-white/40">
                Your details are safe with us. We never share them.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}