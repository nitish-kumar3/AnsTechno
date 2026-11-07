import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import FormFooter from './FormFooter'
import ImageUpload from './ImageUpload'

export default function StoryForm({ item, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    business: item?.business || '',
    location: item?.location || '',
    summary: item?.summary || '',
    before: item?.before || '',
    after: item?.after || '',
    result: item?.result || '',
    image: item?.image || '',
    order: item?.order ?? 0,
    isActive: item?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.title.trim().length < 3) return setError('Story ka title likho')
    setError('')

    onSave({
      title: form.title.trim(),
      business: form.business.trim(),
      location: form.location.trim(),
      summary: form.summary.trim(),
      before: form.before.trim(),
      after: form.after.trim(),
      result: form.result.trim(),
      image: form.image,
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

      <p className="rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-300">
        Sirf asli kahani daalo, aur client ki ijazat ke saath.
      </p>

      <FormField label="Title">
        <input
          className={inputClass}
          placeholder="How a local shop started selling online"
          value={form.title}
          onChange={set('title')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Business" optional>
          <input
            className={inputClass}
            placeholder="Local retail store"
            value={form.business}
            onChange={set('business')}
          />
        </FormField>
        <FormField label="Location" optional>
          <input
            className={inputClass}
            placeholder="Patna, Bihar"
            value={form.location}
            onChange={set('location')}
          />
        </FormField>
      </div>

      <FormField label="Summary" optional>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          value={form.summary}
          onChange={set('summary')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Before (pehle kya haal tha)" optional>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            value={form.before}
            onChange={set('before')}
          />
        </FormField>
        <FormField label="After (ab kya hua)" optional>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            value={form.after}
            onChange={set('after')}
          />
        </FormField>
      </div>

      <FormField label="Result (ek chhoti line)" optional>
        <input
          className={inputClass}
          placeholder="Orders doubled in 3 months"
          value={form.result}
          onChange={set('result')}
        />
      </FormField>

      <ImageUpload
        label="Photo"
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
      />

      <FormFooter
        form={form}
        setForm={setForm}
        saving={saving}
        isNew={!item}
        noun="story"
        onCancel={onCancel}
      />
    </form>
  )
}