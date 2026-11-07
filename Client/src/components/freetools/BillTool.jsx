import { useEffect, useState } from 'react'
import { Check, Copy, MessageCircle, Plus, Printer, RotateCcw, Trash2 } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import { useCopy } from '../../hooks/useCopy'
import { useLanguage } from '../../hooks/useLanguage'

const T = {
  en: {
    yourShop: 'Your shop',
    shopName: 'Shop name',
    shopPh: 'Your Shop Name',
    phone: 'Phone',
    address: 'Address',
    bill: 'Bill',
    billNo: 'Bill no.',
    date: 'Date',
    customer: 'Customer name',
    items: 'Items',
    item: 'Item',
    qty: 'Qty',
    rate: 'Rate (₹)',
    amount: 'Amount',
    addItem: 'Add item',
    discount: 'Discount (₹)',
    gst: 'GST %',
    notes: 'Note at bottom',
    notesPh: 'Thank you, visit again!',
    subtotal: 'Subtotal',
    discountLabel: 'Discount',
    total: 'Total',
    print: 'Print / Save PDF',
    whatsapp: 'Share on WhatsApp',
    copy: 'Copy text',
    copied: 'Copied',
    reset: 'New bill',
    empty: 'Add items to see your bill.',
    note: 'This is a simple bill. For a GST tax invoice, please ask your accountant.',
    saved: 'Your shop details are saved on this device only.',
    to: 'To',
  },
  hi: {
    yourShop: 'आपकी दुकान',
    shopName: 'दुकान का नाम',
    shopPh: 'आपकी दुकान का नाम',
    phone: 'फ़ोन',
    address: 'पता',
    bill: 'बिल',
    billNo: 'बिल नंबर',
    date: 'तारीख',
    customer: 'ग्राहक का नाम',
    items: 'सामान',
    item: 'सामान',
    qty: 'मात्रा',
    rate: 'दाम (₹)',
    amount: 'रकम',
    addItem: 'सामान जोड़ें',
    discount: 'छूट (₹)',
    gst: 'GST %',
    notes: 'नीचे का संदेश',
    notesPh: 'धन्यवाद, फिर आइएगा!',
    subtotal: 'कुल सामान',
    discountLabel: 'छूट',
    total: 'कुल',
    print: 'प्रिंट / PDF सेव',
    whatsapp: 'WhatsApp पर भेजें',
    copy: 'टेक्स्ट कॉपी करें',
    copied: 'कॉपी हो गया',
    reset: 'नया बिल',
    empty: 'बिल देखने के लिए सामान जोड़ें।',
    note: 'यह एक साधारण बिल है। GST टैक्स इनवॉइस के लिए अपने अकाउंटेंट से पूछें।',
    saved: 'आपकी दुकान की जानकारी सिर्फ़ इसी डिवाइस पर सेव रहती है।',
    to: 'ग्राहक',
  },
}

const rupee = (n) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n)
const today = () => new Date().toLocaleDateString('en-CA')

let nextId = 1
const newItem = () => ({ id: nextId++, name: '', qty: 1, price: '' })

function loadShop() {
  try {
    return JSON.parse(localStorage.getItem('bill-shop')) || { name: '', phone: '', address: '' }
  } catch {
    return { name: '', phone: '', address: '' }
  }
}

