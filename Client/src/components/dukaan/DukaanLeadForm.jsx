import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import api from '../../services/api'
import { useLanguage } from '../../hooks/useLanguage'
import FormField, { inputClass } from '../ui/FormField'

const copy = {
  en: {
    name: 'Your name',
    phone: 'Phone / WhatsApp number',
    shop: 'Shop name',
    sells: 'What do you sell?',
    sellsPh: 'Groceries, clothes, mobile accessories...',
    area: 'Area and city',
    button: 'Request my shop page',
    sending: 'Sending...',
    errName: 'Please enter your name',
    errPhone: 'Enter a valid phone number',
    errShop: 'Please enter your shop name',
    errServer: 'Cannot reach the server. Please try again in a moment.',
    doneTitle: 'Request received!',
    doneText: 'We will call you on {phone} soon to set up your shop page.',
  },
  hi: {
    name: 'आपका नाम',
    phone: 'फ़ोन / WhatsApp नंबर',
    shop: 'दुकान का नाम',
    sells: 'आप क्या बेचते हैं?',
    sellsPh: 'किराना, कपड़े, मोबाइल का सामान...',
    area: 'इलाका और शहर',
    button: 'मेरा शॉप पेज बनवाएं',
    sending: 'भेज रहे हैं...',
    errName: 'कृपया अपना नाम लिखें',
    errPhone: 'सही फ़ोन नंबर लिखें',
    errShop: 'कृपया दुकान का नाम लिखें',
    errServer: 'सर्वर से संपर्क नहीं हो पाया। कृपया थोड़ी देर बाद दोबारा कोशिश करें।',
    doneTitle: 'अनुरोध मिल गया!',
    doneText: 'आपका शॉप पेज बनाने के लिए हम जल्द ही आपको {phone} पर कॉल करेंगे।',
  },
}

export default function DukaanLeadForm() {
  const { lang } = useLanguage()
  const c = copy[lang]

  const [form, setForm] = useState({ name: '', phone: '', shop: '', sells: '', area: '' })
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
    if (!form.shop.trim()) err.shop = c.errShop
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    setServerError('')
    try {
      await api.post('/inquiries', {
        type: 'dukaan',
        name: form.name.trim(),
        phone: form.phone.trim(),
        details: [
          `Shop: ${form.shop.trim()}`,
          form.sells.trim() && `Sells: ${form.sells.trim()}`,
          form.area.trim() && `Area: ${form.area.trim()}`,
        ]
          .filter(Boolean)
          .join('\n'),
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
      <div className="py-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-black">
          <Check size={32} strokeWidth={3} />
        </span>
        <p className="mt-4 text-xl font-bold">{c.doneTitle}</p>
        <p className="mx-auto mt-2 max-w-sm text-white/60">{c.doneText.replace('{phone}', form.phone)}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {serverError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {serverError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <FormField label={c.shop} error={errors.shop}>
        <input className={inputClass} value={form.shop} onChange={set('shop')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={c.sells} optional>
          <input className={inputClass} placeholder={c.sellsPh} value={form.sells} onChange={set('sells')} />
        </FormField>
        <FormField label={c.area} optional>
          <input className={inputClass} value={form.area} onChange={set('area')} />
        </FormField>
      </div>

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
            {c.button} <Send size={16} />
          </>
        )}
      </button>
    </form>
  )
}