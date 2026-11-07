import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import { impactIconKeys } from '../../utils/blockIcons'
import FormFooter from './FormFooter'
import IconPicker from './IconPicker'

export default function ImpactForm({ item, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    value: item?.value ?? '',
    suffix: item?.suffix ?? '+',
    label: item?.label || '',
    labelHi: item?.labelHi || '',
    icon: item?.icon || 'users',
    order: item?.order ?? 0,
    isActive: item?.isActive ?? true,
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const value = Number(form.value)
    if (form.value === '' || Number.isNaN(value) || value < 0) {
      return setError('Asli number likho (0 ya usse zyada)')
    }
    if (form.label.trim().length < 2) return setError('Label likho, jaise "People trained"')
    setError('')

    onSave({
      value,
      suffix: form.suffix.trim().slice(0, 5),
      label: form.label.trim(),
      labelHi: form.labelHi.trim(),
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
        Sirf asli numbers daalo, kyunki ye website par sabko dikhenge.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Number">
          <input
            type="number"
            min="0"
            className={inputClass}
            placeholder="500"
            value={form.value}
            onChange={set('value')}
          />
        </FormField>
        <FormField label="Number ke baad (+, %, K+)" optional>
          <input className={inputClass} maxLength={5} value={form.suffix} onChange={set('suffix')} />
        </FormField>
      </div>

      <FormField label="Label (English)">
        <input
          className={inputClass}
          placeholder="People trained"
          value={form.label}
          onChange={set('label')}
        />
      </FormField>
      <FormField label="Label (Hindi)" optional>
        <input
          className={inputClass}
          placeholder="प्रशिक्षित लोग"
          value={form.labelHi}
          onChange={set('labelHi')}
        />
      </FormField>

      <IconPicker keys={impactIconKeys} value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />

      <FormFooter
        form={form}
        setForm={setForm}
        saving={saving}
        isNew={!item}
        noun="number"
        onCancel={onCancel}
      />
    </form>
  )
}