export default function BillTool() {
  const { lang } = useLanguage()
  const c = T[lang]
  const { copied, copyText } = useCopy()

  const [shop, setShop] = useState(loadShop)
  const [customer, setCustomer] = useState('')
  const [billNo, setBillNo] = useState('')
  const [date, setDate] = useState(today)
  const [items, setItems] = useState(() => [newItem()])
  const [discount, setDiscount] = useState('')
  const [gst, setGst] = useState('0')
  const [notes, setNotes] = useState('')

  // Dukaan ki jaankari is device par yaad rakho
  useEffect(() => {
    try {
      localStorage.setItem('bill-shop', JSON.stringify(shop))
    } catch {
      // storage allowed nahi hai
    }
  }, [shop])

  const setItem = (id, patch) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)))

  // Hisaab
  const rows = items
    .filter((i) => i.name.trim() && Number(i.price) > 0 && Number(i.qty) > 0)
    .map((i) => ({ ...i, qty: Number(i.qty), price: Number(i.price), amount: Number(i.qty) * Number(i.price) }))
  const subtotal = rows.reduce((sum, r) => sum + r.amount, 0)
  const discountAmt = Math.min(Math.max(Number(discount) || 0, 0), subtotal)
  const taxable = subtotal - discountAmt
  const gstRate = Number(gst) || 0
  const gstAmt = (taxable * gstRate) / 100
  const total = taxable + gstAmt

  const niceDate = new Date(date || today()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // WhatsApp / copy ke liye text
  const billText = () =>
    [
      `*${shop.name || c.shopPh}*`,
      shop.phone && `${c.phone}: ${shop.phone}`,
      `${c.bill}${billNo ? ` ${billNo}` : ''} | ${niceDate}`,
      customer && `${c.to}: ${customer}`,
      '------------------',
      ...rows.map((r, i) => `${i + 1}. ${r.name} x ${r.qty} = ${rupee(r.amount)}`),
      '------------------',
      `${c.subtotal}: ${rupee(subtotal)}`,
      discountAmt > 0 && `${c.discountLabel}: -${rupee(discountAmt)}`,
      gstRate > 0 && `GST ${gstRate}%: ${rupee(gstAmt)}`,
      `*${c.total}: ${rupee(total)}*`,
      notes && `\n${notes}`,
    ]
      .filter(Boolean)
      .join('\n')

  const reset = () => {
    setCustomer('')
    setBillNo('')
    setDate(today())
    setItems([newItem()])
    setDiscount('')
    setGst('0')
    setNotes('')
  }

  const setShopField = (key) => (e) => setShop({ ...shop, [key]: e.target.value })

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div>
          <h3 className="font-semibold">{c.yourShop}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label={c.shopName}>
              <input className={inputClass} placeholder={c.shopPh} value={shop.name} onChange={setShopField('name')} />
            </FormField>
            <FormField label={c.phone} optional>
              <input type="tel" className={inputClass} value={shop.phone} onChange={setShopField('phone')} />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label={c.address} optional>
              <input className={inputClass} value={shop.address} onChange={setShopField('address')} />
            </FormField>
          </div>
          <p className="mt-2 text-xs text-white/40">{c.saved}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label={c.customer} optional>
            <input className={inputClass} value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </FormField>
          <FormField label={c.billNo} optional>
            <input className={inputClass} placeholder="001" value={billNo} onChange={(e) => setBillNo(e.target.value)} />
          </FormField>
          <FormField label={c.date}>
            <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </FormField>
        </div>

        <div>
          <h3 className="font-semibold">{c.items}</h3>
          <ul className="mt-3 space-y-3">
            {items.map((it) => (
              <li key={it.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <input
                  className={inputClass}
                  placeholder={c.item}
                  value={it.name}
                  onChange={(e) => setItem(it.id, { name: e.target.value })}
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder={c.qty}
                    aria-label={c.qty}
                    value={it.qty}
                    onChange={(e) => setItem(it.id, { qty: e.target.value })}
                  />
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder={c.rate}
                    aria-label={c.rate}
                    value={it.price}
                    onChange={(e) => setItem(it.id, { price: e.target.value })}
                  />
                  <button
                    onClick={() =>
                      setItems((list) => (list.length > 1 ? list.filter((i) => i.id !== it.id) : [newItem()]))
                    }
                    aria-label="Remove item"
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2.5 text-white/60 transition hover:bg-red-500/15 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setItems((list) => [...list, newItem()])}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-brand-500/40 hover:text-brand-300"
          >
            <Plus size={16} /> {c.addItem}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={c.discount} optional>
            <input type="number" min="0" className={inputClass} value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </FormField>
          <FormField label={c.gst} optional>
            <select className={inputClass} value={gst} onChange={(e) => setGst(e.target.value)}>
              {['0', '5', '12', '18', '28'].map((g) => (
                <option key={g} value={g} className="bg-ink">
                  {g}%
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label={c.notes} optional>
          <input className={inputClass} placeholder={c.notesPh} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>
      </div>

      {/* Bill preview */}
      <div>
        <div
          id="bill-print"
          className="mx-auto w-full max-w-md rounded-2xl border border-[#d9e2de] bg-[#ffffff] p-6 text-[#111111] shadow-xl"
        >
          <div className="border-b border-dashed border-[#bfcac5] pb-4 text-center">
            <p className="text-xl font-bold">{shop.name || c.shopPh}</p>
            {shop.address && <p className="mt-1 text-xs text-[#555555]">{shop.address}</p>}
            {shop.phone && (
              <p className="text-xs text-[#555555]">
                {c.phone}: {shop.phone}
              </p>
            )}
          </div>

          <div className="flex justify-between gap-3 py-3 text-xs text-[#444444]">
            <div>
              <p className="font-semibold">
                {c.bill}
                {billNo ? ` #${billNo}` : ''}
              </p>
              {customer && (
                <p>
                  {c.to}: {customer}
                </p>
              )}
            </div>
            <p>{niceDate}</p>
          </div>

          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#888888]">{c.empty}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-[#d9e2de] text-left text-xs text-[#555555]">
                  <th className="py-2 font-semibold">{c.item}</th>
                  <th className="py-2 text-center font-semibold">{c.qty}</th>
                  <th className="py-2 text-right font-semibold">{c.rate.replace(' (₹)', '')}</th>
                  <th className="py-2 text-right font-semibold">{c.amount}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-[#eef2f0]">
                    <td className="py-2 pr-2">{r.name}</td>
                    <td className="py-2 text-center">{r.qty}</td>
                    <td className="py-2 text-right">{rupee(r.price)}</td>
                    <td className="py-2 text-right font-medium">{rupee(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rows.length > 0 && (
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-[#555555]">
                <span>{c.subtotal}</span>
                <span>{rupee(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-[#555555]">
                  <span>{c.discountLabel}</span>
                  <span>-{rupee(discountAmt)}</span>
                </div>
              )}
              {gstRate > 0 && (
                <div className="flex justify-between text-[#555555]">
                  <span>GST {gstRate}%</span>
                  <span>{rupee(gstAmt)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dashed border-[#bfcac5] pt-2 text-lg font-bold">
                <span>{c.total}</span>
                <span>{rupee(total)}</span>
              </div>
            </div>
          )}

          {notes && <p className="mt-5 text-center text-xs text-[#555555]">{notes}</p>}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.print()}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-50"
          >
            <Printer size={16} /> {c.print}
          </button>
          <a
            href={rows.length ? `https://wa.me/?text=${encodeURIComponent(billText())}` : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={rows.length === 0}
            className={`inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 ${
              rows.length === 0 ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <MessageCircle size={16} /> {c.whatsapp}
          </a>
          <button
            onClick={() => copyText(billText())}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300 disabled:opacity-50"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? c.copied : c.copy}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300"
          >
            <RotateCcw size={16} /> {c.reset}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-white/45">{c.note}</p>
      </div>
    </div>
  )
}