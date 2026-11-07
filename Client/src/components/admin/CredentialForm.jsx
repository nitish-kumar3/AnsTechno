import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import { credentialIconKeys } from '../../utils/blockIcons'
import FormFooter from './FormFooter'
import IconPicker from './IconPicker'

export default function CredentialForm({ item, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    titleHi: item?.titleHi || '',
    detail: item?.detail || '',
    icon: item?.icon || 'shield',
    order: item?.order ?? 0,
    isActive: item?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.title.trim().length < 2) return setError('Title likho')
    setError('')

    onSave({
      title: form.title.trim(),
      titleHi: form.titleHi.trim(),
      detail: form.detail.trim(),
      icon: form.icon,
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
        Sirf wahi daalo jo tumhare paas asli me hai (registration, certificate, kaam ka anubhav).
        Registration number jaisi cheez public karni hai ya nahi, ye tum tay karo.
      </p>

      <FormField label="Title (English)">
        <input
          className={inputClass}
          placeholder="MSME registered"
          value={form.title}
          onChange={set('title')}
        />
      </FormField>
      <FormField label="Title (Hindi)" optional>
        <input
          className={inputClass}
          placeholder="MSME पंजीकृत"
          value={form.titleHi}
          onChange={set('titleHi')}
        />
      </FormField>
      <FormField label="Detail (ek line)" optional>
        <input
          className={inputClass}
          placeholder="Registered under Udyam"
          value={form.detail}
          onChange={set('detail')}
        />
      </FormField>

      <IconPicker keys={credentialIconKeys} value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />

      <FormFooter
        form={form}
        setForm={setForm}
        saving={saving}
        isNew={!item}
        noun="credential"
        onCancel={onCancel}
      />
    </form>
  )
}