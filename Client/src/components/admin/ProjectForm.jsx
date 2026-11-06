import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import Toggle from './Toggle'
import { getProjectIcon } from '../../utils/projectIcons'
import ImageUpload from './ImageUpload'

const categories = ['Web App', 'AI / ML']
const iconKeys = ['graduation', 'chat', 'video', 'blog', 'shield', 'bell', 'code']

const toList = (text, separator) =>
  text
    .split(separator)
    .map((t) => t.trim())
    .filter(Boolean)

// Link khali ho sakta hai, par ho to http se shuru hona chahiye
const isLink = (text) => !text || /^https?:\/\//i.test(text)

export default function ProjectForm({ project, serviceOptions, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    category: project?.category || 'Web App',
    icon: project?.icon || 'code',
    serviceId: project?.serviceId || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    featuresText: (project?.features || []).join('\n'),
    techText: (project?.tech || []).join(', '),
    image: project?.image || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    order: project?.order ?? 0,
    isActive: project?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()

    if (form.title.trim().length < 2) return setError('Please enter the project title')
    if (!isLink(form.liveUrl.trim())) return setError('Live link http:// ya https:// se shuru hona chahiye')
    if (!isLink(form.githubUrl.trim())) return setError('GitHub link http:// ya https:// se shuru hona chahiye')
    setError('')

    onSave({
      title: form.title.trim(),
      category: form.category,
      icon: form.icon,
      serviceId: form.serviceId,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      features: toList(form.featuresText, '\n'),
      tech: toList(form.techText, ','),
      image: form.image.trim(),
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
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
          placeholder="e.g. Course Selling Website"
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
        <FormField label="Related service" optional>
          <select className={inputClass} value={form.serviceId} onChange={set('serviceId')}>
            <option value="" className="bg-ink">
              None
            </option>
            {serviceOptions.map((s) => (
              <option key={s.slug} value={s.slug} className="bg-ink">
                {s.title}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-white/80">Icon (jab photo na ho)</p>
        <div className="flex flex-wrap gap-2">
          {iconKeys.map((key) => {
            const Icon = getProjectIcon(key)
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
          placeholder="A complete platform to sell and learn online courses."
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

      <FormField label="Key features (ek line me ek point)" optional>
        <textarea
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder={'User login\nAdmin panel\nPayment flow'}
          value={form.featuresText}
          onChange={set('featuresText')}
        />
      </FormField>

      <FormField label="Tech stack (comma se alag karo)" optional>
        <input
          className={inputClass}
          placeholder="MongoDB, Express, React, Node.js"
          value={form.techText}
          onChange={set('techText')}
        />
      </FormField>

        <ImageUpload
        label="Project photo"
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Live demo link" optional>
          <input
            className={inputClass}
            placeholder="https://..."
            value={form.liveUrl}
            onChange={set('liveUrl')}
          />
        </FormField>
        <FormField label="GitHub link" optional>
          <input
            className={inputClass}
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={set('githubUrl')}
          />
        </FormField>
      </div>

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
          {saving ? 'Saving...' : project ? 'Save changes' : 'Add project'}
        </button>
      </div>
    </form>
  )
}