import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import FormFooter from './FormFooter'

// Date ko input ke format (yyyy-mm-dd) me badlo
const toDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-CA') : '')
const goodLink = (t) => !t || t.startsWith('/') || /^https:\/\//i.test(t)

export default function AnnouncementForm({ item, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    text: item?.text || '',
    textHi: item?.textHi || '',
    link: item?.link || '',
    linkLabel: item?.linkLabel || '',
    linkLabelHi: item?.linkLabelHi || '',
    startsAt: toDate(item?.startsAt),
    expiresAt: toDate(item?.expiresAt),
    order: item?.order ?? 0,
    isActive: item?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.text.trim().length < 3) return setError('Announcement ka text likho')
    if (!goodLink(form.link.trim())) {
      return setError('Link / se shuru ho (jaise /career) ya https:// se')
    }
    if (form.startsAt && form.expiresAt && form.expiresAt < form.startsAt) {
      return setError('Khatam hone ki tareekh shuru hone ke baad ki honi chahiye')
    }
    setError('')

    onSave({
      text: form.text.trim(),
      textHi: form.textHi.trim(),
      link: form.link.trim(),
      linkLabel: form.linkLabel.trim(),
      linkLabelHi: form.linkLabelHi.trim(),
      // Shuru din ke shuru se, khatam din ke ant tak
      startsAt: form.startsAt ? new Date(`${form.startsAt}T00:00:00`).toISOString() : null,
      expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null,
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

      <FormField label="Text (English)">
        <input
          className={inputClass}
          maxLength={200}
          placeholder="New internship batch starts soon. Apply free!"
          value={form.text}
          onChange={set('text')}
        />
      </FormField>
      <FormField label="Text (Hindi)" optional>
        <input
          className={inputClass}
          maxLength={200}
          placeholder="नया इंटर्नशिप बैच जल्द शुरू। मुफ़्त आवेदन करें!"
          value={form.textHi}
          onChange={set('textHi')}
        />
      </FormField>

      <FormField label="Link" optional>
        <input
          className={inputClass}
          placeholder="/career  ya  https://..."
          value={form.link}
          onChange={set('link')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Button text (English)" optional>
          <input className={inputClass} placeholder="Apply now" value={form.linkLabel} onChange={set('linkLabel')} />
        </FormField>
        <FormField label="Button text (Hindi)" optional>
          <input className={inputClass} placeholder="अभी आवेदन करें" value={form.linkLabelHi} onChange={set('linkLabelHi')} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Kab se dikhana hai" optional>
          <input type="date" className={inputClass} value={form.startsAt} onChange={set('startsAt')} />
        </FormField>
        <FormField label="Kab tak dikhana hai" optional>
          <input type="date" className={inputClass} value={form.expiresAt} onChange={set('expiresAt')} />
        </FormField>
      </div>
      <p className="-mt-2 text-xs text-white/40">
        Tareekh khali chhodo to patti hamesha dikhegi. Khatam hone ki tareekh ke din ke ant tak chalti hai.
      </p>

      <FormFooter
        form={form}
        setForm={setForm}
        saving={saving}
        isNew={!item}
        noun="announcement"
        onCancel={onCancel}
      />
    </form>
  )
}