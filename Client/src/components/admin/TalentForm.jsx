import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import FormFooter from './FormFooter'
import ImageUpload from './ImageUpload'
import Toggle from './Toggle'

const isLink = (text) => !text || /^https?:\/\//i.test(text)

export default function TalentForm({ item, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    headline: item?.headline || '',
    location: item?.location || '',
    bio: item?.bio || '',
    skillsText: (item?.skills || []).join(', '),
    photo: item?.photo || '',
    openToWork: item?.openToWork ?? true,
    portfolioUrl: item?.portfolioUrl || '',
    githubUrl: item?.githubUrl || '',
    linkedinUrl: item?.linkedinUrl || '',
    certId: item?.certId || '',
    batch: item?.batch || '',
    order: item?.order ?? 0,
    isActive: item?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Naam likho')
    for (const key of ['portfolioUrl', 'githubUrl', 'linkedinUrl']) {
      if (!isLink(form[key].trim())) return setError('Link http:// ya https:// se shuru hona chahiye')
    }
    setError('')

    onSave({
      name: form.name.trim(),
      headline: form.headline.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
      skills: form.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      photo: form.photo,
      openToWork: form.openToWork,
      portfolioUrl: form.portfolioUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      certId: form.certId.trim().toUpperCase(),
      batch: form.batch.trim(),
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
        Profile sirf learner ki sahmati (WhatsApp message bhi chalega) ke baad daalo. 18 se kam umar
        ke learner ki profile mat daalo, ya guardian ki sahmati lo. Phone/email yahan nahi daalte.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name">
          <input className={inputClass} placeholder="Amit Kumar" value={form.name} onChange={set('name')} />
        </FormField>
        <FormField label="Headline" optional>
          <input
            className={inputClass}
            placeholder="MERN Stack Intern"
            value={form.headline}
            onChange={set('headline')}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Sheher" optional>
          <input
            className={inputClass}
            placeholder="Patna"
            value={form.location}
            onChange={set('location')}
          />
        </FormField>
        <FormField label="Batch" optional>
          <input
            className={inputClass}
            placeholder="2026 Batch 1"
            value={form.batch}
            onChange={set('batch')}
          />
        </FormField>
      </div>

      <ImageUpload
        label="Photo"
        value={form.photo}
        onChange={(url) => setForm({ ...form, photo: url })}
      />

      <FormField label="Skills (comma se alag karo)" optional>
        <input
          className={inputClass}
          placeholder="React, Node.js, MongoDB"
          value={form.skillsText}
          onChange={set('skillsText')}
        />
      </FormField>

      <FormField label="Bio (chhota parichay)" optional>
        <textarea
          rows={4}
          maxLength={800}
          className={`${inputClass} resize-none`}
          value={form.bio}
          onChange={set('bio')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Portfolio link" optional>
          <input
            className={inputClass}
            placeholder="https://..."
            value={form.portfolioUrl}
            onChange={set('portfolioUrl')}
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
        <FormField label="LinkedIn link" optional>
          <input
            className={inputClass}
            placeholder="https://linkedin.com/in/..."
            value={form.linkedinUrl}
            onChange={set('linkedinUrl')}
          />
        </FormField>
      </div>

      <FormField label="Certificate ID (verified nishaan ke liye)" optional>
        <input
          className={inputClass}
          placeholder="ANS-2026-XXXXXX"
          value={form.certId}
          onChange={set('certId')}
        />
        <span className="mt-1.5 block text-xs text-white/40">
          Certificates page se ID copy karo. Certificate valid ho tabhi nishaan dikhega.
        </span>
      </FormField>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-sm font-medium">Open to work</p>
          <p className="text-xs text-white/50">Abhi kaam ya freelance ke liye available hai</p>
        </div>
        <Toggle
          checked={form.openToWork}
          onChange={(value) => setForm({ ...form, openToWork: value })}
          label="Open to work"
        />
      </div>

      <FormFooter
        form={form}
        setForm={setForm}
        saving={saving}
        isNew={!item}
        noun="learner"
        onCancel={onCancel}
      />
    </form>
  )
}