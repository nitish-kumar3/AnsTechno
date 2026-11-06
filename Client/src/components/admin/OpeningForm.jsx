import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import Toggle from './Toggle'

const toList = (text, separator) =>
  text
    .split(separator)
    .map((t) => t.trim())
    .filter(Boolean)

export default function OpeningForm({ opening, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    type: opening?.type || 'Job',
    title: opening?.title || '',
    department: opening?.department || '',
    openings: opening?.openings ?? 1,
    order: opening?.order ?? 0,
    skillsText: (opening?.skills || []).join(', '),
    about: opening?.about || '',
    requirementsText: (opening?.requirements || []).join('\n'),
    isActive: opening?.isActive ?? true,
    // Sirf Job ke liye
    location: opening?.location || '',
    workMode: opening?.workMode || '',
    experience: opening?.experience || '',
    salary: opening?.salary || '',
    responsibilitiesText: (opening?.responsibilities || []).join('\n'),
    // Sirf Internship ke liye
    mode: opening?.mode || '',
    duration: opening?.duration || '',
    fee: opening?.fee || '',
    learnText: (opening?.learn || []).join('\n'),
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const isJob = form.type === 'Job'

  const submit = (e) => {
    e.preventDefault()
    if (form.title.trim().length < 2) {
      setError('Please enter the title')
      return
    }
    setError('')

    // Dono type ke common fields
    const payload = {
      type: form.type,
      title: form.title.trim(),
      department: form.department.trim(),
      openings: Math.max(1, Number(form.openings) || 1),
      order: Number(form.order) || 0,
      skills: toList(form.skillsText, ','),
      about: form.about.trim(),
      requirements: toList(form.requirementsText, '\n'),
      isActive: form.isActive,
    }

    // Type ke hisaab se baaki fields (dusre type ke fields khali kar dete hain)
    if (isJob) {
      Object.assign(payload, {
        location: form.location.trim(),
        workMode: form.workMode.trim(),
        experience: form.experience.trim(),
        salary: form.salary.trim(),
        responsibilities: toList(form.responsibilitiesText, '\n'),
        mode: '',
        duration: '',
        fee: '',
        learn: [],
      })
    } else {
      Object.assign(payload, {
        mode: form.mode.trim(),
        duration: form.duration.trim(),
        fee: form.fee.trim(),
        learn: toList(form.learnText, '\n'),
        location: '',
        workMode: '',
        experience: '',
        salary: '',
        responsibilities: [],
      })
    }

    onSave(payload)
  }

  const shownError = error || serverError

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {shownError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {shownError}
        </div>
      )}

      {/* Job ya Internship */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
        {['Job', 'Internship'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t })}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              form.type === t ? 'bg-brand-500 text-black' : 'text-white/70 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <FormField label="Title">
        <input
          className={inputClass}
          placeholder={isJob ? 'e.g. Frontend Developer (React)' : 'e.g. MERN Stack Internship'}
          value={form.title}
          onChange={set('title')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Department" optional>
          <input
            className={inputClass}
            placeholder="Engineering"
            value={form.department}
            onChange={set('department')}
          />
        </FormField>
        <FormField label="Kitni jagah khali hain">
          <input
            type="number"
            min="1"
            className={inputClass}
            value={form.openings}
            onChange={set('openings')}
          />
        </FormField>
        <FormField label="Order">
          <input type="number" className={inputClass} value={form.order} onChange={set('order')} />
        </FormField>
      </div>

      {/* Job ke fields */}
      {isJob && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Location" optional>
              <input
                className={inputClass}
                placeholder="Delhi"
                value={form.location}
                onChange={set('location')}
              />
            </FormField>
            <FormField label="Work mode" optional>
              <input
                className={inputClass}
                placeholder="Hybrid / Remote"
                value={form.workMode}
                onChange={set('workMode')}
              />
            </FormField>
            <FormField label="Experience" optional>
              <input
                className={inputClass}
                placeholder="0-2 years"
                value={form.experience}
                onChange={set('experience')}
              />
            </FormField>
            <FormField label="Salary" optional>
              <input
                className={inputClass}
                placeholder="Based on skills"
                value={form.salary}
                onChange={set('salary')}
              />
            </FormField>
          </div>

          <FormField label="Responsibilities (ek line me ek point)" optional>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={form.responsibilitiesText}
              onChange={set('responsibilitiesText')}
            />
          </FormField>
        </>
      )}

      {/* Internship ke fields */}
      {!isJob && (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Duration" optional>
              <input
                className={inputClass}
                placeholder="3 Months"
                value={form.duration}
                onChange={set('duration')}
              />
            </FormField>
            <FormField label="Mode" optional>
              <input
                className={inputClass}
                placeholder="Remote / Delhi"
                value={form.mode}
                onChange={set('mode')}
              />
            </FormField>
            <FormField label="Fee" optional>
              <input
                className={inputClass}
                placeholder="Free · small guidance fee"
                value={form.fee}
                onChange={set('fee')}
              />
            </FormField>
          </div>

          <FormField label="You will learn (ek line me ek point)" optional>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={form.learnText}
              onChange={set('learnText')}
            />
          </FormField>
        </>
      )}

      <FormField label="About" optional>
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          value={form.about}
          onChange={set('about')}
        />
      </FormField>

      <FormField label={isJob ? 'Requirements (ek line me ek)' : 'Who can apply (ek line me ek)'} optional>
        <textarea
          rows={4}
          className={`${inputClass} resize-none`}
          value={form.requirementsText}
          onChange={set('requirementsText')}
        />
      </FormField>

      <FormField label="Skills (comma se alag karo)" optional>
        <input
          className={inputClass}
          placeholder="React, Tailwind CSS, Git"
          value={form.skillsText}
          onChange={set('skillsText')}
        />
      </FormField>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-sm font-medium">Show on website</p>
          <p className="text-xs text-white/50">Band karoge to Career page se chhup jayega</p>
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
          {saving ? 'Saving...' : opening ? 'Save changes' : `Add ${form.type.toLowerCase()}`}
        </button>
      </div>
    </form>
  )
}