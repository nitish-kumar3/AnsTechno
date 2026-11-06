import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import RatingStars from './RatingStars'
import Toggle from './Toggle'

export default function TestimonialForm({ testimonial, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    service: testimonial?.service || '',
    rating: testimonial?.rating ?? 5,
    text: testimonial?.text || '',
    order: testimonial?.order ?? 0,
    isActive: testimonial?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Please enter the client name')
    if (form.text.trim().length < 10) return setError('Feedback kam se kam 10 characters ka likho')
    setError('')

    onSave({
      name: form.name.trim(),
      role: form.role.trim(),
      service: form.service.trim(),
      rating: form.rating,
      text: form.text.trim(),
      order: Number(form.order) || 0,
      isActive: form.isActive,
    })
  }

  const shownError = error || serverError

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {shownError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {shownError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Client name">
          <input
            className={inputClass}
            placeholder="e.g. Rohit Verma"
            value={form.name}
            onChange={set('name')}
          />
        </FormField>
        <FormField label="Role / business" optional>
          <input
            className={inputClass}
            placeholder="Owner, Local Retail Store"
            value={form.role}
            onChange={set('role')}
          />
        </FormField>
      </div>

      <FormField label="Service ya kaam" optional>
        <input
          className={inputClass}
          placeholder="Website Development"
          value={form.service}
          onChange={set('service')}
        />
      </FormField>

      <div>
        <p className="mb-2 text-sm font-medium text-white/80">Rating</p>
        <RatingStars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} size={28} />
      </div>

      <FormField label="Client ka feedback">
        <textarea
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Client ne kya kaha..."
          value={form.text}
          onChange={set('text')}
        />
      </FormField>

      <FormField label="Order (chhota number pehle dikhega)">
        <input type="number" className={inputClass} value={form.order} onChange={set('order')} />
      </FormField>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-sm font-medium">Show on website</p>
          <p className="text-xs text-white/50">Band karoge to site se chhup jayega</p>
        </div>
        <Toggle
          checked={form.isActive}
          onChange={(value) => setForm({ ...form, isActive: value })}
          label="Show on website"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70 sm:flex-none"
        >
          {saving ? 'Saving...' : testimonial ? 'Save changes' : 'Add testimonial'}
        </button>
      </div>
    </form>
  )
}