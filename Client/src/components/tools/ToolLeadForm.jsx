import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import api from '../../services/api'
import { useLanguage } from '../../hooks/useLanguage'
import FormField, { inputClass } from '../ui/FormField'

const copy = {
  en: {
    name: 'Your name',
    phone: 'Phone / WhatsApp number',
    email: 'Email (optional)',
    sending: 'Sending...',
    errName: 'Please enter your name',
    errPhone: 'Enter a valid phone number',
    errEmail: 'Enter a valid email',
    errServer: 'Cannot reach the server. Please try again in a moment.',
    doneTitle: 'Sent!',
    doneText: 'We will contact you on {phone} soon.',
  },
  hi: {
    name: 'आपका नाम',
    phone: 'फ़ोन / WhatsApp नंबर',
    email: 'ईमेल (ज़रूरी नहीं)',
    sending: 'भेज रहे हैं...',
    errName: 'कृपया अपना नाम लिखें',
    errPhone: 'सही फ़ोन नंबर लिखें',
    errEmail: 'सही ईमेल लिखें',
    errServer: 'सर्वर से संपर्क नहीं हो पाया। कृपया थोड़ी देर बाद दोबारा कोशिश करें।',
    doneTitle: 'भेज दिया!',
    doneText: 'हम जल्द ही आपको {phone} पर संपर्क करेंगे।',
  },
}

export default function ToolLeadForm({ type, details, service = '', title, button }) {
  const { lang } = useLanguage()
  const c = copy[lang]

  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = c.errName
    if (form.phone.replace(/\D/g, '').length < 10) err.phone = c.errPhone
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) err.email = c.errEmail
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    setServerError('')
    try {
      await api.post('/inquiries', {
        type,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        details,
        service,
      })
      setSent(true)
    } catch (error) {
      setServerError(error.response?.data?.message || c.errServer)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="py-4 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-black">
          <Check size={28} strokeWidth={3} />
        </span>
        <p className="mt-4 text-lg font-bold">{c.doneTitle}</p>
        <p className="mt-1 text-sm text-white/60">{c.doneText.replace('{phone}', form.phone)}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <p className="font-semibold">{title}</p>

      {serverError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {serverError}
        </div>
      )}

      <FormField label={c.name} error={errors.name}>
        <input className={inputClass} value={form.name} onChange={set('name')} />
      </FormField>
      <FormField label={c.phone} error={errors.phone}>
        <input
          type="tel"
          className={inputClass}
          placeholder="98765 43210"
          value={form.phone}
          onChange={set('phone')}
        />
      </FormField>
      <FormField label={c.email} error={errors.email}>
        <input
          type="email"
          className={inputClass}
          value={form.email}
          onChange={set('email')}
        />
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            {c.sending}
          </>
        ) : (
          <>
            {button} <Send size={16} />
          </>
        )}
      </button>
    </form>
  )
}