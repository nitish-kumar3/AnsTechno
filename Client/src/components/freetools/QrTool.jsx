import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import { useLanguage } from '../../hooks/useLanguage'

const colors = ['#04100b', '#0a7d60', '#1d4ed8', '#6d28d9', '#b91c1c']
const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/

const T = {
  en: {
    modes: { link: 'Website / Link', upi: 'UPI Payment', text: 'Text' },
    linkLabel: 'Link',
    linkPh: 'www.yourshop.com',
    textLabel: 'Your text',
    upiId: 'UPI ID',
    upiName: 'Shop or person name',
    amount: 'Amount (optional)',
    note: 'Note (optional)',
    colour: 'QR colour',
    download: 'Download PNG',
    empty: 'Fill the details to see your QR code.',
    errUpi: 'UPI ID looks wrong. Example: name@okhdfcbank',
    errAmount: 'Amount must be more than 0',
    errLink: 'A link cannot have spaces',
    privacy: 'Your QR is made inside your browser. We never see or store your UPI ID or any details.',
  },
  hi: {
    modes: { link: 'वेबसाइट / लिंक', upi: 'UPI पेमेंट', text: 'टेक्स्ट' },
    linkLabel: 'लिंक',
    linkPh: 'www.yourshop.com',
    textLabel: 'आपका टेक्स्ट',
    upiId: 'UPI ID',
    upiName: 'दुकान या व्यक्ति का नाम',
    amount: 'राशि (ज़रूरी नहीं)',
    note: 'नोट (ज़रूरी नहीं)',
    colour: 'QR का रंग',
    download: 'PNG डाउनलोड करें',
    empty: 'अपना QR कोड देखने के लिए जानकारी भरें।',
    errUpi: 'UPI ID सही नहीं लग रही। उदाहरण: name@okhdfcbank',
    errAmount: 'राशि 0 से ज़्यादा होनी चाहिए',
    errLink: 'लिंक में खाली जगह नहीं हो सकती',
    privacy: 'आपका QR आपके ब्राउज़र में ही बनता है। हम आपकी UPI ID या कोई जानकारी न देखते हैं, न रखते हैं।',
  },
}

export default function QrTool() {
  const { lang } = useLanguage()
  const c = T[lang]
  const canvasRef = useRef(null)

  const [mode, setMode] = useState('link')
  const [text, setText] = useState('')
  const [upi, setUpi] = useState({ id: '', name: '', amount: '', note: '' })
  const [color, setColor] = useState(colors[0])

  // QR me kya jayega, aur koi galti
  let payload = ''
  let problem = ''

  if (mode === 'link') {
    const t = text.trim()
    if (/\s/.test(t)) problem = c.errLink
    else if (t) payload = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`
  } else if (mode === 'text') {
    payload = text.trim()
  } else if (upi.id.trim()) {
    if (!upiRegex.test(upi.id.trim())) problem = c.errUpi
    else if (upi.amount && !(Number(upi.amount) > 0)) problem = c.errAmount
    else {
      payload =
        `upi://pay?pa=${upi.id.trim()}` +
        (upi.name.trim() ? `&pn=${encodeURIComponent(upi.name.trim())}` : '') +
        (upi.amount ? `&am=${Number(upi.amount)}` : '') +
        `&cu=INR` +
        (upi.note.trim() ? `&tn=${encodeURIComponent(upi.note.trim())}` : '')
    }
  }

  const ready = Boolean(payload) && !problem

  useEffect(() => {
    if (!ready || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 280,
      margin: 2,
      color: { dark: color, light: '#ffffff' },
    }).catch(() => {})
  }, [ready, payload, color])

  const download = async () => {
    const url = await QRCode.toDataURL(payload, {
      width: 1024,
      margin: 2,
      color: { dark: color, light: '#ffffff' },
    })
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.png'
    a.click()
  }

  const setUpiField = (key) => (e) => setUpi({ ...upi, [key]: e.target.value })

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          {Object.keys(c.modes).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                mode === m ? 'bg-brand-500 text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              {c.modes[m]}
            </button>
          ))}
        </div>

        {mode !== 'upi' && (
          <FormField label={mode === 'link' ? c.linkLabel : c.textLabel} error={problem}>
            {mode === 'link' ? (
              <input
                className={inputClass}
                placeholder={c.linkPh}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <textarea
                rows={4}
                maxLength={500}
                className={`${inputClass} resize-none`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}
          </FormField>
        )}

        {mode === 'upi' && (
          <div className="space-y-4">
            <FormField label={c.upiId} error={problem}>
              <input
                className={inputClass}
                placeholder="name@okhdfcbank"
                value={upi.id}
                onChange={setUpiField('id')}
              />
            </FormField>
            <FormField label={c.upiName} optional>
              <input className={inputClass} value={upi.name} onChange={setUpiField('name')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={c.amount} optional>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  placeholder="₹"
                  value={upi.amount}
                  onChange={setUpiField('amount')}
                />
              </FormField>
              <FormField label={c.note} optional>
                <input className={inputClass} value={upi.note} onChange={setUpiField('note')} />
              </FormField>
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-white/80">{c.colour}</p>
          <div className="flex gap-2">
            {colors.map((col) => (
              <button
                key={col}
                onClick={() => setColor(col)}
                aria-label={col}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  color === col ? 'border-brand-500 ring-2 ring-brand-500/40' : 'border-white/20'
                }`}
                style={{ background: col }}
              />
            ))}
          </div>
        </div>

        <p className="text-xs leading-relaxed text-white/50">{c.privacy}</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex min-h-[16rem] flex-col items-center justify-center gap-5">
          <canvas
            ref={canvasRef}
            className={`h-[280px] w-[280px] max-w-full rounded-2xl bg-[#ffffff] ${ready ? '' : 'hidden'}`}
          />
          {!ready && <p className="text-center text-sm text-white/45">{c.empty}</p>}
          {ready && (
            <button
              onClick={download}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
            >
              <Download size={16} /> {c.download}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}