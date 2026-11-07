import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import { drawOfferPoster, posterThemes } from '../../utils/drawOfferPoster'
import { useLanguage } from '../../hooks/useLanguage'

const T = {
  en: {
    shopName: 'Shop name',
    headline: 'Big heading',
    offer: 'Offer',
    details: 'Details (optional)',
    phone: 'Phone / WhatsApp (optional)',
    theme: 'Colour',
    size: 'Size',
    square: 'Square (post)',
    story: 'Tall (WhatsApp status / story)',
    download: 'Download PNG',
    hint: 'The poster is made inside your browser. Nothing is uploaded.',
  },
  hi: {
    shopName: 'दुकान का नाम',
    headline: 'बड़ा शीर्षक',
    offer: 'ऑफर',
    details: 'जानकारी (ज़रूरी नहीं)',
    phone: 'फ़ोन / WhatsApp (ज़रूरी नहीं)',
    theme: 'रंग',
    size: 'साइज़',
    square: 'चौकोर (पोस्ट)',
    story: 'लंबा (WhatsApp स्टेटस / स्टोरी)',
    download: 'PNG डाउनलोड करें',
    hint: 'पोस्टर आपके ब्राउज़र में ही बनता है। कुछ भी अपलोड नहीं होता।',
  },
}

export default function PosterTool() {
  const { lang } = useLanguage()
  const c = T[lang]
  const canvasRef = useRef(null)

  const [data, setData] = useState({
    shopName: 'Your Shop Name',
    headline: 'Festive Sale',
    offer: 'Flat 20% OFF',
    details: 'On all items. This week only!',
    phone: '',
    theme: 'green',
    size: 'square',
  })

  const set = (key) => (e) => setData((d) => ({ ...d, [key]: e.target.value }))

  // Kuch badle to thodi der baad poster dobara banao
  useEffect(() => {
    const id = setTimeout(() => {
      if (canvasRef.current) drawOfferPoster(canvasRef.current, data).catch(() => {})
    }, 200)
    return () => clearTimeout(id)
  }, [data])

  const download = () => {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'offer-poster.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <FormField label={c.shopName}>
          <input className={inputClass} maxLength={60} value={data.shopName} onChange={set('shopName')} />
        </FormField>
        <FormField label={c.headline}>
          <input className={inputClass} maxLength={40} value={data.headline} onChange={set('headline')} />
        </FormField>
        <FormField label={c.offer}>
          <input className={inputClass} maxLength={50} value={data.offer} onChange={set('offer')} />
        </FormField>
        <FormField label={c.details} optional>
          <input className={inputClass} maxLength={120} value={data.details} onChange={set('details')} />
        </FormField>
        <FormField label={c.phone} optional>
          <input type="tel" className={inputClass} value={data.phone} onChange={set('phone')} />
        </FormField>

        <div>
          <p className="mb-2 text-sm font-medium text-white/80">{c.theme}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(posterThemes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setData((d) => ({ ...d, theme: key }))}
                aria-label={t.name}
                title={t.name}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  data.theme === key ? 'border-brand-500 ring-2 ring-brand-500/40' : 'border-white/20'
                }`}
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-white/80">{c.size}</p>
          <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
            {['square', 'story'].map((s) => (
              <button
                key={s}
                onClick={() => setData((d) => ({ ...d, size: s }))}
                className={`rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  data.size === s ? 'bg-brand-500 text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {c[s]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/45">{c.hint}</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col items-center gap-5">
          <canvas
            ref={canvasRef}
            className="h-auto max-h-[70vh] w-auto max-w-full rounded-2xl border border-white/10 shadow-xl"
          />
          <button
            onClick={download}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
          >
            <Download size={16} /> {c.download}
          </button>
        </div>
      </div>
    </div>
  )
}