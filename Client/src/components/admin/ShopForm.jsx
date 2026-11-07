import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import FormFooter from './FormFooter'
import ImageUpload from './ImageUpload'
import ThumbUpload from './ThumbUpload'
import Toggle from './Toggle'

const categories = [
  'Grocery',
  'Clothing',
  'Electronics',
  'Mobile & Accessories',
  'Food & Sweets',
  'Medical / Pharmacy',
  'Hardware',
  'Stationery',
  'Salon / Beauty',
  'Other',
]

let counter = 0
const newKey = () => `n${++counter}`
const blank = () => ({ key: newKey(), name: '', price: '', unit: '', category: '', image: '', available: true })
const fromProduct = (p) => ({
  key: p._id,
  _id: p._id,
  name: p.name,
  price: p.price ?? '',
  unit: p.unit || '',
  category: p.category || '',
  image: p.image || '',
  available: p.available !== false,
})

// "Aata 5kg, 250, per pack" jaisi lines ko products me badlo
const parseLines = (text) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, price, unit] = line.split(',').map((s) => s.trim())
      return {
        ...blank(),
        name: name || '',
        price: price && !Number.isNaN(Number(price)) ? price : '',
        unit: unit || '',
      }
    })
    .filter((p) => p.name)

export default function ShopForm({ item, saving, serverError, onSave, onCancel }) {
  const [tab, setTab] = useState('details')
  const [form, setForm] = useState({
    name: item?.name || '',
    tagline: item?.tagline || '',
    category: item?.category || '',
    description: item?.description || '',
    logo: item?.logo || '',
    cover: item?.cover || '',
    whatsapp: item?.whatsapp || '',
    phone: item?.phone || '',
    address: item?.address || '',
    city: item?.city || '',
    hours: item?.hours || '',
    notes: item?.notes || '',
    order: item?.order ?? 0,
    isActive: item?.isActive ?? true,
  })
  const [products, setProducts] = useState((item?.products || []).map(fromProduct))
  const [quick, setQuick] = useState('')
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const setProduct = (key, patch) =>
    setProducts((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)))

  const addQuick = () => {
    const added = parseLines(quick)
    if (added.length === 0) return
    setProducts((list) => [...list, ...added])
    setQuick('')
  }

  const submit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) {
      setTab('details')
      return setError('Dukaan ka naam likho')
    }
    if (form.whatsapp.replace(/\D/g, '').length < 10) {
      setTab('details')
      return setError('Dukaan ka WhatsApp number likho (10 digit)')
    }
    if (products.some((p) => p.price !== '' && Number(p.price) < 0)) {
      setTab('products')
      return setError('Daam negative nahi ho sakta')
    }
    setError('')

    onSave({
      ...form,
      name: form.name.trim(),
      order: Number(form.order) || 0,
      products: products
        .filter((p) => p.name.trim())
        .map((p) => ({
          _id: p._id,
          name: p.name.trim(),
          price: p.price === '' ? null : Number(p.price),
          unit: p.unit.trim(),
          category: p.category.trim(),
          image: p.image,
          available: p.available,
        })),
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
        Dukaan, phone aur WhatsApp number dukaandaar ki sahmati ke baad hi daalo. Ye number site par
        public dikhte hain, kyunki customer ko order karna hai.
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
        {[
          ['details', 'Shop details'],
          ['products', `Products (${products.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              tab === key ? 'bg-brand-500 text-black' : 'text-white/70 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'details' && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Dukaan ka naam">
              <input
                className={inputClass}
                placeholder="Ram General Store"
                value={form.name}
                onChange={set('name')}
              />
            </FormField>
            <FormField label="Category" optional>
              <input
                className={inputClass}
                list="shop-categories"
                placeholder="Grocery"
                value={form.category}
                onChange={set('category')}
              />
              <datalist id="shop-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </FormField>
          </div>

          <FormField label="Tagline (ek line)" optional>
            <input
              className={inputClass}
              placeholder="Ghar ka saara saaman, sahi daam par"
              value={form.tagline}
              onChange={set('tagline')}
            />
          </FormField>

          <FormField label="Dukaan ke baare me" optional>
            <textarea
              rows={3}
              maxLength={600}
              className={`${inputClass} resize-none`}
              value={form.description}
              onChange={set('description')}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
            <div>
              <p className="mb-1.5 text-sm font-medium text-white/80">Logo</p>
              <ThumbUpload
                value={form.logo}
                onChange={(url) => setForm({ ...form, logo: url })}
                size="h-24 w-24"
              />
            </div>
            <ImageUpload
              label="Cover photo (dukaan ki photo)"
              value={form.cover}
              onChange={(url) => setForm({ ...form, cover: url })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="WhatsApp number (order yahin aayenge)">
              <input
                type="tel"
                className={inputClass}
                placeholder="98765 43210"
                value={form.whatsapp}
                onChange={set('whatsapp')}
              />
            </FormField>
            <FormField label="Call ka number" optional>
              <input
                type="tel"
                className={inputClass}
                placeholder="Khali = WhatsApp wala hi"
                value={form.phone}
                onChange={set('phone')}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Address / mohalla" optional>
              <input
                className={inputClass}
                placeholder="Main Market, Boring Road"
                value={form.address}
                onChange={set('address')}
              />
            </FormField>
            <FormField label="Sheher" optional>
              <input
                className={inputClass}
                placeholder="Patna"
                value={form.city}
                onChange={set('city')}
              />
            </FormField>
          </div>

          <FormField label="Dukaan ka samay" optional>
            <input
              className={inputClass}
              placeholder="Roz 8 AM - 9 PM"
              value={form.hours}
              onChange={set('hours')}
            />
          </FormField>

          <FormField label="Private notes (public nahi hote)" optional>
            <textarea
              rows={2}
              className={`${inputClass} resize-none`}
              placeholder="Dukaandaar ka naam, kab milna hai..."
              value={form.notes}
              onChange={set('notes')}
            />
          </FormField>
        </div>
      )}

      {tab === 'products' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-medium">Quick add</p>
            <p className="mt-1 text-xs text-white/50">
              Har line me ek product: <b>Naam, daam, unit</b> (daam aur unit zaroori nahi). Jaise:
              Aata 5kg, 250, per pack
            </p>
            <textarea
              rows={4}
              className={`${inputClass} mt-3 resize-none`}
              placeholder={'Aata 5kg, 250, per pack\nChini, 45, per kg\nChai patti 250g, 120'}
              value={quick}
              onChange={(e) => setQuick(e.target.value)}
            />
            <button
              type="button"
              onClick={addQuick}
              disabled={!quick.trim()}
              className="mt-3 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-50"
            >
              Products jodo
            </button>
          </div>

          {products.length === 0 && (
            <p className="py-6 text-center text-sm text-white/50">Abhi koi product nahi hai.</p>
          )}

          <ul className="space-y-3">
            {products.map((p) => (
              <li
                key={p.key}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <ThumbUpload value={p.image} onChange={(url) => setProduct(p.key, { image: url })} />
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    className={inputClass}
                    placeholder="Product ka naam"
                    value={p.name}
                    onChange={(e) => setProduct(p.key, { name: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      placeholder="Daam ₹"
                      value={p.price}
                      onChange={(e) => setProduct(p.key, { price: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Unit"
                      value={p.unit}
                      onChange={(e) => setProduct(p.key, { unit: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Category"
                      value={p.category}
                      onChange={(e) => setProduct(p.key, { category: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-white/60">
                      <Toggle
                        checked={p.available}
                        onChange={(value) => setProduct(p.key, { available: value })}
                        label="Stock me hai"
                      />
                      {p.available ? 'Stock me hai' : 'Stock me nahi'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setProducts((list) => list.filter((x) => x.key !== p.key))}
                      aria-label="Remove product"
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition hover:bg-red-500/15 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setProducts((list) => [...list, blank()])}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
          >
            <Plus size={16} /> Ek product aur
          </button>
        </div>
      )}

      <FormFooter
        form={form}
        setForm={setForm}
        saving={saving}
        isNew={!item}
        noun="shop"
        onCancel={onCancel}
      />
    </form>
  )
}