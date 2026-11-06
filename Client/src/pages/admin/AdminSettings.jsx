import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import api from '../../services/api'
import { useToast } from '../../hooks/useToast'
import FormField, { inputClass } from '../../components/ui/FormField'
import Toast from '../../components/admin/Toast'

const keys = ['email', 'phone', 'whatsapp', 'address', 'hours', 'reply', 'mapQuery']

export default function AdminSettings() {
  const { toast, show } = useToast()
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(null) // jo database me hai (badlav pakadne ke liye)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoadError('')
    api
      .get('/settings')
      .then(({ data }) => {
        const values = {}
        keys.forEach((k) => {
          values[k] = data.settings[k] || ''
        })
        setForm(values)
        setSaved(values)
      })
      .catch((err) => setLoadError(err.response?.data?.message || 'Could not load settings'))
  }

  useEffect(load, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const changed = form && JSON.stringify(form) !== JSON.stringify(saved)

  const submit = async (e) => {
    e.preventDefault()
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Email sahi nahi hai')
      return
    }
    setError('')
    setSaving(true)
    try {
      await api.put('/settings', form)
      setSaved(form)
      show('Settings saved')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <p className="font-semibold text-red-500">{loadError}</p>
        <button
          onClick={load}
          className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!form) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-white/50">
          Contact details jo website par dikhte hain. Khali field site par nahi dikhegi.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="text-lg font-semibold">Contact details</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField label="Email">
                <input
                  type="email"
                  className={inputClass}
                  placeholder="hello@yourcompany.com"
                  value={form.email}
                  onChange={set('email')}
                />
                <span className="mt-1.5 block text-xs text-white/40">
                  Ye sirf website par dikhega. Naye messages jis inbox me aate hain wo server ki
                  .env me MAIL_TO hai.
                </span>
              </FormField>
            </div>
            <FormField label="Phone" optional>
              <input
                className={inputClass}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set('phone')}
              />
            </FormField>
            <FormField label="WhatsApp number" optional>
              <input
                className={inputClass}
                placeholder="919876543210"
                value={form.whatsapp}
                onChange={set('whatsapp')}
              />
              <span className="mt-1.5 block text-xs text-white/40">
                Country code ke saath, bina + ke.
              </span>
            </FormField>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="text-lg font-semibold">Location and timing</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField label="Address">
              <input
                className={inputClass}
                placeholder="Delhi, India"
                value={form.address}
                onChange={set('address')}
              />
            </FormField>
            <FormField label="Map location">
              <input
                className={inputClass}
                placeholder="Delhi, India"
                value={form.mapQuery}
                onChange={set('mapQuery')}
              />
              <span className="mt-1.5 block text-xs text-white/40">
                Google Map isi naam se location dhundhega.
              </span>
            </FormField>
            <FormField label="Working hours">
              <input
                className={inputClass}
                placeholder="Mon – Sat, 10:00 AM – 7:00 PM"
                value={form.hours}
                onChange={set('hours')}
              />
            </FormField>
            <FormField label="Reply time text">
              <input
                className={inputClass}
                placeholder="We usually reply within 24 hours"
                value={form.reply}
                onChange={set('reply')}
              />
            </FormField>
          </div>
        </motion.section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || !changed}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
          {!changed && <span className="text-sm text-white/40">Koi badlav nahi</span>}
        </div>
      </form>

      <Toast toast={toast} />
    </div>
  )
}