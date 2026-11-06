import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import Toggle from './Toggle'
import { getServiceIcon } from '../../utils/serviceIcons'

const categories = ['Development', 'Marketing', 'AI & Automation']
const iconKeys = [
  'monitor',
  'server',
  'layers',
  'globe',
  'rocket',
  'bot',
  'target',
  'camera',
  'share',
  'trending',
]

// "a\nb" -> ['a','b']  aur  "a, b" -> ['a','b']
const toList = (text, separator) =>
  text
    .split(separator)
    .map((t) => t.trim())
    .filter(Boolean)

export default function ServiceForm({ service, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: service?.title || '',
    category: service?.category || 'Development',
    icon: service?.icon || 'globe',
    tagline: service?.tagline || '',
    description: service?.description || '',
    featuresText: (service?.features || []).join('\n'),
    toolsText: (service?.tools || []).join(', '),
    idealFor: service?.idealFor || '',
    order: service?.order ?? 0,
    isActive: service?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.title.trim().length < 2) {
      setError('Please enter the service title')
      return
    }
    setError('')

    onSave({
      title: form.title.trim(),
      category: form.category,
      icon: form.icon,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      features: toList(form.featuresText, '\n'),
      tools: toList(form.toolsText, ','),
      idealFor: form.idealFor.trim(),
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

      <FormField label="Title">
        <input
          className={inputClass}
          placeholder="e.g. Frontend Development"
          value={form.title}
          onChange={set('title')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category">
          <select className={inputClass} value={form.category} onChange={set('category')}>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-ink">
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Order (chhota number pehle dikhega)">
          <input
            type="number"
            className={inputClass}
            value={form.order}
            onChange={set('order')}
          />
        </FormField>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-white/80">Icon</p>
        <div className="flex flex-wrap gap-2">
          {iconKeys.map((key) => {
            const Icon = getServiceIcon(key)
            const selected = form.icon === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, icon: key })}
                title={key}
                className={`grid h-12 w-12 place-items-center rounded-2xl border transition ${
                  selected
                    ? 'border-brand-500 bg-brand-500 text-black'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40'
                }`}
              >
                <Icon size={22} />
              </button>
            )
          })}
        </div>
      </div>

      <FormField label="Tagline (ek line)" optional>
        <input
          className={inputClass}
          placeholder="Fast, beautiful interfaces your customers love."
          value={form.tagline}
          onChange={set('tagline')}
        />
      </FormField>

      <FormField label="Description" optional>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          value={form.description}
          onChange={set('description')}
        />
      </FormField>

      <FormField label="What you will get (ek line me ek point)" optional>
        <textarea
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder={'Responsive UI\nSEO-friendly pages\nSmooth animations'}
          value={form.featuresText}
          onChange={set('featuresText')}
        />
      </FormField>

      <FormField label="Tools (comma se alag karo)" optional>
        <input
          className={inputClass}
          placeholder="React, Tailwind CSS, Vite"
          value={form.toolsText}
          onChange={set('toolsText')}
        />
      </FormField>

      <FormField label="Ideal for" optional>
        <input
          className={inputClass}
          placeholder="Businesses that need a modern website"
          value={form.idealFor}
          onChange={set('idealFor')}
        />
      </FormField>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-sm font-medium">Show on website</p>
          <p className="text-xs text-white/50">Band karoge to site se chhup jayegi</p>
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
          {saving ? 'Saving...' : service ? 'Save changes' : 'Add service'}
        </button>
      </div>
    </form>
  )
}