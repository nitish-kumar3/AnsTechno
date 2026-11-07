import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Check, Copy, Download, ExternalLink } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import { useCopy } from '../../hooks/useCopy'
import { useLanguage } from '../../hooks/useLanguage'

const T = {
  en: {
    phone: 'Your WhatsApp number',
    message: 'Ready message (optional)',
    messagePh: 'Hi, I want to know more about your products',
    invalid: 'Enter a 10-digit number (or with country code)',
    result: 'Your link',
    copy: 'Copy link',
    copied: 'Copied',
    test: 'Test link',
    qr: 'Download QR',
    hint: 'Anyone who clicks or scans this will open a WhatsApp chat with you. Put it on your bill, board or Instagram.',
  },
  hi: {
    phone: 'आपका WhatsApp नंबर',
    message: 'पहले से लिखा संदेश (ज़रूरी नहीं)',
    messagePh: 'नमस्ते, मुझे आपके सामान के बारे में जानकारी चाहिए',
    invalid: '10 अंकों का नंबर लिखें (या देश कोड के साथ)',
    result: 'आपका लिंक',
    copy: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया',
    test: 'लिंक जांचें',
    qr: 'QR डाउनलोड करें',
    hint: 'जो भी इस पर क्लिक या स्कैन करेगा, उसके WhatsApp में आपकी चैट खुल जाएगी। इसे बिल, बोर्ड या Instagram पर लगाइए।',
  },
}

export default function WhatsAppLinkTool() {
  const { lang } = useLanguage()
  const c = T[lang]
  const { copied, copyText } = useCopy()
  const canvasRef = useRef(null)

  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // 10 digit ho to aage 91 laga do
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 10) digits = `91${digits}`
  const valid = digits.length >= 11 && digits.length <= 15
  const text = message.trim()
  const link = valid ? `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}` : ''

  // QR banao
  useEffect(() => {
    if (!link || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, link, {
      width: 220,
      margin: 2,
      color: { dark: '#04100b', light: '#ffffff' },
    }).catch(() => {})
  }, [link])

  const downloadQr = async () => {
    const url = await QRCode.toDataURL(link, { width: 1024, margin: 2 })
    const a = document.createElement('a')
    a.href = url
    a.download = 'whatsapp-qr.png'
    a.click()
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <FormField label={c.phone} error={phone && !valid ? c.invalid : ''}>
          <input
            type="tel"
            className={inputClass}
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormField>
        <FormField label={c.message} optional>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder={c.messagePh}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormField>
        <p className="text-xs leading-relaxed text-white/50">{c.hint}</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        {!link ? (
          <div className="grid h-full min-h-[14rem] place-items-center text-center text-sm text-white/45">
            {c.invalid}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/45">{c.result}</p>
              <p className="mt-2 break-all rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {link}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyText(link)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? c.copied : c.copy}
              </button>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300"
              >
                <ExternalLink size={16} /> {c.test}
              </a>
            </div>

            <div className="flex items-center gap-5 border-t border-white/10 pt-5">
              <canvas ref={canvasRef} className="h-[140px] w-[140px] rounded-xl bg-[#ffffff]" />
              <button
                onClick={downloadQr}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500/40 hover:text-brand-300"
              >
                <Download size={16} /> {c.qr}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}