import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'

const types = ['Internship', 'Training', 'Course']

// Date ko input ke format (yyyy-mm-dd) me badlo
const toInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '')

export default function CertificateForm({ certificate, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: certificate?.name || '',
    email: certificate?.email || '',
    program: certificate?.program || '',
    type: certificate?.type || 'Internship',
    startDate: toInput(certificate?.startDate),
    endDate: toInput(certificate?.endDate),
    issueDate: toInput(certificate?.issueDate) || new Date().toISOString().slice(0, 10),
    grade: certificate?.grade || '',
    notes: certificate?.notes || '',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Please enter the name')
    if (form.program.trim().length < 2) return setError('Please enter the program')
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return setError('Enter a valid email')
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      return setError('End date start date ke baad honi chahiye')
    }
    setError('')

    onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      program: form.program.trim(),
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      issueDate: form.issueDate,
      grade: form.grade.trim(),
      notes: form.notes.trim(),
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
        <FormField label="Name (certificate par yahi chhapega)">
          <input
            className={inputClass}
            placeholder="e.g. Amit Kumar"
            value={form.name}
            onChange={set('name')}
          />
        </FormField>
        <FormField label="Email" optional>
          <input
            type="email"
            className={inputClass}
            placeholder="Sirf tumhare record ke liye"
            value={form.email}
            onChange={set('email')}
          />
        </FormField>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-white/80">Type</p>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {types.map((t) => (
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
      </div>

      <FormField label="Program / course ka naam">
        <input
          className={inputClass}
          placeholder="e.g. MERN Stack Development"
          value={form.program}
          onChange={set('program')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Start date" optional>
          <input type="date" className={inputClass} value={form.startDate} onChange={set('startDate')} />
        </FormField>
        <FormField label="End date" optional>
          <input type="date" className={inputClass} value={form.endDate} onChange={set('endDate')} />
        </FormField>
        <FormField label="Issue date">
          <input type="date" className={inputClass} value={form.issueDate} onChange={set('issueDate')} />
        </FormField>
      </div>

      <FormField label="Grade / remarks" optional>
        <input
          className={inputClass}
          placeholder="e.g. A+  ya  Excellent performance"
          value={form.grade}
          onChange={set('grade')}
        />
      </FormField>

      <FormField label="Private notes" optional>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          value={form.notes}
          onChange={set('notes')}
        />
      </FormField>

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
          {saving ? 'Saving...' : certificate ? 'Save changes' : 'Issue certificate'}
        </button>
      </div>
    </form>
  )
}