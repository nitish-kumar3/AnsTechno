import FormField, { inputClass } from '../ui/FormField'
import Toggle from './Toggle'

export default function FormFooter({ form, setForm, saving, isNew, noun, onCancel }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Order (chhota number pehle dikhega)">
          <input
            type="number"
            className={inputClass}
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
        </FormField>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:mt-7">
          <div>
            <p className="text-sm font-medium">Show on website</p>
            <p className="text-xs text-white/50">Band karoge to chhup jayega</p>
          </div>
          <Toggle
            checked={form.isActive}
            onChange={(value) => setForm({ ...form, isActive: value })}
            label="Show on website"
          />
        </div>
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
          {saving ? 'Saving...' : isNew ? `Add ${noun}` : 'Save changes'}
        </button>
      </div>
    </>
  )
}